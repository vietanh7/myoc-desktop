Ext.define('MYOCD.controller.featureTemplate.RefFeatureTemplatesStoreController', {
	extend: 'Ext.app.Controller',
	singleton: true,
	refs: [
		{
			ref: 'main',
			selector: 'main'
		}
	],
	loadPublicFeatureTemplatesLibs: function(searchText, onView) {
		if(onView) {
			onView.setLoading('Loading Public Feature Templates Libraries ...');
		}
		Ext.Ajax.request({
			url: FEATURE_TEMPLATE_LIB_BASE_URL + 'search/' + searchText + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var libraryData = Ext.decode(data.responseText);
				Ext.getStore('featureTemplate.PublicFeatureTemplatesLibs').loadRawData(libraryData); 
				Ext.getStore('featureTemplate.PublicFeatureTemplatesLibs').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading feature templates libraries failure');			
			}
		});
	},
	loadFeatureTemplatesLibs: function(companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Feature Templates libraries');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/featuretemplatelibs.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                var templateData = Ext.decode(data.responseText);
                Ext.getStore('featureTemplate.RefFeatureTemplatesLibs').loadRawData(templateData); 
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading Feature templates library failure');
			}
		});
	},
	loadCategoriesOfFeatureTemplatesLib: function(libraryId, libraryName, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Feature Templates Categories ...');
		}
		Ext.Ajax.request({
			url: FEATURE_TEMPLATE_LIB_BASE_URL + libraryId + '/categories.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var categoryData = Ext.decode(data.responseText);
				Ext.getStore('featureTemplate.RefFeatureTemplatesCategoriesTreeStore').setRootNode(
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
				console.log('Load Feature templates categories failure');			
			}
		});
	},
	loadCategoriesOfFeatureTemplatesCategory: function(categoryId, categoryTreeNode, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Feature Templates Categories ...');
		}
		Ext.Ajax.request({
			url: FEATURE_TEMPLATE_CATEGORY_BASE_URL + categoryId + '/categories.json',
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
				console.log('Load Feature templates categories failure');			
			}
		});
	},
	loadTemplatesOfFeatureTemplatesLib: function(libraryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Templates ...');
		}
		Ext.Ajax.request({
			url: FEATURE_TEMPLATE_LIB_BASE_URL + libraryId + '/templates.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var templateData = Ext.decode(data.responseText);
				Ext.getStore('featureTemplate.RefFeatureTemplates').loadRawData(templateData);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading templates failure');			
			}
		});
	},
	loadTemplatesOfFeatureTemplatesCategory: function(categoryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Templates ...');
		}
		Ext.Ajax.request({
			url: FEATURE_TEMPLATE_CATEGORY_BASE_URL + categoryId + '/templates.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var templateData = Ext.decode(data.responseText);
				Ext.getStore('featureTemplate.RefFeatureTemplates').loadRawData(templateData);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading templates failure');			
			}
		});
	}
});