Ext.define('MYOCD.controller.project.AddProductController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'projectEstimating',
			selector: 'projectEstimating'
		},
		{
			ref: 'projectAddProduct',
			selector: 'projectAddProduct'
		},
		{
			ref: 'projectAddProductSelectParent',
			selector: 'projectAddProductSelectParent'
		}
	],
	init: function() {
		this.control({
			'projectEstimating tool[name="projectAddProductTool"]': {
				click: this.onProjectAddProductToolClick
			},
			'projectAddProduct button[name="selectParentProductBtn"]': {
				click: this.onSelectParentProductBtnClick
			},
			'projectAddProductSelectParent dataview[name="addProductRefProductCatalogDataView"]': {
				itemdblclick: this.onAddProductRefProductCatalogDataViewItemDblClick
			},
			'projectAddProductSelectParent button[name="addProductBackBtn"]': {
				click: this.onAddProductBackBtnClick
			},
			'projectAddProductSelectParent treepanel[name="addProductRefProductCategoriesTree"]': {
				itemclick: this.onAddProductRefProductCategoriesTreeItemClick,
				itemexpand: this.onAddProductRefProductCategoriesTreeItemExpand,
			},
			'projectAddProductSelectParent dataview[name="addProductRefProductDataView"]': {
				render: this.onAddProductRefProductDataViewRender,
				itemclick: this.onAddProductRefProductDataViewClick,
				itemdblclick: this.onAddProductRefProductDataViewClick
			},
			'projectAddProductSelectParent button[name="addProductAcceptParentBtn"]': {
				click: this.onAddProductAcceptParentBtnClick
			},
			'projectAddProduct button[name="clearParentProductBtn"]': {
				click: this.onClearParentProductBtnClick
			},
			'projectAddProduct button[name="addNewProductBtn"]': {
				click: this.onAddNewProductBtnClick
			},
			'projectAddProduct button[name="updateProductBtn"]': {
				click: this.onUpdateProductBtnClick
			}
		});
	},
	onProjectAddProductToolClick: function() {
		if(this.getProjectAddProductSelectParent()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.project.ProjectAddProductSelectParent');
		popup.show();
		var refProductCatalogStoreController = MYOCD.controller.productCatalog.RefProductCatalogsStoreController;
		refProductCatalogStoreController.loadProductCatalogsLibs(MYOCD.SharedData.currentCompanyId, popup);
	},
	onSelectParentProductBtnClick: function() {
		if(this.getProjectAddProductSelectParent()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.project.ProjectAddProductSelectParent');
		popup.show();
		var refProductCatalogStoreController = MYOCD.controller.productCatalog.RefProductCatalogsStoreController;
		refProductCatalogStoreController.loadProductCatalogsLibs(MYOCD.SharedData.currentCompanyId, popup);
	},
	onAddProductRefProductCatalogDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefProductCatalogLibId = record.get('id');
		this.getProjectAddProductSelectParent().down('panel[name="addProductRefProductCatalogPanel"]').setVisible(false);
		this.getProjectAddProductSelectParent().down('panel[name="addProductRefProductPanel"]').setVisible(true);
		var refProductCatalogStoreController = MYOCD.controller.productCatalog.RefProductCatalogsStoreController;
		refProductCatalogStoreController.loadCategoriesOfProductCatalogsLib(record.get('id'), record.get('name'), this.getProjectAddProductSelectParent());
		refProductCatalogStoreController.loadProductsOfProductCatalogsLib(record.get('id'));
	},
	onAddProductBackBtnClick: function() {
		this.getProjectAddProductSelectParent().down('panel[name="addProductRefProductCatalogPanel"]').setVisible(true);
		this.getProjectAddProductSelectParent().down('panel[name="addProductRefProductPanel"]').setVisible(false)
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
			this.getProjectAddProductSelectParent().destroy();
			return;
		}
		
		this.getProjectAddProduct().down('textfield[name="parentProduct"]').setValue(MYOCD.SharedData.currentRefProduct.name);
		this.getProjectAddProduct().down('textfield[name="parentProductId"]').setValue(MYOCD.SharedData.currentRefProduct.id);
		this.getProjectAddProduct().down('button[name="clearParentProductBtn"]').setVisible(true);
		this.getProjectAddProductSelectParent().destroy();
		MYOCD.SharedData.currentRefProduct = null;
	},
	onClearParentProductBtnClick: function() {
		this.getProjectAddProduct().down('textfield[name="parentProduct"]').setValue('');
		this.getProjectAddProduct().down('textfield[name="parentProductId"]').setValue('');
		this.getProjectAddProduct().down('button[name="clearParentProductBtn"]').setVisible(false);
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
		var productName = this.getProjectAddProduct().down('textfield[name="productName"]').getValue();
		var productDesc = this.getProjectAddProduct().down('textfield[name="productDesc"]').getValue();
		var productParentId = this.getProjectAddProduct().down('textfield[name="parentProductId"]').getValue();
		if (productName.length == 0) {
			return;
		}
		productParentId = productParentId.length > 0 ? productParentId : null;
		var url;
		if (MYOCD.SharedData.currentProjectFeature == null || MYOCD.SharedData.currentProjectFeature.data.id == 'root') {
			url = PROJECT_BASE_URL + MYOCD.SharedData.currentProjectId + '/productitems.json';
		} else {
			url = FEATURE_BASE_URL + MYOCD.SharedData.currentProjectFeature.data.id + '/productitems.json';
		}
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectStoreController.addNewProduct(url, productName, productDesc, productParentId, this.getProjectEstimating());
		this.getProjectAddProduct().destroy();
	},
	onUpdateProductBtnClick: function() {
		var productId = this.getProjectAddProduct().down('textfield[name="productId"]').getValue();
		var productName = this.getProjectAddProduct().down('textfield[name="productName"]').getValue();
		var productDesc = this.getProjectAddProduct().down('textfield[name="productDesc"]').getValue();
		var productParentId = this.getProjectAddProduct().down('textfield[name="parentProductId"]').getValue();
		var productPrice = this.getProjectAddProduct().down('textfield[name="productPrice"]').getValue();
		var productQuantity = this.getProjectAddProduct().down('textfield[name="productQuantity"]').getValue();
		if (productName.length == 0) {
			return;
		}
		productParentId = productParentId.length > 0 ? productParentId : null;
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectStoreController.editProduct(productId, productName, productDesc, productParentId, productPrice, productQuantity, this.getProjectEstimating());
		this.getProjectAddProduct().destroy();
	}
});