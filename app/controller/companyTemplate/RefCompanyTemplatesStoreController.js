Ext.define('MYOCD.controller.companyTemplate.RefCompanyTemplatesStoreController', {
	extend: 'Ext.app.Controller',
	singleton: true,
	refs: [
		{
			ref: 'main',
			selector: 'main'
		}
	],
	loadPublicCompanyTemplatesLibs: function(searchText, onView) {
		if(onView) {
			onView.setLoading('Loading Public Company Templates Libraries ...');
		}
		Ext.Ajax.request({
			url: COMPANY_TEMPLATE_LIB_BASE_URL + 'search/' + searchText + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var libraryData = Ext.decode(data.responseText);
				Ext.getStore('companyTemplate.PublicCompanyTemplatesLibs').loadRawData(libraryData); 
				Ext.getStore('companyTemplate.PublicCompanyTemplatesLibs').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading public Company Template libraries failure');			
			}
		});
	},
	loadCompanyTemplatesLibs: function(companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Company Templates libraries');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/companytemplatelibs.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                var templateData = Ext.decode(data.responseText);
                Ext.getStore('companyTemplate.RefCompanyTemplatesLibs').loadRawData(templateData); 
                Ext.getStore('companyTemplate.RefCompanyTemplatesLibs').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading company templates library failure');
			}
		});
	},
	loadCategoriesOfCompanyTemplatesLib: function(libraryId, libraryName, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Company Templates Categories ...');
		}
		Ext.Ajax.request({
			url: COMPANY_TEMPLATE_LIB_BASE_URL + libraryId + '/categories.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var categoryData = Ext.decode(data.responseText);
				Ext.getStore('companyTemplate.RefCompanyTemplatesCategoriesTreeStore').setRootNode(
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
				console.log('Load company templates categories failure');			
			}
		});
	},
	loadCategoriesOfCompanyTemplatesCategory: function(categoryId, categoryTreeNode, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Company Templates Categories ...');
		}
		Ext.Ajax.request({
			url: COMPANY_TEMPLATE_CATEGORY_BASE_URL + categoryId + '/categories.json',
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
				console.log('Load company templates categories failure');			
			}
		});
	},
	loadTemplatesOfCompanyTemplatesLib: function(libraryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Templates ...');
		}
		Ext.Ajax.request({
			url: COMPANY_TEMPLATE_LIB_BASE_URL + libraryId + '/templates.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var templateData = Ext.decode(data.responseText);
				Ext.getStore('companyTemplate.RefCompanyTemplates').loadRawData(templateData);
				Ext.getStore('companyTemplate.RefCompanyTemplates').sort([
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
	loadTemplatesOfCompanyTemplatesCategory: function(categoryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Templates ...');
		}
		Ext.Ajax.request({
			url: COMPANY_TEMPLATE_CATEGORY_BASE_URL + categoryId + '/templates.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var templateData = Ext.decode(data.responseText);
				Ext.getStore('companyTemplate.RefCompanyTemplates').loadRawData(templateData);
				Ext.getStore('companyTemplate.RefCompanyTemplates').sort([
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