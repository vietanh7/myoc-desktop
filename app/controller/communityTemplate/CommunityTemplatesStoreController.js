Ext.define('MYOCD.controller.communityTemplate.CommunityTemplatesStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadCommunityTemplateLibs: function(companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Community Group Template Libraries');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/communitygrouptemplatelibs.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                var templateData = Ext.decode(data.responseText);
                Ext.getStore('communityTemplate.CommunityTemplateLibs').loadRawData(templateData); 
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading community group template libraries failure');
			}
		});
	},
	addNewCommunityTemplatesLib: function(libraryName, libraryDesc, libraryAccess, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating New Community Templates Library');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/communitygrouptemplatelibs.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				community_group_template_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadCommunityTemplateLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Create new community templates library failure');
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	editCommunityTemplatesLib: function(libraryId, libraryName, libraryDesc, libraryAccess, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Community Templates Library');
		}
		Ext.Ajax.request({
			url: COMMUNITY_TEMPLATE_LIB_BASE_URL + libraryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				community_group_template_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadCommunityTemplateLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update community templates library failure');
			}
		});
	},
	deleteCommunityTemplatesLib: function(libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Community Templates Library');
		}
		Ext.Ajax.request({
			url: COMMUNITY_TEMPLATE_LIB_BASE_URL + libraryId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadCommunityTemplateLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Delete community templates library failure');
			}
		});
	},
	loadCategoriesOfCommunityTemplatesLib: function(libraryId, libraryName, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Community Templates Categories ...');
		}
		Ext.Ajax.request({
			url: COMMUNITY_TEMPLATE_LIB_BASE_URL + libraryId + '/categories.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var categoryData = Ext.decode(data.responseText);
				Ext.getStore('communityTemplate.CommunityTemplatesCategoriesTreeStore').setRootNode(
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
				console.log('Load community templates categories failure');			
			}
		});
	},
	loadCategoriesOfCommunityTemplatesCategory: function(categoryId, categoryTreeNode, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Community Templates Categories ...');
		}
		Ext.Ajax.request({
			url: COMMUNITY_TEMPLATE_CATEGORY_BASE_URL + categoryId + '/categories.json',
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
				console.log('Load community templates categories failure');			
			}
		});
	},
	loadTemplatesOfCommunityTemplatesLib: function(libraryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Templates ...');
		}
		Ext.Ajax.request({
			url: COMMUNITY_TEMPLATE_LIB_BASE_URL + libraryId + '/templates.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var templateData = Ext.decode(data.responseText);
				Ext.getStore('communityTemplate.CommunityTemplates').loadRawData(templateData);
				Ext.getStore('communityTemplate.CommunityTemplates').sort([
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
	loadTemplatesOfCommunityTemplatesCategory: function(categoryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Templates ...');
		}
		Ext.Ajax.request({
			url: COMMUNITY_TEMPLATE_CATEGORY_BASE_URL + categoryId + '/templates.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var templateData = Ext.decode(data.responseText);
				Ext.getStore('communityTemplate.CommunityTemplates').loadRawData(templateData);
				Ext.getStore('communityTemplate.CommunityTemplates').sort([
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
	addNewCommunityTemplatesCategory: function(url, categoryName, categoryDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Community Template Category ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				community_group_template_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.AddingChildOnCommunityTemplateNode.data.id !== 'root') {
					var node = MYOCD.SharedData.AddingChildOnCommunityTemplateNode;
					node.expand(false, function() {
						me.loadCategoriesOfCommunityTemplatesCategory(node.data.id, node, onView);
					});
				} else {
					me.loadCategoriesOfCommunityTemplatesLib(
						MYOCD.SharedData.currentCommunityTemplatesLibId, 
						MYOCD.SharedData.AddingChildOnCommunityTemplateNode.data.name, 
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
				console.log('Create community template category failure');			
			}
		});
	},
	editCommunityTemplateCategory: function(categoryName, categoryDesc, onView){
		var me = this;
		if(onView) {
			onView.setLoading('Updating community Template Category ...');
		}
		var categoryId = MYOCD.SharedData.currentCommunityTemplatesCategoryNodeContextMenu.data.id;
		Ext.Ajax.request({
			url: COMMUNITY_TEMPLATE_CATEGORY_BASE_URL + categoryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				community_group_template_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				MYOCD.SharedData.currentCommunityTemplatesCategoryNodeContextMenu.set('name', categoryName);
				MYOCD.SharedData.currentCommunityTemplatesCategoryNodeContextMenu.set('description', categoryDesc);
				MYOCD.SharedData.currentCommunityTemplatesCategoryNodeContextMenu.commit();
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update community template category failure');			
			}
		});
	},
	deleteCommunityTemplateCategory: function(onView){
		var me = this;
		if(onView) {
			onView.setLoading('Deleting community Template Category ...');
		}
		var categoryId = MYOCD.SharedData.currentCommunityTemplatesCategoryNodeContextMenu.data.id;
		var deleteNode = MYOCD.SharedData.currentCommunityTemplatesCategoryNodeContextMenu;
		Ext.Ajax.request({
			url: COMMUNITY_TEMPLATE_CATEGORY_BASE_URL + categoryId + '.json',
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
				if(deleteNode == MYOCD.SharedData.currentCommunityTemplatesCategory) {
					MYOCD.SharedData.currentCommunityTemplatesCategory = null;
					Ext.getStore('communityTemplate.CommunityTemplates').removeAll();
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
				console.log('Update community template category failure');			
			}
		});
	},

	addNewCommunityTemplate: function(url, templateName, templateDesc, templateType, onView) {
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
				community_group_template: {
					name: templateName,
					description: templateDesc,
					community_group_type: templateType
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentCommunityTemplatesCategory == null || MYOCD.SharedData.currentCommunityTemplatesCategory.data.id == 'root') {
					me.loadTemplatesOfCommunityTemplatesLib(MYOCD.SharedData.currentCommunityTemplatesLibId, onView);
					
				} else {
					me.loadTemplatesOfCommunityTemplatesCategory(MYOCD.SharedData.currentCommunityTemplatesCategory.data.id, onView);
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
	editCommunityTemplate: function(communityTemplateId, communityTemplateName, communityTemplateDesc, communityTemplateType, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Community Template ...');
		}
		Ext.Ajax.request({
			url: COMMUNITY_TEMPLATE_BASE_URL + communityTemplateId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				community_group_template: {
					name: communityTemplateName,
					description: communityTemplateDesc,
					community_group_type: communityTemplateType
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentCommunityTemplatesCategory == null || MYOCD.SharedData.currentCommunityTemplatesCategory.data.id == 'root') {
					me.loadTemplatesOfCommunityTemplatesLib(MYOCD.SharedData.currentCommunityTemplatesLibId, onView);
					
				} else {
					me.loadTemplatesOfCommunityTemplatesCategory(MYOCD.SharedData.currentCommunityTemplatesCategory.data.id, onView);
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
				console.log('Update community template failure');			
			}
		});
	},
	deleteCommunityTemplate: function(communityTemplateId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Community Template ...');
		}
		Ext.Ajax.request({
			url: COMMUNITY_TEMPLATE_BASE_URL + communityTemplateId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentCommunityTemplatesCategory == null || MYOCD.SharedData.currentCommunityTemplatesCategory.data.id == 'root') {
					me.loadTemplatesOfCommunityTemplatesLib(MYOCD.SharedData.currentCommunityTemplatesLibId, onView);
					
				} else {
					me.loadTemplatesOfCommunityTemplatesCategory(MYOCD.SharedData.currentCommunityTemplatesCategory.data.id, onView);
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
				console.log('Delete community template failure');			
			}
		});
	},
	copyCommunityCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			MYOCD.SharedData.communityCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Copying Community Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = COMMUNITY_TEMPLATE_CATEGORY_BASE_URL + sourceFeature.data.id + '/copy/' + MYOCD.SharedData.currentCommunityTemplatesLibId + '.json';  
		} else {
			url = COMMUNITY_TEMPLATE_CATEGORY_BASE_URL + sourceCategory.data.id + '/copy/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.communityCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfCommunityTemplatesLib(MYOCD.SharedData.currentCommunityTemplatesLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfCommunityTemplatesCategory(destCategory.data.id, destCategory, onView)
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
	moveCommunityCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			var treePanel = MYOCD.SharedData.currentCommunityCategoryTree;
			treePanel.ownerCt.getView().removeRowCls(MYOCD.SharedData.communityCategorySourceNode,'opacity-treenode');
			MYOCD.SharedData.communityCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Moving Community Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = COMMUNITY_TEMPLATE_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + MYOCD.SharedData.currentCommunityTemplatesLibId + '.json';  
		} else {
			url = COMMUNITY_TEMPLATE_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + destCategory.data.id + '.json';
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
				var store = MYOCD.SharedData.communityCategorySourceNode.stores[0];
				store.remove (MYOCD.SharedData.communityCategorySourceNode);
				MYOCD.SharedData.communityCategorySourceNode.destroy();
				if(MYOCD.SharedData.communityCategorySourceNode == MYOCD.SharedData.currentCommunityTemplatesCategory) {
					MYOCD.SharedData.currentCommunityTemplatesCategory = null;
					Ext.getStore('communityTemplate.CommunityTemplates').removeAll();
				}
				MYOCD.SharedData.communityCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfCommunityTemplatesLib(MYOCD.SharedData.currentCommunityTemplatesLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfCommunityTemplatesCategory(destCategory.data.id, destCategory, onView)
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
	moveCommunityTemplate: function(communityTemplateId, destCategory, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Moving Community Template ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = COMMUNITY_TEMPLATE_BASE_URL + communityTemplateId + '/move/' + MYOCD.SharedData.currentCommunityTemplatesLibId + '.json';  
		} else {
			url = COMMUNITY_TEMPLATE_BASE_URL + communityTemplateId + '/move/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.currentCommunityTemplatesCategory = destCategory;
				if(MYOCD.SharedData.currentCommunityTemplatesCategory.data.id == 'root') {
                	me.loadTemplatesOfCommunityTemplatesLib(MYOCD.SharedData.currentCommunityTemplatesLibId, onView);
				} else {
					me.loadTemplatesOfCommunityTemplatesCategory(MYOCD.SharedData.currentCommunityTemplatesCategory.data.id, onView);
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
	importCommunityTemplateLibraries: function(libraryId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Importing Library ...');
		}
		Ext.Ajax.request({
			url: COMMUNITY_TEMPLATE_LIB_BASE_URL + 'import.json',
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
				me.loadCommunityTemplateLibs(MYOCD.SharedData.currentCompanyId, onView);
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