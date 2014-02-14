Ext.define('MYOCD.controller.company.CompaniesStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadCompanies: function(onView, callBack) {
		if(onView) {
			onView.setLoading('Loading Companies ...');
		}
		Ext.Ajax.request({
			url: COMPANIES_API_URL,
			method: 'GET',
			withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            var companyData = Ext.decode(data.responseText);
	            Ext.getStore('company.Companies').loadRawData(companyData);
	            if(callBack) {
		            callBack(companyData);
	            }
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            console.log('Loading companies failure'); 
            }
		});
	},
	ajaxGetCompanies: function(onView, callBack) {
		if(onView) {
			onView.setLoading('Loading Companies ...');
		}
		$.ajax({
			type: "GET",
			url: 'http://www.myownframework.com/companies.json',
			withCredentials: true,
			success: function(data) {
				if(onView) {
		            onView.setLoading(false);
	            }
	            console.log(data);
				Ext.getStore('company.Companies').loadRawData(data);
	            if(callBack) {
		            callBack(data);
	            }

			},
			failure: function(data) {
				if(onView) {
		            onView.setLoading(false);
	            }
				console.log(data)
			},
			dataType: 'JSON'
		});
	},
	createNewCompany: function( templateId, companyName, companyDesc, companyWeb, companyTax, 
		employeeName, employeeDesc, employeeEmail, employeeSkype, employeeAddress, employeeWork, onView, callBack) {
		
		var me = this;	
		if(onView) {
			onView.setLoading('Creating New Company ...'); 
		}	

		Ext.Ajax.request({
			url: COMPANIES_API_URL,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				template_id: templateId,
				company: {
			  		name: companyName,
			  		description: companyDesc
				},
				company_profile: {
			  		web_url: companyWeb,
			  		tax_id: companyTax
				},
				employee_profile: {
			  		name: employeeName,
			  		description: employeeDesc,
			  		email: employeeEmail,
			  	skype_id: employeeSkype,
			  		address_same_as_company: employeeAddress.length > 0 ? true : false,
			  		works_at_home: employeeAddress.length > 0 ? false : true
				}  
			},
			success: function(response) {
				if (onView) {
					onView.setLoading(false);
				}
				//console.log(response);
				//currently create new company doesn't return new company or workspace
				//var newCompany = Ext.decode(response.responseText);
				if(callBack) {
		            callBack();
	            }	
			},
			failure: function(response) {
				if (onView) {
					onView.setLoading(false);
					var error = Ext.decode(response.responseText).error;
					Ext.Msg.alert('Create Company Fail', error + ' Please try later!');
				}
			}

		});
	},
	loadAllRolesOfCompany: function(companyId, onView, callBack) {
		if (onView) {
			onView.setLoading('Loading Roles Of Company ...');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/roles.json',
			method: 'GET',
			withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            var roleData = Ext.decode(data.responseText);
	            Ext.getStore('company.CompanyRoles').loadRawData(roleData.owned_roles);
	            Ext.getStore('company.AssignedRoles').loadRawData(roleData.assigned_roles);
	            if (callBack) {
		            callBack(roleData.owned_roles, companyId, onView);
	            }
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            console.log('Loading Roles Of Company failure'); 
            }
		});
	},
	addRoleToCompany: function(companyId, roleId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Adding Role...');
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
	            //me.loadAllRolesOfCompany(companyId, onView);
	            me.getAuthorizationEntities(companyId, onView);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            console.log('Loading Roles Of Company failure'); 
            }
		});
	},
	deleteRole: function(companyId, roleId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Role ...');
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				parent_id: companyId	
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadAllRolesOfCompany(MYOCD.SharedData.currentCompanyId, onView);
				me.getAuthorizationEntities(MYOCD.SharedData.currentCompanyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Delete role failure');			
			}
		});
	},
	getPermissionsOfRole: function(roleId, loadIntoStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Getting Role Permissions ...');
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '/permissions.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				loadIntoStore.removeAll();
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
					permission.isInherited = false;
					loadIntoStore.add(permission);
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
	getPermissionsOfRole_callback: function(roleId, callback, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Getting Role Permissions ...');
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '/permissions.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var permissionsData = Ext.decode(data.responseText);
				if(callback){
					callback(permissionsData.permissions);
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
	addPermissionToRole: function(roleId, permissionId, loadIntoStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Adding New Role Permissions ...');
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '/permissions.json',
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
				me.getPermissionsOfRole(roleId, loadIntoStore, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Add Role Permissions failure');			
			}
		});
	},
	removePermissionFromRole: function(roleId, record, permissionStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Removing Role Permissions ...');
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '/permissions/' + record.data.id + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				permissionStore.remove(record);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Remove Role Permissions failure');			
			}
		});
	},
	loadAssignedItemsOfRole: function(roleId, onView) {
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
	            Ext.getStore('company.AssignedOrgs').loadRawData(assignedItems);
	            Ext.getStore('company.AssignedOrgs').sort([
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
	            me.loadAssignedItemsOfRole(roleId, onView);
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
	            me.loadAssignedItemsOfRole(roleId, onView);
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
	            me.loadAssignedItemsOfRole(roleId, onView);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            console.log('Assign Role to user failure'); 
            }
		});
	},
	getAssignedPermissionsOfObject: function(baseUrl, objectId, loadIntoStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Getting Permissions ...');
		}
		Ext.Ajax.request({
			url: baseUrl + objectId + '/permissions.json?object_id=' + MYOCD.SharedData.currentCompanyId,
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				loadIntoStore.removeAll();
				var permissionsData = Ext.decode(data.responseText);
/*
				for(var i = 0; i < permissionsData.inherited_permissions.length; i++) {
					var permission = permissionsData.inherited_permissions[i];
					permission.isInherited = true;
					loadIntoStore.add(permission);
				}
				for(var i = 0; i < permissionsData.permissions.length; i++) {
					var permission = permissionsData.permissions[i];
					permission.isInherited = false;
					loadIntoStore.add(permission);
				}
*/
				loadIntoStore.loadRawData(permissionsData.permissions);
				loadIntoStore.sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Get Permissions failure');			
			}
		});
	},
	addPermissionToObject: function(baseUrl, objectId, permissionId, loadIntoStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Adding New Permissions ...');
		}
		Ext.Ajax.request({
			url: baseUrl + objectId + '/permissions.json?object_id=' + MYOCD.SharedData.currentCompanyId,
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
				me.getAssignedPermissionsOfObject(baseUrl, objectId, loadIntoStore, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Add Permissions failure');			
			}
		});
	},
	removePermissionFromObject: function(baseUrl, objectId, record, permissionStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Removing Permissions ...');
		}
		Ext.Ajax.request({
			url: baseUrl + objectId + '/permissions.json?object_id=' + MYOCD.SharedData.currentCompanyId,
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
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Remove Role Permissions failure');			
			}
		});
	},
	getAuthorizationEntities: function(companyId, onView) {
		var me = this;
		me.loadAllRolesOfCompany(companyId, onView, me.getPartnersAfterRoles);
	}, 
	getPartnersAfterRoles: function(rolesData, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Partner ...');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/authorizedpartners.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var authoriziedPartnerData = Ext.decode(data.responseText);
				Ext.getStore('company.AuthorizationEntities').removeAll();
				Ext.getStore('company.AuthorizationEntities').add(rolesData);
				Ext.getStore('company.AuthorizationEntities').add(authoriziedPartnerData);
				Ext.getStore('company.AuthorizationEntities').sort([
	            	{property: 'type', direction: 'ASC'}, 
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Add Partner failure');			
			}
		});	
	},
	addPartnerToCompany: function(companyId, partnerId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Adding Partner ...');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/authorizedpartners.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				partner_id: partnerId	
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.getAuthorizationEntities(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Add Partner failure');			
			}
		});
	},
	removePartnerFromCompany: function(companyId, partnerId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Removing Partner ...');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/authorizedpartners/' + partnerId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.getAuthorizationEntities(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Remove Partner failure');			
			}
		});
	},
	loadRolesOfRole: function(roleId, onView, callback) {
		var me = this;
		if (onView) {
			onView.setLoading('Loading Roles ...');
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '/roles.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var roleData = Ext.decode(data.responseText);
				if (callback) {
					callback(roleData.assigned_roles);
				}
			},
			failure: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				console.log('Load Roles failure');	
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
				me.loadAssignedItemsOfRole(roleId, onView);
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
				me.loadAssignedItemsOfRole(roleId, onView);
			},
			failure: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				console.log('Unassign Role failure');	
			}
		});
	} 
});