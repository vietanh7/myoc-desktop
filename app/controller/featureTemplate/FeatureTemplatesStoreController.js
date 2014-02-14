Ext.define('MYOCD.controller.featureTemplate.FeatureTemplatesStoreController', {
	extend: 'Ext.app.Controller',
	singleton: true,
	refs: [
		{
			ref: 'main',
			selector: 'main'
		}
	],
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
                Ext.getStore('featureTemplate.FeatureTemplatesLibs').loadRawData(templateData); 
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
	addNewFeatureTemplatesLib: function(libraryName, libraryDesc, libraryAccess, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating New Feature Templates Library');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/featuretemplatelibs.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				feature_template_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadFeatureTemplatesLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Create new Feature templates library failure');
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	editFeatureTemplatesLib: function(libraryId, libraryName, libraryDesc, libraryAccess, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Feature Templates Library');
		}
		Ext.Ajax.request({
			url: FEATURE_TEMPLATE_LIB_BASE_URL + libraryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				feature_template_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadFeatureTemplatesLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update Feature templates library failure');
			}
		});
	},
	deleteFeatureTemplatesLib: function(libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Feature Templates Library');
		}
		Ext.Ajax.request({
			url: FEATURE_TEMPLATE_LIB_BASE_URL + libraryId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadFeatureTemplatesLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Delete Feature templates library failure');
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
				Ext.getStore('featureTemplate.FeatureTemplatesCategoriesTreeStore').setRootNode(
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
				Ext.getStore('featureTemplate.FeatureTemplates').loadRawData(templateData);
				Ext.getStore('featureTemplate.FeatureTemplates').sort([
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
				Ext.getStore('featureTemplate.FeatureTemplates').loadRawData(templateData);
				Ext.getStore('featureTemplate.FeatureTemplates').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Loading templates failure');			
			}
		});
	},
	addNewFeatureTemplatesCategory: function(url, categoryName, categoryDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Feature Template Category ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				feature_template_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.AddingChildOnFeatureTemplateNode.data.id !== 'root') {
					var node = MYOCD.SharedData.AddingChildOnFeatureTemplateNode;
					node.expand(false, function() {
						me.loadCategoriesOfFeatureTemplatesCategory(node.data.id, node, onView);
					});
				} else {
					me.loadCategoriesOfFeatureTemplatesLib(
						MYOCD.SharedData.currentFeatureTemplatesLibId, 
						MYOCD.SharedData.AddingChildOnFeatureTemplateNode.data.name, 
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
				console.log('Create Feature template category failure');			
			}
		});
	},
	editFeatureTemplateCategory: function(categoryName, categoryDesc, onView){
		var me = this;
		if(onView) {
			onView.setLoading('Updating Feature Template Category ...');
		}
		var categoryId = MYOCD.SharedData.currentFeatureTemplatesCategoryNodeContextMenu.data.id;
		Ext.Ajax.request({
			url: FEATURE_TEMPLATE_CATEGORY_BASE_URL + categoryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				feature_template_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				MYOCD.SharedData.currentFeatureTemplatesCategoryNodeContextMenu.set('name', categoryName);
				MYOCD.SharedData.currentFeatureTemplatesCategoryNodeContextMenu.set('description', categoryDesc);
				MYOCD.SharedData.currentFeatureTemplatesCategoryNodeContextMenu.commit();
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update Feature template category failure');			
			}
		});
	},
	deleteFeatureTemplateCategory: function(onView){
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Feature Template Category ...');
		}
		var categoryId = MYOCD.SharedData.currentFeatureTemplatesCategoryNodeContextMenu.data.id;
		var deleteNode = MYOCD.SharedData.currentFeatureTemplatesCategoryNodeContextMenu;
		Ext.Ajax.request({
			url: FEATURE_TEMPLATE_CATEGORY_BASE_URL + categoryId + '.json',
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
				if(deleteNode == MYOCD.SharedData.currentFeatureTemplatesCategory) {
					MYOCD.SharedData.currentFeatureTemplatesCategory = null;
					Ext.getStore('featureTemplate.FeatureTemplates').removeAll();
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
				console.log('Update Feature template category failure');			
			}
		});
	},
	addNewFeatureTemplate: function(url, templateName, templateDesc, objectTypeId, onView) {
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
				feature_template: {
					name: templateName,
					description: templateDesc,
				},
				object_type_id: objectTypeId
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentFeatureTemplatesCategory == null || MYOCD.SharedData.currentFeatureTemplatesCategory.data.id == 'root') {
					me.loadTemplatesOfFeatureTemplatesLib(MYOCD.SharedData.currentFeatureTemplatesLibId, onView);
					
				} else {
					me.loadTemplatesOfFeatureTemplatesCategory(MYOCD.SharedData.currentFeatureTemplatesCategory.data.id, onView);
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
	editFeatureTemplate: function(featureTemplateId, featureTemplateName, featureTemplateDesc, objectTypeId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Feature Template ...');
		}
		Ext.Ajax.request({
			url: FEATURE_TEMPLATE_BASE_URL + featureTemplateId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				feature_template: {
					name: featureTemplateName,
					description: featureTemplateDesc,
				},
				object_type_id: objectTypeId
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentFeatureTemplatesCategory == null || MYOCD.SharedData.currentFeatureTemplatesCategory.data.id == 'root') {
					me.loadTemplatesOfFeatureTemplatesLib(MYOCD.SharedData.currentFeatureTemplatesLibId, onView);
					
				} else {
					me.loadTemplatesOfFeatureTemplatesCategory(MYOCD.SharedData.currentFeatureTemplatesCategory.data.id, onView);
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
				console.log('Update Feature template failure');			
			}
		});
	},
	deleteFeatureTemplate: function(featureTemplateId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Feature Template ...');
		}
		Ext.Ajax.request({
			url: FEATURE_TEMPLATE_BASE_URL + featureTemplateId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentFeatureTemplatesCategory == null || MYOCD.SharedData.currentFeatureTemplatesCategory.data.id == 'root') {
					me.loadTemplatesOfFeatureTemplatesLib(MYOCD.SharedData.currentFeatureTemplatesLibId, onView);
					
				} else {
					me.loadTemplatesOfFeatureTemplatesCategory(MYOCD.SharedData.currentFeatureTemplatesCategory.data.id, onView);
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
				console.log('Delete Feature template failure');			
			}
		});
	},
	getFeatureTemplateInfo: function(featureTemplateId, callback, onView ) {
		var me = this;
		if(onView) {
			onView.setLoading('Getting Object Type Info ...');
		}
		Ext.Ajax.request({
			url: FEATURE_TEMPLATE_BASE_URL + featureTemplateId + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var featureTemplateData = Ext.decode(data.responseText);
				if(callback) {
					callback(featureTemplateData);
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
	getFeaturesOfFeatureTemplate: function(featureTemplateId, featureTemplateName, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Features ...'); 
		}
		Ext.Ajax.request({
            url: FEATURE_TEMPLATE_BASE_URL + featureTemplateId + '/features.json',
            method: 'GET',
            withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(response){
                if(onView) {
					onView.setLoading(false);
				}
                var featureData = Ext.decode(response.responseText);
                Ext.getStore('featureTemplate.FeatureTemplateFeatureTreeStore').setRootNode(
                	{
	                	name: featureTemplateName,
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
			onView.setLoading('Loading Features ...');
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
                if(MYOCD.SharedData.currentFeatureTemplateFeatureTreeDropNode.data.id == 'root') {
                	me.getFeaturesOfFeatureTemplate(MYOCD.SharedData.currentFeatureTemplateId, MYOCD.SharedData.currentFeatureTemplateFeatureTreeDropNode.data.name, onView);
				} else {
					me.getFeaturesOfFeature(MYOCD.SharedData.currentFeatureTemplateFeatureTreeDropNode.data.id, MYOCD.SharedData.currentFeatureTemplateFeatureTreeDropNode, onView)
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
			onView.setLoading('Getting Feature Info ...');
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
			onView.setLoading('Updating Feature ...');
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
				MYOCD.SharedData.currentContextMenuFeatureTemplateFeatureNode.set('name', featureName);
				MYOCD.SharedData.currentContextMenuFeatureTemplateFeatureNode.set('description', featureDesc);
				MYOCD.SharedData.currentContextMenuFeatureTemplateFeatureNode.commit();
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
			onView.setLoading('Deleting Feature ...');
		}
		var featureId = MYOCD.SharedData.currentContextMenuFeatureTemplateFeatureNode.data.id;
		var deleteNode = MYOCD.SharedData.currentContextMenuFeatureTemplateFeatureNode;
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
				if(deleteNode == MYOCD.SharedData.currentFeatureTemplateFeature) {
					MYOCD.SharedData.currentFeatureTemplateFeature = null;
					Ext.getStore('featureTemplate.FeatureAttributes').removeAll();
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
				Ext.getStore('featureTemplate.FeatureAttributes').removeAll();
				for(var i = 0; i < attributeData.attributes.length; i++) {
					var newAtt = attributeData.attributes[i];
					newAtt.isInherited = false;
					Ext.getStore('featureTemplate.FeatureAttributes').add(newAtt);
				}
				for(var i = 0; i < attributeData.inherited_attributes.length; i++) {
					var newAtt = attributeData.inherited_attributes[i];
					newAtt.isInherited = true;
					Ext.getStore('featureTemplate.FeatureAttributes').add(newAtt);
				}
			}, 
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				Ext.getStore('featureTemplate.FeatureAttributes').removeAll();
			}
		});
	},
	addNewFeatureAttribute: function(featureId, attributeName, attributeDesc, attributeValueType, attributeHidden, 
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, onView, callback) {
		
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
				if (callback) {
					callback(newAttribute);
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
				me.loadFeatureAttributes(MYOCD.SharedData.currentFeatureTemplateFeature.data.id, onView);
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
				me.loadFeatureAttributes(MYOCD.SharedData.currentFeatureTemplateFeature.data.id, onView);
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
			MYOCD.SharedData.featureTemplateSourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Copying Features ...');
		}
		var url;
		if(destFeature.data.id == 'root') {
			url = FEATURE_BASE_URL + sourceFeature.data.id + '/copy/' + MYOCD.SharedData.currentFeatureTemplateId + '.json';  
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
				MYOCD.SharedData.featureTemplateSourceNode = null;
				if(destFeature.data.id == 'root') {
                	me.getFeaturesOfFeatureTemplate(MYOCD.SharedData.currentFeatureTemplateId, destFeature.data.name, onView);
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
			var treePanel = MYOCD.SharedData.currentFeatureTemplateFeatureTree;
			treePanel.ownerCt.getView().removeRowCls(MYOCD.SharedData.featureTemplateSourceNode,'opacity-treenode');
			MYOCD.SharedData.featureTemplateSourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Moving Features ...');
		}
		var url;
		if(destFeature.data.id == 'root') {
			url = FEATURE_BASE_URL + sourceFeature.data.id + '/move/' + MYOCD.SharedData.currentFeatureTemplateId + '.json';  
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
				var store = MYOCD.SharedData.featureTemplateSourceNode.stores[0];
				store.remove (MYOCD.SharedData.featureTemplateSourceNode);
				MYOCD.SharedData.featureTemplateSourceNode.destroy();
				if(MYOCD.SharedData.featureTemplateSourceNode == MYOCD.SharedData.currentFeatureTemplateFeature) {
					MYOCD.SharedData.currentFeatureTemplateFeature = null;
					Ext.getStore('featureTemplate.FeatureAttributes').removeAll();
				}
				MYOCD.SharedData.featureTemplateSourceNode = null;
				if(destFeature.data.id == 'root') {
                	me.getFeaturesOfFeatureTemplate(MYOCD.SharedData.currentFeatureTemplateId, destFeature.data.name, onView);
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
	copyFeatureCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			MYOCD.SharedData.featureCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Copying Feature Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = FEATURE_TEMPLATE_CATEGORY_BASE_URL + sourceFeature.data.id + '/copy/' + MYOCD.SharedData.currentFeatureTemplatesLibId + '.json';  
		} else {
			url = FEATURE_TEMPLATE_CATEGORY_BASE_URL + sourceCategory.data.id + '/copy/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.featureCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfFeatureTemplatesLib(MYOCD.SharedData.currentFeatureTemplatesLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfFeatureTemplatesCategory(destCategory.data.id, destCategory, onView)
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
	moveFeatureCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			var treePanel = MYOCD.SharedData.currentFeatureCategoryTree;
			treePanel.ownerCt.getView().removeRowCls(MYOCD.SharedData.featureCategorySourceNode,'opacity-treenode');
			MYOCD.SharedData.featureCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Moving Feature Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = FEATURE_TEMPLATE_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + MYOCD.SharedData.currentFeatureTemplatesLibId + '.json';  
		} else {
			url = FEATURE_TEMPLATE_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + destCategory.data.id + '.json';
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
				var store = MYOCD.SharedData.featureCategorySourceNode.stores[0];
				store.remove (MYOCD.SharedData.featureCategorySourceNode);
				MYOCD.SharedData.featureCategorySourceNode.destroy();
				if(MYOCD.SharedData.featureCategorySourceNode == MYOCD.SharedData.currentFeatureTemplatesCategory) {
					MYOCD.SharedData.currentFeatureTemplatesCategory = null;
					Ext.getStore('featureTemplate.FeatureTemplates').removeAll();
				}
				MYOCD.SharedData.featureCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfFeatureTemplatesLib(MYOCD.SharedData.currentFeatureTemplatesLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfFeatureTemplatesCategory(destCategory.data.id, destCategory, onView)
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
	moveFeatureTemplate: function(featureTemplateId, destCategory, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Moving Feature Template ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = FEATURE_TEMPLATE_BASE_URL + featureTemplateId + '/move/' + MYOCD.SharedData.currentFeatureTemplatesLibId + '.json';  
		} else {
			url = FEATURE_TEMPLATE_BASE_URL + featureTemplateId + '/move/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.currentFeatureTemplatesCategory = destCategory;
				if(MYOCD.SharedData.currentFeatureTemplatesCategory.data.id == 'root') {
                	me.loadTemplatesOfFeatureTemplatesLib(MYOCD.SharedData.currentFeatureTemplatesLibId, onView);
				} else {
					me.loadTemplatesOfFeatureTemplatesCategory(MYOCD.SharedData.currentFeatureTemplatesCategory.data.id, onView);
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
	getProductsOfFeatureTemplate: function(featureTemplateId, onView) {
		if(onView) {
			onView.setLoading('Loading Products ...');
		}
		Ext.Ajax.request({
			url: FEATURE_TEMPLATE_BASE_URL + featureTemplateId + '/productitems.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var productData = Ext.decode(data.responseText);
				Ext.getStore('featureTemplate.Products').loadRawData(productData);
				Ext.getStore('featureTemplate.Products').sort([
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
				Ext.getStore('featureTemplate.Products').loadRawData(productData);
				Ext.getStore('featureTemplate.Products').sort([
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
				if(MYOCD.SharedData.currentFeatureTemplateFeature == null || MYOCD.SharedData.currentFeatureTemplateFeature.data.id == 'root') {
					me.getProductsOfFeatureTemplate(MYOCD.SharedData.currentFeatureTemplateId, onView);
					
				} else {
					me.getProductsOfFeature(MYOCD.SharedData.currentFeatureTemplateFeature.data.id, onView);
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
				product_ids: [parentProductId]	
			},
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentFeatureTemplateFeature == null || MYOCD.SharedData.currentFeatureTemplateFeature.data.id == 'root') {
					me.getProductsOfFeatureTemplate(MYOCD.SharedData.currentFeatureTemplateId, onView);
					
				} else {
					me.getProductsOfFeature(MYOCD.SharedData.currentFeatureTemplateFeature.data.id, onView);
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
				if(MYOCD.SharedData.currentFeatureTemplateFeature == null || MYOCD.SharedData.currentFeatureTemplateFeature.data.id == 'root') {
					me.getProductsOfFeatureTemplate(MYOCD.SharedData.currentFeatureTemplateId, onView);
					
				} else {
					me.getProductsOfFeature(MYOCD.SharedData.currentFeatureTemplateFeature.data.id, onView);
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
				Ext.getStore('featureTemplate.ProductItemAttributes').removeAll();
				var attributeData = Ext.decode(data.responseText);
				for(var i = 0; i < attributeData.attributes.length; i++) {
					var att = attributeData.attributes[i];
					att.isInherited = false;
					Ext.getStore('featureTemplate.ProductItemAttributes').add(att);
				}
				for(var i = 0; i < attributeData.inherited_attributes.length; i++) {
					var att = attributeData.inherited_attributes[i];
					att.isInherited = true;
					Ext.getStore('featureTemplate.ProductItemAttributes').add(att);
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
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, onView, callback) {
		
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
				if (callback) {
					callback(newAttribute);
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
				me.loadAttributeOfProduct(MYOCD.SharedData.currentFeatureTemplateProduct.id, onView);
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
				me.loadAttributeOfProduct(MYOCD.SharedData.currentFeatureTemplateProduct.id, onView);
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
	importFeatureTemplatesLibraries: function(libraryId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Importing Library ...');
		}
		Ext.Ajax.request({
			url: FEATURE_TEMPLATE_LIB_BASE_URL + 'import.json',
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
				me.loadFeatureTemplatesLibs(MYOCD.SharedData.currentCompanyId, onView);
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