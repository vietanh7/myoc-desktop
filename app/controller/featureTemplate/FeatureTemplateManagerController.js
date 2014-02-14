Ext.define('MYOCD.controller.featureTemplate.FeatureTemplateManagerController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'featureTemplatesTab',
			selector: 'featureTemplatesTab'
		},
		{
			ref: 'featureTemplatesLibraryManager',
			selector: 'featureTemplatesLibraryManager'
		},
		{
			ref: 'featureTemplateManager',
			selector: 'featureTemplateManager'
		},
		{
			ref: 'featureTemplateFeatureTree',
			selector: 'featureTemplateManager treepanel[name="featureTemplateFeatureTree"]'
		},
		{
			ref: 'newFeature',
			selector: 'newFeature'
		},
		{
			ref: 'newFeatureTemplateFeatureFromOtls',
			selector: 'newFeatureTemplateFeatureFromOtls'
		},
		{
			ref: 'featureAttributes',
			selector: 'featureAttributes',
		},
		{
			ref: 'editFeature',
			selector: 'editFeature'
		},
		{
			ref: 'featureAttributes',
			selector: 'featureTemplateManager featureAttributes'
		},
		{
			ref: 'featureOwnedAttributes',
			selector: 'featureTemplateManager featureAttributes featureOwnedAttributes'
		},
		{
			ref: 'featureTemplateAddProduct',
			selector: 'featureTemplateAddProduct'
		},
		{
			ref: 'featureTemplateAddProductSelectParent',
			selector: 'featureTemplateAddProductSelectParent'
		},
		{
			ref: 'featureTemplateProductItemAttributes',
			selector: 'featureTemplateProductItemAttributes'
		},
		{
			ref: 'featureTemplateProductItemOwnedAtts',
			selector: 'featureTemplateProductItemOwnedAtts'
		},
		{
			ref: 'attributeAction',
			selector: 'attributeAction'
		}
	],
	init: function() {
		this.control({
			'featureTemplateManager button[name="featureTemplatesBackButton"]': {
				click: this.onFeatureTemplatesBackButtonClick
			},
			'featureTemplateManager treepanel[name="featureTemplateFeatureTree"]': {
				render: this.onFeatureTemplateFeaturesTreeRender,
				itemclick: this.onFeatureTemplateFeaturesTreeItemClick,
				itemexpand: this.onFeatureTemplateFeatureTreeItemExpand,
				itemcontextmenu: this.onFeatureTemplateFeatureTreeItemContextMenu,
				containercontextmenu: this.onFeatureTemplateFeaturesTreeContextMenu,
				edit: this.onFeatureTemplateFeaturesTreeEdit
			},
			'featureTemplateManager tool[name="featureTemplateFeatureTreeAddTool"]': {
				click: this.onFeatureTemplateFeatureTreeAddToolClick
			},
			'featureTemplateManager featureAttributes featureOwnedAttributes button[name="createFeatureAttBtn"]': {
				click: this.onCreateFeatureAttBtnClick
			},
			'featureTemplateManager featureAttributes featureOwnedAttributes grid[name="featureOwnedAttributesGrid"]': {
				render: this.onFeatureOwnedAttributesGridRender,
				itemcontextmenu: this.onFeatureOwnedAttributesGridItemContextMenu,
				beforeedit: this.onFeatureOwnedAttributesGridBeforeEdit,
				edit: this.onFeatureOwnedAttributesGridEdit,
			},
			'featureTemplateManager dataview[name="featureTemplateProductDataview"]': {
				render: this.onFeatureTemplateProductDataViewRender,
				itemcontextmenu: this.onfeatureTemplateProductDataviewItemContextMenu,
				containercontextmenu: this.onFeatureTemplateProductDataViewContextMenu,
				itemdblclick: this.onFeatureTemplateProductDataViewItemDblClick
			},
			'featureTemplateManager grid[name="featureTemplateProductGrid"]': {
				render: this.onFeatureTemplateProductGridRender,
				itemcontextmenu: this.onfeatureTemplateProductDataviewItemContextMenu,
				containercontextmenu: this.onFeatureTemplateProductDataViewContextMenu,
				itemdblclick: this.onFeatureTemplateProductDataViewItemDblClick
			},
			'featureTemplateManager tool[name="featureTemplateToggleViewTool"]': {
				click: this.onFeatureTemplateToggleViewToolClick
			},
			'featureTemplateProductItemOwnedAtts button[name="createProductAttBtn"]': {
				click: this.onCreateProductAttBtnClick
			},
			'featureTemplateProductItemOwnedAtts grid[name="productOwnedAttsGrid"]': {
				render: this.onProductOwnedAttsGridRender,
				itemcontextmenu: this.onProductOwnedAttsGridItemContextMenu,
				edit: this.onProductOwnedAttsGridEdit,
				beforeedit: this.onProductOwnedAttsGridBeforeEdit
			},
			'featureTemplateProductItemOwnedAtts': {
				removeinheritedattribute: this.onProductOwnedAttsRemoveInheritedAttribute
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
	onFeatureTemplatesBackButtonClick: function() {
		var me = this;
		me.getFeatureTemplatesLibraryManager().setVisible(true);
		me.getFeatureTemplateManager().setVisible(false);
		Ext.getStore('featureTemplate.FeatureAttributes').removeAll();
		Ext.getStore('featureTemplate.FeatureTemplateFeatureTreeStore').setRootNode(null);
		Ext.getStore('featureTemplate.FeatureTemplateFeatureTreeStore').removeAll();
		MYOCD.SharedData.featureTemplateSourceNode = null;
	},
	checkNameOnFeatureTreeNode: function(childItems, newItemName) {
		var exist = false;
		var count = 0;
		var name = newItemName;
		do {
			exist = false;
			for(var i = 0; i < childItems.length; i++) {
				if(childItems[i].data.name.trim().indexOf(name.trim()) == 0 
					&& childItems[i].data.name.trim().length == name.trim().length) {
					count ++ ;
					exist = true;
					name = newItemName + ' ' + count.toString();
					//childItems.splice(i, 1); //use this line only when having a perfectly cloned array
					break;
				}
			}
		} while (exist);
		return name;	
	},
	onFeatureTemplateFeaturesTreeRender: function(treePanel, eOpts) {
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
	        	MYOCD.SharedData.currentFeatureTemplateFeatureTreeDropNode = record;
	        	console.log(record);
	        	if(data.featureData) {
	        		var featureData = data.featureData;
	        		console.log(featureData);
	        		var childItems = record.childNodes;
	        		if(featureData.type == 'objectType') {
		        		var name = me.checkNameOnFeatureTreeNode(childItems, featureData.infoData.name);
		        		record.appendChild(
		        			{
			        			name: name,
			        			objectTypeId: featureData.infoData.id,
		        			}
		        		);
		        		var newRecord = record.findChildBy(
		        			function(child) {
			        			return child.raw.objectTypeId == featureData.infoData.id;
		        			}
		        		);
		        		console.log(newRecord);
		        		me.getFeatureTemplateFeatureTree().getPlugin('cellEditingPlugin').startEdit(newRecord, me.getFeatureTemplateFeatureTree().columns[0]);
	        		} else {
	        			if (featureData.infoData.id == MYOCD.SharedData.currentFeatureTemplateId) {
		        			Ext.Msg.alert('Error!', 'You can not drop a template to itself');
		        			return;
	        			}
	        			var name = me.checkNameOnFeatureTreeNode(childItems, featureData.infoData.name);
		        		record.appendChild(
		        			{
			        			name: name,
			        			featureTemplateId: featureData.infoData.id,
		        			}
		        		);
		        		var newRecord = record.findChildBy(
		        			function(child) {
			        			return child.raw.featureTemplateId == featureData.infoData.id;
		        			}
		        		);
		        		console.log(newRecord);
		        		me.getFeatureTemplateFeatureTree().getPlugin('cellEditingPlugin').startEdit(newRecord, me.getFeatureTemplateFeatureTree().columns[0]);
	        		}
	        		
		        	return true;
	        	}
	            return false;
	        }
	    });
	},
	onFeatureTemplateFeaturesTreeItemClick: function( treePanel, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentFeatureTemplateFeature = record;
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		if(record.get('id') == 'root') {
			Ext.getStore('featureTemplate.FeatureAttributes').removeAll();
			featureTemplateStoreController.getProductsOfFeatureTemplate(MYOCD.SharedData.currentFeatureTemplateId);
			return;
		}
	    featureTemplateStoreController.loadFeatureAttributes(record.get('id'));
	    featureTemplateStoreController.getProductsOfFeature(record.get('id'));
	},
	onFeatureTemplateFeatureTreeItemExpand: function( featureNode, eOpts ) {
		MYOCD.SharedData.currentFeatureTemplateFeature = featureNode;
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		if(featureNode.data.id == 'root') {
			Ext.getStore('featureTemplate.FeatureAttributes').removeAll();
			featureTemplateStoreController.getProductsOfFeatureTemplate(MYOCD.SharedData.currentFeatureTemplateId);
			return;
		}
		
	    featureTemplateStoreController.loadFeatureAttributes(featureNode.data.id);
		featureTemplateStoreController.getFeaturesOfFeature(featureNode.data.id, featureNode);
		featureTemplateStoreController.getProductsOfFeature(featureNode.data.id);
	},
	onFeatureTemplateFeatureTreeItemContextMenu: function ( treePanel, record, item, index, e, eOpts ) {
		var me = this;
		//return;
		e.stopEvent();
		MYOCD.SharedData.currentContextMenuFeatureTemplateFeatureNode = record;
		var editFeatureFunc = function() {
			if(me.getEditFeature()) {
				return;
			}
			var popup = Ext.create('MYOCD.view.featureTemplate.EditFeature');
			popup.show();
			popup.down('textfield[name="featureId"]').setValue(record.get('id'));
			popup.down('textfield[name="featureName"]').setValue(record.get('name'));
			popup.down('textfield[name="featureDesc"]').setValue(record.get('description'));
			var setInfo = function(featureInfo) {
				if (featureInfo.object_types.length > 0) {
					popup.down('textfield[name="parentObjectType"]').setValue(featureInfo.object_types[0].id+'-'+featureInfo.object_types[0].name);
				}
			}
			var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
			featureTemplateStoreController.getFeatureInfo(record.get('id'), setInfo, popup);
		}
		var deleteFeatureFunc = function() {
			Ext.Msg.confirm({
			    title: 'Delete Feature',
			    msg: 'Do you really want to delete this feature?',
			    width: 200,
			    buttons: Ext.Msg.YESNO,
			    icon: Ext.Msg.QUESTION,
			    fn: function(btn) {
				    if(btn == 'yes') {
					    var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
					    featureTemplateStoreController.deleteFeature();
				    }
			    }
			});
		}
		var copyFeatureFunc = function() {
			MYOCD.SharedData.featureTemplateSourceNode = record;
			MYOCD.SharedData.featureTemplateSourceNode.isCut = false;
		}
		var cutFeatureFunc = function() {
			MYOCD.SharedData.featureTemplateSourceNode = record;
			treePanel.ownerCt.getView().addRowCls(record,'opacity-treenode');
			MYOCD.SharedData.currentFeatureTemplateFeatureTree = treePanel;
			MYOCD.SharedData.featureTemplateSourceNode.isCut = true;
		}
		var pasteFeatureFunc = function() {
			//MYOCD.SharedData.featureTemplateDestNode = record;
			var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
			if(MYOCD.SharedData.featureTemplateSourceNode.isCut) {
				featureTemplateStoreController.moveFeature(MYOCD.SharedData.featureTemplateSourceNode, record, me.getMain());
			} else {
				featureTemplateStoreController.copyFeature(MYOCD.SharedData.featureTemplateSourceNode, record, me.getMain());

			}
		}
		if(record.get('id') !== 'root') {
			var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Feature',
						//handler: newCateFunc
					},
					{
						xtype: 'menuseparator'	
					},
					{
						text: 'Copy',
						handler: copyFeatureFunc
					},
					{
						text: 'Cut',
						handler: cutFeatureFunc	
					},
					{
						text: 'Paste',
						disabled: MYOCD.SharedData.featureTemplateSourceNode == null,
						handler: pasteFeatureFunc	
					},
					{
						xtype: 'menuseparator'	
					},
					{
						text: 'Edit',
						handler: editFeatureFunc
					},
					{
						text: 'Delete',
						handler: deleteFeatureFunc
					}
				]
			}).showAt(e.xy);
		} else {
			var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Feature',
						//handler: newCateFunc
					},
					{
						xtype: 'menuseparator'	
					},
					{
						text: 'Paste',
						disabled: MYOCD.SharedData.featureTemplateSourceNode == null,
						handler: pasteFeatureFunc	
					}
				]
			}).showAt(e.xy);
		}
	},
	onFeatureTemplateFeaturesTreeContextMenu: function( treePanel, e, eOpts ) {
		e.stopEvent();
	},
	onFeatureTemplateFeatureTreeAddToolClick: function() {
		if(this.getNewFeature()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.featureTemplate.NewFeature');
		popup.show();
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadObjectTypeLibraries(MYOCD.SharedData.currentCompanyId, this.getNewFeatureTemplateFeatureFromOtls());
		var refTplStoreController = MYOCD.controller.featureTemplate.RefFeatureTemplatesStoreController;
		refTplStoreController.loadFeatureTemplatesLibs(MYOCD.SharedData.currentCompanyId);
	},
	onFeatureTemplateFeaturesTreeEdit: function(editor, e, eOpts) {
		var featureName = e.record.data.name;
		var featureDesc = '';
		var parentType;
		var url;
		var param;
		if(featureName.trim().length == 0) {
			Ext.Msg.alert('Error!', 'Please enter feature name');
			e.record.stores[0].remove(e.record);
			e.record.destroy();
			return;
		}
		//createForm.destroy();
		if(MYOCD.SharedData.currentFeatureTemplateFeatureTreeDropNode.data.id == 'root') {
			url = FEATURE_TEMPLATE_BASE_URL + MYOCD.SharedData.currentFeatureTemplateId +'/features.json';
		} else {
			url = FEATURE_BASE_URL + MYOCD.SharedData.currentFeatureTemplateFeatureTreeDropNode.data.id + '/features.json';
		}
		if(e.record.raw.objectTypeId){
			param = {
			    feature: {
				    name: featureName,
				    description: featureDesc,
			    },
			    object_type_ids: [e.record.raw.objectTypeId.toString()]
		    }

		} else {
			param = {
			    feature: {
				    name: featureName,
				    description: featureDesc,
			    },
			    template_id: e.record.raw.featureTemplateId.toString()
		    }
			
		}
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplateStoreController.addNewFeature(url, param, this.getMain());
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onCreateFeatureAttBtnClick: function() {
		var attributeName = this.getFeatureOwnedAttributes().down('textfield[name="featureAttName"]').getValue();
		var attributeDesc = this.getFeatureOwnedAttributes().down('textfield[name="featureAttDesc"]').getValue(); 
		var attributeValueType = this.getFeatureOwnedAttributes().down('combobox[name="featureAttValueType"]').getValue();
		var attributeHidden = this.getFeatureOwnedAttributes().down('checkboxfield[name="featureAttHiddenCheck"]').getValue();
		var attributeConstant = this.getFeatureOwnedAttributes().down('checkboxfield[name="featureAttConstantCheck"]').getValue();
		var attributeMandatory = this.getFeatureOwnedAttributes().down('checkboxfield[name="featureAttMandatoryCheck"]').getValue();
		var attributeDeprecated = this.getFeatureOwnedAttributes().down('checkboxfield[name="featureAttDeprecatedCheck"]').getValue();
		var attributeDefaultValue = this.getFeatureOwnedAttributes().down('textfield[name="featureAttDefaultValue"]').getValue();
		
		if(attributeName.length == 0) {
			return;
		}

		var setActionPermission = this.getFeatureOwnedAttributes().down('setActionPermission');
		var callBack = function(newAttribute) {
			setActionPermission.fireEvent('setPermissionForAction', setActionPermission, newAttribute.id);
		}
		
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplateStoreController.addNewFeatureAttribute(MYOCD.SharedData.currentFeatureTemplateFeature.data.id, attributeName, attributeDesc, attributeValueType, 
		attributeHidden, attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, this.getFeatureAttributes(),callBack);	
	},
	onFeatureOwnedAttributesGridRender: function(grid, e, eOpts) {
		this.createToolTipForGrid(grid);	
	},
	onFeatureOwnedAttributesGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		if (record.data.isInherited) {
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
								   var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
								   featureTemplateStoreController.deleteFeatureAttribute( record.data.id, me.getFeatureAttributes());
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
	onFeatureOwnedAttributesGridBeforeEdit: function(editor, e, eOpts) {
		return !e.record.data.isInherited && !e.record.data.constant;
	},
	onFeatureOwnedAttributesGridEdit: function(editor, e, eOpts) {
		var attribute = e.record.data;
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplateStoreController.editFeatureAttribute(attribute.id, attribute.name, attribute.description, attribute.value_type, attribute.hidden, 
		attribute.constant, attribute.mandatory, attribute.deprecated, attribute.default_value, this.getFeatureAttributes());
	},
	onfeatureTemplateProductDataviewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		var editProductFunc = function () {
			if (me.getFeatureTemplateAddProduct()) {
				return;
			}
			var popup = Ext.create('MYOCD.view.featureTemplate.FeatureTemplateAddProduct');
			popup.down('textfield[name="productId"]').setValue(record.data.id);
			popup.down('textfield[name="productName"]').setValue(record.data.name);
			popup.down('textfield[name="productDesc"]').setValue(record.data.description);
			popup.down('button[name="addNewProductBtn"]').setVisible(false);
			popup.down('button[name="updateProductBtn"]').setVisible(true);
			popup.show();
			var callback = function(product) {
				if(product.products.length > 0) {
					var parentProduct = product.products[0];
					popup.down('textfield[name="parentProduct"]').setValue(parentProduct.name);
					popup.down('textfield[name="parentProductId"]').setValue(parentProduct.id);
				}
			}
			featureTemplateStoreController.getProductInfo(record.data.id, callback, popup);
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
								   var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
								   featureTemplateStoreController.deleteProduct( record.data.id, me.getFeatureTemplatesTab());
							    }
						    }
						});
					}
				}
			]
		}).showAt(e.xy);
	}, 
	onFeatureTemplateProductDataViewContextMenu: function(dataView, e, eOpts) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Add Product',
					handler: function() {
						if(me.getFeatureTemplateAddProductSelectParent()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.featureTemplate.FeatureTemplateAddProductSelectParent');
						popup.show();
						var refProductCatalogStoreController = MYOCD.controller.productCatalog.RefProductCatalogsStoreController;
						refProductCatalogStoreController.loadProductCatalogsLibs(MYOCD.SharedData.currentCompanyId, popup);
					}
				}
			]
		}).showAt(e.xy);
	},
	onFeatureTemplateToggleViewToolClick: function(tool) {
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
		this.getFeatureTemplateManager().down('dataview[name="featureTemplateProductDataview"]').setVisible(!isDataView);
		this.getFeatureTemplateManager().down('grid[name="featureTemplateProductGrid"]').setVisible(isDataView);
	},
	onFeatureTemplateProductDataViewRender: function(dataview, e, eOpts) {
		var me = this;
		dataview.dropZone = new Ext.dd.DropZone(dataview.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.productData) {
					return false;
				}
				var productData = dragData.productData;
	            var url;
				if (MYOCD.SharedData.currentFeatureTemplateFeature == null || MYOCD.SharedData.currentFeatureTemplateFeature.data.id == 'root') {
					url = FEATURE_TEMPLATE_BASE_URL + MYOCD.SharedData.currentFeatureTemplateId + '/productitems.json';
				} else {
					url = FEATURE_BASE_URL + MYOCD.SharedData.currentFeatureTemplateFeature.data.id + '/productitems.json';
				}
				var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
				featureTemplateStoreController.addNewProduct(url, productData.name, productData.description, productData.id.toString(), me.getFeatureTemplatesTab());
				return true;
	        }

		});
	},
	onFeatureTemplateProductGridRender: function(grid, e, eOpts) {
		var me = this;
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.productData) {
					return false;
				}
				var productData = dragData.productData;
	            var url;
				if (MYOCD.SharedData.currentFeatureTemplateFeature == null || MYOCD.SharedData.currentFeatureTemplateFeature.data.id == 'root') {
					url = FEATURE_TEMPLATE_BASE_URL + MYOCD.SharedData.currentFeatureTemplateId + '/productitems.json';
				} else {
					url = FEATURE_BASE_URL + MYOCD.SharedData.currentFeatureTemplateFeature.data.id + '/productitems.json';
				}
				var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
				featureTemplateStoreController.addNewProduct(url, productData.name, productData.description, productData.id.toString(), me.getFeatureTemplatesTab());
				return true;
	        }
		});
	},
	onFeatureTemplateProductDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		if(this.getFeatureTemplateProductItemAttributes()) {
			return;
		}
		MYOCD.SharedData.currentFeatureTemplateProduct = record.data;
		var popup = Ext.create('MYOCD.view.featureTemplate.FeatureTemplateProductItemAttributes');
		popup.show();
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplateStoreController.loadAttributeOfProduct(record.get('id'), popup);
	},
	onCreateProductAttBtnClick: function() {
		var attributeName = this.getFeatureTemplateProductItemOwnedAtts().down('textfield[name="productAttName"]').getValue();
		var attributeDesc = this.getFeatureTemplateProductItemOwnedAtts().down('textfield[name="productAttDesc"]').getValue(); 
		var attributeValueType = this.getFeatureTemplateProductItemOwnedAtts().down('combobox[name="productAttValueType"]').getValue();
		var attributeHidden = this.getFeatureTemplateProductItemOwnedAtts().down('checkboxfield[name="productAttHiddenCheck"]').getValue();
		var attributeConstant = this.getFeatureTemplateProductItemOwnedAtts().down('checkboxfield[name="productAttConstantCheck"]').getValue();
		var attributeMandatory = this.getFeatureTemplateProductItemOwnedAtts().down('checkboxfield[name="productAttMandatoryCheck"]').getValue();
		var attributeDeprecated = this.getFeatureTemplateProductItemOwnedAtts().down('checkboxfield[name="productAttDeprecatedCheck"]').getValue();
		var attributeDefaultValue = this.getFeatureTemplateProductItemOwnedAtts().down('textfield[name="productAttDefaultValue"]').getValue();
		
		if(attributeName.length == 0) {
			return;
		}

		var setActionPermission = this.getFeatureTemplateProductItemOwnedAtts().down('setActionPermission');
		var callBack = function(newAttribute) {
			setActionPermission.fireEvent('setPermissionForAction', setActionPermission, newAttribute.id);
		}
		
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplateStoreController.addNewProductAttribute(MYOCD.SharedData.currentFeatureTemplateProduct.id, attributeName, attributeDesc, attributeValueType, attributeHidden, 
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, this.getFeatureTemplateProductItemAttributes(), callBack);
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
								   var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
								   featureTemplateStoreController.deleteProductAttribute( record.data.id, me.getFeatureTemplateProductItemAttributes());
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
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplateStoreController.editProductAttribute(attribute.id, attribute.name, attribute.description, attribute.value_type, attribute.hidden, 
		attribute.constant, attribute.mandatory, attribute.deprecated, attribute.default_value, this.getFeatureTemplateProductItemAttributes());
	},
	onProductOwnedAttsGridBeforeEdit: function (editor, e, eOpts) {
		return !e.record.data.isInherited && !e.record.data.constant;
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
				   var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
				   featureTemplateStoreController.deleteProductAttribute( record.data.id, me.getFeatureTemplateProductItemAttributes());
			    }
		    }
		});
	}
});