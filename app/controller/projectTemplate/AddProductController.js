Ext.define('MYOCD.controller.projectTemplate.AddProductController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'projectTemplatesTab',
			selector: 'projectTemplatesTab'
		},
		{
			ref: 'projectTemplateAddProduct',
			selector: 'projectTemplateAddProduct'
		},
		{
			ref: 'projectTemplateAddProductSelectParent',
			selector: 'projectTemplateAddProductSelectParent'
		}
	],
	init: function() {
		this.control({
			'projectTemplateManager tool[name="projectTemplateAddProductTool"]': {
				click: this.onProjectTemplateAddProductToolClick
			},
			'projectTemplateAddProduct button[name="selectParentProductBtn"]': {
				click: this.onSelectParentProductBtnClick
			},
			'projectTemplateAddProductSelectParent dataview[name="addProductRefProductCatalogDataView"]': {
				itemdblclick: this.onAddProductRefProductCatalogDataViewItemDblClick
			},
			'projectTemplateAddProductSelectParent button[name="addProductBackBtn"]': {
				click: this.onAddProductBackBtnClick
			},
			'projectTemplateAddProductSelectParent treepanel[name="addProductRefProductCategoriesTree"]': {
				itemclick: this.onAddProductRefProductCategoriesTreeItemClick,
				itemexpand: this.onAddProductRefProductCategoriesTreeItemExpand,
			},
			'projectTemplateAddProductSelectParent dataview[name="addProductRefProductDataView"]': {
				render: this.onAddProductRefProductDataViewRender,
				itemclick: this.onAddProductRefProductDataViewClick,
				itemdblclick: this.onAddProductRefProductDataViewClick
			},
			'projectTemplateAddProductSelectParent button[name="addProductAcceptParentBtn"]': {
				click: this.onAddProductAcceptParentBtnClick
			},
			'projectTemplateAddProduct button[name="clearParentProductBtn"]': {
				click: this.onClearParentProductBtnClick
			},
			'projectTemplateAddProduct button[name="addNewProductBtn"]': {
				click: this.onAddNewProductBtnClick
			},
			'projectTemplateAddProduct button[name="updateProductBtn"]': {
				click: this.onUpdateProductBtnClick
			}
		});
	},
	onProjectTemplateAddProductToolClick: function() {
		if(this.getProjectTemplateAddProductSelectParent()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.projectTemplate.ProjectTemplateAddProductSelectParent');
		popup.show();
		var refProductCatalogStoreController = MYOCD.controller.productCatalog.RefProductCatalogsStoreController;
		refProductCatalogStoreController.loadProductCatalogsLibs(MYOCD.SharedData.currentCompanyId, popup);
		
	},
	onSelectParentProductBtnClick: function() {
		if(this.getProjectTemplateAddProductSelectParent()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.projectTemplate.ProjectTemplateAddProductSelectParent');
		popup.show();
		var refProductCatalogStoreController = MYOCD.controller.productCatalog.RefProductCatalogsStoreController;
		refProductCatalogStoreController.loadProductCatalogsLibs(MYOCD.SharedData.currentCompanyId, popup);
	},
	onAddProductRefProductCatalogDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefProductCatalogLibId = record.get('id');
		this.getProjectTemplateAddProductSelectParent().down('panel[name="addProductRefProductCatalogPanel"]').setVisible(false);
		this.getProjectTemplateAddProductSelectParent().down('panel[name="addProductRefProductPanel"]').setVisible(true);
		var refProductCatalogStoreController = MYOCD.controller.productCatalog.RefProductCatalogsStoreController;
		refProductCatalogStoreController.loadCategoriesOfProductCatalogsLib(record.get('id'), record.get('name'), this.getProjectTemplateAddProductSelectParent());
		refProductCatalogStoreController.loadProductsOfProductCatalogsLib(record.get('id'));
	},
	onAddProductBackBtnClick: function() {
		this.getProjectTemplateAddProductSelectParent().down('panel[name="addProductRefProductCatalogPanel"]').setVisible(true);
		this.getProjectTemplateAddProductSelectParent().down('panel[name="addProductRefProductPanel"]').setVisible(false)
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
			this.getProjectTemplateAddProductSelectParent().destroy();
			return;
		}
		
		this.getProjectTemplateAddProduct().down('textfield[name="parentProduct"]').setValue(MYOCD.SharedData.currentRefProduct.name);
		this.getProjectTemplateAddProduct().down('textfield[name="parentProductId"]').setValue(MYOCD.SharedData.currentRefProduct.id);
		this.getProjectTemplateAddProduct().down('button[name="clearParentProductBtn"]').setVisible(true);
		this.getProjectTemplateAddProductSelectParent().destroy();
		MYOCD.SharedData.currentRefProduct = null;
	},
	onClearParentProductBtnClick: function() {
		this.getProjectTemplateAddProduct().down('textfield[name="parentProduct"]').setValue('');
		this.getProjectTemplateAddProduct().down('textfield[name="parentProductId"]').setValue('');
		this.getProjectTemplateAddProduct().down('button[name="clearParentProductBtn"]').setVisible(false);
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
		var productName = this.getProjectTemplateAddProduct().down('textfield[name="productName"]').getValue();
		var productDesc = this.getProjectTemplateAddProduct().down('textfield[name="productDesc"]').getValue();
		var productParentId = this.getProjectTemplateAddProduct().down('textfield[name="parentProductId"]').getValue();
		if (productName.length == 0) {
			return;
		}
		productParentId = productParentId.length > 0 ? productParentId : null;
		var url;
		if (MYOCD.SharedData.currentProjectTemplateFeature == null || MYOCD.SharedData.currentProjectTemplateFeature.data.id == 'root') {
			url = PROJECT_TEMPLATE_BASE_URL + MYOCD.SharedData.currentProjectTemplateId + '/productitems.json';
		} else {
			url = FEATURE_BASE_URL + MYOCD.SharedData.currentProjectTemplateFeature.data.id + '/productitems.json';
		}
		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		projectTemplateStoreController.addNewProduct(url, productName, productDesc, productParentId, this.getProjectTemplatesTab());
		this.getProjectTemplateAddProduct().destroy();
	},
	onUpdateProductBtnClick: function() {
		var productId = this.getProjectTemplateAddProduct().down('textfield[name="productId"]').getValue();
		var productName = this.getProjectTemplateAddProduct().down('textfield[name="productName"]').getValue();
		var productDesc = this.getProjectTemplateAddProduct().down('textfield[name="productDesc"]').getValue();
		var productParentId = this.getProjectTemplateAddProduct().down('textfield[name="parentProductId"]').getValue();
		if (productName.length == 0) {
			return;
		}
		productParentId = productParentId.length > 0 ? productParentId : null;
		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		projectTemplateStoreController.editProduct(productId, productName, productDesc, productParentId, this.getProjectTemplatesTab());
		this.getProjectTemplateAddProduct().destroy();
	}
});