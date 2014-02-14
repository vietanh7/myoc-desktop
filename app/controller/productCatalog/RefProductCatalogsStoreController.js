Ext.define('MYOCD.controller.productCatalog.RefProductCatalogsStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadPublicProductCatalogsLibraries: function(searchText, onView) {
		if(onView) {
			onView.setLoading('Loading Public Product Catalogs Libraries ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_CATALOG_LIB_BASE_URL + 'search/' + searchText + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var libraryData = Ext.decode(data.responseText);
				Ext.getStore('productCatalog.PublicProductCatalogLibs').loadRawData(libraryData); 
				Ext.getStore('productCatalog.PublicProductCatalogLibs').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading product Catalogs libraries failure');			
			}
		});
	},
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
                Ext.getStore('productCatalog.RefProductCatalogLibs').loadRawData(productData); 
                Ext.getStore('productCatalog.RefProductCatalogLibs').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading product catalogs libraries failure');
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
				Ext.getStore('productCatalog.RefProductCatalogsCategoriesTreeStore').setRootNode(
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
				Ext.getStore('productCatalog.RefProducts').loadRawData(productData);
				Ext.getStore('productCatalog.RefProducts').sort([
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
				Ext.getStore('productCatalog.RefProducts').loadRawData(classificationData);
				Ext.getStore('productCatalog.RefProducts').sort([
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
});