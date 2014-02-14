Ext.define('MYOCD.controller.project.ProjectsStoreController', {
	extend: 'Ext.app.Controller',
	singleton: true,
	
	loadProjects: function(onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Projects ... ');
		}
		Ext.Ajax.request({
            url: PROJECT_API_URL,
            method: 'GET',
            withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(response){
                if(onView) {
					onView.setLoading(false);
				}
                var projectData = Ext.decode(response.responseText);
                Ext.getStore('project.Projects').loadRawData(projectData);
            },
            failure: function(response) {
                if(onView) {
					onView.setLoading(false);
				}
            }
        });
	},
	addNewProject: function(projectName, projectDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating New Project ...'); 
		}
		Ext.Ajax.request({
            url: PROJECT_API_URL,
            method: 'POST',
            withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
	          	project: {
		          	name: projectName,
		          	description: projectDesc
	          	}  
            },
            success: function(response){
                if(onView) {
					onView.setLoading(false);
				}
                me.loadProjects(onView);
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
	editProject: function(projectId, projectName, projectDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Project ...'); 
		}
		Ext.Ajax.request({
            url: PROJECT_BASE_URL + projectId + '.json',
            method: 'PUT',
            withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
	          	project: {
		          	name: projectName,
		          	description: projectDesc
	          	}  
            },
            success: function(response){
                if(onView) {
					onView.setLoading(false);
				}
                me.loadProjects(onView);
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
	deleteProject: function(projectId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Project ...'); 
		}
		Ext.Ajax.request({
            url: PROJECT_BASE_URL + projectId + '.json',
            method: 'DELETE',
            withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(response){
                if(onView) {
					onView.setLoading(false);
				}
                me.loadProjects(onView);
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
	getFeaturesOfProject: function(projectId, projectName, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Features ...'); 
		}
		Ext.Ajax.request({
            url: PROJECT_BASE_URL + projectId + '/features.json',
            method: 'GET',
            withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(response){
                if(onView) {
					onView.setLoading(false);
				}
                var featureData = Ext.decode(response.responseText);
                Ext.getStore('project.FeaturesTreeStore').setRootNode(
                	{
	                	name: projectName,
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
    //             if(MYOCD.SharedData.currentFeatureTreeDropNode.data.id == 'root') {
    //             	me.getFeaturesOfProject(MYOCD.SharedData.currentProjectId, MYOCD.SharedData.currentFeatureTreeDropNode.data.name, onView);
				// } else {
				// 	me.getFeaturesOfFeature(MYOCD.SharedData.currentFeatureTreeDropNode.data.id, MYOCD.SharedData.currentFeatureTreeDropNode, onView)
				// }
				var newFeature = Ext.decode(response.responseText);
				MYOCD.SharedData.currentFeatureTreeDropNode.appendChild(newFeature);

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
				MYOCD.SharedData.currentContextMenuFeatureNode.set('name', featureName);
				MYOCD.SharedData.currentContextMenuFeatureNode.set('description', featureDesc);
				MYOCD.SharedData.currentContextMenuFeatureNode.commit();
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
			onView.setLoading('Deleting ObjectTypes Category ...');
		}
		var featureId = MYOCD.SharedData.currentContextMenuFeatureNode.data.id;
		var deleteNode = MYOCD.SharedData.currentContextMenuFeatureNode;
		Ext.Ajax.request({
			url: FEATURE_BASE_URL + featureId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				deleteNode.removeAll();
				var store = deleteNode.stores[0];
				store.remove(deleteNode);
				deleteNode.destroy();
				if(deleteNode == MYOCD.SharedData.currentProjectFeature) {
					MYOCD.SharedData.currentProjectFeature = null;
					Ext.getStore('project.FeatureAttributes').removeAll();
					Ext.getStore('project.FeatureInheritedAttributes').removeAll();
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
			url: FEATURE_BASE_URL + featureId + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var feature = Ext.decode(data.responseText);
				/*
Ext.getStore('project.FeatureAttributes').loadRawData(attributeData.attributes);
				Ext.getStore('project.FeatureInheritedAttributes').loadRawData(attributeData.inherited_attributes);
*/
				Ext.getStore('project.FeatureAttributes').removeAll();
				for(var i = 0; i < feature.attributes.length; i++) {
					var newAtt = feature.attributes[i];
					newAtt.isInherited = false;
					Ext.getStore('project.FeatureAttributes').add(newAtt);
				}
				for(var i = 0; i < feature.inherited_attributes.length; i++) {
					var newAtt = feature.inherited_attributes[i];
					newAtt.isInherited = true;
					Ext.getStore('project.FeatureAttributes').add(newAtt);
				}
			}, 
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				Ext.getStore('project.FeatureAttributes').removeAll();
			}
		});
	},
	loadFeatureAttributesWithStore: function(featureId, featureAttributesStore, onView) {
		var me = this;
		if (!featureAttributesStore) {
			return;
		}
		if(onView) {
			onView.setLoading('Loading Feature Attributes ...');
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
				var feature = Ext.decode(data.responseText);
				featureAttributesStore.removeAll();
				for(var i = 0; i < feature.attributes.length; i++) {
					var newAtt = feature.attributes[i];
					newAtt.isInherited = false;
					featureAttributesStore.add(newAtt);
				}
				for(var i = 0; i < feature.inherited_attributes.length; i++) {
					var newAtt = feature.inherited_attributes[i];
					newAtt.isInherited = true;
					featureAttributesStore.add(newAtt);
				}
			}, 
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				featureAttributesStore.removeAll();
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
	addNewFeatureAttributeWithStore: function(featureId, attributeName, attributeDesc, attributeValueType, attributeHidden, 
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, onView, callBack, featureStore) {
		
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
				me.loadFeatureAttributesWithStore(featureId, featureStore, onView);
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
	editFeatureAttributeValue: function(featureId, attributeId, attributeValue, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Upating Feature Attribute ...');
		}
		//var jsonData = "{'attribute_values': { 'attribute_" + attributeId + "': '" + attributeValue + "'}}"; 
		var data = new Object();
		data.attribute_values = new Object();
		var key = "attribute_" + attributeId;
		data.attribute_values[key] = attributeValue;
		data.object_type_ids = null;
		Ext.Ajax.request({
			url: FEATURE_BASE_URL + featureId + '.json',
			method: 'PUT',
			jsonData: data,
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadFeatureAttributes(MYOCD.SharedData.currentProjectFeature.data.id, onView);
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
	editFeatureAttributeValueWithStore: function(featureId, attributeId, attributeValue, featureAttStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Upating Feature Attribute ...');
		}
		//var jsonData = "{'attribute_values': { 'attribute_" + attributeId + "': '" + attributeValue + "'}}"; 
		var data = new Object();
		data.attribute_values = new Object();
		var key = "attribute_" + attributeId;
		data.attribute_values[key] = attributeValue;
		data.object_type_ids = null;
		Ext.Ajax.request({
			url: FEATURE_BASE_URL + featureId + '.json',
			method: 'PUT',
			jsonData: data,
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadFeatureAttributesWithStore(MYOCD.SharedData.currentProjectFeature.data.id, featureAttStore, onView);
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
				me.loadFeatureAttributes(MYOCD.SharedData.currentProjectFeature.data.id, onView);
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
				me.loadFeatureAttributes(MYOCD.SharedData.currentProjectFeature.data.id, onView);
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
	deleteFeatureAttributeRecord: function(record, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Feature Attribute ...');
		}
		Ext.Ajax.request({
			url: ATTRIBUTE_BASE_URL + record.data.id + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				record.store.remove(record);
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
			MYOCD.SharedData.projectFeatureSourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Copying Features ...');
		}
		var url;
		if(destFeature.data.id == 'root') {
			url = FEATURE_BASE_URL + sourceFeature.data.id + '/copy/' + MYOCD.SharedData.currentProjectId + '.json';  
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
				MYOCD.SharedData.projectFeatureSourceNode = null;
				if(destFeature.data.id == 'root') {
                	me.getFeaturesOfProject(MYOCD.SharedData.currentProjectId, destFeature.data.name, onView);
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
			var treePanel = MYOCD.SharedData.currentProjectFeatureTree;
			treePanel.ownerCt.getView().removeRowCls(MYOCD.SharedData.projectFeatureSourceNode,'opacity-treenode');
			MYOCD.SharedData.projectFeatureSourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Moving Features ...');
		}
		var url;
		if(destFeature.data.id == 'root') {
			url = FEATURE_BASE_URL + sourceFeature.data.id + '/move/' + MYOCD.SharedData.currentProjectId + '.json';  
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
				var store = MYOCD.SharedData.projectFeatureSourceNode.stores[0];
				store.remove (MYOCD.SharedData.projectFeatureSourceNode);
				MYOCD.SharedData.projectFeatureSourceNode.destroy();
				if(MYOCD.SharedData.projectFeatureSourceNode == MYOCD.SharedData.currentProjectFeature) {
					MYOCD.SharedData.currentProjectFeature = null;
					Ext.getStore('project.FeatureAttributes').removeAll();
				}
				MYOCD.SharedData.projectFeatureSourceNode = null;
				if(destFeature.data.id == 'root') {
                	me.getFeaturesOfProject(MYOCD.SharedData.currentProjectId, destFeature.data.name, onView);
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
    getProductsOfProject: function(projectId, onView) {
		if(onView) {
			onView.setLoading('Loading Products ...');
		}
		Ext.Ajax.request({
			url: PROJECT_BASE_URL + projectId + '/productitems.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var productData = Ext.decode(data.responseText);
				Ext.getStore('project.ProjectProducts').loadRawData(productData);
				Ext.getStore('project.ProjectProducts').sort([
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
				Ext.getStore('project.ProjectProducts').loadRawData(productData);
				Ext.getStore('project.ProjectProducts').sort([
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
	getProductsOfProjectWithStore: function(projectId, projectProductsStore, onView) {
		if (onView) {
			onView.setLoading('Loading Products ...');
		}
		if (!projectProductsStore) {
			return;
		}
		Ext.Ajax.request({
			url: PROJECT_BASE_URL + projectId + '/productitems.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var productData = Ext.decode(data.responseText);
				projectProductsStore.loadRawData(productData);
				projectProductsStore.sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				projectProductsStore.removeAll();
			}
		});
	},
	getProductsOfFeatureWithStore: function(featureId, featureProductsStore, onView) {
		if (onView) {
			onView.setLoading('Loading Products ...');
		}
		if (!featureProductsStore) {
			return;
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
				featureProductsStore.loadRawData(productData);
				featureProductsStore.sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				featureProductsStore.removeAll();
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
				if(MYOCD.SharedData.currentProjectFeature == null || MYOCD.SharedData.currentProjectFeature.data.id == 'root') {
					me.getProductsOfProject(MYOCD.SharedData.currentProjectId, onView);
					
				} else {
					me.getProductsOfFeature(MYOCD.SharedData.currentProjectFeature.data.id, onView);
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
	addNewProductToFeatureNode: function(url, productName, productDesc, parentProductId, featureNode, store, onView) {
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
				if(featureNode == null || featureNode.data.id == 'root') {
					me.getProductsOfProjectWithStore(MYOCD.SharedData.currentProjectId, store, onView);
					
				} else {
					me.getProductsOfFeatureWithStore(featureNode.data.id, store, onView);
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
	editProduct: function(productId, productName, productDesc, parentProductId, productPrice, productQuantity, onView) {
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
				product_id: parentProductId,
				cost_info: {
					price: productPrice,
					quantity: productQuantity
				}	
			},
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentProjectFeature == null || MYOCD.SharedData.currentProjectFeature.data.id == 'root') {
					me.getProductsOfProject(MYOCD.SharedData.currentProjectId, onView);
					
				} else {
					me.getProductsOfFeature(MYOCD.SharedData.currentProjectFeature.data.id, onView);
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
	editProductRecord: function(productId, productName, productDesc, parentProductId, productPrice, productQuantity, record, onView) {
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
				product_id: parentProductId,
				cost_info: {
					price: productPrice,
					quantity: productQuantity
				}	
			},
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				record.set('name', productName);
				record.set('description', productDesc);
				record.set('cost_info', {
					price: productPrice,
					quantity: productQuantity
				});
				record.commit();
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
				if(MYOCD.SharedData.currentProjectFeature == null || MYOCD.SharedData.currentProjectFeature.data.id == 'root') {
					me.getProductsOfProject(MYOCD.SharedData.currentProjectId, onView);
					
				} else {
					me.getProductsOfFeature(MYOCD.SharedData.currentProjectFeature.data.id, onView);
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
	deleteProductRecord: function(record, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Product ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_ITEMS_BASE_URL + record.data.id + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				record.store.remove(record);
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
			url: PRODUCT_ITEMS_BASE_URL + productId + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				Ext.getStore('project.ProductItemAttributes').removeAll();
				var productData = Ext.decode(data.responseText);
				for(var i = 0; i < productData.attributes.length; i++) {
					var att = productData.attributes[i];
					att.isInherited = false;
					if (att.type_group && att.type_group.length == 0) {
						att.type_group = 'General';
					}
					Ext.getStore('project.ProductItemAttributes').add(att);
				}
				for(var i = 0; i < productData.inherited_attributes.length; i++) {
					var att = productData.inherited_attributes[i];
					att.isInherited = true;
					if (att.type_group && att.type_group.length == 0) {
						att.type_group = 'General';
					}
					Ext.getStore('project.ProductItemAttributes').add(att);
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
	editProductAttributeValue: function(productId, attributeId, attributeValue, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Upating Product Attribute ...');
		}
		//var jsonData = "{'attribute_values': { 'attribute_" + attributeId + "': '" + attributeValue + "'}}"; 
		var data = new Object();
		data.attribute_values = new Object();
		var key = "attribute_" + attributeId;
		data.attribute_values[key] = attributeValue;
		data.product_ids = null;
		Ext.Ajax.request({
			url: PRODUCT_ITEMS_BASE_URL + productId + '.json',
			method: 'PUT',
			jsonData: data,
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
	saveFeatureAsFeatureTemplate: function(url, featureId, featureTemplateName, featureTemplateDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Saving New Template ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			jsonData: {
				feature_id: featureId,
	          	feature_template: {
	          		name: featureTemplateName,
	          		description: featureTemplateDesc
	          	}
			},
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
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
				console.log('Saving Template failure');			
			}
		});
	},

//////////////////////////////////////////////////////////////////////////
////////////////              Security Functions
//////////////////////////////////////////////////////////////////////////

	loadProjectAuthorizationContext: function(projectId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Loading Authorization Contexts Of Project ...');
		}
		Ext.Ajax.request({
			url: PROJECT_BASE_URL + projectId + '/authcontexts.json',
			method: 'GET',
			withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            var authData = Ext.decode(data.responseText);
				Ext.getStore('project.security.ProjectAuthorizationContexts').removeAll();
	            for (var i = 0; i < authData.authorization_contexts.length; i++) {
	            	var context = authData.authorization_contexts[i];
	            	if (!context.first_name) {
	            		context.first_name = '';
	            	} 
	            	if (!context.last_name) {
	            		context.last_name = '';
	            	}
	            	context.isInherited = false;
		            Ext.getStore('project.security.ProjectAuthorizationContexts').add(context);
	            }
	            for (var i = 0; i < authData.inherited_authorization_contexts.length; i++) {
	            	var context = authData.inherited_authorization_contexts[i];
	            	if (!context.first_name) {
	            		context.first_name = '';
	            	} 
	            	if (!context.last_name) {
	            		context.last_name = '';
	            	}
	            	context.isInherited = true;
		            Ext.getStore('project.security.ProjectAuthorizationContexts').add(context);
	            }
	            Ext.getStore('project.security.ProjectAuthorizationContexts').sort([
	            	{property: 'type', direction: 'ASC'}, 
	            	{property: 'isInherited', direction: 'ASC'},
	            	{property: 'name', direction: 'ASC'}
	            ]);
	            me.showInheritedItems(MYOCD.SharedData.showProjectInheritedAuthContext);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
	            console.log('Loading Roles Of Project failure'); 
            }
		});
	},
	showInheritedItems: function(yes) {
		Ext.getStore('project.security.ProjectAuthorizationContexts').clearFilter();
		if (yes) {
			return;
		} else {
			Ext.getStore('project.security.ProjectAuthorizationContexts').filter([
			    {filterFn: function(item) {
			    	return !item.get('isInherited'); 
			    }}
			]);
		}
	},
	loadSecurityRolesOfProject: function(projectId, onView) {
		if (onView) {
			onView.setLoading('Loading Roles Of Project ...');
		}
		Ext.Ajax.request({
			url: PROJECT_BASE_URL + projectId + '/roles.json',
			method: 'GET',
			withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            var roleData = Ext.decode(data.responseText);
	            Ext.getStore('project.security.ProjectRoles').loadRawData(roleData.owned_roles);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            console.log('Loading Roles Of Project failure'); 
            }
		});
	},
	addPartnerToProject: function(projectId, partnerId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Adding Partner ...');
		}
		Ext.Ajax.request({
			url: PROJECT_BASE_URL + projectId + '/authorizedpartners.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				partner_id: partnerId	
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadProjectAuthorizationContext(projectId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Add Partner failure');			
			}
		});
	},
	removePartnerFromProject: function(projectId, partnerId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Removing Partner ...');
		}
		Ext.Ajax.request({
			url: PROJECT_BASE_URL + projectId + '/authorizedpartners/' + partnerId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadProjectAuthorizationContext(projectId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Remove Partner failure');			
			}
		});
	},
	addRoleToProject: function(projectId, roleId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Adding Role...');
		}
		Ext.Ajax.request({
			url: PROJECT_BASE_URL + projectId + '/roles.json',
			method: 'POST',
			withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
	            role_id: roleId
            },
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            me.loadSecurityRolesOfProject(projectId, onView);
	            me.loadProjectAuthorizationContext(projectId, onView);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
	            console.log('Add Role To Project failure'); 
            }
		});
	},
	removeRoleFromProject: function(projectId, roleId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Removing Role...');
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '.json',
			method: 'DELETE',
			withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
	          	parent_id: projectId  
            },
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            me.loadSecurityRolesOfProject(projectId, onView);
	            me.loadProjectAuthorizationContext(projectId, onView);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
	            console.log('Remove Role Of Company failure'); 
            }
		});
	},
	loadAssignedItemsOfProjectRole: function(roleId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Loading Assigned Organizations And Users...')
		} 
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '/assignees.json',
			method: 'GET',
			withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            var assignedItems = Ext.decode(data.responseText);
	            Ext.getStore('project.security.ProjectRoleUsersAndRoles').loadRawData(assignedItems);
	            Ext.getStore('project.security.ProjectRoleUsersAndRoles').sort([
	            	{property: 'type', direction: 'ASC'}, 
	            	{property: 'isInherited', direction: 'ASC'},
	            	{property: 'name', direction: 'ASC'}
	            ]);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            console.log('Load Assigned Organizations And Users failure'); 
            }
		});
	},
	loadRolesOfProjectRole: function(roleId, onView, callback) {
		var me = this;
		if (onView) {
			onView.setLoading('Loading Roles ...');
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '/roles.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var roleData = Ext.decode(data.responseText);
				if (callback) {
					callback(roleData.assigned_roles);
				}
			},
			failure: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				console.log('Load Roles failure');	
			}
		});
	},
	assignRoleToProjectRole: function(roleId, toRoleId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Assigning Role ...');
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + toRoleId + '/roles.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				role_id: roleId
			},
			success: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var roleData = Ext.decode(data.responseText);
				me.loadAssignedItemsOfProjectRole(roleId, onView);
			},
			failure: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Assign Role failure');	
			}
		});
	},    
	assignProjectRoleToCompany: function(roleId, companyId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Assigning Role...');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/roles.json',
			method: 'POST',
			withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
	            role_id: roleId
            },
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            me.loadAssignedItemsOfProjectRole(roleId, onView);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
	            console.log('Loading Roles Of Company failure'); 
            }
		});

	},
	assignProjectRoleToEmployeeProfile: function(roleId, employeeProfileId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Assigning Role...');
		}
		Ext.Ajax.request({
			url: EMPLOYEE_PROFILES_BASE_URL + employeeProfileId + '/roles.json',
			method: 'POST',
			withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
	            role_id: roleId
            },
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            me.loadAssignedItemsOfProjectRole(roleId, onView);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
	            console.log('Assign Role failure'); 
            }
		});
	},
	assignProjectRoleToPersonalProfile: function(roleId, employeeProfileId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Assigning Role...');
		}
		Ext.Ajax.request({
			url: PERSONAL_PROFILES_BASE_URL + employeeProfileId + '/roles.json',
			method: 'POST',
			withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
	            role_id: roleId
            },
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            me.loadAssignedItemsOfProjectRole(roleId, onView);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
	            console.log('Assign Role failure'); 
            }
		});
	},
	unassignItemFromProjectRole: function(baseUrl, itemId, roleId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Unassigning Item ...');
		}
		Ext.Ajax.request({
			url: baseUrl + itemId + '/roles/' + roleId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				me.loadAssignedItemsOfProjectRole(roleId, onView);
			},
			failure: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Unassign Role failure');	
			}
		});
	},
	// getAssignedPermissionsOfObject: function(baseUrl, objectId, loadIntoStore, onView) {
	// 	var me = this;
	// 	if(onView) {
	// 		onView.setLoading('Getting Permissions ...');
	// 	}
	// 	Ext.Ajax.request({
	// 		url: baseUrl + objectId + '/permissions.json?object_id=' + MYOCD.SharedData.currentProjectId,
	// 		method: 'GET',
	// 		withCredentials: true,
	// 		useDefaultXhrHeader: false,
	// 		success: function(data) {
	// 			if(onView) {
	// 				onView.setLoading(false);
	// 			}
	// 			loadIntoStore.removeAll();
	// 			var permissionsData = Ext.decode(data.responseText);
	// 			loadIntoStore.loadRawData(permissionsData);
	// 			loadIntoStore.sort([
	//             	{property: 'isInherited', direction: 'ASC'},
	//             	{property: 'name', direction: 'ASC'}
	//             ]);
	// 		},
	// 		failure: function(data) {
	// 			if(onView) {
	// 				onView.setLoading(false);
	// 			}
	// 			console.log('Get Permissions failure');			
	// 		}
	// 	});
	// },
	// addPermissionToObject: function(baseUrl, objectId, permissionId, loadIntoStore, onView) {
	// 	var me = this;
	// 	if(onView) {
	// 		onView.setLoading('Adding New Permissions ...');
	// 	}
	// 	Ext.Ajax.request({
	// 		url: baseUrl + objectId + '/permissions.json?object_id=' + MYOCD.SharedData.currentProjectId,
	// 		method: 'POST',
	// 		jsonData: {
	// 			permission_ids: [permissionId]	
	// 		},
	// 		withCredentials: true,
	// 		useDefaultXhrHeader: false,
	// 		success: function(data) {
	// 			if(onView) {
	// 				onView.setLoading(false);
	// 			}
	// 			me.getAssignedPermissionsOfObject(baseUrl, objectId, loadIntoStore, onView);
	// 		},
	// 		failure: function(data) {
	// 			if(onView) {
	// 				onView.setLoading(false);
	// 			}
	// 			var error = Ext.decode(data.responseText);
	// 			if (error.error) {
	// 				Ext.Msg.alert('Error!', error.error.toString());
	// 			}
	// 			console.log('Add Permissions failure');			
	// 		}
	// 	});
	// },
	// removePermissionFromObject: function(baseUrl, objectId, record, permissionStore, onView) {
	// 	var me = this;
	// 	if(onView) {
	// 		onView.setLoading('Removing Permissions ...');
	// 	}
	// 	Ext.Ajax.request({
	// 		url: baseUrl + objectId + '/permissions.json?object_id=' + MYOCD.SharedData.currentProjectId,
	// 		method: 'DELETE',
	// 		withCredentials: true,
	// 		useDefaultXhrHeader: false,
	// 		jsonData: {
	// 			permission_ids: [record.data.id]	
	// 		},
	// 		success: function(data) {
	// 			if(onView) {
	// 				onView.setLoading(false);
	// 			}
	// 			permissionStore.remove(record);
	// 		},
	// 		failure: function(data) {
	// 			if(onView) {
	// 				onView.setLoading(false);
	// 			}
	// 			var error = Ext.decode(data.responseText);
	// 			if (error.error) {
	// 				Ext.Msg.alert('Error!', error.error.toString());
	// 			}
	// 			console.log('Remove Permissions failure');			
	// 		}
	// 	});
	// },
	getPermissionsOfProjectRole: function(roleId, loadIntoStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Getting Role Permissions ...');
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '/permissions.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				loadIntoStore.removeAll();
				var permissionsData = Ext.decode(data.responseText);
				if (permissionsData.inherited_permissions) {
					for(var i = 0; i < permissionsData.inherited_permissions.length; i++) {
						var permission = permissionsData.inherited_permissions[i];
						permission.isInherited = true;
						loadIntoStore.add(permission);
					}
				}
				for(var i = 0; i < permissionsData.permissions.length; i++) {
					var permission = permissionsData.permissions[i];
					permission.isInherited = MYOCD.SharedData.projectSecurityShowInherited; //false;
					console.log(MYOCD.SharedData.projectSecurityShowInherited);
					loadIntoStore.add(permission);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Get Role Permissions failure');			
			}
		});
	},
	addPermissionToProjectRole: function(roleId, permissionId, loadIntoStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Adding New Role Permissions ...');
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '/permissions.json',
			method: 'POST',
			jsonData: {
				permission_ids: [permissionId]	
			},
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.getPermissionsOfProjectRole(roleId, loadIntoStore, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Add Role Permissions failure');			
			}
		});
	},
	removePermissionFromProjectRole: function(roleId, record, permissionStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Removing Role Permissions ...');
		}
		Ext.Ajax.request({
			url: ROLE_BASE_URL + roleId + '/permissions/' + record.data.id + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				permissionStore.remove(record);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Remove Role Permissions failure');			
			}
		});
	},
	getAssignedPermissionsOfObject: function(baseUrl, objectId, loadIntoStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Getting Permissions ...');
		}
		Ext.Ajax.request({
			url: baseUrl + objectId + '/permissions.json?object_id=' + MYOCD.SharedData.currentProjectId,
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				loadIntoStore.removeAll();
				var permissionsData = Ext.decode(data.responseText);
				if (permissionsData.inherited_permissions) {
					for(var i = 0; i < permissionsData.inherited_permissions.length; i++) {
						var permission = permissionsData.inherited_permissions[i];
						permission.isInherited = true;
						loadIntoStore.add(permission);
					}
				}
				for(var i = 0; i < permissionsData.permissions.length; i++) {
					var permission = permissionsData.permissions[i];
					permission.isInherited = MYOCD.SharedData.projectSecurityShowInherited //false;
					loadIntoStore.add(permission);
				}
				loadIntoStore.sort([
	            	{property: 'isInherited', direction: 'ASC'},
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Get Permissions failure');			
			}
		});
	},
	addPermissionToObject: function(baseUrl, objectId, permissionId, loadIntoStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Adding New Permissions ...');
		}
		Ext.Ajax.request({
			url: baseUrl + objectId + '/permissions.json?object_id=' + MYOCD.SharedData.currentProjectId,
			method: 'POST',
			jsonData: {
				permission_ids: [permissionId]	
			},
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.getAssignedPermissionsOfObject(baseUrl, objectId, loadIntoStore, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Add Permissions failure');			
			}
		});
	},
	removePermissionFromObject: function(baseUrl, objectId, record, permissionStore, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Removing Permissions ...');
		}
		Ext.Ajax.request({
			url: baseUrl + objectId + '/permissions.json?object_id=' + MYOCD.SharedData.currentProjectId,
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				permission_ids: [record.data.id]	
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				permissionStore.remove(record);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Remove Role Permissions failure');			
			}
		});
	},
	updateInheritFromParent: function(projectId, inheritFromParent, onView, callback) {
		var me = this;
		if (onView) {
			onView.setLoading('Updating Inheritance ...');
		}
		Ext.Ajax.request({
			url: PROJECT_BASE_URL + projectId + '/securityattributes.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				security_attributes: {
					inherit_security_from_parent: inheritFromParent.toString()
				}
			},
			success: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				if (callback) {
					callback();
				}
				me.loadProjectAuthorizationContext( projectId, onView);		
			},
			failure: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update Inheritance failure');	
			}
		});
	},
	getProjectAuthorizedInfo: function(projectId, onView, callback) {
		var me = this;
		if (onView) {
			onView.setLoading('Loading Inheritance ...');
		}
		Ext.Ajax.request({
			url: PROJECT_BASE_URL + projectId + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var objectData = Ext.decode(data.responseText);
				if (callback) {
					callback(objectData);
				}
				me.loadProjectAuthorizationContext( projectId, onView);			
			},
			failure: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				console.log('Load Inheritance failure');	
			}
		});
	},
	getFeaturesOfProjectByViews: function(projectId, viewId, onView, callback) {
		var me = this;
		if (onView) {
			onView.setLoading('Loading Features ...');
		}
		Ext.Ajax.request({
			url: PROJECT_BASE_URL + projectId + '/features.json?view_id=' + viewId,
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var resultData = Ext.decode(data.responseText);
				if (callback) {
					callback(resultData);
				}
			},
			failure: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error);
				}
				console.log('Load Features failure');	
			}
		});
	},
	getFeaturesOfFeatureByViews: function(featureId, viewId, onView, callback) {
		var me = this;
		if (onView) {
			onView.setLoading('Loading Features ...');
		}
		Ext.Ajax.request({
			url: FEATURE_BASE_URL + featureId + '/features.json?view_id=' + viewId,
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var resultData = Ext.decode(data.responseText);
				if (callback) {
					callback(resultData);
				}
			},
			failure: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error);
				}
				console.log('Load Features failure');	
			}
		});
	},
	getProductItemsOfProjectByViews: function(projectId, viewId, onView, callback) {
		var me = this;
		if (onView) {
			onView.setLoading('Loading Features ...');
		}
		Ext.Ajax.request({
			url: PROJECT_BASE_URL + projectId + '/productitems.json?view_id=' + viewId,
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var resultData = Ext.decode(data.responseText);
				if (callback) {
					callback(resultData);
				}
			},
			failure: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error);
				}
				console.log('Load Features failure');	
			}
		});
	},
	getProductItemsOfFeatureByViews: function(featureId, viewId, onView, callback) {
		var me = this;
		if (onView) {
			onView.setLoading('Loading Features ...');
		}
		Ext.Ajax.request({
			url: FEATURE_BASE_URL + featureId + '/productitems.json?view_id=' + viewId,
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var resultData = Ext.decode(data.responseText);
				if (callback) {
					callback(resultData);
				}
			},
			failure: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error);
				}
				console.log('Load Features failure');	
			}
		});
	},
	getItemsByView: function(targetId, viewId, onView, callback) {
		var me = this;
		if (onView) {
			onView.setLoading('Loading Items ....');
		}
		Ext.Ajax.request({
			url: VIEW_BASE_URL + viewId + '/apply.json?root_id=' + targetId,
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var resultData = Ext.decode(data.responseText);
				if (callback) {
					callback(resultData);
				}
			},
			failure: function(data) {
				if (onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error);
				}
				console.log('Load Items failure');	
			}
		});
	}
});