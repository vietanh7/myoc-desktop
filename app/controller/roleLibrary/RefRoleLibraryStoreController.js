Ext.define('MYOCD.controller.roleLibrary.RefRoleLibraryStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadPublicRoleLibraries: function(searchText, onView) {
		if(onView) {
			onView.setLoading('Loading Public Role Libraries ...');
		}
		Ext.Ajax.request({
			url: ROLE_LIBS_BASE_URL + 'search/' + searchText + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var libraryData = Ext.decode(data.responseText);
				Ext.getStore('roleLibrary.PublicRoleLibraries').loadRawData(libraryData); 
				Ext.getStore('roleLibrary.PublicRoleLibraries').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading role libraries failure');			
			}
		});
	},
	loadRoleLibraries: function(companyId, onView) {
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
				Ext.getStore('roleLibrary.RefRoleLibraries').loadRawData(libraryData); 
				Ext.getStore('roleLibrary.RefRoleLibraries').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading role libraries failure');			
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
				Ext.getStore('roleLibrary.RefRoleCategoriesTreeStore').setRootNode(
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
					Ext.getStore('roleLibrary.RefRoles').loadRawData(roleData.owned_roles);
				} else {
					Ext.getStore('roleLibrary.RefRoles').loadRawData(roleData);
				}
				Ext.getStore('roleLibrary.RefRoles').sort([
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
					Ext.getStore('roleLibrary.RefRoles').loadRawData(roleData.owned_roles);
				} else {
					Ext.getStore('roleLibrary.RefRoles').loadRawData(roleData);
				}
				Ext.getStore('roleLibrary.RefRoles').sort([
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
	}  
});