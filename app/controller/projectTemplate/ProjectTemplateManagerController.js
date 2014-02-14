Ext.define('MYOCD.controller.projectTemplate.ProjectTemplateManagerController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'projectTemplatesTab',
			selector: 'projectTemplatesTab'
		},
		{
			ref: 'projectTemplatesLibraryManager',
			selector: 'projectTemplatesLibraryManager'
		},
		{
			ref: 'projectTemplateManager',
			selector: 'projectTemplateManager'
		},
		{
			ref: 'projectTemplateFeatureTree',
			selector: 'projectTemplateManager treepanel[name="projectTemplateFeatureTree"]'
		},
		{
			ref: 'newFeature',
			selector: 'newFeature'
		},
		{
			ref: 'newProjectTemplateFeatureFromOtls',
			selector: 'newProjectTemplateFeatureFromOtls'
		},
		{
			ref: 'editFeature',
			selector: 'editFeature'
		},
		{
			ref: 'projectTemplateFeatureAttributes',
			selector: 'projectTemplateManager projectTemplateFeatureAttributes'
		},
		{
			ref: 'projectTemplateFeatureOwnedAttributes',
			selector: 'projectTemplateManager projectTemplateFeatureAttributes projectTemplateFeatureOwnedAttributes'
		},
		{
			ref: 'projectTemplateAddProduct',
			selector: 'projectTemplateAddProduct'
		},
		{
			ref: 'projectTemplateAddProductSelectParent',
			selector: 'projectTemplateAddProductSelectParent'
		},
		{
			ref: 'projectTemplateProductItemAttributes',
			selector: 'projectTemplateProductItemAttributes'
		},
		{
			ref: 'projectTemplateProductItemOwnedAtts',
			selector: 'projectTemplateProductItemOwnedAtts'
		},
		{
			ref: 'attributeAction',
			selector: 'attributeAction'
		}
	],
	init: function() {
		this.control({
			'projectTemplateManager button[name="projectTemplatesBackButton"]': {
				click: this.onProjectTemplatesBackButtonClick
			},
			'projectTemplateManager treepanel[name="projectTemplateFeatureTree"]': {
				render: this.onProjectTemplateFeaturesTreeRender,
				itemclick: this.onProjectTemplateFeaturesTreeItemClick,
				itemexpand: this.onProjectTemplateFeatureTreeItemExpand,
				itemcontextmenu: this.onProjectTemplateFeatureTreeItemContextMenu,
				containercontextmenu: this.onProjectTemplateFeaturesTreeContextMenu,
				edit: this.onProjectTemplateFeaturesTreeEdit
			},
			'projectTemplateManager tool[name="projectTemplateFeatureTreeAddTool"]': {
				click: this.onProjectTemplateFeatureTreeAddToolClick
			},
			'projectTemplateManager projectTemplateFeatureAttributes projectTemplateFeatureOwnedAttributes button[name="createFeatureAttBtn"]': {
				click: this.onCreateFeatureAttBtnClick
			},
			'projectTemplateManager projectTemplateFeatureAttributes projectTemplateFeatureOwnedAttributes grid[name="featureOwnedAttributesGrid"]': {
				render: this.onFeatureOwnedAttributesGridRender,
				itemcontextmenu: this.onFeatureOwnedAttributesGridItemContextMenu,
				beforeedit: this.onFeatureOwnedAttributesGridBeforeEdit,
				edit: this.onFeatureOwnedAttributesGridEdit,
			},
			'projectTemplateManager dataview[name="projectTemplateProductDataview"]': {
				render: this.onProjectTemplateProductDataViewRender,
				itemcontextmenu: this.onProjectTemplateProductDataviewItemContextMenu,
				containercontextmenu: this.onProjectTemplateProductDataViewContextMenu,
				itemdblclick: this.onProjectTemplateProductDataViewItemDblClick
			},
			'projectTemplateManager grid[name="projectTemplateProductGrid"]': {
				render: this.onProjectTemplateProductGridRender,
				itemcontextmenu: this.onProjectTemplateProductDataviewItemContextMenu,
				containercontextmenu: this.onProjectTemplateProductDataViewContextMenu,
				itemdblclick: this.onProjectTemplateProductDataViewItemDblClick
			},
			'projectTemplateManager tool[name="projectTemplateToggleViewTool"]': {
				click: this.onProjectTemplateToggleViewToolClick
			},
			'projectTemplateManager tool[name="projectTemplateToggleViewTool"]': {
				click: this.onProjectTemplateToggleViewToolClick
			},
			'projectTemplateProductItemOwnedAtts button[name="createProductAttBtn"]': {
				click: this.onCreateProductAttBtnClick
			},
			'projectTemplateProductItemOwnedAtts grid[name="productOwnedAttsGrid"]': {
				render: this.onProductOwnedAttsGridRender,
				itemcontextmenu: this.onProductOwnedAttsGridItemContextMenu,
				edit: this.onProductOwnedAttsGridEdit,
				beforeedit: this.onProductOwnedAttsGridBeforeEdit
			},
			'projectTemplateProductItemOwnedAtts': {
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
	onProjectTemplatesBackButtonClick: function() {
		var me = this;
		me.getProjectTemplatesLibraryManager().setVisible(true);
		me.getProjectTemplateManager().setVisible(false);
		Ext.getStore('projectTemplate.FeatureAttributes').removeAll();
		Ext.getStore('projectTemplate.ProjectTemplateFeatureTreeStore').setRootNode(null);
		Ext.getStore('projectTemplate.ProjectTemplateFeatureTreeStore').removeAll();
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
	onProjectTemplateFeaturesTreeRender: function(treePanel, eOpts) {
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
	        	MYOCD.SharedData.currentProjectTemplateFeatureTreeDropNode = record;
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
		        		me.getProjectTemplateFeatureTree().getPlugin('cellEditingPlugin').startEdit(newRecord, me.getProjectTemplateFeatureTree().columns[0]);
	        		} else {
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
		        		me.getProjectTemplateFeatureTree().getPlugin('cellEditingPlugin').startEdit(newRecord, me.getProjectTemplateFeatureTree().columns[0]);
	        		}
	        		
		        	return true;
	        	}
	        	return false
	        }
	    });
	},
	onProjectTemplateFeaturesTreeItemClick: function( treePanel, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentProjectTemplateFeature = record;
		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		if(record.get('id') == 'root') {
			Ext.getStore('projectTemplate.FeatureAttributes').removeAll();
			projectTemplateStoreController.getProductsOfProjectTemplate(MYOCD.SharedData.currentProjectTemplateId);
			return;
		}
	    projectTemplateStoreController.loadFeatureAttributes(record.get('id'));
	    projectTemplateStoreController.getProductsOfFeature(record.get('id'));
	},
	onProjectTemplateFeatureTreeItemExpand: function( featureNode, eOpts ) {

		MYOCD.SharedData.currentProjectTemplateFeature = featureNode;
		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		if(featureNode.data.id == 'root') {
			Ext.getStore('projectTemplate.FeatureAttributes').removeAll();
			projectTemplateStoreController.getProductsOfProjectTemplate(MYOCD.SharedData.currentProjectTemplateId);
			return;
		}
	    projectTemplateStoreController.loadFeatureAttributes(featureNode.data.id);
		projectTemplateStoreController.getFeaturesOfFeature(featureNode.data.id, featureNode);
		projectTemplateStoreController.getProductsOfFeature(featureNode.data.id);
	},
	onProjectTemplateFeatureTreeItemContextMenu: function ( treePanel, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		MYOCD.SharedData.currentContextMenuProjectTemplateFeatureNode = record;
		var editFeatureFunc = function() {
			if(me.getEditFeature()) {
				return;
			}
			var popup = Ext.create('MYOCD.view.projectTemplate.EditProjectTemplateFeature');
			popup.show();
			popup.down('textfield[name="featureId"]').setValue(record.get('id'));
			popup.down('textfield[name="featureName"]').setValue(record.get('name'));
			popup.down('textfield[name="featureDesc"]').setValue(record.get('description'));
			var setInfo = function(featureInfo) {
				popup.down('textfield[name="parentObjectType"]').setValue(featureInfo.object_types[0].id+'-'+featureInfo.object_types[0].name);
			}
			var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
			projectTemplateStoreController.getFeatureInfo(record.get('id'), setInfo, popup);
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
					    var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
					    projectTemplateStoreController.deleteFeature();
				    }
			    }
			});
		}
		var copyFeatureFunc = function() {
			MYOCD.SharedData.projectTemplateFeatureSourceNode = record;
			MYOCD.SharedData.projectTemplateFeatureSourceNode.isCut = false;
		}
		var cutFeatureFunc = function() {
			MYOCD.SharedData.projectTemplateFeatureSourceNode = record;
			treePanel.ownerCt.getView().addRowCls(record,'opacity-treenode');
			MYOCD.SharedData.currentProjectTemplateFeatureTree = treePanel;
			MYOCD.SharedData.projectTemplateFeatureSourceNode.isCut = true;
		}
		var pasteFeatureFunc = function() {
			//MYOCD.SharedData.featureTemplateDestNode = record;
			var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
			if(MYOCD.SharedData.projectTemplateFeatureSourceNode.isCut) {
				projectTemplateStoreController.moveFeature(MYOCD.SharedData.projectTemplateFeatureSourceNode, record, me.getProjectTemplatesTab());
			} else {
				projectTemplateStoreController.copyFeature(MYOCD.SharedData.projectTemplateFeatureSourceNode, record, me.getProjectTemplatesTab());

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
						disabled: MYOCD.SharedData.projectTemplateFeatureSourceNode == null,
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
						disabled: MYOCD.SharedData.projectTemplateFeatureSourceNode == null,
						handler: pasteFeatureFunc	
					}
				]
			}).showAt(e.xy);
		}

	},
	onProjectTemplateFeaturesTreeContextMenu: function( treePanel, e, eOpts ) {
		e.stopEvent();
	},
	onProjectTemplateFeatureTreeAddToolClick: function() {
		if(this.getNewFeature()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.projectTemplate.NewProjectTemplateFeature');
		popup.show();
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadObjectTypeLibraries(MYOCD.SharedData.currentCompanyId, this.getNewProjectTemplateFeatureFromOtls());
		var refTplStoreController = MYOCD.controller.featureTemplate.RefFeatureTemplatesStoreController;
		refTplStoreController.loadFeatureTemplatesLibs(MYOCD.SharedData.currentCompanyId);
	},
	onProjectTemplateFeaturesTreeEdit: function(editor, e, eOpts) {
		var featureName = e.record.data.name;
		var featureDesc = '';
		var parentType;
		var url;
		var param;
		if(featureName.trim().length == 0) {
			Ext.Msg.alert('Error!', 'please enter feature name');
			e.record.stores[0].remove(e.record);
			e.record.destroy();
			return;
		}
		//createForm.destroy();
		if(MYOCD.SharedData.currentProjectTemplateFeatureTreeDropNode.data.id == 'root') {
			url = PROJECT_TEMPLATE_BASE_URL + MYOCD.SharedData.currentProjectTemplateId +'/features.json';
		} else {
			url = FEATURE_BASE_URL + MYOCD.SharedData.currentProjectTemplateFeatureTreeDropNode.data.id + '/features.json';
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
		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		projectTemplateStoreController.addNewFeature(url, param, this.getProjectTemplatesTab());
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onCreateFeatureAttBtnClick: function() {
		var attributeName = this.getProjectTemplateFeatureOwnedAttributes().down('textfield[name="featureAttName"]').getValue();
		var attributeDesc = this.getProjectTemplateFeatureOwnedAttributes().down('textfield[name="featureAttDesc"]').getValue(); 
		var attributeValueType = this.getProjectTemplateFeatureOwnedAttributes().down('combobox[name="featureAttValueType"]').getValue();
		var attributeHidden = this.getProjectTemplateFeatureOwnedAttributes().down('checkboxfield[name="featureAttHiddenCheck"]').getValue();
		var attributeConstant = this.getProjectTemplateFeatureOwnedAttributes().down('checkboxfield[name="featureAttConstantCheck"]').getValue();
		var attributeMandatory = this.getProjectTemplateFeatureOwnedAttributes().down('checkboxfield[name="featureAttMandatoryCheck"]').getValue();
		var attributeDeprecated = this.getProjectTemplateFeatureOwnedAttributes().down('checkboxfield[name="featureAttDeprecatedCheck"]').getValue();
		var attributeDefaultValue = this.getProjectTemplateFeatureOwnedAttributes().down('textfield[name="featureAttDefaultValue"]').getValue();
		
		if(attributeName.length == 0) {
			return;
		}

		var setActionPermission = this.getProjectTemplateFeatureOwnedAttributes().down('setActionPermission');
		var callBack = function(newAttribute) {
			setActionPermission.fireEvent('setPermissionForAction', setActionPermission, newAttribute.id);
		}
		
		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		projectTemplateStoreController.addNewFeatureAttribute(MYOCD.SharedData.currentProjectTemplateFeature.data.id, attributeName, attributeDesc, attributeValueType, 
		attributeHidden, attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, this.getProjectTemplateFeatureAttributes(), callBack);	
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
								   var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
								   projectTemplateStoreController.deleteFeatureAttribute( record.data.id, me.getProjectTemplateFeatureAttributes());
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
		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		projectTemplateStoreController.editFeatureAttribute(attribute.id, attribute.name, attribute.description, attribute.value_type, attribute.hidden, 
		attribute.constant, attribute.mandatory, attribute.deprecated, attribute.default_value, this.getProjectTemplateFeatureAttributes());
	},
	onProjectTemplateProductDataviewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		var editProductFunc = function () {
			if (me.getProjectTemplateAddProduct()) {
				return;
			}
			var popup = Ext.create('MYOCD.view.projectTemplate.ProjectTemplateAddProduct');
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
			projectTemplateStoreController.getProductInfo(record.data.id, callback, popup);
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
								   var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
								   projectTemplateStoreController.deleteProduct( record.data.id, me.getProjectTemplatesTab());
							    }
						    }
						});
					}
				}
			]
		}).showAt(e.xy);
	}, 
	onProjectTemplateProductDataViewContextMenu: function(dataView, e, eOpts) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Add Product',
					handler: function() {
						if(me.getProjectTemplateAddProductSelectParent()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.projectTemplate.ProjectTemplateAddProductSelectParent');
						popup.show();
						var refProductCatalogStoreController = MYOCD.controller.productCatalog.RefProductCatalogsStoreController;
						refProductCatalogStoreController.loadProductCatalogsLibs(MYOCD.SharedData.currentCompanyId, popup);
					}
				}
			]
		}).showAt(e.xy);
	},
	onProjectTemplateToggleViewToolClick: function(tool) {
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
		this.getProjectTemplateManager().down('dataview[name="projectTemplateProductDataview"]').setVisible(!isDataView);
		this.getProjectTemplateManager().down('grid[name="projectTemplateProductGrid"]').setVisible(isDataView);
	},
	onProjectTemplateProductDataViewRender: function(dataview, e, eOpts) {
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
				if (MYOCD.SharedData.currentProjectTemplateFeature == null || MYOCD.SharedData.currentProjectTemplateFeature.data.id == 'root') {
					url = PROJECT_TEMPLATE_BASE_URL + MYOCD.SharedData.currentProjectTemplateId + '/productitems.json';
				} else {
					url = FEATURE_BASE_URL + MYOCD.SharedData.currentProjectTemplateFeature.data.id + '/productitems.json';
				}
				var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
				projectTemplateStoreController.addNewProduct(url, productData.name, productData.description, productData.id.toString(), me.getProjectTemplatesTab());
				return true;
	        }

		});
	},
	onProjectTemplateProductGridRender: function(grid, e, eOpts) {
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
				if (MYOCD.SharedData.currentProjectTemplateFeature == null || MYOCD.SharedData.currentProjectTemplateFeature.data.id == 'root') {
					url = PROJECT_TEMPLATE_BASE_URL + MYOCD.SharedData.currentProjectTemplateId + '/productitems.json';
				} else {
					url = FEATURE_BASE_URL + MYOCD.SharedData.currentProjectTemplateFeature.data.id + '/productitems.json';
				}
				var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
				projectTemplateStoreController.addNewProduct(url, productData.name, productData.description, productData.id.toString(), me.getProjectTemplatesTab());
				return true;
	        }

		});
	},
	onProjectTemplateProductDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		if(this.getProjectTemplateProductItemAttributes()) {
			return;
		}
		MYOCD.SharedData.currentProduct = record.data;
		var popup = Ext.create('MYOCD.view.projectTemplate.ProjectTemplateProductItemAttributes');
		popup.show();
		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		projectTemplateStoreController.loadAttributeOfProduct(record.get('id'), popup);
	},
	onCreateProductAttBtnClick: function() {
		var attributeName = this.getProjectTemplateProductItemOwnedAtts().down('textfield[name="productAttName"]').getValue();
		var attributeDesc = this.getProjectTemplateProductItemOwnedAtts().down('textfield[name="productAttDesc"]').getValue(); 
		var attributeValueType = this.getProjectTemplateProductItemOwnedAtts().down('combobox[name="productAttValueType"]').getValue();
		var attributeHidden = this.getProjectTemplateProductItemOwnedAtts().down('checkboxfield[name="productAttHiddenCheck"]').getValue();
		var attributeConstant = this.getProjectTemplateProductItemOwnedAtts().down('checkboxfield[name="productAttConstantCheck"]').getValue();
		var attributeMandatory = this.getProjectTemplateProductItemOwnedAtts().down('checkboxfield[name="productAttMandatoryCheck"]').getValue();
		var attributeDeprecated = this.getProjectTemplateProductItemOwnedAtts().down('checkboxfield[name="productAttDeprecatedCheck"]').getValue();
		var attributeDefaultValue = this.getProjectTemplateProductItemOwnedAtts().down('textfield[name="productAttDefaultValue"]').getValue();
		
		if(attributeName.length == 0) {
			return;
		}
		var setActionPermission = this.getProjectTemplateProductItemOwnedAtts().down('setActionPermission');
		var callBack = function(newAttribute) {
			setActionPermission.fireEvent('setPermissionForAction', setActionPermission, newAttribute.id);
		}
		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		projectTemplateStoreController.addNewProductAttribute(MYOCD.SharedData.currentProduct.id, attributeName, attributeDesc, attributeValueType, attributeHidden, 
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, this.getProjectTemplateProductItemAttributes(), callBack);
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
								   var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
								   projectTemplateStoreController.deleteProductAttribute( record.data.id, me.getProjectTemplateProductItemAttributes());
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
		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		projectTemplateStoreController.editProductAttribute(attribute.id, attribute.name, attribute.description, attribute.value_type, attribute.hidden, 
		attribute.constant, attribute.mandatory, attribute.deprecated, attribute.default_value, this.getProjectTemplateProductItemAttributes());
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
				   var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
				   projectTemplateStoreController.deleteProductAttribute( record.data.id, me.getProjectTemplateProductItemAttributes());
			    }
		    }
		});
	} 

});