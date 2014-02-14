Ext.define('MYOCD.controller.permissionLibrary.RefPermissionLibraryStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadPublicPermissionLibraries: function(searchText, onView) {
		if(onView) {
			onView.setLoading('Loading Public Permission Libraries ...');
		}
		Ext.Ajax.request({
			url: PERMISSION_LIBS_BASE_URL + 'search/' + searchText + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var libraryData = Ext.decode(data.responseText);
				Ext.getStore('permissionLibrary.PublicPermissionLibraries').loadRawData(libraryData); 
				Ext.getStore('permissionLibrary.PublicPermissionLibraries').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading permission libraries failure');			
			}
		});
	},
	loadPermissionLibraries: function(companyId, onView) {
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
				Ext.getStore('permissionLibrary.RefPermissionLibraries').loadRawData(libraryData); 
				Ext.getStore('permissionLibrary.RefPermissionLibraries').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading permission libraries failure');			
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
				Ext.getStore('permissionLibrary.RefPermissionCategoriesTreeStore').setRootNode(
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
				Ext.getStore('permissionLibrary.RefPermissions').loadRawData(permissionsData.permissions);
				Ext.getStore('permissionLibrary.RefPermissions').sort([
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
				Ext.getStore('permissionLibrary.RefPermissions').loadRawData(permissionsData.permissions);
				Ext.getStore('permissionLibrary.RefPermissions').sort([
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
	} 
});