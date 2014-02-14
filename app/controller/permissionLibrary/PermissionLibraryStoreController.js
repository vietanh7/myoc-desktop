Ext.define('MYOCD.controller.permissionLibrary.PermissionLibraryStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadPermissionLibraries: function(companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Permission Libraries ...');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/permissionlibs.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var libraryData = Ext.decode(data.responseText);
				Ext.getStore('permissionLibrary.PermissionLibraries').loadRawData(libraryData); 
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading permission libraries failure');			
			}
		});
	},
	addNewPermissionLib: function(libraryName, libraryDesc, libraryAccess, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating New Permission Library ... ');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/permissionlibs.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				permission_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadPermissionLibraries(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Create new permission library failure');
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	editPermissionsLib: function(libraryName, libraryDesc, libraryAccess, libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Permissions Library');
		}
		Ext.Ajax.request({
			url: PERMISSION_LIBS_BASE_URL + libraryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				permission_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadPermissionLibraries(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('update permissions library failure');
			}
		});
	},
	deletePermissionsLib: function(libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Permissions Library ...');
		}
		Ext.Ajax.request({
			url: PERMISSION_LIBS_BASE_URL + libraryId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadPermissionLibraries(companyId, onView);			
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Delete permission library failure');			
			}
		});	
	},
	loadCategoriesOfPermissionsLib: function(libraryId, libraryName, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Permission Categories ...');
		}
		Ext.Ajax.request({
			url: PERMISSION_LIBS_BASE_URL + libraryId + '/categories.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var categoryData = Ext.decode(data.responseText);
				Ext.getStore('permissionLibrary.PermissionCategoriesTreeStore').setRootNode(
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
				console.log('Load permission categories failure');			
			}
		});
	},
	loadCategoriesOfPermissionsCategory: function(categoryId, categoryTreeNode, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Permission Categories ...');
		}
		Ext.Ajax.request({
			url: PERMISSION_CATEGORY_BASE_URL + categoryId + '/categories.json',
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
				console.log('Load permission categories failure');			
			}
		});
	},
	loadPermissionsOfPermissionLib: function(libraryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Permissions ...');
		}
		Ext.Ajax.request({
			url: PERMISSION_LIBS_BASE_URL + libraryId + '/permissions.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var permissionsData = Ext.decode(data.responseText);
				Ext.getStore('permissionLibrary.Permissions').loadRawData(permissionsData.permissions);
				Ext.getStore('permissionLibrary.Permissions').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Load permissions failure');			
			}
		});
	},
	loadPermissionsOfPermissionCategory: function(categoryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Permissions ...');
		}
		Ext.Ajax.request({
			url: PERMISSION_CATEGORY_BASE_URL + categoryId + '/permissions.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var permissionsData = Ext.decode(data.responseText);
				Ext.getStore('permissionLibrary.Permissions').loadRawData(permissionsData.permissions);
				Ext.getStore('permissionLibrary.Permissions').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Load permissions failure');			
			}
		});
	},
	addNewPermissionCategory: function(url, categoryName, categoryDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Permissions Category ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				permission_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.AddingChildOnPermissionNode.data.id !== 'root') {
					var node = MYOCD.SharedData.AddingChildOnPermissionNode;
					node.expand(false, function() {
						me.loadCategoriesOfPermissionsCategory(node.data.id, node, onView);
					});
				} else {
					me.loadCategoriesOfPermissionsLib(MYOCD.SharedData.currentPermissionLibId , MYOCD.SharedData.AddingChildOnPermissionNode.data.name,  onView);
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
				console.log('Create permissions category failure');			
			}
		});
	},
	editPermissionsCategory: function(categoryName, categoryDesc, onView){
		var me = this;
		if(onView) {
			onView.setLoading('Updating Permissions Category ...');
		}
		var categoryId = MYOCD.SharedData.currentPermissionsCategoryNodeContextMenu.data.id;
		Ext.Ajax.request({
			url: PERMISSION_CATEGORY_BASE_URL + categoryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				permission_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				MYOCD.SharedData.currentPermissionsCategoryNodeContextMenu.set('name', categoryName);
				MYOCD.SharedData.currentPermissionsCategoryNodeContextMenu.set('description', categoryDesc);
				MYOCD.SharedData.currentPermissionsCategoryNodeContextMenu.commit();
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update permissions category failure');			
			}
		});

	},
	deletePermissionsCategory: function(onView){
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Permissions Category ...');
		}
		var categoryId = MYOCD.SharedData.currentPermissionsCategoryNodeContextMenu.data.id;
		var deleteNode = MYOCD.SharedData.currentPermissionsCategoryNodeContextMenu;
		Ext.Ajax.request({
			url: PERMISSION_CATEGORY_BASE_URL + categoryId + '.json',
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
				if(deleteNode == MYOCD.SharedData.currentPermissionCategory) {
					MYOCD.SharedData.currentPermissionCategory = null;
					Ext.getStore('permissionLibrary.Permissions').removeAll();
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
				console.log('Update Permissions category failure');			
			}
		});
	},
	addNewPermission: function(url, permissionName, permissionDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating New Permission ...');
		}
		Ext.Ajax.request({
			url: url, //PERMISSION_CATEGORY_BASE_URL + categoryId + '/permissions.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				permission: {
					name: permissionName,
					description: permissionDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                
                if(MYOCD.SharedData.currentPermissionCategory == null || MYOCD.SharedData.currentPermissionCategory.data.id == 'root') {
					me.loadPermissionsOfPermissionLib(MYOCD.SharedData.currentPermissionLibId, onView);				
				} else {
					me.loadPermissionsOfPermissionCategory(MYOCD.SharedData.currentPermissionCategory.data.id, onView);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Create new permission failure');
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	editPermission: function(permissionId, permissionName, permissionDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Permission ...');
		}
		Ext.Ajax.request({
			url: PERMISSION_BASE_URL + permissionId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				permission: {
					name: permissionName,
					description: permissionDesc				
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentPermissionCategory == null || MYOCD.SharedData.currentPermissionCategory.data.id == 'root') {
					me.loadPermissionsOfPermissionLib(MYOCD.SharedData.currentPermissionLibId, onView);				
				} else {
					me.loadPermissionsOfPermissionCategory(MYOCD.SharedData.currentPermissionCategory.data.id, onView);
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
				console.log('Update classification failure');			
			}
		});
	},
	deletePermission: function(permissionId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Permission ...');
		}
		Ext.Ajax.request({
			url: PERMISSION_BASE_URL + permissionId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentPermissionCategory == null || MYOCD.SharedData.currentPermissionCategory.data.id == 'root') {
					me.loadPermissionsOfPermissionLib(MYOCD.SharedData.currentPermissionLibId, onView);				
				} else {
					me.loadPermissionsOfPermissionCategory(MYOCD.SharedData.currentPermissionCategory.data.id, onView);
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
				console.log('Delete permission failure');			
			}
		});
	},
	copyPermissionCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			MYOCD.SharedData.permissionCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Copying Permission Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = PERMISSION_CATEGORY_BASE_URL + sourceFeature.data.id + '/copy/' + MYOCD.SharedData.currentPermissionLibId + '.json';  
		} else {
			url = PERMISSION_CATEGORY_BASE_URL + sourceCategory.data.id + '/copy/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.permissionCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfPermissionsLib(MYOCD.SharedData.currentPermissionLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfPermissionsCategory(destCategory.data.id, destCategory, onView)
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
	movePermissionCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			var treePanel = MYOCD.SharedData.currentPermissionCategoryTree;
			treePanel.ownerCt.getView().removeRowCls(MYOCD.SharedData.permissionCategorySourceNode,'opacity-treenode');
			MYOCD.SharedData.permissionCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Moving Permission Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = PERMISSION_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + MYOCD.SharedData.currentPermissionLibId + '.json';  
		} else {
			url = PERMISSION_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + destCategory.data.id + '.json';
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
				var store = MYOCD.SharedData.permissionCategorySourceNode.stores[0];
				store.remove (MYOCD.SharedData.permissionCategorySourceNode);
				MYOCD.SharedData.permissionCategorySourceNode.destroy();
				if(MYOCD.SharedData.permissionCategorySourceNode == MYOCD.SharedData.currentPermissionCategory) {
					MYOCD.SharedData.currentPermissionCategory = null;
					Ext.getStore('permissionLibrary.Permissions').removeAll();
				}
				MYOCD.SharedData.permissionCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfPermissionsLib(MYOCD.SharedData.currentPermissionLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfPermissionsCategory(destCategory.data.id, destCategory, onView)
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
	movePermission: function(permissionId, destCategory, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Moving Permission ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = PERMISSION_BASE_URL + permissionId + '/move/' + MYOCD.SharedData.currentPermissionLibId + '.json';  
		} else {
			url = PERMISSION_BASE_URL + permissionId + '/move/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.currentPermissionCategory = destCategory;
				if(MYOCD.SharedData.currentPermissionCategory.data.id == 'root') {
                	me.loadPermissionsOfPermissionLib(MYOCD.SharedData.currentPermissionLibId, onView);
				} else {
					me.loadPermissionsOfPermissionCategory(MYOCD.SharedData.currentPermissionCategory.data.id, onView);
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
	importPermissionLibraries: function(libraryId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Importing Library ...');
		}
		Ext.Ajax.request({
			url: PERMISSION_LIBS_BASE_URL + 'import.json',
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
				me.loadPermissionLibraries(MYOCD.SharedData.currentCompanyId, onView);
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