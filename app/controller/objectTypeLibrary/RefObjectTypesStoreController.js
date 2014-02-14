Ext.define('MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadPublicObjectTypeLibraries: function(searchText, onView) {
		if(onView) {
			onView.setLoading('Loading Public Object Type Libraries ...');
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_LIB_BASE_URL + 'search/' + searchText + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var libraryData = Ext.decode(data.responseText);
				Ext.getStore('objectTypeLibrary.PublicObjectTypeLibraries').loadRawData(libraryData); 
				Ext.getStore('objectTypeLibrary.PublicObjectTypeLibraries').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading object type libraries failure');			
			}
		});
	}, 
	loadObjectTypeLibraries: function(companyId, onView) {
		if(onView) {
			onView.setLoading('Loading Object Type Libraries ...');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/objecttypelibs.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var libraryData = Ext.decode(data.responseText);
				Ext.getStore('objectTypeLibrary.RefObjectTypeLibraries').loadRawData(libraryData); 
				Ext.getStore('objectTypeLibrary.RefObjectTypeLibraries').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading object type libraries failure');			
			}
		});
	},
	loadCategoriesOfObjectTypesLib: function(libraryId, libraryName, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Object Type Categories ...');
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_LIB_BASE_URL + libraryId + '/categories.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var categoryData = Ext.decode(data.responseText);
				Ext.getStore('objectTypeLibrary.RefObjectTypeCategoriesTreeStore').setRootNode(
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
				console.log('Load object type categories failure');			
			}
		});
	},
	loadCategoriesOfObjectTypesCategory: function(categoryId, categoryTreeNode, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Object Type Categories ...');
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_CATEGORY_BASE_URL + categoryId + '/categories.json',
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
				console.log('Load object type categories failure');			
			}
		});
	},
	loadObjectTypesOfObjectTypeLib: function(libraryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Object Types ...');
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_LIB_BASE_URL + libraryId + '/objecttypes.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var objectTypeData = Ext.decode(data.responseText);
				Ext.getStore('objectTypeLibrary.RefObjectTypes').loadRawData(objectTypeData);
				Ext.getStore('objectTypeLibrary.RefObjectTypes').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading object types failure');			
			}
		});
	},
	loadObjectTypesOfObjectTypeCategory: function(categoryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Object Types ...');
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_CATEGORY_BASE_URL + categoryId + '/objecttypes.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var objectTypeData = Ext.decode(data.responseText);
				Ext.getStore('objectTypeLibrary.RefObjectTypes').loadRawData(objectTypeData);
				Ext.getStore('objectTypeLibrary.RefObjectTypes').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading ObjectTypes failure');			
			}
		});
	},
	loadObjectTypeVersions: function (objectTypeId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Object Type Versions ...');
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_BASE_URL + objectTypeId + '/versions.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var versionData = Ext.decode(data.responseText);
				Ext.getStore('objectTypeLibrary.RefObjectTypeVersions').removeAll();
				versionData.forEach(function(version) {
					version.selected = false;
					Ext.getStore('objectTypeLibrary.RefObjectTypeVersions').add(version);
				});
				Ext.getStore('objectTypeLibrary.RefObjectTypeVersions').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading ObjectTypes failure');			
			}
		});
	}
});