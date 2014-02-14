Ext.define('MYOCD.controller.projectTemplate.ProjectTemplatesStoreController', {
	extend: 'Ext.app.Controller',
	singleton: true,
	refs: [
		{
			ref: 'main',
			selector: 'main'
		}
	],
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
                Ext.getStore('projectTemplate.ProjectTemplatesLibs').loadRawData(templateData);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading Project templates library failure');
			}
		});
	},
	addNewProjectTemplatesLib: function(libraryName, libraryDesc, libraryAccess, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating New Project Templates Library');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/projecttemplatelibs.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				project_template_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadProjectTemplatesLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Create new Project templates library failure');
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	editProjectTemplatesLib: function(libraryId, libraryName, libraryDesc, libraryAccess, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Project Templates Library');
		}
		Ext.Ajax.request({
			url: PROJECT_TEMPLATE_LIB_BASE_URL + libraryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				project_template_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadProjectTemplatesLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update Project templates library failure');
			}
		});
	},
	deleteProjectTemplatesLib: function(libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Project Templates Library');
		}
		Ext.Ajax.request({
			url: PROJECT_TEMPLATE_LIB_BASE_URL + libraryId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadProjectTemplatesLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Delete Project templates library failure');
			}
		});
	},
	loadCategoriesOfProjectTemplatesLib: function(libraryId, libraryName, onView) {
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
				Ext.getStore('projectTemplate.ProjectTemplatesCategoriesTreeStore').setRootNode(
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
				Ext.getStore('projectTemplate.ProjectTemplates').loadRawData(templateData);
				Ext.getStore('projectTemplate.ProjectTemplates').sort([
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
				Ext.getStore('projectTemplate.ProjectTemplates').loadRawData(templateData);
				Ext.getStore('projectTemplate.ProjectTemplates').sort([
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
	addNewProjectTemplatesCategory: function(url, categoryName, categoryDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Project Template Category ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				project_template_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.AddingChildOnProjectTemplateNode.data.id !== 'root') {
					var node = MYOCD.SharedData.AddingChildOnProjectTemplateNode;
					node.expand(false, function() {
						me.loadCategoriesOfProjectTemplatesCategory(node.data.id, node, onView);
					});
				} else {
					me.loadCategoriesOfProjectTemplatesLib(
						MYOCD.SharedData.currentProjectTemplatesLibId, 
						MYOCD.SharedData.AddingChildOnProjectTemplateNode.data.name, 
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
				console.log('Create Project template category failure');			
			}
		});
	},
	editProjectTemplateCategory: function(categoryName, categoryDesc, onView){
		var me = this;
		if(onView) {
			onView.setLoading('Updating Project Template Category ...');
		}
		var categoryId = MYOCD.SharedData.currentProjectTemplatesCategoryNodeContextMenu.data.id;
		Ext.Ajax.request({
			url: PROJECT_TEMPLATE_CATEGORY_BASE_URL + categoryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				project_template_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				MYOCD.SharedData.currentProjectTemplatesCategoryNodeContextMenu.set('name', categoryName);
				MYOCD.SharedData.currentProjectTemplatesCategoryNodeContextMenu.set('description', categoryDesc);
				MYOCD.SharedData.currentProjectTemplatesCategoryNodeContextMenu.commit();
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update Project template category failure');			
			}
		});
	},
	deleteProjectTemplateCategory: function(onView){
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Project Template Category ...');
		}
		var categoryId = MYOCD.SharedData.currentProjectTemplatesCategoryNodeContextMenu.data.id;
		var deleteNode = MYOCD.SharedData.currentProjectTemplatesCategoryNodeContextMenu;
		Ext.Ajax.request({
			url: PROJECT_TEMPLATE_CATEGORY_BASE_URL + categoryId + '.json',
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
				if(deleteNode == MYOCD.SharedData.currentProjectTemplatesCategory) {
					MYOCD.SharedData.currentProjectTemplatesCategory = null;
					Ext.getStore('projectTemplate.ProjectTemplates').removeAll();
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
				console.log('Update Project template category failure');			
			}
		});
	},
	addNewProjectTemplate: function(url, templateName, templateDesc, objectTypeId, onView) {
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
				project_template: {
					name: templateName,
					description: templateDesc,
				},
				object_type_id: objectTypeId
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentProjectTemplatesCategory == null || MYOCD.SharedData.currentProjectTemplatesCategory.data.id == 'root') {
					me.loadTemplatesOfProjectTemplatesLib(MYOCD.SharedData.currentProjectTemplatesLibId, onView);
					
				} else {
					me.loadTemplatesOfProjectTemplatesCategory(MYOCD.SharedData.currentProjectTemplatesCategory.data.id, onView);
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
	editProjectTemplate: function(projectTemplateId, projectTemplateName, projectTemplateDesc, objectTypeId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Project Template ...');
		}
		Ext.Ajax.request({
			url: PROJECT_TEMPLATE_BASE_URL + projectTemplateId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				project_template: {
					name: projectTemplateName,
					description: projectTemplateDesc,
				},
				object_type_id: objectTypeId
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentProjectTemplatesCategory == null || MYOCD.SharedData.currentProjectTemplatesCategory.data.id == 'root') {
					me.loadTemplatesOfProjectTemplatesLib(MYOCD.SharedData.currentProjectTemplatesLibId, onView);
					
				} else {
					me.loadTemplatesOfProjectTemplatesCategory(MYOCD.SharedData.currentProjectTemplatesCategory.data.id, onView);
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
				console.log('Update Project template failure');			
			}
		});
	},
	deleteProjectTemplate: function(projectTemplateId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Project Template ...');
		}
		Ext.Ajax.request({
			url: PROJECT_TEMPLATE_BASE_URL + projectTemplateId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentProjectTemplatesCategory == null || MYOCD.SharedData.currentProjectTemplatesCategory.data.id == 'root') {
					me.loadTemplatesOfProjectTemplatesLib(MYOCD.SharedData.currentProjectTemplatesLibId, onView);
					
				} else {
					me.loadTemplatesOfProjectTemplatesCategory(MYOCD.SharedData.currentProjectTemplatesCategory.data.id, onView);
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
				console.log('Delete Project template failure');			
			}
		});
	},
	getProjectTemplateInfo: function(projectTemplateId, callback, onView ) {
		var me = this;
		if(onView) {
			onView.setLoading('Getting Object Type Info ...');
		}
		Ext.Ajax.request({
			url: PROJECT_TEMPLATE_BASE_URL + projectTemplateId + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var projectTemplateData = Ext.decode(data.responseText);
				if(callback) {
					callback(projectTemplateData);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Get Object Type Info failure');			
			}
		});
	},
	getFeaturesOfProjectTemplate: function(projectTemplateId, projectTemplateName, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Features ...'); 
		}
		Ext.Ajax.request({
            url: PROJECT_TEMPLATE_BASE_URL + projectTemplateId + '/features.json',
            method: 'GET',
            withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(response){
                if(onView) {
					onView.setLoading(false);
				}
                var featureData = Ext.decode(response.responseText);
                Ext.getStore('projectTemplate.ProjectTemplateFeatureTreeStore').setRootNode(
                	{
	                	name: projectTemplateName,
	                	children: featureData,
	                	expanded: true
                	}
                )
            },
            failure: function(response) {
                if(onView) {
					onView.setLoading(false);
				}
            }
        });
	},
	getFeaturesOfFeature: function(featureId, featureTreeNode, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading features ...');
		}
		Ext.Ajax.request({
			url: FEATURE_BASE_URL + featureId + '/features.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var featureData = Ext.decode(data.responseText);
				if(featureData.length == 0) {
					return;
				}
				featureTreeNode.removeAll();
				featureTreeNode.appendChild(featureData);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
			}
		});
	},
	addNewFeature: function(url, params, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating New Feature ...'); 
		}
		Ext.Ajax.request({
            url: url,
            method: 'POST',
            withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: params,
            success: function(response){
                if(onView) {
					onView.setLoading(false);
				}
                if(MYOCD.SharedData.currentProjectTemplateFeatureTreeDropNode.data.id == 'root') {
                	me.getFeaturesOfProjectTemplate(MYOCD.SharedData.currentProjectTemplateId, MYOCD.SharedData.currentProjectTemplateFeatureTreeDropNode.data.name, onView);
				} else {
					me.getFeaturesOfFeature(MYOCD.SharedData.currentProjectTemplateFeatureTreeDropNode.data.id, MYOCD.SharedData.currentProjectTemplateFeatureTreeDropNode, onView)
				}
            },
            failure: function(response) {
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
	getFeatureInfo: function(featureId, callBackFunc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Getting Project Info ...');
		}
		Ext.Ajax.request({
			url: FEATURE_BASE_URL + featureId + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(callBackFunc) {
					callBackFunc(Ext.decode(data.responseText));
				}
			}, 
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
			}
		});
	},
	editFeature: function(featureId, objectTypeId, featureName, featureDesc, onView ) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Project ...');
		}
		Ext.Ajax.request({
			url: FEATURE_BASE_URL + featureId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
			 	object_type_id: objectTypeId,
			 	feature: {
				 	name: featureName,
				 	description: featureDesc
			 	}	
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				MYOCD.SharedData.currentContextMenuProjectTemplateFeatureNode.set('name', featureName);
				MYOCD.SharedData.currentContextMenuProjectTemplateFeatureNode.set('description', featureDesc);
				MYOCD.SharedData.currentContextMenuProjectTemplateFeatureNode.commit();
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
	deleteFeature: function( onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Project ...');
		}
		var featureId = MYOCD.SharedData.currentContextMenuProjectTemplateFeatureNode.data.id;
		var deleteNode = MYOCD.SharedData.currentContextMenuProjectTemplateFeatureNode;
		Ext.Ajax.request({
			url: FEATURE_BASE_URL + featureId + '.json',
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
				if(deleteNode == MYOCD.SharedData.currentProjectTemplateFeature) {
					MYOCD.SharedData.currentProjectTemplateFeature = null;
					Ext.getStore('projectTemplate.FeatureAttributes').removeAll();
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
	loadFeatureAttributes: function(featureId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Feature Attributes ...');
		}
		Ext.Ajax.request({
			url: FEATURE_BASE_URL + featureId + '/attributes.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var attributeData = Ext.decode(data.responseText);
				Ext.getStore('projectTemplate.FeatureAttributes').removeAll();
				for(var i = 0; i < attributeData.attributes.length; i++) {
					var newAtt = attributeData.attributes[i];
					newAtt.isInherited = false;
					Ext.getStore('projectTemplate.FeatureAttributes').add(newAtt);
				}
				for(var i = 0; i < attributeData.inherited_attributes.length; i++) {
					var newAtt = attributeData.inherited_attributes[i];
					newAtt.isInherited = true;
					Ext.getStore('projectTemplate.FeatureAttributes').add(newAtt);
				}
			}, 
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				Ext.getStore('projectTemplate.FeatureAttributes').removeAll();
			}
		});
	},
	addNewFeatureAttribute: function(featureId, attributeName, attributeDesc, attributeValueType, attributeHidden, 
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, onView, callBack) {
		
		var me = this;
		if(onView) {
			onView.setLoading('Creating Feature Attribute ...');
		}
		Ext.Ajax.request({
			url: FEATURE_BASE_URL + featureId + '/attributes.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				attribute: {
					name: attributeName,
					description: attributeDesc,
					value_type: attributeValueType,
					hidden: attributeHidden,
					constant: attributeConstant,
					mandatory: attributeMandatory,
					deprecated: attributeDeprecated,
					default_value: attributeDefaultValue
				}	
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var newAttribute = Ext.decode(data.responseText);
				if (callBack) {
					callBack(newAttribute);
				}
				me.loadFeatureAttributes(featureId, onView);
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
	editFeatureAttribute: function(attributeId, attributeName, attributeDesc, attributeValueType, attributeHidden, 
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, onView) {
		
		var me = this;
		if(onView) {
			onView.setLoading('Updating Feature Attribute ...');
		}
		Ext.Ajax.request({
			url: ATTRIBUTE_BASE_URL + attributeId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				attribute: {
					name: attributeName,
					description: attributeDesc,
					value_type: attributeValueType,
					hidden: attributeHidden,
					constant: attributeConstant,
					mandatory: attributeMandatory,
					deprecated: attributeDeprecated,
					default_value: attributeDefaultValue
				}	
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadFeatureAttributes(MYOCD.SharedData.currentProjectTemplateFeature.data.id, onView);
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
	deleteFeatureAttribute: function(attributeId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Feature Attribute ...');
		}
		Ext.Ajax.request({
			url: ATTRIBUTE_BASE_URL + attributeId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadFeatureAttributes(MYOCD.SharedData.currentProjectTemplateFeature.data.id, onView);
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
	copyFeature: function(sourceFeature, destFeature, onView) {
		var me = this;
		if(sourceFeature.data.id == destFeature.data.id || sourceFeature.parentNode.data.id ==  destFeature.data.id) {
			MYOCD.SharedData.projectTemplateFeatureSourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Copying Features ...');
		}
		var url;
		if(destFeature.data.id == 'root') {
			url = FEATURE_BASE_URL + sourceFeature.data.id + '/copy/' + MYOCD.SharedData.currentProjectTemplateId + '.json';  
		} else {
			url = FEATURE_BASE_URL + sourceFeature.data.id + '/copy/' + destFeature.data.id + '.json';
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
				MYOCD.SharedData.projectTemplateFeatureSourceNode = null;
				if(destFeature.data.id == 'root') {
                	me.getFeaturesOfProjectTemplate(MYOCD.SharedData.currentProjectTemplateId, destFeature.data.name, onView);
				} else {
					me.getFeaturesOfFeature(destFeature.data.id, destFeature, onView)
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
	moveFeature: function(sourceFeature, destFeature, onView) {
		var me = this;
		if(sourceFeature.data.id == destFeature.data.id || sourceFeature.parentNode.data.id ==  destFeature.data.id) {
			var treePanel = MYOCD.SharedData.currentProjectTemplateFeatureTree;
			treePanel.ownerCt.getView().removeRowCls(MYOCD.SharedData.projectTemplateFeatureSourceNode,'opacity-treenode');
			MYOCD.SharedData.projectTemplateFeatureSourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Moving Features ...');
		}
		var url;
		if(destFeature.data.id == 'root') {
			url = FEATURE_BASE_URL + sourceFeature.data.id + '/move/' + MYOCD.SharedData.currentProjectTemplateId + '.json';  
		} else {
			url = FEATURE_BASE_URL + sourceFeature.data.id + '/move/' + destFeature.data.id + '.json';
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
				var store = MYOCD.SharedData.projectTemplateFeatureSourceNode.stores[0];
				store.remove (MYOCD.SharedData.projectTemplateFeatureSourceNode);
				MYOCD.SharedData.projectTemplateFeatureSourceNode.destroy();
				if(MYOCD.SharedData.projectTemplateFeatureSourceNode == MYOCD.SharedData.currentProjectTemplateFeature) {
					MYOCD.SharedData.currentProjectTemplateFeature = null;
					Ext.getStore('projectTemplate.FeatureAttributes').removeAll();
				}
				MYOCD.SharedData.projectTemplateFeatureSourceNode = null;
				if(destFeature.data.id == 'root') {
                	me.getFeaturesOfProjectTemplate(MYOCD.SharedData.currentProjectTemplateId, destFeature.data.name, onView);
				} else {
					me.getFeaturesOfFeature(destFeature.data.id, destFeature, onView)
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
	copyProjectCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			MYOCD.SharedData.projectCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Copying Project Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = PROJECT_TEMPLATE_CATEGORY_BASE_URL + sourceFeature.data.id + '/copy/' + MYOCD.SharedData.currentProjectTemplatesLibId + '.json';  
		} else {
			url = PROJECT_TEMPLATE_CATEGORY_BASE_URL + sourceCategory.data.id + '/copy/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.projectCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfProjectTemplatesLib(MYOCD.SharedData.currentProjectTemplatesLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfProjectTemplatesCategory(destCategory.data.id, destCategory, onView)
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
	moveProjectCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			var treePanel = MYOCD.SharedData.currentProjectCategoryTree;
			treePanel.ownerCt.getView().removeRowCls(MYOCD.SharedData.projectCategorySourceNode,'opacity-treenode');
			MYOCD.SharedData.projectCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Moving Project Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = PROJECT_TEMPLATE_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + MYOCD.SharedData.currentProjectTemplatesLibId + '.json';  
		} else {
			url = PROJECT_TEMPLATE_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + destCategory.data.id + '.json';
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
				var store = MYOCD.SharedData.projectCategorySourceNode.stores[0];
				store.remove (MYOCD.SharedData.projectCategorySourceNode);
				MYOCD.SharedData.projectCategorySourceNode.destroy();
				if(MYOCD.SharedData.projectCategorySourceNode == MYOCD.SharedData.currentProjectTemplatesCategory) {
					MYOCD.SharedData.currentProjectTemplatesCategory = null;
					Ext.getStore('projectTemplate.ProjectTemplates').removeAll();
				}
				MYOCD.SharedData.projectCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfProjectTemplatesLib(MYOCD.SharedData.currentProjectTemplatesLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfProjectTemplatesCategory(destCategory.data.id, destCategory, onView)
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
	moveProjectTemplate: function(projectTemplateId, destCategory, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Moving Project Template ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = PROJECT_TEMPLATE_BASE_URL + projectTemplateId + '/move/' + MYOCD.SharedData.currentProjectTemplatesLibId + '.json';  
		} else {
			url = PROJECT_TEMPLATE_BASE_URL + projectTemplateId + '/move/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.currentProjectTemplatesCategory = destCategory;
				if(MYOCD.SharedData.currentProjectTemplatesCategory.data.id == 'root') {
                	me.loadTemplatesOfProjectTemplatesLib(MYOCD.SharedData.currentProjectTemplatesLibId, onView);
				} else {
					me.loadTemplatesOfProjectTemplatesCategory(MYOCD.SharedData.currentProjectTemplatesCategory.data.id, onView);
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
	getProductsOfProjectTemplate: function(projectTemplateId, onView) {
		if(onView) {
			onView.setLoading('Loading Products ...');
		}
		Ext.Ajax.request({
			url: PROJECT_TEMPLATE_BASE_URL + projectTemplateId + '/productitems.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var productData = Ext.decode(data.responseText);
				Ext.getStore('projectTemplate.Products').loadRawData(productData);
				Ext.getStore('projectTemplate.Products').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
			}
		});
	},
	getProductsOfFeature: function(featureId, onView) {
		if(onView) {
			onView.setLoading('Loading Products ...');
		}
		Ext.Ajax.request({
			url: FEATURE_BASE_URL + featureId + '/productitems.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var productData = Ext.decode(data.responseText);
				Ext.getStore('projectTemplate.Products').loadRawData(productData);
				Ext.getStore('projectTemplate.Products').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
			}
		});
	},
	addNewProduct: function(url, productName, productDesc, parentProductId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Adding Product ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			jsonData: {
				product_item: {
					name: productName,
					description: productDesc
				},
				product_ids: [parentProductId]	
			},
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentProjectTemplateFeature == null || MYOCD.SharedData.currentProjectTemplateFeature.data.id == 'root') {
					me.getProductsOfProjectTemplate(MYOCD.SharedData.currentProjectTemplateId, onView);
					
				} else {
					me.getProductsOfFeature(MYOCD.SharedData.currentProjectTemplateFeature.data.id, onView);
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
	getProductInfo: function(productId, callBack, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Loading Product Info ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_ITEMS_BASE_URL + productId + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var productData = Ext.decode(data.responseText);
				if (callBack) {
					callBack(productData);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
			}
		});	
	},
	editProduct: function(productId, productName, productDesc, parentProductId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Upating Product ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_ITEMS_BASE_URL + productId + '.json',
			method: 'PUT',
			jsonData: {
				product_item: {
					name: productName,
					description: productDesc
				},
				product_id: parentProductId	
			},
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentProjectTemplateFeature == null || MYOCD.SharedData.currentProjectTemplateFeature.data.id == 'root') {
					me.getProductsOfProjectTemplate(MYOCD.SharedData.currentProjectTemplateId, onView);
					
				} else {
					me.getProductsOfFeature(MYOCD.SharedData.currentProjectTemplateFeature.data.id, onView);
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
	deleteProduct: function(productId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Product ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_ITEMS_BASE_URL + productId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentProjectTemplateFeature == null || MYOCD.SharedData.currentProjectTemplateFeature.data.id == 'root') {
					me.getProductsOfProjectTemplate(MYOCD.SharedData.currentProjectTemplateId, onView);
					
				} else {
					me.getProductsOfFeature(MYOCD.SharedData.currentProjectTemplateFeature.data.id, onView);
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
	loadAttributeOfProduct: function(productId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Product Attributes ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_ITEMS_BASE_URL + productId + '/attributes.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				Ext.getStore('projectTemplate.ProductItemAttributes').removeAll();
				var attributeData = Ext.decode(data.responseText);
				for(var i = 0; i < attributeData.attributes.length; i++) {
					var att = attributeData.attributes[i];
					att.isInherited = false;
					Ext.getStore('projectTemplate.ProductItemAttributes').add(att);
				}
				for(var i = 0; i < attributeData.inherited_attributes.length; i++) {
					var att = attributeData.inherited_attributes[i];
					att.isInherited = true;
					Ext.getStore('projectTemplate.ProductItemAttributes').add(att);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading Product Attributes failure');			
			}
		});
	},
	addNewProductAttribute: function(productId, attributeName, attributeDesc, attributeValueType, attributeHidden, 
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, onView, callBack) {
		
		var me = this;
		if(onView) {
			onView.setLoading('Creating Product Attribute ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_ITEMS_BASE_URL + productId + '/attributes.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				attribute: {
					name: attributeName,
					description: attributeDesc,
					value_type: attributeValueType,
					hidden: attributeHidden,
					constant: attributeConstant,
					mandatory: attributeMandatory,
					deprecated: attributeDeprecated,
					default_value: attributeDefaultValue
				}	
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var newAttribute = Ext.decode(data.responseText);
				if (callBack) {
					callBack(newAttribute);
				}
				me.loadAttributeOfProduct(productId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Create Product Attribute failure');			
			}
		});
	},
	editProductAttribute: function(attributeId, attributeName, attributeDesc, attributeValueType, attributeHidden, 
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, onView) {
		
		var me = this;
		if(onView) {
			onView.setLoading('Updating Product Attribute ...');
		}
		Ext.Ajax.request({
			url: ATTRIBUTE_BASE_URL + attributeId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				attribute: {
					name: attributeName,
					description: attributeDesc,
					value_type: attributeValueType,
					hidden: attributeHidden,
					constant: attributeConstant,
					mandatory: attributeMandatory,
					deprecated: attributeDeprecated,
					default_value: attributeDefaultValue
				}	
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadAttributeOfProduct(MYOCD.SharedData.currentProduct.id, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Edit Product Attribute failure');			
			}
		});
	},
	deleteProductAttribute: function(attributeId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Product Attribute ...');
		}
		Ext.Ajax.request({
			url: ATTRIBUTE_BASE_URL + attributeId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadAttributeOfProduct(MYOCD.SharedData.currentProduct.id, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Delete Product Attribute failure');			
			}
		});
	},
	importProjectTemplateLibs: function(libraryId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Importing Library ...');
		}
		Ext.Ajax.request({
			url: PROJECT_TEMPLATE_LIB_BASE_URL + 'import.json',
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
				me.loadProjectTemplatesLibs(MYOCD.SharedData.currentCompanyId, onView);
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