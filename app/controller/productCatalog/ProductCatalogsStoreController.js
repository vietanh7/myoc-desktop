Ext.define('MYOCD.controller.productCatalog.ProductCatalogsStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadProductCatalogsLibs: function(companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Product Catalogs libraries');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/productlibs.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                var productData = Ext.decode(data.responseText);
                Ext.getStore('productCatalog.ProductCatalogLibs').loadRawData(productData);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading product catalogs libraries failure');
			}
		});
	},
	addNewProductCatalogsLib: function(libraryName, libraryDesc, libraryAccess, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating New Product Catalog Library');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/productlibs.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				product_catalog: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadProductCatalogsLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Create new product catalog library failure');
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	editProductCatalogsLib: function(libraryName, libraryDesc, libraryAccess, libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Product Catalog Library');
		}
		Ext.Ajax.request({
			url: PRODUCT_CATALOG_LIB_BASE_URL + libraryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				product_catalog: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadProductCatalogsLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('update product catalog  library failure');
			}
		});
	},
	deleteProductCatalogsLib: function(libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Product Catalog Library ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_CATALOG_LIB_BASE_URL + libraryId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadProductCatalogsLibs(companyId, onView);			
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Delete product catalog  library failure');			
			}
		});	
	},
	loadCategoriesOfProductCatalogsLib: function(libraryId, libraryName, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Product Catalog Categories ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_CATALOG_LIB_BASE_URL + libraryId + '/categories.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var categoryData = Ext.decode(data.responseText);
				Ext.getStore('productCatalog.ProductCatalogsCategoriesTreeStore').setRootNode(
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
				console.log('Load product catalog categories failure');			
			}
		});
	},
	loadCategoriesOfProductCatalogsCategory: function(categoryId, categoryTreeNode, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Product Catalog Categories ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_CATALOG_CATEGORY_BASE_URL + categoryId + '/categories.json',
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
				console.log('Load Product Catalog categories failure');			
			}
		});
	},
	loadProductsOfProductCatalogsLib: function(libraryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Products ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_CATALOG_LIB_BASE_URL + libraryId + '/products.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var productData = Ext.decode(data.responseText);
				Ext.getStore('productCatalog.Products').loadRawData(productData);
				Ext.getStore('productCatalog.Products').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading products failure');			
			}
		});
	},
	loadProductsOfProductCatalogsCategory: function(categoryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Products ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_CATALOG_CATEGORY_BASE_URL + categoryId + '/products.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var classificationData = Ext.decode(data.responseText);
				Ext.getStore('productCatalog.Products').loadRawData(classificationData);
				Ext.getStore('productCatalog.Products').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading products failure');			
			}
		});
	},
	addNewProductCatalogsCategory: function(url, categoryName, categoryDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Product Catalog Category ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				product_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.AddingChildOnProductCatalogNode.data.id !== 'root') {
					var node = MYOCD.SharedData.AddingChildOnProductCatalogNode;
					node.expand(false, function() {
						me.loadCategoriesOfProductCatalogsCategory(node.data.id, node, onView);
					});
				} else {
					me.loadCategoriesOfProductCatalogsLib(
						MYOCD.SharedData.currentProductCatalogLibId, 
						MYOCD.SharedData.AddingChildOnProductCatalogNode.data.name, 
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
				console.log('Create product catalog category failure');			
			}
		});
	},
	editProductCatalogsCategory: function(categoryName, categoryDesc, onView){
		var me = this;
		if(onView) {
			onView.setLoading('Updating products Category ...');
		}
		var categoryId = MYOCD.SharedData.currentProductCatalogsCategoryNodeContextMenu.data.id;
		Ext.Ajax.request({
			url: PRODUCT_CATALOG_CATEGORY_BASE_URL + categoryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				product_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				MYOCD.SharedData.currentProductCatalogsCategoryNodeContextMenu.set('name', categoryName);
				MYOCD.SharedData.currentProductCatalogsCategoryNodeContextMenu.set('description', categoryDesc);
				MYOCD.SharedData.currentProductCatalogsCategoryNodeContextMenu.commit();
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update products category failure');			
			}
		});

	},
	deleteProductCatalogsCategory: function(onView){
		var me = this;
		if(onView) {
			onView.setLoading('Deleting products Category ...');
		}
		var categoryId = MYOCD.SharedData.currentProductCatalogsCategoryNodeContextMenu.data.id;
		var deleteNode = MYOCD.SharedData.currentProductCatalogsCategoryNodeContextMenu;
		Ext.Ajax.request({
			url: PRODUCT_CATALOG_CATEGORY_BASE_URL + categoryId + '.json',
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
				if(deleteNode == MYOCD.SharedData.currentProductCatalogsCategory) {
					MYOCD.SharedData.currentProductCatalogsCategory = null;
					Ext.getStore('productCatalog.Products').removeAll();
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
				console.log('Update products category failure');			
			}
		});
	},
	addNewProduct: function(url, productName, productDesc, objectTypeIds, objectTypeVersion, associatedParam, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Product ...');
		}
		var data = {
			product: {
				name: productName,
				description: productDesc				
			},
			object_type_ids: objectTypeIds,
			version_id: objectTypeVersion
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
				if(MYOCD.SharedData.currentProductCatalogsCategory == null || MYOCD.SharedData.currentProductCatalogsCategory.data.id == 'root') {
					me.loadProductsOfProductCatalogsLib(MYOCD.SharedData.currentProductCatalogLibId, onView);
					
				} else {
					me.loadProductsOfProductCatalogsCategory(MYOCD.SharedData.currentProductCatalogsCategory.data.id, onView);
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
				console.log('Create product failure');			
			}
		});
	},
	editProduct: function(productId, productName, productDesc, objectTypeIds, objectTypeVersion, associatedParam, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Product ...');
		}
		var data = {
			product: {
				name: productName,
				description: productDesc				
			},
			object_type_ids: objectTypeIds,
			version_id: objectTypeVersion
		}
		if (Object.keys(associatedParam).length > 0) {
			data.associated_object_type_ids = associatedParam;
		}
		Ext.Ajax.request({
			url: PRODUCT_BASE_URL + productId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: data,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentProductCatalogsCategory == null || MYOCD.SharedData.currentProductCatalogsCategory.data.id == 'root') {
					me.loadProductsOfProductCatalogsLib(MYOCD.SharedData.currentProductCatalogLibId, onView);
					
				} else {
					me.loadProductsOfProductCatalogsCategory(MYOCD.SharedData.currentProductCatalogsCategory.data.id, onView);
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
				console.log('Update product failure');			
			}
		});
	},
	deleteProduct: function(productId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Product ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_BASE_URL + productId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentProductCatalogsCategory == null || MYOCD.SharedData.currentProductCatalogsCategory.data.id == 'root') {
					me.loadProductsOfProductCatalogsLib(MYOCD.SharedData.currentProductCatalogLibId, onView);
					
				} else {
					me.loadProductsOfProductCatalogsCategory(MYOCD.SharedData.currentProductCatalogsCategory.data.id, onView);
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
				console.log('Delete product failure');			
			}
		});
	},
	getProductInfo: function(productId, callBack, onView) {
		if(onView) {
			onView.setLoading('Loading product information ...');
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
			url: PRODUCT_BASE_URL + productId + '.json' + associatedTypeParam,
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var product = Ext.decode(data.responseText);
				if(callBack) {
					callBack(product);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Load product information failure');			
			}
		});
	},
	loadAttributeOfProduct: function(productId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Product Attributes ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_BASE_URL + productId + '/attributes.json?associated_object_type_keys[]=cost_info&associated_object_type_keys[]=scheduling_info',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				Ext.getStore('productCatalog.ProductAttributes').removeAll();
				var product = Ext.decode(data.responseText);
				for(var i = 0; i < product.attributes.length; i++) {
					var att = product.attributes[i];
					att.isInherited = false;
					if (att.type_group && att.type_group.length == 0) {
						att.type_group = 'General';
					}
					Ext.getStore('productCatalog.ProductAttributes').add(att);
				}
				for(var i = 0; i < product.inherited_attributes.length; i++) {
					var att = product.inherited_attributes[i];
					att.isInherited = true;
					if (att.type_group && att.type_group.length == 0) {
						att.type_group = 'General';
					}
					Ext.getStore('productCatalog.ProductAttributes').add(att);
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
			url: PRODUCT_BASE_URL + productId + '/attributes.json',
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
		data.object_type_ids = null;
		Ext.Ajax.request({
			url: PRODUCT_BASE_URL + productId + '.json',
			method: 'PUT',
			jsonData: data,
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadAttributeOfProduct(MYOCD.SharedData.currentProductCatalogProduct.id, onView);
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
				me.loadAttributeOfProduct(MYOCD.SharedData.currentProductCatalogProduct.id, onView);
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
				me.loadAttributeOfProduct(MYOCD.SharedData.currentProductCatalogProduct.id, onView);
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
	copyProductCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			MYOCD.SharedData.productCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Copying Product Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = PRODUCT_CATALOG_CATEGORY_BASE_URL + sourceFeature.data.id + '/copy/' + MYOCD.SharedData.currentProductCatalogLibId + '.json';  
		} else {
			url = PRODUCT_CATALOG_CATEGORY_BASE_URL + sourceCategory.data.id + '/copy/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.productCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfProductCatalogsLib(MYOCD.SharedData.currentProductCatalogLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfProductCatalogsCategory(destCategory.data.id, destCategory, onView)
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
	moveProductCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			var treePanel = MYOCD.SharedData.currentProductCategoryTree;
			treePanel.ownerCt.getView().removeRowCls(MYOCD.SharedData.productCategorySourceNode,'opacity-treenode');
			MYOCD.SharedData.productCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Moving Product Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = PRODUCT_CATALOG_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + MYOCD.SharedData.currentProductCatalogLibId + '.json';  
		} else {
			url = PRODUCT_CATALOG_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + destCategory.data.id + '.json';
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
				var store = MYOCD.SharedData.productCategorySourceNode.stores[0];
				store.remove (MYOCD.SharedData.productCategorySourceNode);
				MYOCD.SharedData.productCategorySourceNode.destroy();
				if(MYOCD.SharedData.productCategorySourceNode == MYOCD.SharedData.currentProductCatalogsCategory) {
					MYOCD.SharedData.currentProductCatalogsCategory = null;
					Ext.getStore('productCatalog.Products').removeAll();
				}
				MYOCD.SharedData.productCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfProductCatalogsLib(MYOCD.SharedData.currentProductCatalogLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfProductCatalogsCategory(destCategory.data.id, destCategory, onView)
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
	moveProduct: function(productId, destCategory, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Moving Permission ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = PRODUCT_BASE_URL + productId + '/move/' + MYOCD.SharedData.currentProductCatalogLibId + '.json';  
		} else {
			url = PRODUCT_BASE_URL + productId + '/move/' + destCategory.data.id + '.json';
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
				MYOCD.SharedData.currentProductCatalogsCategory = destCategory;
				if(MYOCD.SharedData.currentProductCatalogsCategory.data.id == 'root') {
                	me.loadProductsOfProductCatalogsLib(MYOCD.SharedData.currentProductCatalogLibId, onView);
				} else {
					me.loadProductsOfProductCatalogsCategory(MYOCD.SharedData.currentProductCatalogsCategory.data.id, onView);
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
	importProductCatalogLibraries: function(libraryId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Importing Library ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_CATALOG_LIB_BASE_URL + 'import.json',
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
				me.loadProductCatalogsLibs(MYOCD.SharedData.currentCompanyId, onView);
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
	getProductsOfProductCatalogByView: function(productCatalogId, viewId, onView, callback) {
		var me = this;
		if (onView) {
			onView.setLoading('Loading Products ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_CATALOG_LIB_BASE_URL + productCatalogId + '/products.json?view_id=' + viewId,
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
				console.log('Load Features failure');	
			}
		});
	},
	getProductsOfProductCategoryByView: function(productCategoryId, viewId, onView, callback) {
		var me = this;
		if (onView) {
			onView.setLoading('Loading Products ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_CATALOG_CATEGORY_BASE_URL + productCategoryId + '/products.json?view_id=' + viewId,
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
				console.log('Load Features failure');	
			}
		});
	}
});