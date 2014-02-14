Ext.define('MYOCD.controller.featureTemplate.AddProductController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'featureTemplatesTab',
			selector: 'featureTemplatesTab'
		},
		{
			ref: 'featureTemplateAddProduct',
			selector: 'featureTemplateAddProduct'
		},
		{
			ref: 'featureTemplateAddProductSelectParent',
			selector: 'featureTemplateAddProductSelectParent'
		}
	],
	init: function() {
		this.control({
			'featureTemplateManager tool[name="featureTemplateAddProductTool"]': {
				click: this.onFeatureTemplateAddProductToolClick
			},
			'featureTemplateAddProduct button[name="selectParentProductBtn"]': {
				click: this.onSelectParentProductBtnClick
			},
			'featureTemplateAddProductSelectParent dataview[name="addProductRefProductCatalogDataView"]': {
				itemdblclick: this.onAddProductRefProductCatalogDataViewItemDblClick
			},
			'featureTemplateAddProductSelectParent button[name="addProductBackBtn"]': {
				click: this.onAddProductBackBtnClick
			},
			'featureTemplateAddProductSelectParent treepanel[name="addProductRefProductCategoriesTree"]': {
				itemclick: this.onAddProductRefProductCategoriesTreeItemClick,
				itemexpand: this.onAddProductRefProductCategoriesTreeItemExpand,
			},
			'featureTemplateAddProductSelectParent dataview[name="addProductRefProductDataView"]': {
				render: this.onAddProductRefProductDataViewRender,
				itemclick: this.onAddProductRefProductDataViewClick,
				itemdblclick: this.onAddProductRefProductDataViewClick
			},
			'featureTemplateAddProductSelectParent button[name="addProductAcceptParentBtn"]': {
				click: this.onAddProductAcceptParentBtnClick
			},
			'featureTemplateAddProduct button[name="clearParentProductBtn"]': {
				click: this.onClearParentProductBtnClick
			},
			'featureTemplateAddProduct button[name="addNewProductBtn"]': {
				click: this.onAddNewProductBtnClick
			},
			'featureTemplateAddProduct button[name="updateProductBtn"]': {
				click: this.onUpdateProductBtnClick
			}
		});
	},
	onFeatureTemplateAddProductToolClick: function() {
		if(this.getFeatureTemplateAddProductSelectParent()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.featureTemplate.FeatureTemplateAddProductSelectParent');
		popup.show();
		var refProductCatalogStoreController = MYOCD.controller.productCatalog.RefProductCatalogsStoreController;
		refProductCatalogStoreController.loadProductCatalogsLibs(MYOCD.SharedData.currentCompanyId, popup);
		
	},
	onSelectParentProductBtnClick: function() {
		if(this.getFeatureTemplateAddProductSelectParent()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.featureTemplate.FeatureTemplateAddProductSelectParent');
		popup.show();
		var refProductCatalogStoreController = MYOCD.controller.productCatalog.RefProductCatalogsStoreController;
		refProductCatalogStoreController.loadProductCatalogsLibs(MYOCD.SharedData.currentCompanyId, popup);
	},
	onAddProductRefProductCatalogDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefProductCatalogLibId = record.get('id');
		this.getFeatureTemplateAddProductSelectParent().down('panel[name="addProductRefProductCatalogPanel"]').setVisible(false);
		this.getFeatureTemplateAddProductSelectParent().down('panel[name="addProductRefProductPanel"]').setVisible(true);
		var refProductCatalogStoreController = MYOCD.controller.productCatalog.RefProductCatalogsStoreController;
		refProductCatalogStoreController.loadCategoriesOfProductCatalogsLib(record.get('id'), record.get('name'), this.getFeatureTemplateAddProductSelectParent());
		refProductCatalogStoreController.loadProductsOfProductCatalogsLib(record.get('id'));
	},
	onAddProductBackBtnClick: function() {
		this.getFeatureTemplateAddProductSelectParent().down('panel[name="addProductRefProductCatalogPanel"]').setVisible(true);
		this.getFeatureTemplateAddProductSelectParent().down('panel[name="addProductRefProductPanel"]').setVisible(false)
		MYOCD.SharedData.currentRefProductCatalogLibId = null;
		Ext.getStore('productCatalog.RefProducts').removeAll();
		Ext.getStore('productCatalog.RefProductCatalogsCategoriesTreeStore').setRootNode(null);
		Ext.getStore('productCatalog.RefProductCatalogsCategoriesTreeStore').removeAll();;
	},
	onAddProductRefProductCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
		var refProductCatalogStoreController = MYOCD.controller.productCatalog.RefProductCatalogsStoreController;
		
		if(record.get('id')!=='root') {
			refProductCatalogStoreController.loadProductsOfProductCatalogsCategory(record.get('id'));
		} else {
			refProductCatalogStoreController.loadProductsOfProductCatalogsLib(MYOCD.SharedData.currentRefProductCatalogLibId);
		}
    },
	onAddProductRefProductCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		var refProductCatalogStoreController = MYOCD.controller.productCatalog.RefProductCatalogsStoreController;
		if(categoryNode.data.id !== 'root') {
			refProductCatalogStoreController.loadProductsOfProductCatalogsCategory(categoryNode.data.id);
			refProductCatalogStoreController.loadCategoriesOfProductCatalogsCategory(categoryNode.data.id, categoryNode);
		} else {
			refProductCatalogStoreController.loadProductsOfProductCatalogsLib(MYOCD.SharedData.currentRefProductCatalogLibId);
		}
	},
	onAddProductRefProductDataViewClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefProduct = record.data;
	},
	onAddProductAcceptParentBtnClick: function() {
		if(!MYOCD.SharedData.currentRefProduct) {
			this.getFeatureTemplateAddProductSelectParent().destroy();
			return;
		}
		
		this.getFeatureTemplateAddProduct().down('textfield[name="parentProduct"]').setValue(MYOCD.SharedData.currentRefProduct.name);
		this.getFeatureTemplateAddProduct().down('textfield[name="parentProductId"]').setValue(MYOCD.SharedData.currentRefProduct.id);
		this.getFeatureTemplateAddProduct().down('button[name="clearParentProductBtn"]').setVisible(true);
		this.getFeatureTemplateAddProductSelectParent().destroy();
		MYOCD.SharedData.currentRefProduct = null;
	},
	onClearParentProductBtnClick: function() {
		this.getFeatureTemplateAddProduct().down('textfield[name="parentProduct"]').setValue('');
		this.getFeatureTemplateAddProduct().down('textfield[name="parentProductId"]').setValue('');
		this.getFeatureTemplateAddProduct().down('button[name="clearParentProductBtn"]').setVisible(false);
	}, 
	onAddProductRefProductDataViewRender: function(dataview, e, eOpts) {
		dataview.dragZone = new Ext.dd.DragZone(dataview.getEl(), {
	        getDragData: function(e) {
	            var sourceEl = e.getTarget(dataview.itemSelector, 10);
	            if (sourceEl) {
	                d = sourceEl.cloneNode(true);
	                d.id = Ext.id();
	                return dataview.dragData = {
	                    sourceEl: sourceEl,
	                    repairXY: Ext.fly(sourceEl).getXY(),
	                    ddel: d,
	                    productData: dataview.getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });	
	}, 
	onAddNewProductBtnClick: function() {
		var productName = this.getFeatureTemplateAddProduct().down('textfield[name="productName"]').getValue();
		var productDesc = this.getFeatureTemplateAddProduct().down('textfield[name="productDesc"]').getValue();
		var productParentId = this.getFeatureTemplateAddProduct().down('textfield[name="parentProductId"]').getValue();
		if (productName.length == 0) {
			return;
		}
		productParentId = productParentId.length > 0 ? productParentId : null;
		var url;
		if (MYOCD.SharedData.currentFeatureTemplateFeature == null || MYOCD.SharedData.currentFeatureTemplateFeature.data.id == 'root') {
			url = FEATURE_TEMPLATE_BASE_URL + MYOCD.SharedData.currentFeatureTemplateId + '/productitems.json';
		} else {
			url = FEATURE_BASE_URL + MYOCD.SharedData.currentFeatureTemplateFeature.data.id + '/productitems.json';
		}
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplateStoreController.addNewProduct(url, productName, productDesc, productParentId, this.getFeatureTemplatesTab());
		this.getFeatureTemplateAddProduct().destroy();
	},
	onUpdateProductBtnClick: function() {
		var productId = this.getFeatureTemplateAddProduct().down('textfield[name="productId"]').getValue();
		var productName = this.getFeatureTemplateAddProduct().down('textfield[name="productName"]').getValue();
		var productDesc = this.getFeatureTemplateAddProduct().down('textfield[name="productDesc"]').getValue();
		var productParentId = this.getFeatureTemplateAddProduct().down('textfield[name="parentProductId"]').getValue();
		if (productName.length == 0) {
			return;
		}
		productParentId = productParentId.length > 0 ? productParentId : null;
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplateStoreController.editProduct(productId, productName, productDesc, productParentId, this.getFeatureTemplatesTab());
		this.getFeatureTemplateAddProduct().destroy();
	}
});