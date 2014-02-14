Ext.define('MYOCD.controller.authorization.AuthorizationStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadObjectAuthorizationContext: function(baseUrl, objectId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Loading Authorization Contexts...')
		}
		Ext.Ajax.request({
			url: baseUrl + objectId + '/authcontexts.json',
			method: 'GET',
			withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            var authData = Ext.decode(data.responseText);
	            Ext.getStore('authorization.AuthorizationContexts').removeAll();
	            for (var i = 0; i < authData.authorization_contexts.length; i++) {
	            	var context = authData.authorization_contexts[i];
	            	if (!context.first_name) {
	            		context.first_name = '';
	            	} 
	            	if (!context.last_name) {
	            		context.last_name = '';
	            	}
	            	context.isInherited = false;
		            Ext.getStore('authorization.AuthorizationContexts').add(context);
	            }
	            for (var i = 0; i < authData.inherited_authorization_contexts.length; i++) {
	            	var context = authData.inherited_authorization_contexts[i];
	            	if (!context.first_name) {
	            		context.first_name = '';
	            	} 
	            	if (!context.last_name) {
	            		context.last_name = '';
	            	}
	            	context.isInherited = true;
		            Ext.getStore('authorization.AuthorizationContexts').add(context);
	            }
	            Ext.getStore('authorization.AuthorizationContexts').sort([
	            	{property: 'type', direction: 'ASC'}, 
	            	{property: 'isInherited', direction: 'ASC'},
	            	{property: 'name', direction: 'ASC'}
	            ]);
	            me.showInheritedItems(MYOCD.SharedData.showInheritedAuthContext);
	            
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            console.log('Load Authorization Context failure'); 
            }
		});
	},
	showInheritedItems: function(yes) {
		Ext.getStore('authorization.AuthorizationContexts').clearFilter();
		if (yes) {
			return;
		} else {
			Ext.getStore('authorization.AuthorizationContexts').filter([
			    {filterFn: function(item) {
			    	return !item.get('isInherited'); 
			    }}
			]);
		}
	},
	addNewAuthorizationContextToObject: function(baseUrl, objectId, targetId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Adding New Authorization Context...')
		}
		Ext.Ajax.request({
			url: baseUrl + objectId + '/authcontexts.json',
			method: 'POST',
			withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
	            target_context_id: targetId
            },
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            me.loadObjectAuthorizationContext(baseUrl, objectId, onView);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            console.log('Add New Authorization Context failure'); 
            }
		});
	},
	removeAuthorizationContextFromObject: function(baseUrl, objectId, targetId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Removing Authorization Context...');
		}
		Ext.Ajax.request({
			url: baseUrl + objectId + '/authcontexts/' + targetId + '.json',
			method: 'DELETE',
			withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            me.loadObjectAuthorizationContext(baseUrl, objectId, onView);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            console.log('Remove Authorization Context failure'); 
            }
		});
	},
	getPermissionsOfAuthorizationContext: function(baseUrl, objectId, securityObjectId, loadIntoStore, onView, callback) {
		var me = this;
		if(onView) {
			onView.setLoading('Getting Permissions ...');
		}
		Ext.Ajax.request({
			url: baseUrl + objectId + '/permissions.json?object_id=' + securityObjectId,
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if (loadIntoStore.data.items.length > 0) {
					loadIntoStore.removeAll();
				}
				var permissionsData = Ext.decode(data.responseText);
				if (permissionsData.inherited_permissions) {
					for(var i = 0; i < permissionsData.inherited_permissions.length; i++) {
						var permission = permissionsData.inherited_permissions[i];
						permission.isInherited = true;
						loadIntoStore.add(permission);
					}
				}
				for(var i = 0; i < permissionsData.permissions.length; i++) {
					var permission = permissionsData.permissions[i];
					permission.isInherited = MYOCD.SharedData.childSecurityShowInherited; //false;
					loadIntoStore.add(permission);
				}
				loadIntoStore.sort([
	            	{property: 'isInherited', direction: 'ASC'},
	            	{property: 'name', direction: 'ASC'}
	            ]);
	            if (callback) {
	            	callback(loadIntoStore);
	            }

			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Get Permissions failure');			
			}
		});
	},
	addPermissionToAuthorizationContext: function(baseUrl, objectId, securityObjectId, permissionId, loadIntoStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Adding New Permissions ...');
		}
		Ext.Ajax.request({
			url: baseUrl + objectId + '/permissions.json?object_id=' + securityObjectId,
			method: 'POST',
			jsonData: {
				permission_ids: [permissionId]	
			},
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var callBack = null;
				if (baseUrl != ROLE_BASE_URL) {
					callBack = function (loadIntoStore) {
						var authActionPermission = Ext.getStore('authorization.AuthorizationActionsPermissions');
						var actionItems = authActionPermission.data.items;
			            for (var i = 0; i < actionItems.length; i++) {
			            	if (loadIntoStore.find('id', actionItems[i].data.permission.id) != -1) {
			            		var index = authActionPermission.find('secure_action',actionItems[i].data.secure_action);
			            		authActionPermission.getAt(index).set('granted', true);
			            		authActionPermission.getAt(index).set('isInherited', false);
			            		authActionPermission.getAt(index).commit();
			            	}
			            }
					}
				}
				me.getPermissionsOfAuthorizationContext(baseUrl, objectId, securityObjectId, loadIntoStore, onView, callBack);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Add Permissions failure');			
			}
		});
	},
	removePermissionFromAuthorizationContext: function(baseUrl, objectId, record, securityObjectId, permissionStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Getting Permissions ...');
		}
		Ext.Ajax.request({
			url: baseUrl + objectId + '/permissions.json?object_id=' + securityObjectId,
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				permission_ids: [record.data.id]	
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				permissionStore.remove(record);
				if (baseUrl != ROLE_BASE_URL) {
					var authActionPermission = Ext.getStore('authorization.AuthorizationActionsPermissions');
					var actionItems = authActionPermission.data.items;
		            for (var i = 0; i < actionItems.length; i++) {
		            	if (actionItems[i].data.permission.id == record.data.id) {
		            		var index = authActionPermission.find('secure_action',actionItems[i].data.secure_action);
		            		authActionPermission.getAt(index).set('granted', false);
		            		authActionPermission.getAt(index).set('isInherited', false);
		            		authActionPermission.getAt(index).commit();
		            	}
		            }
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Get Role Permissions failure');			
			}
		});
	},
	loadAssignedItemsOfAuthorizedRole: function(roleId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Loading Assigned Organizations And Users...')
		} 
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '/assignees.json',
			method: 'GET',
			withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            var assignedItems = Ext.decode(data.responseText);
	            Ext.getStore('authorization.AuthorizationContextRoleUsersAndRoles').loadRawData(assignedItems);
	            Ext.getStore('authorization.AuthorizationContextRoleUsersAndRoles').sort([
	            	{property: 'type', direction: 'ASC'}, 
	            	{property: 'name', direction: 'ASC'}
	            ]);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            console.log('Load Assigned Organizations And Users failure'); 
            }
		});
	},
	assignRoleToCompany: function(roleId, companyId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Assigning Role...');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/roles.json',
			method: 'POST',
			withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
	            role_id: roleId
            },
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            me.loadAssignedItemsOfAuthorizedRole(roleId, onView);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            console.log('Assign Role to Company failure'); 
            }
		});

	},
	assignRoleToEmployeeProfile: function(roleId, employeeProfileId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Assigning Role...');
		}
		Ext.Ajax.request({
			url: EMPLOYEE_PROFILES_BASE_URL + employeeProfileId + '/roles.json',
			method: 'POST',
			withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
	            role_id: roleId
            },
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            me.loadAssignedItemsOfAuthorizedRole(roleId, onView);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            console.log('Assign Role to Employee failure'); 
            }
		});
	},
	assignRoleToPersonalProfile: function(roleId, personalProfileId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Assigning Role...');
		}
		Ext.Ajax.request({
			url: PERSONAL_PROFILES_BASE_URL + personalProfileId + '/roles.json',
			method: 'POST',
			withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
	            role_id: roleId
            },
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            me.loadAssignedItemsOfAuthorizedRole(roleId, onView);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            console.log('Assign Role to user failure'); 
            }
		});
	},
	assignRoleToRole: function(roleId, toRoleId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Assigning Role ...');
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + toRoleId + '/roles.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				role_id: roleId
			},
			success: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var roleData = Ext.decode(data.responseText);
				me.loadAssignedItemsOfAuthorizedRole(roleId, onView);
			},
			failure: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				console.log('Assign Role failure');	
			}
		});
	},
	unassignItemFromRole: function(baseUrl, itemId, roleId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Unassigning Item ...');
		}
		Ext.Ajax.request({
			url: baseUrl + itemId + '/roles/' + roleId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				me.loadAssignedItemsOfAuthorizedRole(roleId, onView);
			},
			failure: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				console.log('Unassign Role failure');	
			}
		});
	},
	updateInheritFromParent: function(baseUrl, objectId, inheritFromParent, onView, callback) {
		var me = this;
		if (onView) {
			onView.setLoading('Updating Inheritance ...');
		}
		// Ext.Ajax.request({
		// 	url: baseUrl + objectId + '.json',
		// 	method: 'GET',
		// 	withCredentials: true,
		// 	useDefaultXhrHeader: false,
		// 	success: function(data) {
		// 		var objectData = Ext.decode(data.responseText);
		// 		objectData.inherit_security_from_parent = inheritFromParent.toString();
				
				Ext.Ajax.request({
					url: baseUrl + objectId + '/securityattributes.json',
					method: 'PUT',
					withCredentials: true,
					useDefaultXhrHeader: false,
					jsonData: {
						security_attributes: {
							inherit_security_from_parent: inheritFromParent.toString()
						}
					},
					success: function(data) {
						if (onView) {
							onView.setLoading(false);
						}
						if (callback) {
							callback();
						}
						me.loadObjectAuthorizationContext(baseUrl, objectId, onView);		
					},
					failure: function(data) {
						if (onView) {
							onView.setLoading(false);
						}
						console.log('Update Inheritance failure');	
					}
				});
		// 	},
		// 	failure: function(data) {
		// 		if (onView) {
		// 			onView.setLoading(false);
		// 		}
		// 		console.log('Update Inheritance failure');	
		// 	}
		// });
	},
	getObjectAuthorizedInfo: function(baseUrl, objectId, onView, callback) {
		var me = this;
		if (onView) {
			onView.setLoading('Loading Inheritance ...');
		}
		Ext.Ajax.request({
			url: baseUrl + objectId + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var objectData = Ext.decode(data.responseText);
				if (callback) {
					callback(objectData);
				}
				me.loadObjectAuthorizationContext(baseUrl, objectId, onView);		
			},
			failure: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				console.log('Load Inheritance failure');	
			}
		});
	},
	loadActionPermission: function(baseUrl, objectId, onView) {
		if (onView) {
			onView.setLoading('Loading Action Permissions ...');
		}
		Ext.Ajax.request({
			url: baseUrl + objectId + '/actions.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				Ext.getStore('authorization.AuthorizationActionsPermissions').removeAll();
				var actionsData = Ext.decode(data.responseText);
				for (var i = 0; i < actionsData.length; i++) {
					var action = actionsData[i];
					action.granted = false;
					Ext.getStore('authorization.AuthorizationActionsPermissions').add(action);
				}
			},
			failure: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				console.log('Load Action Permissions failure');	
			}
		});
	} 
});