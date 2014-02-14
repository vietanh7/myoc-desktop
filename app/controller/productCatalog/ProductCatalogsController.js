Ext.define('MYOCD.controller.productCatalog.ProductCatalogsController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'productCatalogsTab',
			selector: 'productCatalogsTab'
		},
		{
			ref: 'newProductCatalogsLibrary',
			selector: 'newProductCatalogsLibrary'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'importPublicProductCatalogLibrary',
			selector: 'importPublicProductCatalogLibrary'
		}
	],
	init: function() {
		this.control({
			'productCatalogsTab': {
				show: this.onProductCatalogsTabShow
			},
			'productCatalogsTab grid[name="productCatalogLibrariesGrid"]': {
				render: this.onProductCatalogLibrariesGridRender,
				itemdblclick: this.onProductCatalogLibrariesGridItemDblClick,
				itemcontextmenu: this.onProductCatalogLibrariesGridItemContextMenu,
				edit: this.onProductCatalogLibrariesGridEdit	
			},
			'productCatalogsTab grid[name="productCatalogLibrariesGrid"] tool[name="newProductCatalogsLibTool"]': {
				click: this.onNewProductCatalogsLibToolClick
			},
			'newProductCatalogsLibrary button[name="createNewProductCatalogLibraryBtn"]': {
				click: this.onCreateNewProductCatalogLibraryBtnClick
			},
			'importPublicProductCatalogLibrary grid[name="publicProductCatalogLibsGrid"]': {
				render: this.onPublicProductCatalogLibsGridRender
			}
		});
	},
	onProductCatalogsTabShow: function() {
		var productCatalogStore = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
        productCatalogStore.loadProductCatalogsLibs(MYOCD.SharedData.currentCompanyId);
	},
	onProductCatalogLibrariesGridRender: function(grid, eOpts) {
		var rowEditingPlugin = grid.getPlugin('rowEditingPlugin');
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'celldblclick'); 
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'itemdblclick'); 

   		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.publicProductCatalogLib) {
					return false;
				}
				var productCatalogStore = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
        		productCatalogStore.importProductCatalogLibraries(dragData.publicProductCatalogLib.id, grid);
	            return true;
	        }
		});
	},
	onNewProductCatalogsLibToolClick: function(tool, e, eOpts) {
		var me = this;
		var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Library',
						handler: function () {
							if(me.getNewProductCatalogsLibrary()) {
								Ext.WindowManager.bringToFront(me.getNewProductCatalogsLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.productCatalog.NewProductCatalogsLibrary');
							popup.down('textfield[name="productCatalogLibraryName"]').setValue(gCurrentWorkspaceName + ' Product Catalogs Library');
							popup.show();
						}
							
					},
					{
						text: 'Import Public Library',
						handler: function() {
							if(me.getImportPublicProductCatalogLibrary()) {
								Ext.WindowManager.bringToFront(me.getImportPublicProductCatalogLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.productCatalog.ImportPublicProductCatalogLibrary');
							popup.show();	
							MYOCD.controller.productCatalog.RefProductCatalogsStoreController.loadPublicProductCatalogsLibraries('all', popup);
						}
					}
				]
			}).showAt(e.browserEvent.x, e.browserEvent.y);
		
	},
	onCreateNewProductCatalogLibraryBtnClick: function() {
		var libraryName = this.getNewProductCatalogsLibrary().down('textfield[name="productCatalogLibraryName"]').getValue();
		var libraryDesc = this.getNewProductCatalogsLibrary().down('textfield[name="productCatalogLibraryDesc"]').getValue();
		var libraryAccess = this.getNewProductCatalogsLibrary().down('combobox[name="productCatalogLibraryAccess"]').getValue();
		if(libraryName.length == 0) {
			return;
		}
		this.getNewProductCatalogsLibrary().destroy();
		var productCatalogStore = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
		productCatalogStore.addNewProductCatalogsLib(libraryName, libraryDesc, libraryAccess, MYOCD.SharedData.currentCompanyId, this.getProductCatalogsTab());
	},
	onProductCatalogLibrariesGridItemDblClick: function( grid, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentProductCatalogLibId = record.get('id');
		this.getProductCatalogsTab().down('grid[name="productCatalogLibrariesGrid"]').setVisible(false);
		this.getProductCatalogsTab().down('productCatalogsLibManager').setVisible(true);
		var productCatalogStore = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
		productCatalogStore.loadCategoriesOfProductCatalogsLib(record.get('id'), record.get('name'), this.getProductCatalogsTab());
		productCatalogStore.loadProductsOfProductCatalogsLib(record.get('id'));
	},
	onProductCatalogLibrariesGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		if (record.get('imported')) {
			return;
		}
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: function() {
						grid.ownerCt.getPlugin('rowEditingPlugin').startEdit(record,0);
					}
				},
				{
					text: 'Delete',
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Delete Library',
						    msg: 'Do you really want to delete this library?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
								   var productCatalogStore = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
								   productCatalogStore.deleteProductCatalogsLib(
								    	record.data.id,
								    	MYOCD.SharedData.currentCompanyId,  
								    	me.getProductCatalogsTab());
							    }
						    }
						});
					}
				},
				'-',
				{
					text: 'Security',
					handler: function() {
						if (me.getAuthorizationDialog()) {
							me.getAuthorizationDialog().destroy();
						}
						var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
						popup.down('textfield[name="baseUrl"]').setValue(PRODUCT_CATALOG_LIB_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	},
	onProductCatalogLibrariesGridEdit: function(editor, e, eOpts) {
		var productCatalogStore = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
		productCatalogStore.editProductCatalogsLib(
			e.record.data.name, 
			e.record.data.description,
			e.record.data.access,
			e.record.data.id,
			MYOCD.SharedData.currentCompanyId, 
			this.getProductCatalogsTab());
	},
	onPublicProductCatalogLibsGridRender: function(grid, e, eOpts) {
		grid.dragZone = new Ext.dd.DragZone(grid.getEl(), {
	        getDragData: function(e) {
	            var sourceEl = e.getTarget(grid.getView().rowSelector, 10);
	            if (sourceEl) {
	                d = sourceEl.cloneNode(true);
	                d.id = Ext.id();
	                return grid.dragData = {
	                    sourceEl: sourceEl,
	                    repairXY: Ext.fly(sourceEl).getXY(),
	                    ddel: d,
	                    publicProductCatalogLib: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	}  	
});