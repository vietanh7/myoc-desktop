Ext.define('MYOCD.controller.productCatalog.ProductCatalogsLibraryManagerController',{
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
			ref: 'productCatalogsLibManager',
			selector: 'productCatalogsLibManager'
		},
		{
			ref: 'productCatalogsCategoriesTree',
			selector: 'productCatalogsLibManager treepanel[name="productCatalogsCategoriesTree"]'
		},
		{
			ref: 'newProduct',
			selector: 'newProduct'
		},
		{
			ref: 'editProductCatalogCategory',
			selector: 'editProductCatalogCategory'
		},
		{
			ref: 'productAttributes',
			selector: 'productAttributes'
		},
		{
			ref: 'productAttributes',
			selector: 'productAttributes'
		},
		{
			ref: 'productOwnedAtts',
			selector: 'productOwnedAtts'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'attributeAction',
			selector: 'attributeAction'
		}
	],
	init: function() {
		this.control({
			'productCatalogsLibManager button[name="productCatalogsLibsBackButton"]': {
				click: this.onProductCatalogsLibsBackButtonClick
			},
			'productCatalogsLibManager treepanel[name="productCatalogsCategoriesTree"]': {
				render: this.onProductCatalogsCategoriesTreeRender,
				itemclick: this.onProductCatalogsCategoriesTreeItemClick,
				itemexpand: this.onProductCatalogsCategoriesTreeItemExpand,
				itemcontextmenu: this.onProductCatalogsCategoriesTreeItemContext,
				containercontextmenu: this.onProductCatalogsCategoriesTreeContextMenu,
				edit: this.onProductCatalogsCategoriesTreeEdit,
				canceledit: this.onProductCatalogsCategoriesTreeCancelEdit
			},
			'productCatalogsLibManager tool[name="addNewProductCatalogCategoryTool"]': {
				click: this.onAddNewProductCatalogCategoryToolClick
			},
			'productCatalogsLibManager dataview[name="productsDataView"]': {
				itemcontextmenu: this.onProductsDataViewItemContextMenu,
				containercontextmenu: this.onProductsDataViewContextMenu,
				itemdblclick: this.onProductDataViewItemDblClick,
				render: this.onProductsDataViewRender,
				itemclick: this.onProductDataViewItemClick
			},
			'productCatalogsLibManager tool[name="addNewProductTool"]' : {
				click: this.onAddNewProductToolClick
			},
			'productCatalogsLibManager tool[name="productCatalogsLibraryToggleViewTool"]': {
				click: this.onProductCatalogsLibraryToggleViewToolClick
			},
			'productCatalogsLibManager grid[name="productsGrid"]': {
				itemcontextmenu: this.onProductsDataViewItemContextMenu,
				containercontextmenu: this.onProductsDataViewContextMenu,
				itemdblclick: this.onProductDataViewItemDblClick,
				render: this.onProductsGridRender,
				itemclick: this.onProductDataViewItemClick
			},
			'editProductCatalogCategory button[name="updateProductCatalogCategoryBtn"]': {
				click: this.onUpdateProductCatalogCategoryBtnClick
			},
			'productOwnedAtts button[name="createProductAttBtn"]': {
				click: this.onCreateProductAttBtnClick
			},
			'productOwnedAtts grid[name="productOwnedAttsGrid"]': {
				render: this.onProductOwnedAttsGridRender,
				itemcontextmenu: this.onProductOwnedAttsGridItemContextMenu,
				edit: this.onProductOwnedAttsGridEdit,
				beforeedit: this.onProductOwnedAttsGridBeforeEdit
			},
			'productOwnedAtts': {
				removeinheritedattribute: this.onProductOwnedAttsRemoveInheritedAttribute
			},
			'productCatalogsLibManager treepanel tool[name="productCatalogCategoryAuthorTool"]': {
				click: this.onProductCatalogCategoryAuthorToolClick
			},
			'productCatalogsLibManager tool[name="productAuthorTool"]': {
				click: this.onProductAuthorToolClick
			} 
		});
	},
	createToolTipForGrid: function(grid) {
		grid.tip = Ext.create('Ext.tip.ToolTip', {
	        // The overall target element.
	        target: grid.el,
	        // Each grid row causes its own seperate show and hide.
	        delegate: grid.getView().itemSelector,
	        // Moving within the row should not hide the tip.
	        trackMouse: true,
	        // Render immediately so that tip.body can be referenced prior to the first show.
	        renderTo: Ext.getBody(),
	        listeners: {
	            // Change content dynamically depending on which element triggered the show.
	            beforeshow: function (tip, eOpts) {
	                var desc = grid.getView().getRecord(tip.triggerElement).get('description');
	                if(desc && desc.length > 0){
	                	tip.update(desc);
	                } else {
	                	tip.update('');
	                    tip.on('show', function(){
	                    	Ext.defer(tip.hide, 1, tip);
	                    }, tip, {single: true});
	                }
	            }
	        }
	    });
	},
	onProductCatalogsLibsBackButtonClick: function() {
		this.getProductCatalogsTab().down('grid[name="productCatalogLibrariesGrid"]').setVisible(true);
		this.getProductCatalogsTab().down('productCatalogsLibManager').setVisible(false);
		MYOCD.SharedData.currentProductCatalogsCategory = null;
		Ext.getStore('productCatalog.Products').removeAll();
		Ext.getStore('productCatalog.ProductCatalogsCategoriesTreeStore').setRootNode(null);
		Ext.getStore('productCatalog.ProductCatalogsCategoriesTreeStore').removeAll();
	},
	onProductCatalogsCategoriesTreeRender: function( treePanel, eOpts ) {
		var me = this;
		var rowEditingPlugin = treePanel.getPlugin('cellEditingPlugin');
    	rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'celldblclick');
    	
    	treePanel.dropZone = new Ext.dd.DropZone(treePanel.el, {

	    	getTargetFromEvent: function(e) {
	            return e.getTarget(treePanel.getView().rowSelector);
	        },
	
	        onNodeEnter : function(target, dd, e, data){
		        var record =  treePanel.getView().getRecord(target);
		        record.expand();
	            Ext.fly(target).addCls('my-row-highlight-class');
	        },
	
	        onNodeOut : function(target, dd, e, data){
	            Ext.fly(target).removeCls('my-row-highlight-class');
	        },

	        onNodeOver : function(target, dd, e, data){
	            return Ext.dd.DropZone.prototype.dropAllowed;
	        },
	        
	        onNodeDrop : function(target, dd, e, data){
	        	var record =  treePanel.getView().getRecord(target);
	        	MYOCD.SharedData.currentProductCategoryTreeDropNode = record;
	        	if(data.productData) {
	        		treePanel.getSelectionModel().select(record);
	        		var productCatalogStoreCtl = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
	        		productCatalogStoreCtl.moveProduct(data.productData.id, record, me.getProductCatalogsTab());
	        		return true;
	        	} else {
		        	return false
	        	}
	            return true;
	        }
	    });
	},
	onProductCatalogsCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
	    MYOCD.SharedData.currentProductCatalogsCategory = record;
		var productCatalogStoreCtl = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
		
		if(record.get('id')!=='root') {
			productCatalogStoreCtl.loadProductsOfProductCatalogsCategory(record.get('id'));
		} else {
			productCatalogStoreCtl.loadProductsOfProductCatalogsLib(MYOCD.SharedData.currentProductCatalogLibId);
		}
		//MYOCD.SharedData.currentProduct = null;
    },
    onProductCatalogsCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		MYOCD.SharedData.currentProductCatalogsCategory = categoryNode;
		var productCatalogStoreCtl = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
		if(categoryNode.data.id !== 'root') {
			productCatalogStoreCtl.loadProductsOfProductCatalogsCategory(categoryNode.data.id);
			productCatalogStoreCtl.loadCategoriesOfProductCatalogsCategory(categoryNode.data.id, categoryNode);
		} else {
			productCatalogStoreCtl.loadProductsOfProductCatalogsLib(MYOCD.SharedData.currentClassificationsLibId);
		}
		//MYOCD.SharedData.currentProduct = null;
	},
	onProductCatalogsCategoriesTreeItemContext: function( treePanel, record, item, index, e, eOpts ) {
		var me = this;
		MYOCD.SharedData.currentProductCatalogsCategoryNodeContextMenu = record;
		e.stopEvent()
		var newCateFunc = function () {
			record.expand(false, function () {
				record.appendChild(
					{
						id: -1,
						name: ''
					}
				);
				var newRecord = record.findChildBy(
					function(child) {
		    			return child.raw.id == -1;
					}
				);
				MYOCD.SharedData.AddingChildOnProductCatalogNode = record;
				treePanel.ownerCt.getPlugin('cellEditingPlugin').startEdit(newRecord, treePanel.ownerCt.columns[0]);
			});
		}
		var editCateFunc = function() {
			if(me.getEditProductCatalogCategory()) {
				return;
			}
			var popup = Ext.create('MYOCD.view.productCatalog.EditProductCatalogCategory');
			popup.down('textfield[name="productCatalogCategoryName"]').setValue(record.get('name'));
			popup.down('textfield[name="productCatalogCategoryDesc"]').setValue(record.get('description'));
			popup.show();
		}
		var deleteCateFunc = function() {
			Ext.Msg.confirm({
			    title: 'Delete Category',
			    msg: 'Do you really want to delete this category?',
			    width: 200,
			    buttons: Ext.Msg.YESNO,
			    icon: Ext.Msg.QUESTION,
			    fn: function(btn) {
				    if(btn == 'yes') {
					    var productCatalogStoreCtl = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
					    productCatalogStoreCtl.deleteProductCatalogsCategory();
				    }
			    }
			});
		}
		var copyCateFunc = function() {
			MYOCD.SharedData.productCategorySourceNode = record;
			MYOCD.SharedData.productCategorySourceNode.isCut = false;
		}
		var cutCateFunc = function() {
			MYOCD.SharedData.productCategorySourceNode = record;
			treePanel.ownerCt.getView().addRowCls(record,'opacity-treenode');
			MYOCD.SharedData.currentProductCategoryTree = treePanel;
			MYOCD.SharedData.productCategorySourceNode.isCut = true;
		}
		var pasteCateFunc = function() {
			var productCatalogStoreCtl = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
			if(MYOCD.SharedData.productCategorySourceNode.isCut) {
				productCatalogStoreCtl.moveProductCategory(MYOCD.SharedData.productCategorySourceNode, record, me.getProductCatalogsTab());
			} else {
				productCatalogStoreCtl.copyProductCategory(MYOCD.SharedData.productCategorySourceNode, record, me.getProductCatalogsTab());

			}
		}
		var securityFunc = function() {
			if(me.getAuthorizationDialog()) {
				me.getAuthorizationDialog().destroy();
			}		
			var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
			if (record.data.id == 'root') {
				popup.down('textfield[name="baseUrl"]').setValue(PRODUCT_CATALOG_LIB_BASE_URL);
				popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentProductCatalogLibId);
			} else {
				popup.down('textfield[name="baseUrl"]').setValue(PRODUCT_CATALOG_CATEGORY_BASE_URL);
				popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
			}
			popup.show(); 
		}
		if(record.get('id') !== 'root') {
			var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Category',
						handler: newCateFunc
					},
					{
						xtype: 'menuseparator'	
					},
					{
						text: 'Copy',
						handler: copyCateFunc
					},
					{
						text: 'Cut',
						handler: cutCateFunc	
					},
					{
						text: 'Paste',
						disabled: MYOCD.SharedData.productCategorySourceNode == null,
						handler: pasteCateFunc	
					},
					{
						xtype: 'menuseparator'	
					},
					{
						text: 'Edit',
						handler: editCateFunc
					},
					{
						text: 'Delete',
						handler: deleteCateFunc
					},
					'-',
					{
						text: 'Security',
						handler: securityFunc
					},
					'-',
					{
						text: 'Show Product by Views',
						menu: {
							xtype: 'menu',
							name: 'showByViewMenu'
						}
					}
				]
			});
			for (var i = 0; i < Ext.getStore('company.WorkspaceViews').data.items.length; i++) {
				menu.down('menu[name="showByViewMenu"]').add(
				{
                	xtype: 'menuitem',
                	text: Ext.getStore('company.WorkspaceViews').data.items[i].data.name,
                	viewId: Ext.getStore('company.WorkspaceViews').data.items[i].data.id,
                	handler: function(menu) {
                    	var popup = Ext.create('MYOCD.view.productCatalog.GetProductsByView');
                    	popup.down('textfield[name="viewId"]').setValue(this.viewId);
                    	if(record.get('id') == 'root') {
							popup.down('textfield[name="productCatalogId"]').setValue(MYOCD.SharedData.currentProductCatalogLibId);
						} else {
							popup.down('textfield[name="productCategoryId"]').setValue(record.data.id);
						}
                    	popup.show();
                	}
            	});
			}
			menu.showAt(e.xy);
		} else {
			var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Category',
						handler: newCateFunc
					},
					{
						xtype: 'menuseparator'	
					},
					{
						text: 'Paste',
						disabled: MYOCD.SharedData.productCategorySourceNode == null,
						handler: pasteCateFunc	
					},
					'-',
					{
						text: 'Security',
						handler: securityFunc
					},
					'-',
					{
						text: 'Show Product by Views',
						menu: {
							xtype: 'menu',
							name: 'showByViewMenu'
						}
					}
				]
			});
			for (var i = 0; i < Ext.getStore('company.WorkspaceViews').data.items.length; i++) {
				menu.down('menu[name="showByViewMenu"]').add(
				{
                	xtype: 'menuitem',
                	text: Ext.getStore('company.WorkspaceViews').data.items[i].data.name,
                	viewId: Ext.getStore('company.WorkspaceViews').data.items[i].data.id,
                	handler: function(menu) {
                    	var popup = Ext.create('MYOCD.view.productCatalog.GetProductsByView');
                    	popup.down('textfield[name="viewId"]').setValue(this.viewId);
                    	if(record.get('id') == 'root') {
							popup.down('textfield[name="productCatalogId"]').setValue(MYOCD.SharedData.currentProductCatalogLibId);
						} else {
							popup.down('textfield[name="productCategoryId"]').setValue(record.data.id);
						}
                    	popup.show();
                	}
            	});
			}
			menu.showAt(e.xy);
		}
	},
	onProductCatalogsCategoriesTreeContextMenu: function(treePanel, e, eOpts) {
		e.stopEvent();
	},
	onProductCatalogsCategoriesTreeEdit: function(editor, e, eOpts) {
		var data = e.record.data;
	    var url;
	    if(data.parentId !== 'root') {
		    url = PRODUCT_CATALOG_CATEGORY_BASE_URL + data.parentId + '/categories.json'
	    } else {
		    url = PRODUCT_CATALOG_LIB_BASE_URL + MYOCD.SharedData.currentProductCatalogLibId  + '/categories.json'
	    }
	    var categoryName = data.name;
	    if(categoryName.trim().length == 0){
		    Ext.Msg.alert('Missing Category Name', 'Please enter category name');
		    e.record.stores[0].remove(e.record);
		    e.record.destroy();
		    return;
	    }
	    
	    var productCatalogStoreCtl = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
		productCatalogStoreCtl.addNewProductCatalogsCategory(url, categoryName, '', this.getProductCatalogsTab());
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onProductCatalogsCategoriesTreeCancelEdit: function(editor, e, eOpts) {
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onAddNewProductCatalogCategoryToolClick: function() {
		var me = this;
		if(MYOCD.SharedData.currentProductCatalogsCategory == null || MYOCD.SharedData.currentProductCatalogsCategory.data.id == 'root') {
			var root = Ext.getStore('productCatalog.ProductCatalogsCategoriesTreeStore').getRootNode();
			root.expand(false, function () {
				root.appendChild(
					{
						id: -1,
						name: ''
					}
				);
				var newRecord = root.findChildBy(
					function(child) {
		    			return child.raw.id == -1;
					}
				);
				MYOCD.SharedData.AddingChildOnProductCatalogNode = root;
				me.getProductCatalogsCategoriesTree().getPlugin('cellEditingPlugin').startEdit(
					newRecord, me.getProductCatalogsCategoriesTree().columns[0]);
			});
		} else {
			var record = MYOCD.SharedData.currentProductCatalogsCategory;
			record.expand(false, function () {
				record.appendChild(
					{
						id: -1,
						name: ''
					}
				);
				var newRecord = record.findChildBy(
					function(child) {
		    			return child.raw.id == -1;
					}
				);
				MYOCD.SharedData.AddingChildOnProductCatalogNode = record;
				me.getProductCatalogsCategoriesTree().getPlugin('cellEditingPlugin').startEdit(
					newRecord, me.getProductCatalogsCategoriesTree().columns[0]);
			});
		}
	},
	onProductsDataViewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: function() {
						if(me.getNewProduct()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.productCatalog.NewProduct');
						popup.setTitle('Edit Product');
						popup.down('textfield[name="productId"]').setValue(record.get('id'));
						popup.down('textfield[name="productName"]').setValue(record.get('name'));
						popup.down('textfield[name="productDesc"]').setValue(record.get('description'));
						popup.down('button[name="updateProductBtn"]').hidden = false;
						popup.down('button[name="createNewProductBtn"]').hidden = true;
						
						var callback = function(product) {
							var parentStore = popup.down('grid[name="parentObjectTypesGrid"]').getStore();
							parentStore.removeAll();
							if(product.object_types.length > 0) {
								for (var i = 0; i < product.object_types.length; i++) {
									var parent = new Object();
									parent.id = product.object_types[i].id;
									parent.name = product.object_types[i].name;
									parent.type_group = product.object_types[i].type_group;
									parentStore.add(parent);
								}
							}
						}
						popup.show();
						var productCatalogStoreCtl = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
						productCatalogStoreCtl.getProductInfo(record.data.id, callback, popup);
						
					}
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
								    var productCatalogStoreCtl = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
								    productCatalogStoreCtl.deleteProduct(record.get('id'), me.getProductCatalogsTab());
							    }
						    }
						});
					}
				},
				'-',
				{
					text: 'Security',
					handler: function() {
						if(me.getAuthorizationDialog()) {
							me.getAuthorizationDialog().destroy();
						}
						var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
						popup.down('textfield[name="baseUrl"]').setValue(PRODUCT_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	},
	onProductsDataViewContextMenu: function(dataview, e, eOpts) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Add New Product',
					handler: function() {
						if(me.getNewProduct()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.productCatalog.NewProduct');
						var parentStore = popup.down('grid[name="parentObjectTypesGrid"]').getStore();
						parentStore.removeAll();
						popup.show();
					}
				}
			]
		}).showAt(e.xy);
	},
	onProductDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		console.log('Product atributes');
		if(this.getProductAttributes()) {
			return;
		}
		MYOCD.SharedData.currentProductCatalogProduct = record.data;
		var popup = Ext.create('MYOCD.view.productCatalog.ProductAttributes');
		popup.show();
		var productCatalogStoreCtl = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
		productCatalogStoreCtl.loadAttributeOfProduct(record.get('id'), popup);
	},
	onAddNewProductToolClick: function() {
		var me = this;
		if(me.getNewProduct()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.productCatalog.NewProduct');
		var parentStore = popup.down('grid[name="parentObjectTypesGrid"]').getStore();
		parentStore.removeAll();
		popup.show();
	},
	onProductCatalogsLibraryToggleViewToolClick: function(tool) {
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
		this.getProductCatalogsLibManager().down('dataview[name="productsDataView"]').setVisible(!isDataView);
		this.getProductCatalogsLibManager().down('grid[name="productsGrid"]').setVisible(isDataView);
	},
	onUpdateProductCatalogCategoryBtnClick: function() {
		var categoryName = this.getEditProductCatalogCategory().down('textfield[name="productCatalogCategoryName"]').getValue();
		var categoryDesc = this.getEditProductCatalogCategory().down('textfield[name="productCatalogCategoryDesc"]').getValue();
		if(categoryName.length == 0) {
			return;
		}
		this.getEditProductCatalogCategory().destroy();

		var productCatalogStoreCtl = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
		productCatalogStoreCtl.editProductCatalogsCategory(categoryName, categoryDesc, this.getProductCatalogsTab());
	},
	onProductsDataViewRender: function(dataview, eOpts) {
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
	onProductsGridRender: function(grid, eOpts) {
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
	                    productData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onCreateProductAttBtnClick: function() {
		var attributeName = this.getProductOwnedAtts().down('textfield[name="productAttName"]').getValue();
		var attributeDesc = this.getProductOwnedAtts().down('textfield[name="productAttDesc"]').getValue(); 
		var attributeValueType = this.getProductOwnedAtts().down('combobox[name="productAttValueType"]').getValue();
		var attributeHidden = this.getProductOwnedAtts().down('checkboxfield[name="productAttHiddenCheck"]').getValue();
		var attributeConstant = this.getProductOwnedAtts().down('checkboxfield[name="productAttConstantCheck"]').getValue();
		var attributeMandatory = this.getProductOwnedAtts().down('checkboxfield[name="productAttMandatoryCheck"]').getValue();
		var attributeDeprecated = this.getProductOwnedAtts().down('checkboxfield[name="productAttDeprecatedCheck"]').getValue();
		var attributeDefaultValue = this.getProductOwnedAtts().down('textfield[name="productAttDefaultValue"]').getValue();
		
		if(attributeName.length == 0) {
			return;
		}
		var setActionPermission = this.getProductOwnedAtts().down('setActionPermission');
		var callBack = function(newAttribute) {
			setActionPermission.fireEvent('setPermissionForAction', setActionPermission, newAttribute.id);
		}
		var productCatalogStoreCtl = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
		productCatalogStoreCtl.addNewProductAttribute(MYOCD.SharedData.currentProductCatalogProduct.id, attributeName, attributeDesc, attributeValueType, attributeHidden, 
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, this.getProductAttributes(), callBack);
	},
	onProductOwnedAttsGridRender: function(grid, e, eOpts) {
		this.createToolTipForGrid(grid);	
	}, 
	onProductOwnedAttsGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		if(record.get('isInherited')) {
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
						    title: 'Delete Attribute',
						    msg: 'Do you really want to delete this attribute?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
								   var productCatalogStoreCtl = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
								   productCatalogStoreCtl.deleteProductAttribute( record.data.id, me.getProductAttributes());
							    }
						    }
						});
					}
				},
				{
					text: 'Actions Permissions',
					handler: function() {
						if (me.getAttributeAction()) {
							me.getAttributeAction().destroy();
						}
						var popup = Ext.create('MYOCD.view.attributeAction.AttributeAction');
						popup.down('textfield[name="attributeId"]').setValue(record.data.id);
						popup.show();
					}
				}
			]
		}).showAt(e.xy);
	},
	onProductOwnedAttsGridEdit: function(editor, e, eOpts) {
		var attribute = e.record.data;
		var productCatalogStoreCtl = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
		
		productCatalogStoreCtl.editProductAttributeValue(MYOCD.SharedData.currentProductCatalogProduct.id, attribute.id, attribute.value, this.getProductAttributes());
		// productCatalogStoreCtl.editProductAttribute(attribute.id, attribute.name, attribute.description, attribute.value_type, attribute.hidden, 
		// attribute.constant, attribute.mandatory, attribute.deprecated, attribute.default_value, this.getProductAttributes());
	},
	onProductOwnedAttsGridBeforeEdit: function (editor, e, eOpts) {
		return !e.record.data.constant;
	},
	onProductOwnedAttsRemoveInheritedAttribute: function(grid, record) {
		var me = this;
		Ext.Msg.confirm({
		    title: 'Delete Attribute',
		    msg: 'Do you really want to delete this attribute?',
		    width: 200,
		    buttons: Ext.Msg.YESNO,
		    icon: Ext.Msg.QUESTION,
		    fn: function(btn) {
			    if(btn == 'yes') {
				   var productCatalogStoreCtl = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
				   productCatalogStoreCtl.deleteProductAttribute( record.data.id, me.getProductAttributes());
			    }
		    }
		});
	},
	onProductCatalogCategoryAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}		
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		if (!MYOCD.SharedData.currentProductCatalogsCategory || MYOCD.SharedData.currentProductCatalogsCategory.data.id == 'root') {
			popup.down('textfield[name="baseUrl"]').setValue(PRODUCT_CATALOG_LIB_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentProductCatalogLibId);
		} else {
			popup.down('textfield[name="baseUrl"]').setValue(PRODUCT_CATALOG_CATEGORY_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentProductCatalogsCategory.data.id);
		}
		popup.show(); 
	},
	onProductDataViewItemClick: function( dataview, record, item, index, e, eOpts ) {
		//MYOCD.SharedData.currentProduct = record.data;
	},
	onProductAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}
		if (!MYOCD.SharedData.currentProduct) {
			return;
		}
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		popup.down('textfield[name="baseUrl"]').setValue(PRODUCT_BASE_URL);
		popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentProduct.id);
		popup.show(); 
	}
});