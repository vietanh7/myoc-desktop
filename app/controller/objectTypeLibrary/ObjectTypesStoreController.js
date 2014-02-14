Ext.define('MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadObjectTypeLibraries: function(companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Object Type Libraries ...');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/objecttypelibs.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var libraryData = Ext.decode(data.responseText);
				Ext.getStore('objectTypeLibrary.ObjectTypeLibraries').loadRawData(libraryData); 
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
			}
		});
	},
	addNewObjectTypeLib: function(libraryName, libraryDesc, libraryAccess, libraryType, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating New Object Type Library ... ');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/objecttypelibs.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				object_type_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess,
					library_type: libraryType
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadObjectTypeLibraries(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Create new object type library failure');
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	editObjectTypesLib: function(libraryName, libraryDesc, libraryAccess, libraryType, libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Object Type Library');
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_LIB_BASE_URL + libraryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				object_type_library: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess,
					library_type: libraryType
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadObjectTypeLibraries(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('update object types library failure');
			}
		});
	},
	deleteObjectTypesLib: function(libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Object Type Library ...');
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_LIB_BASE_URL + libraryId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadObjectTypeLibraries(companyId, onView);			
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Delete object types library failure');			
			}
		});	
	},
	loadCategoriesOfObjectTypesLib: function(libraryId, libraryName, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Object Type Categories ...');
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_LIB_BASE_URL + libraryId + '/categories.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var categoryData = Ext.decode(data.responseText);
				Ext.getStore('objectTypeLibrary.ObjectTypeCategoriesTreeStore').setRootNode(
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
				console.log('Load object type categories failure');			
			}
		});
	},
	loadCategoriesOfObjectTypesCategory: function(categoryId, categoryTreeNode, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Object Type Categories ...');
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_CATEGORY_BASE_URL + categoryId + '/categories.json',
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
				console.log('Load object type categories failure');			
			}
		});
	},
	loadObjectTypesOfObjectTypeLib: function(libraryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Object Types ...');
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_LIB_BASE_URL + libraryId + '/objecttypes.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var objectTypeData = Ext.decode(data.responseText);
				Ext.getStore('objectTypeLibrary.ObjectTypes').loadRawData(objectTypeData);
				Ext.getStore('objectTypeLibrary.ObjectTypes').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading object types failure');			
			}
		});
	},
	loadObjectTypesOfObjectTypeCategory: function(categoryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Object Types ...');
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_CATEGORY_BASE_URL + categoryId + '/objecttypes.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var objectTypeData = Ext.decode(data.responseText);
				Ext.getStore('objectTypeLibrary.ObjectTypes').loadRawData(objectTypeData);
				Ext.getStore('objectTypeLibrary.ObjectTypes').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading ObjectTypes failure');			
			}
		});
	},
	addNewObjectTypeCategory: function(url, categoryName, categoryDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Object Type Category ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				object_type_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.AddingChildOnObjectTypeNode.data.id !== 'root') {
					var node = MYOCD.SharedData.AddingChildOnObjectTypeNode;
					node.expand(false, function() {
						me.loadCategoriesOfObjectTypesCategory(node.data.id, node, onView);
					});
				} else {
					me.loadCategoriesOfObjectTypesLib(MYOCD.SharedData.currentObjectTypeLibId , MYOCD.SharedData.AddingChildOnObjectTypeNode.data.name, onView);
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
				console.log('Create Object Type category failure');			
			}
		});
	},
	editObjectTypesCategory: function(categoryName, categoryDesc, onView){
		var me = this;
		if(onView) {
			onView.setLoading('Updating Object Types Category ...');
		}
		var categoryId = MYOCD.SharedData.currentObjectTypesCategoryNodeContextMenu.data.id;
		Ext.Ajax.request({
			url: OBJECT_TYPE_CATEGORY_BASE_URL + categoryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				object_type_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				MYOCD.SharedData.currentObjectTypesCategoryNodeContextMenu.set('name', categoryName);
				MYOCD.SharedData.currentObjectTypesCategoryNodeContextMenu.set('description', categoryDesc);
				MYOCD.SharedData.currentObjectTypesCategoryNodeContextMenu.commit();
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update ObjectTypes category failure');			
			}
		});

	},
	deleteObjectTypesCategory: function(onView){
		var me = this;
		if(onView) {
			onView.setLoading('Deleting ObjectTypes Category ...');
		}
		var categoryId = MYOCD.SharedData.currentObjectTypesCategoryNodeContextMenu.data.id;
		var deleteNode = MYOCD.SharedData.currentObjectTypesCategoryNodeContextMenu;
		Ext.Ajax.request({
			url: OBJECT_TYPE_CATEGORY_BASE_URL + categoryId + '.json',
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
				if(deleteNode == MYOCD.SharedData.currentObjectTypeCategory) {
					MYOCD.SharedData.currentObjectTypeCategory = null;
					Ext.getStore('ObjectTypeLibrary.ObjectTypes').removeAll();
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
				console.log('Update ObjectTypes category failure');			
			}
		});
	},
	addNewObjectType: function(url, objectTypeName, objectTypeDesc, parentIds, parentVersion, associatedParam, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Object Type ...');
		}
		var data = {
			object_type: {
				name: objectTypeName,
				description: objectTypeDesc,
			},
			base_object_type_ids: parentIds,
			version_id: parentVersion
		}
		if (Object.keys(associatedParam).length > 0) {
			data.associated_object_type_ids = associatedParam;
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: data,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentObjectTypeCategory == null || MYOCD.SharedData.currentObjectTypeCategory.data.id == 'root') {
					me.loadObjectTypesOfObjectTypeLib(MYOCD.SharedData.currentObjectTypeLibId, onView);
					
				} else {
					me.loadObjectTypesOfObjectTypeCategory(MYOCD.SharedData.currentObjectTypeCategory.data.id, onView);
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
				console.log('Create Object Type failure');			
			}
		});
	},
	editObjectType: function(objectTypeId, objectTypeName, objectTypeDesc, parentIds, parentVersion, associatedParam, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Editing Object Type ...');
		}
		var data = {
			object_type: {
				name: objectTypeName,
				description: objectTypeDesc,
			},
			base_object_type_ids: parentIds,
			version_id: parentVersion
		}
		if (Object.keys(associatedParam).length > 0) {
			data.associated_object_type_ids = associatedParam;
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_BASE_URL + objectTypeId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: data,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentObjectTypeCategory == null || MYOCD.SharedData.currentObjectTypeCategory.data.id == 'root') {
					me.loadObjectTypesOfObjectTypeLib(MYOCD.SharedData.currentObjectTypeLibId, onView);
					
				} else {
					me.loadObjectTypesOfObjectTypeCategory(MYOCD.SharedData.currentObjectTypeCategory.data.id, onView);
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
				console.log('Edit Object Type failure');			
			}
		});
	},
	deleteObjectType: function(objectTypeId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Object Type ...');
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_BASE_URL + objectTypeId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentObjectTypeCategory == null || MYOCD.SharedData.currentObjectTypeCategory.data.id == 'root') {
					me.loadObjectTypesOfObjectTypeLib(MYOCD.SharedData.currentObjectTypeLibId, onView);
					
				} else {
					me.loadObjectTypesOfObjectTypeCategory(MYOCD.SharedData.currentObjectTypeCategory.data.id, onView);
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
				console.log('Delete Object Type failure');			
			}
		});
	},
	loadAttributeOfObjectType: function(objectTypeId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Object Type Attributes ...');
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_BASE_URL + objectTypeId + '/attributes.json?associated_object_type_keys[]=cost_info&associated_object_type_keys[]=scheduling_info',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				Ext.getStore('objectTypeLibrary.ObjectTypeAttributes').removeAll();
				var attributeData = Ext.decode(data.responseText);
				for(var i = 0; i < attributeData.attributes.length; i++) {
					var att = attributeData.attributes[i];
					att.isInherited = false;
					if (att.type_group && att.type_group.length == 0) {
						att.type_group = 'General';
					}
					Ext.getStore('objectTypeLibrary.ObjectTypeAttributes').add(att);
				}
				for(var i = 0; i < attributeData.inherited_attributes.length; i++) {
					var att = attributeData.inherited_attributes[i];
					att.isInherited = true;
					if (att.type_group && att.type_group.length == 0) {
						att.type_group = 'General';
					}
					Ext.getStore('objectTypeLibrary.ObjectTypeAttributes').add(att);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading Object Type Attributes failure');			
			}
		});
	},
	addNewObjectTypeAttribute: function(objectTypeId, attributeName, attributeDesc, attributeValueType, attributeHidden, 
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, onView, callback) {
		
		var me = this;
		if(onView) {
			onView.setLoading('Creating Object Type Attribute ...');
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_BASE_URL + objectTypeId + '/attributes.json',
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
				me.loadAttributeOfObjectType(objectTypeId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Create Object Type Attribute failure');			
			}
		});
	},
	editObjectTypeAttribute: function(attributeId, attributeName, attributeDesc, attributeValueType, attributeHidden, 
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, onView) {
		
		var me = this;
		if(onView) {
			onView.setLoading('Editing Object Type Attribute ...');
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
				me.loadAttributeOfObjectType(MYOCD.SharedData.currentObjectType.id, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Edit Object Type Attribute failure');			
			}
		});
	},
	deleteObjectTypeAttribute: function(attributeId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Object Type Attribute ...');
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
				me.loadAttributeOfObjectType(MYOCD.SharedData.currentObjectType.id, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Delete Object Type Attribute failure');			
			}
		});
	},
	getObjectTypeInfo: function(objectTypeId, onView, callback) {
		var me = this;
		if(onView) {
			onView.setLoading('Getting Object Type Info ...');
		}
		var keyParam = "";
		for (var i = 0; i < MYOCD.SharedData.associatedTypes.length; i++ ) {
			keyParam = "associated_object_type_keys[]=" + MYOCD.SharedData.associatedTypes[i].associatedType;
			if (i != MYOCD.SharedData.associatedTypes.length - 1) {
				keyParam += "&";
			}
		}
		var associatedTypeParam = "";
		if (keyParam.length > 0) {
			associatedTypeParam = "?" + keyParam;
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_BASE_URL + objectTypeId + '.json' + associatedTypeParam,
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var objectTypeData = Ext.decode(data.responseText);
				if(callback) {
					callback(objectTypeData);
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
	copyObjectTypeCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			MYOCD.SharedData.objectTypeCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Copying Object Type Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = OBJECT_TYPE_CATEGORY_BASE_URL + sourceFeature.data.id + '/copy/' + MYOCD.SharedData.currentObjectTypeLibId + '.json';  
		} else {
			url = OBJECT_TYPE_CATEGORY_BASE_URL + sourceCategory.data.id + '/copy/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.objectTypeCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfObjectTypesLib(MYOCD.SharedData.currentObjectTypeLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfObjectTypesCategory(destCategory.data.id, destCategory, onView)
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
	moveObjectTypeCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			var treePanel = MYOCD.SharedData.currentObjectTypeCategoryTree;
			treePanel.ownerCt.getView().removeRowCls(MYOCD.SharedData.objectTypeCategorySourceNode,'opacity-treenode');
			MYOCD.SharedData.objectTypeCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Moving Object Type Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = OBJECT_TYPE_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + MYOCD.SharedData.currentObjectTypeLibId + '.json';  
		} else {
			url = OBJECT_TYPE_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + destCategory.data.id + '.json';
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
				var store = MYOCD.SharedData.objectTypeCategorySourceNode.stores[0];
				store.remove (MYOCD.SharedData.objectTypeCategorySourceNode);
				MYOCD.SharedData.objectTypeCategorySourceNode.destroy();
				if(MYOCD.SharedData.objectTypeCategorySourceNode == MYOCD.SharedData.currentObjectTypeCategory) {
					MYOCD.SharedData.currentObjectTypeCategory = null;
					Ext.getStore('objectTypeLibrary.ObjectTypes').removeAll();
				}
				MYOCD.SharedData.objectTypeCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfObjectTypesLib(MYOCD.SharedData.currentObjectTypeLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfObjectTypesCategory(destCategory.data.id, destCategory, onView)
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
	moveObjectType: function(objectTypeId, destCategory, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Moving Object Type ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = OBJECT_TYPE_BASE_URL + objectTypeId + '/move/' + MYOCD.SharedData.currentObjectTypeLibId + '.json';  
		} else {
			url = OBJECT_TYPE_BASE_URL + objectTypeId + '/move/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.currentObjectTypeCategory = destCategory;
				if(MYOCD.SharedData.currentObjectTypeCategory.data.id == 'root') {
                	me.loadObjectTypesOfObjectTypeLib(MYOCD.SharedData.currentObjectTypeLibId, onView);
				} else {
					me.loadObjectTypesOfObjectTypeCategory(MYOCD.SharedData.currentObjectTypeCategory.data.id, onView);
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
	importObjectTypeLibraries: function(libraryId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Importing Library ...');
		}
		Ext.Ajax.request({
			url: OBJECT_TYPE_LIB_BASE_URL + 'import.json',
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
				me.loadObjectTypeLibraries(MYOCD.SharedData.currentCompanyId, onView);
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