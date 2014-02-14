Ext.define('MYOCD.controller.companyTemplate.CompanyTemplatesStoreController', {
	extend: 'Ext.app.Controller',
	singleton: true,
	refs: [
		{
			ref: 'main',
			selector: 'main'
		}
	],
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
                Ext.getStore('companyTemplate.CompanyTemplatesLibs').loadRawData(templateData); 
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading company templates library failure');
			}
		});
	},
	addNewCompanyTemplatesLib: function(libraryName, libraryDesc, libraryAccess, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating New Company Templates Library');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/companytemplatelibs.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				company_template_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadCompanyTemplatesLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Create new company templates library failure');
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	editCompanyTemplatesLib: function(libraryId, libraryName, libraryDesc, libraryAccess, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Company Templates Library');
		}
		Ext.Ajax.request({
			url: COMPANY_TEMPLATE_LIB_BASE_URL + libraryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				company_template_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadCompanyTemplatesLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update company templates library failure');
			}
		});
	},
	deleteCompanyTemplatesLib: function(libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Company Templates Library');
		}
		Ext.Ajax.request({
			url: COMPANY_TEMPLATE_LIB_BASE_URL + libraryId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadCompanyTemplatesLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Delete company templates library failure');
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
				Ext.getStore('companyTemplate.CompanyTemplatesCategoriesTreeStore').setRootNode(
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
				Ext.getStore('companyTemplate.CompanyTemplates').loadRawData(templateData);
				Ext.getStore('companyTemplate.CompanyTemplates').sort([
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
				Ext.getStore('companyTemplate.CompanyTemplates').loadRawData(templateData);
				Ext.getStore('companyTemplate.CompanyTemplates').sort([
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
	addNewCompanyTemplatesCategory: function(url, categoryName, categoryDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Company Template Category ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				company_template_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.AddingChildOnCompanyTemplateNode.data.id !== 'root') {
					var node = MYOCD.SharedData.AddingChildOnCompanyTemplateNode;
					node.expand(false, function() {
						me.loadCategoriesOfCompanyTemplatesCategory(node.data.id, node, onView);
					});
				} else {
					me.loadCategoriesOfCompanyTemplatesLib(
						MYOCD.SharedData.currentCompanyTemplatesLibId, 
						MYOCD.SharedData.AddingChildOnCompanyTemplateNode.data.name, 
						onView);
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
				console.log('Create company template category failure');			
			}
		});
	},
	editCompanyTemplateCategory: function(categoryName, categoryDesc, onView){
		var me = this;
		if(onView) {
			onView.setLoading('Updating Company Template Category ...');
		}
		var categoryId = MYOCD.SharedData.currentCompanyTemplatesCategoryNodeContextMenu.data.id;
		Ext.Ajax.request({
			url: COMPANY_TEMPLATE_CATEGORY_BASE_URL + categoryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				company_template_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				MYOCD.SharedData.currentCompanyTemplatesCategoryNodeContextMenu.set('name', categoryName);
				MYOCD.SharedData.currentCompanyTemplatesCategoryNodeContextMenu.set('description', categoryDesc);
				MYOCD.SharedData.currentCompanyTemplatesCategoryNodeContextMenu.commit();
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update company template category failure');			
			}
		});
	},
	deleteCompanyTemplateCategory: function(onView){
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Company Template Category ...');
		}
		var categoryId = MYOCD.SharedData.currentCompanyTemplatesCategoryNodeContextMenu.data.id;
		var deleteNode = MYOCD.SharedData.currentCompanyTemplatesCategoryNodeContextMenu;
		Ext.Ajax.request({
			url: COMPANY_TEMPLATE_CATEGORY_BASE_URL + categoryId + '.json',
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
				if(deleteNode == MYOCD.SharedData.currentCompanyTemplatesCategory) {
					MYOCD.SharedData.currentCompanyTemplatesCategory = null;
					Ext.getStore('companyTemplate.CompanyTemplates').removeAll();
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
				console.log('Update company template category failure');			
			}
		});
	},
	addNewCompanyTemplate: function(url, templateName, templateDesc, templateType, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Template ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				company_template: {
					name: templateName,
					description: templateDesc,
					company_type: templateType
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentCompanyTemplatesCategory == null || MYOCD.SharedData.currentCompanyTemplatesCategory.data.id == 'root') {
					me.loadTemplatesOfCompanyTemplatesLib(MYOCD.SharedData.currentCompanyTemplatesLibId, onView);
					
				} else {
					me.loadTemplatesOfCompanyTemplatesCategory(MYOCD.SharedData.currentCompanyTemplatesCategory.data.id, onView);
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
				console.log('Create template failure');			
			}
		});
	},
	editCompanyTemplate: function(companyTemplateId, companyTemplateName, companyTemplateDesc, companyTemplateType, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Company Template ...');
		}
		Ext.Ajax.request({
			url: COMPANY_TEMPLATE_BASE_URL + companyTemplateId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				company_template: {
					name: companyTemplateName,
					description: companyTemplateDesc,
					company_type: companyTemplateType
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentCompanyTemplatesCategory == null || MYOCD.SharedData.currentCompanyTemplatesCategory.data.id == 'root') {
					me.loadTemplatesOfCompanyTemplatesLib(MYOCD.SharedData.currentCompanyTemplatesLibId, onView);
					
				} else {
					me.loadTemplatesOfCompanyTemplatesCategory(MYOCD.SharedData.currentCompanyTemplatesCategory.data.id, onView);
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
				console.log('Update company template failure');			
			}
		});
	},
	deleteCompanyTemplate: function(companyTemplateId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Company Template ...');
		}
		Ext.Ajax.request({
			url: COMPANY_TEMPLATE_BASE_URL + companyTemplateId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentCompanyTemplatesCategory == null || MYOCD.SharedData.currentCompanyTemplatesCategory.data.id == 'root') {
					me.loadTemplatesOfCompanyTemplatesLib(MYOCD.SharedData.currentCompanyTemplatesLibId, onView);
					
				} else {
					me.loadTemplatesOfCompanyTemplatesCategory(MYOCD.SharedData.currentCompanyTemplatesCategory.data.id, onView);
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
				console.log('Delete company template failure');			
			}
		});
	},
	copyCompanyCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			MYOCD.SharedData.companyCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Copying Company Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = COMPANY_TEMPLATE_CATEGORY_BASE_URL + sourceFeature.data.id + '/copy/' + MYOCD.SharedData.currentCompanyTemplatesLibId + '.json';  
		} else {
			url = COMPANY_TEMPLATE_CATEGORY_BASE_URL + sourceCategory.data.id + '/copy/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.companyCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfCompanyTemplatesLib(MYOCD.SharedData.currentCompanyTemplatesLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfCompanyTemplatesCategory(destCategory.data.id, destCategory, onView)
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
	moveCompanyCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			var treePanel = MYOCD.SharedData.currentCompanyCategoryTree;
			treePanel.ownerCt.getView().removeRowCls(MYOCD.SharedData.companyCategorySourceNode,'opacity-treenode');
			MYOCD.SharedData.companyCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Moving Company Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = COMPANY_TEMPLATE_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + MYOCD.SharedData.currentCompanyTemplatesLibId + '.json';  
		} else {
			url = COMPANY_TEMPLATE_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + destCategory.data.id + '.json';
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
				var store = MYOCD.SharedData.companyCategorySourceNode.stores[0];
				store.remove (MYOCD.SharedData.companyCategorySourceNode);
				MYOCD.SharedData.companyCategorySourceNode.destroy();
				if(MYOCD.SharedData.companyCategorySourceNode == MYOCD.SharedData.currentCompanyTemplatesCategory) {
					MYOCD.SharedData.currentCompanyTemplatesCategory = null;
					Ext.getStore('companyTemplate.CompanyTemplates').removeAll();
				}
				MYOCD.SharedData.companyCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfCompanyTemplatesLib(MYOCD.SharedData.currentCompanyTemplatesLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfCompanyTemplatesCategory(destCategory.data.id, destCategory, onView)
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
	moveCompanyTemplate: function(companyTemplateId, destCategory, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Moving Company Template ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = COMPANY_TEMPLATE_BASE_URL + companyTemplateId + '/move/' + MYOCD.SharedData.currentCompanyTemplatesLibId + '.json';  
		} else {
			url = COMPANY_TEMPLATE_BASE_URL + companyTemplateId + '/move/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.currentCompanyTemplatesCategory = destCategory;
				if(MYOCD.SharedData.currentCompanyTemplatesCategory.data.id == 'root') {
                	me.loadTemplatesOfCompanyTemplatesLib(MYOCD.SharedData.currentCompanyTemplatesLibId, onView);
				} else {
					me.loadTemplatesOfCompanyTemplatesCategory(MYOCD.SharedData.currentCompanyTemplatesCategory.data.id, onView);
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
	importCompanyTemplateLibraries: function(libraryId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Importing Library ...');
		}
		Ext.Ajax.request({
			url: COMPANY_TEMPLATE_LIB_BASE_URL + 'import.json',
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
				me.loadCompanyTemplatesLibs(MYOCD.SharedData.currentCompanyId, onView);
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