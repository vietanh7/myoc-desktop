Ext.define('MYOCD.controller.viewTemplate.ViewLibraryStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
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
				Ext.getStore('viewTemplate.ViewLibraries').loadRawData(libraryData); 
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
	addNewViewLib: function(libraryName, libraryDesc, libraryAccess, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating New View Library ... ');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/viewlibs.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				view_template_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadViewLibraries(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Create new View library failure');
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	editViewsLib: function(libraryName, libraryDesc, libraryAccess, libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Views Library');
		}
		Ext.Ajax.request({
			url: VIEW_LIB_BASE_URL + libraryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				view_template_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadViewLibraries(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('update Views library failure');
			}
		});
	},
	deleteViewsLib: function(libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Views Library ...');
		}
		Ext.Ajax.request({
			url: VIEW_LIB_BASE_URL + libraryId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadViewLibraries(companyId, onView);			
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Delete View library failure');			
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
				Ext.getStore('viewTemplate.ViewCategoriesTreeStore').setRootNode(
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
				Ext.getStore('viewTemplate.ViewTemplates').loadRawData(categoryData);
				Ext.getStore('viewTemplate.ViewTemplates').sort([
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
				Ext.getStore('viewTemplate.ViewTemplates').loadRawData(categoryData);
				Ext.getStore('viewTemplate.ViewTemplates').sort([
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
	addNewViewCategory: function(url, categoryName, categoryDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Views Category ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				view_template_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.AddingChildOnViewNode.data.id !== 'root') {
					var node = MYOCD.SharedData.AddingChildOnViewNode;
					node.expand(false, function() {
						me.loadCategoriesOfViewsCategory(node.data.id, node, onView);
					});
				} else {
					me.loadCategoriesOfViewsLib(MYOCD.SharedData.currentViewLibId , MYOCD.SharedData.AddingChildOnViewNode.data.name,  onView);
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
				console.log('Create Views category failure');			
			}
		});
	},
	editViewsCategory: function(categoryName, categoryDesc, onView){
		var me = this;
		if(onView) {
			onView.setLoading('Updating Views Category ...');
		}
		var categoryId = MYOCD.SharedData.currentViewsCategoryNodeContextMenu.data.id;
		Ext.Ajax.request({
			url: VIEW_CATEGORY_BASE_URL + categoryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				view_template_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				MYOCD.SharedData.currentViewsCategoryNodeContextMenu.set('name', categoryName);
				MYOCD.SharedData.currentViewsCategoryNodeContextMenu.set('description', categoryDesc);
				MYOCD.SharedData.currentViewsCategoryNodeContextMenu.commit();
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update Views category failure');			
			}
		});

	},
	deleteViewsCategory: function(onView){
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Views Category ...');
		}
		var categoryId = MYOCD.SharedData.currentViewsCategoryNodeContextMenu.data.id;
		var deleteNode = MYOCD.SharedData.currentViewsCategoryNodeContextMenu;
		Ext.Ajax.request({
			url: VIEW_CATEGORY_BASE_URL + categoryId + '.json',
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
				if(deleteNode == MYOCD.SharedData.currentViewCategory) {
					MYOCD.SharedData.currentViewCategory = null;
					Ext.getStore('viewTemplate.ViewTemplates').removeAll();
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
				console.log('Update Views category failure');			
			}
		});
	},
	addNewViewTemplate: function(url, viewTemplateName, viewTemplateDesc, 
						secondaryObjs, primaryObjs, filters, groupByFields, orderBys, orderSorting, aggregations, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating New View Template ...');
		}
		Ext.Ajax.request({
			url: url, //View_CATEGORY_BASE_URL + categoryId + '/Views.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				view: {
					name: viewTemplateName,
					description: viewTemplateDesc,
					object_type_ids: primaryObjs,
					container_object_type_ids: secondaryObjs,
					filters: filters,
					group_by: groupByFields,
					order_by: orderBys,
					order_direction: orderSorting,
					aggregations: aggregations
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                if (url == VIEW_API_URL) {
                	MYOCD.controller.company.CompanySettingsController.getCompanyViews();
                } else {
                	if(MYOCD.SharedData.currentViewCategory == null || MYOCD.SharedData.currentViewCategory.data.id == 'root') {
						me.loadViewTemplatesOfViewLib(MYOCD.SharedData.currentViewLibId, onView);				
					} else {
						me.loadViewTemplatesOfViewCategory(MYOCD.SharedData.currentViewCategory.data.id, onView);
					}
                }
                
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Create new View Template failure');
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	getViewTemplateInfo: function(viewTemplateId, callback, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading View ...');
		}
		Ext.Ajax.request({
			url: VIEW_BASE_URL + viewTemplateId + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var viewTemplate = Ext.decode(data.responseText);
				if (callback) {
					callback(viewTemplate);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Load Views failure');			
			}
		});
	},
	editViewTemplate: function(viewTemplateId, viewTemplateName, viewTemplateDesc, 
						secondaryObjs, primaryObjs, filters, groupByFields, orderBys, orderSorting, aggregations, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating View Template ...');
		}
		Ext.Ajax.request({
			url: VIEW_BASE_URL + viewTemplateId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				view: {
					name: viewTemplateName,
					description: viewTemplateDesc,
					object_type_ids: primaryObjs,
					container_object_type_ids: secondaryObjs,
					filters: filters,
					group_by: groupByFields,
					order_by: orderBys,
					order_direction: orderSorting,
					aggregations: aggregations
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if (!onView) {
					MYOCD.controller.company.CompanySettingsController.getCompanyViews();
				} else {
					if(MYOCD.SharedData.currentViewCategory == null || MYOCD.SharedData.currentViewCategory.data.id == 'root') {
						me.loadViewTemplatesOfViewLib(MYOCD.SharedData.currentViewLibId, onView);				
					} else {
						me.loadViewTemplatesOfViewCategory(MYOCD.SharedData.currentViewCategory.data.id, onView);
					}
				}
				if (MYOCD.SharedData.refreshAfterUpdateView) {
					MYOCD.SharedData.refreshAfterUpdateView();
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
				console.log('Update View Template failure');			
			}
		});
	},
	deleteViewTemplate: function(viewTemplateId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting View Template ...');
		}
		Ext.Ajax.request({
			url: VIEW_BASE_URL + viewTemplateId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentViewCategory == null || MYOCD.SharedData.currentViewCategory.data.id == 'root') {
					me.loadViewTemplatesOfViewLib(MYOCD.SharedData.currentViewLibId, onView);				
				} else {
					me.loadViewTemplatesOfViewCategory(MYOCD.SharedData.currentViewCategory.data.id, onView);
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
				console.log('Delete View Template failure');			
			}
		});
	},
	copyViewCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			MYOCD.SharedData.viewCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Copying Company Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = VIEW_CATEGORY_BASE_URL + sourceFeature.data.id + '/copy/' + MYOCD.SharedData.currentViewLibId + '.json';  
		} else {
			url = VIEW_CATEGORY_BASE_URL + sourceCategory.data.id + '/copy/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.viewCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfViewsLib(MYOCD.SharedData.currentViewLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfViewsCategory(destCategory.data.id, destCategory, onView)
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
	moveViewCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			var treePanel = MYOCD.SharedData.currentViewCategoryTree;
			treePanel.ownerCt.getView().removeRowCls(MYOCD.SharedData.viewCategorySourceNode,'opacity-treenode');
			MYOCD.SharedData.viewCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Moving Company Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = VIEW_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + MYOCD.SharedData.currentViewLibId + '.json';  
		} else {
			url = VIEW_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + destCategory.data.id + '.json';
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
				var store = MYOCD.SharedData.viewCategorySourceNode.stores[0];
				store.remove (MYOCD.SharedData.viewCategorySourceNode);
				MYOCD.SharedData.viewCategorySourceNode.destroy();
				if(MYOCD.SharedData.viewCategorySourceNode == MYOCD.SharedData.currentViewCategory) {
					MYOCD.SharedData.currentViewCategory = null;
					Ext.getStore('viewTemplate.ViewTemplates').removeAll();
				}
				MYOCD.SharedData.viewCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfViewsLib(MYOCD.SharedData.currentViewLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfViewsCategory(destCategory.data.id, destCategory, onView)
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
	moveViewTemplate: function(viewTemplateId, destCategory, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Moving View Template ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = VIEW_TEMPLATE_BASE_URL + viewTemplateId + '/move/' + MYOCD.SharedData.currentViewLibId + '.json';  
		} else {
			url = VIEW_TEMPLATE_BASE_URL + viewTemplateId + '/move/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.currentViewCategory = destCategory;
				if(MYOCD.SharedData.currentViewCategory.data.id == 'root') {
                	me.loadViewTemplatesOfViewLib(MYOCD.SharedData.currentViewLibId, onView);
				} else {
					me.loadViewTemplatesOfViewCategory(MYOCD.SharedData.currentViewCategory.data.id, onView);
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
	importViewLibraries: function(libraryId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Importing Library ...');
		}
		Ext.Ajax.request({
			url: VIEW_LIB_BASE_URL + 'import.json',
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
				me.loadViewLibraries(MYOCD.SharedData.currentCompanyId, onView);
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
	loadAvailableAttributesOfObjectTypes: function(objectTypeIds, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Available Attributes ...');
		}
		var ids = '';
		for (var i = 0; i < objectTypeIds.length; i++) {
			ids =  ids + 'object_type_ids[]=' + objectTypeIds[i];
			if (i != objectTypeIds.length - 1) {
				ids = ids + '&';
			}
		}
		Ext.Ajax.request({
			url: VIEW_BASE_URL + 'availablefields.json?' + ids,
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var fields = Ext.decode(data.responseText);
				Ext.getStore('viewTemplate.AvailableFields').removeAll();
				for (var key in fields) {
					for (var sub_key in fields[key]) {
						for (var i = 0; i < fields[key][sub_key].length; i++) {
							var field = new Object();
							field.name = fields[key][sub_key][i];
							field.objectTypeId = key;
							field.columnSelected = false;
							field.groupBySelected = false;
							if (sub_key.length == 0) {
								field.group = 'General';
							} else {
								field.group = sub_key;
							}
							Ext.getStore('viewTemplate.ObjectTypesColumns').each(function(record){
								if (record.data.objectTypeId == field.objectTypeId && record.data.fieldName == field.name) {
									field.columnSelected = true;
								}
							});
							Ext.getStore('viewTemplate.GroupByFields').each(function(record){
								if (record.data.objectTypeId == field.objectTypeId && record.data.fieldName == field.name) {
									field.groupBySelected = true;
								}
							});
							Ext.getStore('viewTemplate.AvailableFields').add(field);
						}
					}
				}
				MYOCD.SharedData.processingAvailableField = null;
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading Available Attributes failure');			
			}
		});
	}
});