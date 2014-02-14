Ext.define('MYOCD.controller.productCatalog.NewProductController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'productCatalogsTab',
			selector: 'productCatalogsTab'
		},
		{
			ref: 'newProduct',
			selector: 'newProduct'
		},
		{
			ref: 'newProductSelectParent',
			selector: 'newProductSelectParent'
		},
		{
			ref: 'newOTRefObjectTypesDataView',
			selector: 'newProductSelectParent dataview[name="newOTRefObjectTypesDataView"]'
		},
		{
			ref: 'newOTRefOTVersionGrid',
			selector: 'newProductSelectParent grid[name="newOTRefOTVersionGrid"]'
		}
	],
	init: function() {
		this.control({
			'newProduct tool[name="addParentTool"]': {
				click: this.onAddParentToolClick
			},
			'newProductSelectParent': {
				render: this.onNewProductSelectParentRender
			},
			'newProductSelectParent dataview[name="newOTRefOTLDataview"]': {
				itemdblclick: this.onNewOTRefOTLDataviewItemDblClick
			},
			'newProductSelectParent button[name="newOTRefOTLBackButton"]': {
				click: this.onNewOTRefOTLBackButtonClick
			},
			'newProductSelectParent treepanel[name="newOTRefObjectTypeCategoriesTree"]': {
				itemclick: this.onNewOTRefObjectTypeCategoriesTreeItemClick,
				itemexpand: this.onNewOTRefObjectTypeCategoriesTreeItemExpand
			},
			'newProductSelectParent dataview[name="newOTRefObjectTypesDataView"]': {
				itemclick: this.onNewOTRefObjectTypesDataViewClick,
				itemdblclick: this.onNewOTRefObjectTypesDataViewClick
			},
			'newProductSelectParent button[name="newOTAcceptParentBtn"]': {
				click: this.onNewOTAcceptParentBtnClick
			},
			'newProduct button[name="createNewProductBtn"]': {
				click: this.onCreateNewProductBtnClick
			},
			'newProduct button[name="updateProductBtn"]': {
				click: this.onUpdateProductBtnClick
			},
			'newProductSelectParent grid[name="newOTRefOTVersionGrid"]': {
				itemclick: this.onNewOTRefOTVersionGridItemClick,
				itemdblclick: this.onNewOTRefOTVersionGridItemClick
			}
		});
	},
	onAddParentToolClick: function() {
		if(this.getNewProductSelectParent()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.productCatalog.NewProductSelectParent');
		popup.show();
	},
	onNewProductSelectParentRender: function() {
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadObjectTypeLibraries(MYOCD.SharedData.currentCompanyId, this.getNewProductSelectParent());
	},
	onNewOTRefOTLDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefOTL = record.data;
		this.getNewProductSelectParent().down('panel[name="newOTRefOTLPanel"]').setVisible(false);
		this.getNewProductSelectParent().down('panel[name="newOTRefOTPanel"]').setVisible(true);
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadCategoriesOfObjectTypesLib(record.data.id, record.data.name, this.getNewProductSelectParent());
		refOTLStoreController.loadObjectTypesOfObjectTypeLib(record.data.id);
	},
	onNewOTRefOTLBackButtonClick: function() {
		this.getNewProductSelectParent().down('panel[name="newOTRefOTLPanel"]').setVisible(true);
		this.getNewProductSelectParent().down('panel[name="newOTRefOTPanel"]').setVisible(false);
		Ext.getStore('objectTypeLibrary.RefObjectTypes').removeAll();
		Ext.getStore('objectTypeLibrary.RefObjectTypeCategoriesTreeStore').setRootNode(null);
		Ext.getStore('objectTypeLibrary.RefObjectTypeCategoriesTreeStore').removeAll();
	},
	onNewOTRefObjectTypeCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		if(record.get('id')!=='root') {
			refOTLStoreController.loadObjectTypesOfObjectTypeCategory(record.get('id'));
		} else {
			refOTLStoreController.loadObjectTypesOfObjectTypeLib(MYOCD.SharedData.currentRefOTL.id);
		}
    },
    onNewOTRefObjectTypeCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		if(categoryNode.data.id !== 'root') {
			refOTLStoreController.loadObjectTypesOfObjectTypeCategory(categoryNode.data.id);
			refOTLStoreController.loadCategoriesOfObjectTypesCategory(categoryNode.data.id, categoryNode);
		} else {
			refOTLStoreController.loadObjectTypesOfObjectTypeLib(MYOCD.SharedData.currentRefOTL.id);
		}
	},
	onNewOTRefObjectTypesDataViewClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentSelectedRefOT = record.data;
		this.getNewOTRefOTVersionGrid().expand();
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadObjectTypeVersions(record.data.id, this.getNewOTRefOTVersionGrid());
	},
	onNewOTAcceptParentBtnClick: function() {
		if(!MYOCD.SharedData.currentSelectedRefOT) {
			this.getNewProductSelectParent().destroy();
			return;
		}
		var parent = new Object();
		parent.name = MYOCD.SharedData.currentSelectedRefOT.name;
		parent.id = MYOCD.SharedData.currentSelectedRefOT.id;
		if(MYOCD.SharedData.currentSelectRefOTVersion) {
			parent.version = MYOCD.SharedData.currentSelectRefOTVersion.data.name;
			parent.versionId = MYOCD.SharedData.currentSelectRefOTVersion.data.id
		} 
		var parentOrAssociated = this.getNewProductSelectParent().down('textfield[name="parentOrAssociated"]').getValue();
		if (parentOrAssociated.length > 0) {
			var store = MYOCD.SharedData.currentProductAssociatedStore;
			var record = store.findRecord('associatedType', parentOrAssociated);
			record.set('objectTypeId', parent.id);
			record.set('objectTypeName', parent.name);
			record.set('changed', true);			
			record.commit();
		} else {
			this.getNewProduct().down('grid[name="parentObjectTypesGrid"]').getStore().add(parent);
		}
		
		MYOCD.SharedData.currentSelectRefOTVersion = null;
		MYOCD.SharedData.currentSelectedRefOT = null;
		this.getNewProductSelectParent().destroy();
	},
	onCreateNewProductBtnClick: function() {
		var productName = this.getNewProduct().down('textfield[name="productName"]').getValue();
		var productDesc = this.getNewProduct().down('textfield[name="productDesc"]').getValue();
		var objectTypeIds = [];
		if(productName.length == 0) {
			return;
		}
		var parentStoreItems = this.getNewProduct().down('grid[name="parentObjectTypesGrid"]').getStore().data.items;
		for (var i = 0; i < parentStoreItems.length; i++) {
			objectTypeIds.push(parentStoreItems[i].data.id.toString());
		}

		var associatedTypeStore = this.getNewProduct().down('grid[name="associatedGrid"]').getStore();
		var associatedItems = associatedTypeStore.data.items;
		var associatedParam =  new Object();
		for (var i = 0; i < associatedItems.length; i++) {
			if (associatedItems[i].data.enabled && associatedItems[i].data.objectTypeId.toString().length > 0) {
				associatedParam[associatedItems[i].data.associatedType] = [associatedItems[i].data.objectTypeId.toString()];
			}
		}

		var objectTypeVersion = null;
		var url;
		if(MYOCD.SharedData.currentProductCatalogsCategory == null || MYOCD.SharedData.currentProductCatalogsCategory.data.id == 'root') {
			url = PRODUCT_CATALOG_LIB_BASE_URL + MYOCD.SharedData.currentProductCatalogLibId + '/products.json';
		} else {
			url = PRODUCT_CATALOG_CATEGORY_BASE_URL + MYOCD.SharedData.currentProductCatalogsCategory.data.id + '/products.json';
		}
		this.getNewProduct().down('grid[name="parentObjectTypesGrid"]').getStore().removeAll();
		this.getNewProduct().destroy();

		var productCatalogStoreCtl = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
		productCatalogStoreCtl.addNewProduct(url, productName, productDesc, objectTypeIds, objectTypeVersion, associatedParam, this.getProductCatalogsTab());
	},
	onUpdateProductBtnClick: function() {
		var productId = this.getNewProduct().down('textfield[name="productId"]').getValue();
		var productName = this.getNewProduct().down('textfield[name="productName"]').getValue();
		var productDesc = this.getNewProduct().down('textfield[name="productDesc"]').getValue();
		var objectTypeIds = [];
		if(productName.length == 0) {
			return;
		}
		var parentStoreItems = this.getNewProduct().down('grid[name="parentObjectTypesGrid"]').getStore().data.items;
		for (var i = 0; i < parentStoreItems.length; i++) {
			objectTypeIds.push(parentStoreItems[i].data.id.toString())
		}

		var associatedTypeStore = this.getNewProduct().down('grid[name="associatedGrid"]').getStore();
		var associatedItems = associatedTypeStore.data.items;
		var associatedParam =  new Object();
		for (var i = 0; i < associatedItems.length; i++) {
			if (associatedItems[i].data.enabled && associatedItems[i].data.objectTypeId.toString().length > 0) {
				associatedParam[associatedItems[i].data.associatedType] = [associatedItems[i].data.objectTypeId.toString()];
			}
		}

		var objectTypeVersion = null;
		this.getNewProduct().down('grid[name="parentObjectTypesGrid"]').getStore().removeAll();
		this.getNewProduct().destroy();
		
		var productCatalogStoreCtl = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
		productCatalogStoreCtl.editProduct(productId, productName, productDesc, objectTypeIds, objectTypeVersion, associatedParam, this.getProductCatalogsTab());
	},
	onNewOTRefOTVersionGridItemClick: function( grid, record, item, index, e, eOpts ) {
		if(MYOCD.SharedData.currentSelectRefOTVersion) {
			MYOCD.SharedData.currentSelectRefOTVersion.set('selected', false);
			MYOCD.SharedData.currentSelectRefOTVersion.commit();
		}
		if(MYOCD.SharedData.currentSelectRefOTVersion != record) {
			record.set('selected', true);
			record.commit();
			MYOCD.SharedData.currentSelectRefOTVersion = record;
		} else {
			MYOCD.SharedData.currentSelectRefOTVersion = null;
		}
		
	}
});