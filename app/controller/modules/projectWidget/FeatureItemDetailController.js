Ext.define('MYOCD.controller.modules.projectWidget.FeatureItemDetailController',{
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
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'projectAddProductSelectParent',
			selector: 'projectAddProductSelectParent'
		},
		{
			ref: 'projectProductItemAttributes',
			selector: 'projectProductItemAttributes'
		}
	],
	mainXtype: '',
	productsGrid: 'grid[name="projectProductGrid"]',
	productsDataView: 'dataview[name="projectProductDataview"]',
	getMainXtype: function() {
		var me = this;
		return Ext.ComponentQuery.query(me.mainXtype)[0];
	},
	getComponent: function(component) {
		var me = this;
		return Ext.ComponentQuery.query(me.mainXtype + ' ' + component)[0];
	},
	init: function() {
		console.log('Feature Item Detail Controller init');

		var controller = new Object();
		controller[this.mainXtype + ' featureItemDetailPaneWidget tabpanel[name="mainTabPanel"]'] = {
			render: this.onMainTabPanelRender
		}
		controller[this.mainXtype + ' featureItemDetailPaneWidget dataview[name="projectProductDataview"]'] = {
			render: this.onProjectProductDataViewRender,
			itemcontextmenu: this.onProjectProductDataviewItemContextMenu,
			containercontextmenu: this.onProjectProductDataViewContextMenu,
			itemdblclick: this.onProjectProductDataViewItemDblClick,
			// itemclick: this.onProjectProductDataViewItemClick
		}
		controller[this.mainXtype + ' featureItemDetailPaneWidget grid[name="projectProductGrid"]'] = {
			render: this.onProjectProductGridRender,
			itemcontextmenu: this.onProjectProductDataviewItemContextMenu,
			containercontextmenu: this.onProjectProductDataViewContextMenu,
			itemdblclick: this.onProjectProductDataViewItemDblClick,
			// itemclick: this.onProjectProductDataViewItemClick
		}
		controller[this.mainXtype + ' featureItemDetailPaneWidget tool[name="projectToggleViewTool"]'] = {
			click: this.onProjectToggleViewToolClick
		}
		controller[this.mainXtype + ' tool[name="projectAddProductTool"]'] = {
			click: this.onProjectAddProductToolClick
		}
		this.application = MYOCD.SharedData.application;
		this.control(controller);
	},
	onMainTabPanelRender: function() {
		var store = new Ext.data.Store({
			model: 'MYOCD.model.project.ProjectProduct'
		});
		this.getComponent(this.productsGrid).bindStore(store);
		this.getComponent(this.productsDataView).bindStore(store);
	},
	onProjectProductDataviewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		var editProductFunc = function () {
			var popup = Ext.create('MYOCD.view.modules.projectWidget.EditProjectProductWidget');
			popup.down('textfield[name="productId"]').setValue(record.data.id);
			popup.down('textfield[name="productName"]').setValue(record.data.name);
			popup.down('textfield[name="productDesc"]').setValue(record.data.description);
			// popup.down('button[name="addNewProductBtn"]').setVisible(false);
			popup.down('button[name="updateProductBtn"]').setVisible(true);
			popup.productRecord = record;
			popup.show();
			var callback = function(product) {
				if(product.products.length > 0) {
					var parentProduct = product.products[0];
					popup.down('textfield[name="parentProduct"]').setValue(parentProduct.name);
					popup.down('textfield[name="parentProductId"]').setValue(parentProduct.id);
				}
				if (null != product.cost_info) {
					popup.down('textfield[name="productPrice"]').setValue(product.cost_info.price);
					popup.down('textfield[name="productQuantity"]').setValue(product.cost_info.quantity);
				}
				
			}
			projectStoreController.getProductInfo(record.data.id, callback, popup);
		}
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: editProductFunc
				},
				{
					text: 'Delete',
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Delete Product',
						    msg: 'Do you really want to delete this product?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
								   var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
								   projectStoreController.deleteProductRecord(record);
							    }
						    }
						});
					}
				},
				{
					text: 'Security',
					handler: function() {
						if(me.getAuthorizationDialog()) {
							me.getAuthorizationDialog().destroy();
						}
						var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
						popup.down('textfield[name="baseUrl"]').setValue(PRODUCT_ITEMS_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	}, 
	onProjectProductDataViewContextMenu: function(dataView, e, eOpts) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Add Product',
					handler: function() {
						if(me.getProjectAddProductSelectParent()) {
							Ext.WindowManager.bringToFront(me.getProjectAddProductSelectParent());
							return;
						}
						var popup = Ext.create('MYOCD.view.project.ProjectAddProductSelectParent');
						popup.show();
						var refProductCatalogStoreController = MYOCD.controller.productCatalog.RefProductCatalogsStoreController;
						refProductCatalogStoreController.loadProductCatalogsLibs(MYOCD.SharedData.currentCompanyId, popup);
					}
				}
			]
		}).showAt(e.xy);
	},
	onProjectToggleViewToolClick: function(tool) {
		var isDataView = tool.cls == 'listview-icon'?true:false;
		if(isDataView) {
			tool.removeCls('listview-icon');
			tool.addCls('dataview-icon');
			tool.cls = 'dataview-icon';
		} else {
			tool.removeCls('dataview-icon');
			tool.addCls('listview-icon');
			tool.cls = 'listview-icon';
		}
		this.getComponent(this.productsDataView).setVisible(!isDataView);
		this.getComponent(this.productsGrid).setVisible(isDataView);
	},
	onProjectProductDataViewRender: function(dataview, e, eOpts) {
		var me = this;
		dataview.dropZone = new Ext.dd.DropZone(dataview.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.productData) {
					return false;
				}
				var projectExplorerWidget = me.getMainXtype().down('projectExplorerWidget');
				if (!projectExplorerWidget) return false;
				var selectedFeatureNode = projectExplorerWidget.down('treepanel[name="projectFeaturesTree"]').getSelectionModel().getSelection()[0];
				if (!selectedFeatureNode) {
					Ext.Msg.alert('Error!', 'Please select a feature first');
					return false;
				}
	            var productData = dragData.productData;
	            var url;
				if (MYOCD.SharedData.currentProjectFeature == null || MYOCD.SharedData.currentProjectFeature.data.id == 'root') {
					url = PROJECT_BASE_URL + MYOCD.SharedData.currentProjectId + '/productitems.json';
				} else {
					url = FEATURE_BASE_URL + MYOCD.SharedData.currentProjectFeature.data.id + '/productitems.json';
				}
	            var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
	            projectStoreController.addNewProductToFeatureNode(url, productData.name, productData.description, productData.id.toString(), selectedFeatureNode, dataview.getStore(), me.getProjectEstimating());
	            return true;
	        }

		});
	},
	onProjectProductGridRender: function(grid, e, eOpts) {
		var me = this;
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.productData) {
					return false;
				}
				var projectExplorerWidget = me.getMainXtype().down('projectExplorerWidget');
				if (!projectExplorerWidget) return false;
				var selectedFeatureNode = projectExplorerWidget.down('treepanel[name="projectFeaturesTree"]').getSelectionModel().getSelection()[0];
				if (!selectedFeatureNode) {
					Ext.Msg.alert('Error!', 'Please select a feature first');
					return false;
				}
	            var productData = dragData.productData;
	            var url;
				if (MYOCD.SharedData.currentProjectFeature == null || MYOCD.SharedData.currentProjectFeature.data.id == 'root') {
					url = PROJECT_BASE_URL + MYOCD.SharedData.currentProjectId + '/productitems.json';
				} else {
					url = FEATURE_BASE_URL + MYOCD.SharedData.currentProjectFeature.data.id + '/productitems.json';
				}
	            var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
	            projectStoreController.addNewProductToFeatureNode(url, productData.name, productData.description, productData.id.toString(), selectedFeatureNode, grid.getStore(), me.getProjectEstimating());
	            return true;
	        }

		});
	},
	onProjectProductDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		if(this.getProjectProductItemAttributes()) {
			return;
		}
		MYOCD.SharedData.currentProduct = record.data;
		var popup = Ext.create('MYOCD.view.project.ProjectProductItemAttributes');
		popup.show();
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectStoreController.loadAttributeOfProduct(record.get('id'), popup);
	},
	onProjectAddProductToolClick: function() {
		var me = this;
		if(me.getProjectAddProductSelectParent()) {
			Ext.WindowManager.bringToFront(me.getProjectAddProductSelectParent());
			return;
		}
		var popup = Ext.create('MYOCD.view.project.ProjectAddProductSelectParent');
		popup.show();
		var refProductCatalogStoreController = MYOCD.controller.productCatalog.RefProductCatalogsStoreController;
		refProductCatalogStoreController.loadProductCatalogsLibs(MYOCD.SharedData.currentCompanyId, popup);
	}
});