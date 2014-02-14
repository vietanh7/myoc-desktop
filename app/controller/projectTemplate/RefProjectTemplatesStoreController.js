Ext.define('MYOCD.controller.projectTemplate.RefProjectTemplatesStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadPublicProjectTemplatesLibs: function(searchText, onView) {
		if(onView) {
			onView.setLoading('Loading Public Project Templates Libraries ...');
		}
		Ext.Ajax.request({
			url: PROJECT_TEMPLATE_LIB_BASE_URL + 'search/' + searchText + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var libraryData = Ext.decode(data.responseText);
				Ext.getStore('projectTemplate.PublicProjectTemplateLibs').loadRawData(libraryData); 
				Ext.getStore('projectTemplate.PublicProjectTemplateLibs').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading Project Templates libraries failure');			
			}
		});
	},
	loadProjectTemplatesLibs: function(companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Project Templates libraries');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/projecttemplatelibs.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                var templateData = Ext.decode(data.responseText);
                Ext.getStore('projectTemplate.RefProjectTemplatesLibs').loadRawData(templateData); 
                Ext.getStore('projectTemplate.RefProjectTemplatesLibs').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading Project templates library failure');
			}
		});
	},
	oadCategoriesOfProjectTemplatesLib: function(libraryId, libraryName, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Project Templates Categories ...');
		}
		Ext.Ajax.request({
			url: PROJECT_TEMPLATE_LIB_BASE_URL + libraryId + '/categories.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var categoryData = Ext.decode(data.responseText);
				Ext.getStore('projectTemplate.RefProjectTemplatesCategoriesTreeStore').setRootNode(
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
				console.log('Load Project templates categories failure');			
			}
		});
	},
	loadCategoriesOfProjectTemplatesCategory: function(categoryId, categoryTreeNode, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Project Templates Categories ...');
		}
		Ext.Ajax.request({
			url: PROJECT_TEMPLATE_CATEGORY_BASE_URL + categoryId + '/categories.json',
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
				console.log('Load Project templates categories failure');			
			}
		});
	},
	loadTemplatesOfProjectTemplatesLib: function(libraryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Templates ...');
		}
		Ext.Ajax.request({
			url: PROJECT_TEMPLATE_LIB_BASE_URL + libraryId + '/templates.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var templateData = Ext.decode(data.responseText);
				Ext.getStore('projectTemplate.RefProjectTemplates').loadRawData(templateData);
				Ext.getStore('projectTemplate.RefProjectTemplates').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading templates failure');			
			}
		});
	},
	loadTemplatesOfProjectTemplatesCategory: function(categoryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Templates ...');
		}
		Ext.Ajax.request({
			url: PROJECT_TEMPLATE_CATEGORY_BASE_URL + categoryId + '/templates.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var templateData = Ext.decode(data.responseText);
				Ext.getStore('projectTemplate.RefProjectTemplates').loadRawData(templateData);
				Ext.getStore('projectTemplate.RefProjectTemplates').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
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