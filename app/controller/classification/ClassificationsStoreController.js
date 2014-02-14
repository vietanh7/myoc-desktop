Ext.define('MYOCD.controller.classification.ClassificationsStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadClassificationsLibs: function(companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Classifications libraries');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/classificationlibs.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                var classData = Ext.decode(data.responseText);
                Ext.getStore('classification.ClassificationsLibraries').loadRawData(classData); 
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading classifications library failure');
			}
		});
	},
	addNewClassificationsLib: function(libraryName, libraryDesc, libraryAccess, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating New Classifications Library');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/classificationlibs.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				classification_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadClassificationsLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Create new classifications library failure');
			}
		});
	},
	editClassificationsLib: function(libraryName, libraryDesc, libraryAccess, libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Classifications Library');
		}
		Ext.Ajax.request({
			url: CLASSIFICATION_LIB_BASE_URL + libraryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				classification_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadClassificationsLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('update classifications library failure');
			}
		});
	},
	deleteClassificationsLib: function(libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Classification Library ...');
		}
		Ext.Ajax.request({
			url: CLASSIFICATION_LIB_BASE_URL + libraryId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadClassificationsLibs(companyId, onView);			
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Delete classification library failure');			
			}
		});	
	},
	loadCategoriesOfClassificationsLib: function(libraryId, libraryName, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Classification Categories ...');
		}
		Ext.Ajax.request({
			url: CLASSIFICATION_LIB_BASE_URL + libraryId + '/categories.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var categoryData = Ext.decode(data.responseText);
				Ext.getStore('classification.ClassificationsCategoriesTreeStore').setRootNode(
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
				console.log('Load classification categories failure');			
			}
		});
	},
	loadCategoriesOfClassificationsCategory: function(categoryId, categoryTreeNode, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Classification Categories ...');
		}
		Ext.Ajax.request({
			url: CLASSIFICATION_CATEGORY_BASE_URL + categoryId + '/categories.json',
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
				console.log('Load classification categories failure');			
			}
		});
	},
	loadClassificationsOfClassificationsLib: function(libraryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Classifications ...');
		}
		Ext.Ajax.request({
			url: CLASSIFICATION_LIB_BASE_URL + libraryId + '/classifications.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var classificationData = Ext.decode(data.responseText);
				Ext.getStore('classification.Classifications').loadRawData(classificationData);
				Ext.getStore('classification.Classifications').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading classifications failure');			
			}
		});
	},
	loadClassificationsOfClassificationsCategory: function(categoryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading classifications ...');
		}
		Ext.Ajax.request({
			url: CLASSIFICATION_CATEGORY_BASE_URL + categoryId + '/classifications.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var classificationData = Ext.decode(data.responseText);
				Ext.getStore('classification.Classifications').loadRawData(classificationData);
				Ext.getStore('classification.Classifications').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading classifications failure');			
			}
		});
	},
	addNewClassificationsCategory: function(url, categoryName, categoryDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Classifications Category ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				classification_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.AddingChildOnClassificationNode.data.id !== 'root') {
					var node = MYOCD.SharedData.AddingChildOnClassificationNode;
					node.expand(false, function() {
						me.loadCategoriesOfClassificationsCategory(node.data.id, node, onView);
					});
				} else {
					me.loadCategoriesOfClassificationsLib(
						MYOCD.SharedData.currentClassificationsLibId, 
						MYOCD.SharedData.AddingChildOnClassificationNode.data.name, 
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
				console.log('Create classifications category failure');			
			}
		});
	},
	editClassificationsCategory: function(categoryName, categoryDesc, onView){
		var me = this;
		if(onView) {
			onView.setLoading('Updating Classifications Category ...');
		}
		var categoryId = MYOCD.SharedData.currentClassificationsCategoryNodeContextMenu.data.id;
		Ext.Ajax.request({
			url: CLASSIFICATION_CATEGORY_BASE_URL + categoryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				classification_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				MYOCD.SharedData.currentClassificationsCategoryNodeContextMenu.set('name', categoryName);
				MYOCD.SharedData.currentClassificationsCategoryNodeContextMenu.set('description', categoryDesc);
				MYOCD.SharedData.currentClassificationsCategoryNodeContextMenu.commit();
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update classifications category failure');			
			}
		});

	},
	deleteClassificationsCategory: function(onView){
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Classifications Category ...');
		}
		var categoryId = MYOCD.SharedData.currentClassificationsCategoryNodeContextMenu.data.id;
		var deleteNode = MYOCD.SharedData.currentClassificationsCategoryNodeContextMenu;
		Ext.Ajax.request({
			url: CLASSIFICATION_CATEGORY_BASE_URL + categoryId + '.json',
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
				if(deleteNode == MYOCD.SharedData.currentClassificationsCategory) {
					MYOCD.SharedData.currentClassificationsCategory = null;
					Ext.getStore('classification.Classifications').removeAll();
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
				console.log('Update classifications category failure');			
			}
		});
	},
	addNewClassification: function(url, classificationName, classificationDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Classification ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				classification: {
					name: classificationName,
					description: classificationDesc				
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentClassificationsCategory == null || MYOCD.SharedData.currentClassificationsCategory.data.id == 'root') {
					me.loadClassificationsOfClassificationsLib(MYOCD.SharedData.currentClassificationsLibId, onView);
					
				} else {
					me.loadClassificationsOfClassificationsCategory(MYOCD.SharedData.currentClassificationsCategory.data.id, onView);
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
				console.log('Create classification failure');			
			}
		});
	},
	editClassification: function(classId, className, classDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Classification ...');
		}
		Ext.Ajax.request({
			url: CLASSIFICATION_BASE_URL + classId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				classification: {
					name: className,
					description: classDesc				
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentClassificationsCategory == null || MYOCD.SharedData.currentClassificationsCategory.data.id == 'root') {
					me.loadClassificationsOfClassificationsLib(MYOCD.SharedData.currentClassificationsLibId, onView);
					
				} else {
					me.loadClassificationsOfClassificationsCategory(MYOCD.SharedData.currentClassificationsCategory.data.id, onView);
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
				console.log('Update classification failure');			
			}
		});
	},
	deleteClassification: function(classId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Classification ...');
		}
		Ext.Ajax.request({
			url: CLASSIFICATION_BASE_URL + classId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentClassificationsCategory == null || MYOCD.SharedData.currentClassificationsCategory.data.id == 'root') {
					me.loadClassificationsOfClassificationsLib(MYOCD.SharedData.currentClassificationsLibId, onView);
					
				} else {
					me.loadClassificationsOfClassificationsCategory(MYOCD.SharedData.currentClassificationsCategory.data.id, onView);
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
				console.log('Delete classification failure');			
			}
		});
	},
	copyClassificationCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			MYOCD.SharedData.classificationCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Copying Classification Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = CLASSIFICATION_CATEGORY_BASE_URL + sourceFeature.data.id + '/copy/' + MYOCD.SharedData.currentClassificationsLibId + '.json';  
		} else {
			url = CLASSIFICATION_CATEGORY_BASE_URL + sourceCategory.data.id + '/copy/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.classificationCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfClassificationsLib(MYOCD.SharedData.currentClassificationsLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfClassificationsCategory(destCategory.data.id, destCategory, onView)
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
	moveClassificationCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			var treePanel = MYOCD.SharedData.currentClassificationCategoryTree;
			treePanel.ownerCt.getView().removeRowCls(MYOCD.SharedData.classificationCategorySourceNode,'opacity-treenode');
			MYOCD.SharedData.classificationCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Moving Classification Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = CLASSIFICATION_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + MYOCD.SharedData.currentClassificationsLibId + '.json';  
		} else {
			url = CLASSIFICATION_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + destCategory.data.id + '.json';
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
				var store = MYOCD.SharedData.classificationCategorySourceNode.stores[0];
				store.remove (MYOCD.SharedData.classificationCategorySourceNode);
				MYOCD.SharedData.classificationCategorySourceNode.destroy();
				if(MYOCD.SharedData.classificationCategorySourceNode == MYOCD.SharedData.currentClassificationsCategory) {
					MYOCD.SharedData.currentClassificationsCategory = null;
					Ext.getStore('classification.Classifications').removeAll();
				}
				MYOCD.SharedData.classificationCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfClassificationsLib(MYOCD.SharedData.currentClassificationsLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfClassificationsCategory(destCategory.data.id, destCategory, onView)
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
	moveClassification: function(classificationId, destCategory, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Moving Classification ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = CLASSIFICATION_BASE_URL + classificationId + '/move/' + MYOCD.SharedData.currentClassificationsLibId + '.json';  
		} else {
			url = CLASSIFICATION_BASE_URL + classificationId + '/move/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.currentClassificationsCategory = destCategory;
				if(MYOCD.SharedData.currentClassificationsCategory.data.id == 'root') {
                	me.loadClassificationsOfClassificationsLib(MYOCD.SharedData.currentClassificationsLibId, onView);
				} else {
					me.loadClassificationsOfClassificationsCategory(MYOCD.SharedData.currentClassificationsCategory.data.id, onView);
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
	importClassificationLibraries: function(libraryId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Importing Library ...');
		}
		Ext.Ajax.request({
			url: CLASSIFICATION_LIB_BASE_URL + 'import.json',
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
				me.loadClassificationsLibs(MYOCD.SharedData.currentCompanyId, onView);
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