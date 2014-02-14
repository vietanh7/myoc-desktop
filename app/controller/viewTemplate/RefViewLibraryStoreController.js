Ext.define('MYOCD.controller.viewTemplate.RefViewLibraryStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadPublicViewLibraries: function(searchText, onView) {
		if(onView) {
			onView.setLoading('Loading Public View Templates Libraries ...');
		}
		Ext.Ajax.request({
			url: VIEW_LIB_BASE_URL + 'search/' + searchText + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var libraryData = Ext.decode(data.responseText);
				Ext.getStore('viewTemplate.PublicViewLibraries').loadRawData(libraryData); 
				Ext.getStore('viewTemplate.PublicViewLibraries').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading View Templates libraries failure');			
			}
		});
	},
	loadViewLibraries: function(companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading View Templates Libraries ...');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/viewlibs.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var libraryData = Ext.decode(data.responseText);
				Ext.getStore('viewTemplate.RefViewLibraries').loadRawData(libraryData); 
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading View libraries failure');			
			}
		});
	},
	loadCategoriesOfViewsLib: function(libraryId, libraryName, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading View Categories ...');
		}
		Ext.Ajax.request({
			url: VIEW_LIB_BASE_URL + libraryId + '/categories.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var categoryData = Ext.decode(data.responseText);
				Ext.getStore('viewTemplate.RefViewCategoriesTreeStore').setRootNode(
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
				console.log('Load View categories failure');			
			}
		});
	},
	loadCategoriesOfViewsCategory: function(categoryId, categoryTreeNode, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading View Categories ...');
		}
		Ext.Ajax.request({
			url: VIEW_CATEGORY_BASE_URL + categoryId + '/categories.json',
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
				console.log('Load View categories failure');			
			}
		});
	},
	loadViewTemplatesOfViewLib: function(libraryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading View Templates ...');
		}
		Ext.Ajax.request({
			url: VIEW_LIB_BASE_URL + libraryId + '/templates.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var categoryData = Ext.decode(data.responseText);
				Ext.getStore('viewTemplate.RefViewTemplates').loadRawData(categoryData);
				Ext.getStore('viewTemplate.RefViewTemplates').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Load Views failure');			
			}
		});
	},
	loadViewTemplatesOfViewCategory: function(categoryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading View Templates ...');
		}
		Ext.Ajax.request({
			url: VIEW_CATEGORY_BASE_URL + categoryId + '/templates.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var categoryData = Ext.decode(data.responseText);
				Ext.getStore('viewTemplate.RefViewTemplates').loadRawData(categoryData);
				Ext.getStore('viewTemplate.RefViewTemplates').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Load Views failure');			
			}
		});
	}
});