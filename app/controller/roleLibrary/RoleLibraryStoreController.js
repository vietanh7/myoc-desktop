Ext.define('MYOCD.controller.roleLibrary.RoleLibraryStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadRoleLibraries: function(companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Role Libraries ...');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/rolelibs.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var libraryData = Ext.decode(data.responseText);
				Ext.getStore('roleLibrary.RoleLibraries').loadRawData(libraryData); 
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading role libraries failure');			
			}
		});
	},
	addNewRoleLib: function(libraryName, libraryDesc, libraryAccess, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating New Role Library ... ');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/rolelibs.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				role_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadRoleLibraries(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Create new role library failure');
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	editRolesLib: function(libraryName, libraryDesc, libraryAccess, libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Roles Library');
		}
		Ext.Ajax.request({
			url: ROLE_LIBS_BASE_URL + libraryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				role_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadRoleLibraries(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('update roles library failure');
			}
		});
	},
	deleteRolesLib: function(libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Roles Library ...');
		}
		Ext.Ajax.request({
			url: ROLE_LIBS_BASE_URL + libraryId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadRoleLibraries(companyId, onView);			
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Delete roles library failure');			
			}
		});	
	},
	loadCategoriesOfRolesLib: function(libraryId, libraryName, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Role Categories ...');
		}
		Ext.Ajax.request({
			url: ROLE_LIBS_BASE_URL + libraryId + '/categories.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var categoryData = Ext.decode(data.responseText);
				Ext.getStore('roleLibrary.RoleCategoriesTreeStore').setRootNode(
					{
						name: libraryName,
						children: categoryData,
						expanded: true
					}
				) 
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Load role categories failure');			
			}
		});
	},
	loadCategoriesOfRolesCategory: function(categoryId, categoryTreeNode, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Role Categories ...');
		}
		Ext.Ajax.request({
			url: ROLE_CATEGORY_BASE_URL + categoryId + '/categories.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var categoryData = Ext.decode(data.responseText);
				if(categoryData.length == 0) {
					return;
				}
				categoryTreeNode.removeAll();
				categoryTreeNode.appendChild(categoryData);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Load role categories failure');			
			}
		});
	},
	loadRolesOfRoleLib: function(libraryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Roles ...');
		}
		Ext.Ajax.request({
			url: ROLE_LIBS_BASE_URL + libraryId + '/roles.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var roleData = Ext.decode(data.responseText);
				if (roleData.owned_roles) {
					Ext.getStore('roleLibrary.Roles').loadRawData(roleData.owned_roles);
				} else {
					Ext.getStore('roleLibrary.Roles').loadRawData(roleData);
				}
				Ext.getStore('roleLibrary.Roles').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
				
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading roles failure');			
			}
		});
	},
	loadRolesOfRoleCategory: function(categoryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Roles ...');
		}
		Ext.Ajax.request({
			url: ROLE_CATEGORY_BASE_URL + categoryId + '/roles.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var roleData = Ext.decode(data.responseText);
				if (roleData.owned_roles) {
					Ext.getStore('roleLibrary.Roles').loadRawData(roleData.owned_roles);
				} else {
					Ext.getStore('roleLibrary.Roles').loadRawData(roleData);
				}
				Ext.getStore('roleLibrary.Roles').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading roles failure');			
			}
		});
	},
	addNewRoleCategory: function(url, categoryName, categoryDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Role Category ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				role_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.AddingChildOnRoleNode.data.id !== 'root') {
					var node = MYOCD.SharedData.AddingChildOnRoleNode;
					node.expand(false, function() {
						me.loadCategoriesOfRolesCategory(node.data.id, node, onView);
					});
				} else {
					me.loadCategoriesOfRolesLib(MYOCD.SharedData.currentRoleLibId , MYOCD.SharedData.AddingChildOnRoleNode.data.name, onView);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Create role category failure');			
			}
		});
	},
	editRolesCategory: function(categoryName, categoryDesc, onView){
		var me = this;
		if(onView) {
			onView.setLoading('Updating Roles Category ...');
		}
		var categoryId = MYOCD.SharedData.currentRolesCategoryNodeContextMenu.data.id;
		Ext.Ajax.request({
			url: ROLE_CATEGORY_BASE_URL + categoryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				role_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				MYOCD.SharedData.currentRolesCategoryNodeContextMenu.set('name', categoryName);
				MYOCD.SharedData.currentRolesCategoryNodeContextMenu.set('description', categoryDesc);
				MYOCD.SharedData.currentRolesCategoryNodeContextMenu.commit();
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update roles category failure');			
			}
		});

	},
	deleteRolesCategory: function(onView){
		var me = this;
		if(onView) {
			onView.setLoading('Deleting roles Category ...');
		}
		var categoryId = MYOCD.SharedData.currentRolesCategoryNodeContextMenu.data.id;
		var deleteNode = MYOCD.SharedData.currentRolesCategoryNodeContextMenu;
		Ext.Ajax.request({
			url: ROLE_CATEGORY_BASE_URL + categoryId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var store = deleteNode.stores[0];
				store.remove (deleteNode);
				deleteNode.destroy();
				if(deleteNode == MYOCD.SharedData.currentRoleCategory) {
					MYOCD.SharedData.currentRoleCategory = null;
					Ext.getStore('roleLibrary.Roles').removeAll();
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update roles category failure');			
			}
		});
	},
	addNewRole: function(url, roleName, roleDesc, parentRoleId, permissionArr, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Role ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				role: {
					name: roleName,
					description: roleDesc,
				},
				base_role_id: parentRoleId
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var newRole = Ext.decode(data.responseText);
				if(permissionArr) {
					me.addMultiPermissionsToRole(newRole.id, permissionArr, null, onView);
				}
				if(MYOCD.SharedData.currentRoleCategory == null || MYOCD.SharedData.currentRoleCategory.data.id == 'root') {
					me.loadRolesOfRoleLib(MYOCD.SharedData.currentRoleLibId, onView);
					
				} else {
					me.loadRolesOfRoleCategory(MYOCD.SharedData.currentRoleCategory.data.id, onView);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Create role failure');			
			}
		});
	},
	editRole: function(roleId, roleName, roleDesc, parentRole, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Role ...');
		}
		var data = parentRole != null ? {
										role: {
											name: roleName,
											description: roleDesc
										},
										base_role_id: parentRole

									  } : {
										  role: {
											name: roleName,
											description: roleDesc
										  }
									  }
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: data,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentRoleCategory == null || MYOCD.SharedData.currentRoleCategory.data.id == 'root') {
					me.loadRolesOfRoleLib(MYOCD.SharedData.currentRoleLibId, onView);
					
				} else {
					me.loadRolesOfRoleCategory(MYOCD.SharedData.currentRoleCategory.data.id, onView);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update role failure');			
			}
		});
	},
	deleteRole: function(roleId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Role ...');
		}
		var parentId;
		if(MYOCD.SharedData.currentRoleCategory == null || MYOCD.SharedData.currentRoleCategory.data.id == 'root') {
			parentId = MYOCD.SharedData.currentRoleLibId;
			
		} else {
			parentId = MYOCD.SharedData.currentRoleCategory.data.id;
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				parent_id: parentId.toString()	
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentRoleCategory == null || MYOCD.SharedData.currentRoleCategory.data.id == 'root') {
					me.loadRolesOfRoleLib(MYOCD.SharedData.currentRoleLibId, onView);
					
				} else {
					me.loadRolesOfRoleCategory(MYOCD.SharedData.currentRoleCategory.data.id, onView);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Delete role failure');			
			}
		});
	},
	getRoleInfo: function(roleId, onView, callBack) {
		var me = this;
		if(onView) {
			onView.setLoading('Getting Role Info ...');
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var role = Ext.decode(data.responseText);
				if(callBack) {
					callBack(role);
				}
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
				loadIntoStore.loadRawData(permissionsData.permissions);
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
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Add Role Permissions failure');			
			}
		});
	},
	removePermissionFromRole: function(roleId, record, permissionStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Getting Role Permissions ...');
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '/permissions.json',
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
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Get Role Permissions failure');			
			}
		});
	},
	addMultiPermissionsToRole: function(roleId, permissionArr, permisstionStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Adding New Role Permissions ...');
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '/permissions.json',
			method: 'POST',
			jsonData: {
				permission_ids: permissionArr	
			},
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(permisstionStore) {
					me.getPermissionsOfRole(roleId, permisstionStore, onView);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Add Role Permissions failure');			
			}
		});
	},
	copyRoleCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			MYOCD.SharedData.roleCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Copying Role Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = ROLE_CATEGORY_BASE_URL + sourceFeature.data.id + '/copy/' + MYOCD.SharedData.currentRoleLibId + '.json';  
		} else {
			url = ROLE_CATEGORY_BASE_URL + sourceCategory.data.id + '/copy/' + destCategory.data.id + '.json';
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				MYOCD.SharedData.roleCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfRolesLib(MYOCD.SharedData.currentRoleLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfRolesCategory(destCategory.data.id, destCategory, onView)
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	moveRoleCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			var treePanel = MYOCD.SharedData.currentRoleCategoryTree;
			treePanel.ownerCt.getView().removeRowCls(MYOCD.SharedData.roleCategorySourceNode,'opacity-treenode');
			MYOCD.SharedData.permissionCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Moving Role Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = ROLE_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + MYOCD.SharedData.currentRoleLibId + '.json';  
		} else {
			url = ROLE_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + destCategory.data.id + '.json';
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var store = MYOCD.SharedData.roleCategorySourceNode.stores[0];
				store.remove (MYOCD.SharedData.roleCategorySourceNode);
				MYOCD.SharedData.roleCategorySourceNode.destroy();
				if(MYOCD.SharedData.roleCategorySourceNode == MYOCD.SharedData.currentRoleCategory) {
					MYOCD.SharedData.currentRoleCategory = null;
					Ext.getStore('roleLibrary.Roles').removeAll();
				}
				MYOCD.SharedData.roleCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfRolesLib(MYOCD.SharedData.currentRoleLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfRolesCategory(destCategory.data.id, destCategory, onView)
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	moveRole: function(roleId, destCategory, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Moving Role ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = ROLE_BASE_URL + roleId + '/move/' + MYOCD.SharedData.currentRoleLibId + '.json';  
		} else {
			url = ROLE_BASE_URL + roleId + '/move/' + destCategory.data.id + '.json';
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				MYOCD.SharedData.currentRoleCategory = destCategory;
				if(MYOCD.SharedData.currentRoleCategory.data.id == 'root') {
                	me.loadRolesOfRoleLib(MYOCD.SharedData.currentRoleLibId, onView);
				} else {
					me.loadRolesOfRoleCategory(MYOCD.SharedData.currentRoleCategory.data.id, onView);
				}
				
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	importRoleLibraries: function(libraryId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Importing Library ...');
		}
		Ext.Ajax.request({
			url: ROLE_LIBS_BASE_URL + 'import.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				library_ids: [libraryId]
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log(data.responseText);
				me.loadRoleLibraries(MYOCD.SharedData.currentCompanyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	}  
});