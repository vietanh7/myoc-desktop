Ext.define('MYOCD.controller.featureTemplate.FeatureTemplatesLibManagerController',{
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
			ref: 'featureTemplatesCategoriesTree',
			selector: 'featureTemplatesLibraryManager treepanel[name="featureTemplatesCategoriesTree"]'
		},
		{
			ref: 'newFeatureTemplate',
			selector: 'newFeatureTemplate'
		},
		{
			ref: 'editFeatureTemplateCategory',
			selector: 'editFeatureTemplateCategory'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		}
	],
	init: function() {
		this.control({
			'featureTemplatesLibraryManager button[name="featureTemplatesLibsBackButton"]': {
				click: this.onFeatureTemplatesLibsBackButtonClick
			},
			'featureTemplatesLibraryManager treepanel[name="featureTemplatesCategoriesTree"]': {
				render: this.onFeatureTemplatesCategoriesTreeRender,
				itemclick: this.onFeatureTemplatesCategoriesTreeItemClick,
				itemexpand: this.onFeatureTemplatesCategoriesTreeItemExpand,
				itemcontextmenu: this.onFeatureTemplatesCategoriesTreeItemContextMenu,
				containercontextmenu: this.onFeatureTemplatesCategoriesContextMenu,
				edit: this.onFeatureTemplatesCategoriesTreeEdit,
				canceledit: this.onFeatureTemplatesCategoriesTreeCancelEdit
			},
			'featureTemplatesLibraryManager tool[name="addNewFeatureTemplateCategoryTool"]': {
				click: this.onAddNewFeatureTemplateCategoryToolClick
			},
			'featureTemplatesLibraryManager dataview[name="featureTemplatesDataView"]': {
				itemcontextmenu: this.onFeatureTemplatesDataViewItemContextMenu,
				containercontextmenu: this.onFeatureTemplatesDataViewContextMenu,
				itemdblclick: this.onFeatureTemplatesDataViewItemDblClick,
				render: this.onFeatureTemplatesDataViewRender,
				itemclick: this.onFeatureTemplatesDataViewItemClick
			},
			'featureTemplatesLibraryManager tool[name="addNewFeatureTemplateTool"]': {
				click: this.onAddNewFeatureTemplateToolClick
			},
			'featureTemplatesLibraryManager tool[name="featureTemplatesLibraryToggleViewTool"]': {
				click: this.onFeatureTemplatesLibraryToggleViewToolClick
			},
			'featureTemplatesLibraryManager grid[name="featureTemplatesGrid"]': {
				itemcontextmenu: this.onFeatureTemplatesDataViewItemContextMenu,
				containercontextmenu: this.onFeatureTemplatesDataViewContextMenu,
				itemdblclick: this.onFeatureTemplatesDataViewItemDblClick,
				render: this.onFeatureTemplatesGridRender,
				itemclick: this.onFeatureTemplatesDataViewItemClick
			},
			'editFeatureTemplateCategory button[name="updateFeatureTemplateCategoryBtn"]': {
				click: this.onUpdateFeatureTemplateCategoryBtnClick
			},
			'featureTemplatesLibraryManager treepanel tool[name="featureTemplateCategoryAuthorTool"]': {
				click: this.onFeatureTemplateCategoryAuthorToolClick
			},
			'featureTemplatesLibraryManager tool[name="featureTemplateAuthorTool"]': {
				click: this.onFeatureTemplateAuthorToolClick
			}
		});
	},
	onFeatureTemplatesLibsBackButtonClick: function() {
		this.getFeatureTemplatesTab().down('grid[name="featureTemplatesLibrariesGrid"]').setVisible(true);
		this.getFeatureTemplatesTab().down('featureTemplatesLibraryManager').setVisible(false);
		MYOCD.SharedData.currentFeatureTemplatesCategory = null;
		Ext.getStore('featureTemplate.FeatureTemplates').removeAll();
		Ext.getStore('featureTemplate.FeatureTemplatesCategoriesTreeStore').setRootNode(null);
		Ext.getStore('featureTemplate.FeatureTemplatesCategoriesTreeStore').removeAll();
	},
	onFeatureTemplatesCategoriesTreeRender: function(treePanel, eOpts) {
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
	        	MYOCD.SharedData.currentFeatureTemplateCategoryTreeDropNode = record;
	        	if(data.featureTemplateData) {
	        		treePanel.getSelectionModel().select(record);
	        		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
	        		featureTemplateStoreController.moveFeatureTemplate(data.featureTemplateData.id, record, me.getFeatureTemplatesTab());
	        		return true;
	        	} else {
		        	return false
	        	}
	            return true;
	        }
	    });
    },
    onFeatureTemplatesCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
	    MYOCD.SharedData.currentFeatureTemplatesCategory = record;
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		
		if(record.get('id')!=='root') {
			featureTemplateStoreController.loadTemplatesOfFeatureTemplatesCategory(record.get('id'));
		} else {
			featureTemplateStoreController.loadTemplatesOfFeatureTemplatesLib(MYOCD.SharedData.currentFeatureTemplatesLibId);
		}
		//MYOCD.SharedData.currentFeatureTemplate = null;
    },
    onFeatureTemplatesCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		MYOCD.SharedData.currentFeatureTemplatesCategory = categoryNode;
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		if(categoryNode.data.id !== 'root') {
			featureTemplateStoreController.loadTemplatesOfFeatureTemplatesCategory(categoryNode.data.id);
			featureTemplateStoreController.loadCategoriesOfFeatureTemplatesCategory(categoryNode.data.id, categoryNode);
		} else {
			featureTemplateStoreController.loadTemplatesOfFeatureTemplatesLib(MYOCD.SharedData.currentFeatureTemplatesLibId);
		}
		//MYOCD.SharedData.currentFeatureTemplate = null;
	},
	onFeatureTemplatesCategoriesTreeItemContextMenu: function( treePanel, record, item, index, e, eOpts ) {
		var me = this;
		MYOCD.SharedData.currentFeatureTemplatesCategoryNodeContextMenu = record;
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
				MYOCD.SharedData.AddingChildOnFeatureTemplateNode = record;
				treePanel.ownerCt.getPlugin('cellEditingPlugin').startEdit(newRecord, treePanel.ownerCt.columns[0]);
			});
		}
		var editCateFunc = function() {
			if(me.getEditFeatureTemplateCategory()) {
				return;
			}
			var popup = Ext.create('MYOCD.view.featureTemplate.EditFeatureTemplateCategory');
			popup.down('textfield[name="featureTemplateCategoryName"]').setValue(record.get('name'));
			popup.down('textfield[name="featureTemplateCategoryDesc"]').setValue(record.get('description'));
			popup.show();
		}
		var deleteCateFunc = function() {
			Ext.Msg.confirm({
			    title: 'Delete Category',
			    msg: 'Do you really want delete this Category?',
			    width: 200,
			    buttons: Ext.Msg.YESNO,
			    icon: Ext.Msg.QUESTION,
			    fn: function(btn) {
				    if(btn == 'yes') {
				    	var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
				    	featureTemplateStoreController.deleteFeatureTemplateCategory();
				    }
			    }
			});
		}
		var copyCateFunc = function() {
			MYOCD.SharedData.featureCategorySourceNode = record;
			MYOCD.SharedData.featureCategorySourceNode.isCut = false;
		}
		var cutCateFunc = function() {
			MYOCD.SharedData.featureCategorySourceNode = record;
			treePanel.ownerCt.getView().addRowCls(record,'opacity-treenode');
			MYOCD.SharedData.currentFeatureCategoryTree = treePanel;
			MYOCD.SharedData.featureCategorySourceNode.isCut = true;
		}
		var pasteCateFunc = function() {
			var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
			if(MYOCD.SharedData.featureCategorySourceNode.isCut) {
				featureTemplateStoreController.moveFeatureCategory(MYOCD.SharedData.featureCategorySourceNode, record, me.getFeatureTemplatesTab());
			} else {
				featureTemplateStoreController.copyFeatureCategory(MYOCD.SharedData.featureCategorySourceNode, record, me.getFeatureTemplatesTab());

			}
		}
		var securityFunc = function () {
			if(me.getAuthorizationDialog()) {
				me.getAuthorizationDialog().destroy();
			}		
			var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
			if (record.data.id == 'root') {
				popup.down('textfield[name="baseUrl"]').setValue(FEATURE_TEMPLATE_LIB_BASE_URL);
				popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentFeatureTemplatesLibId);
			} else {
				popup.down('textfield[name="baseUrl"]').setValue(FEATURE_TEMPLATE_CATEGORY_BASE_URL);
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
						disabled: MYOCD.SharedData.featureCategorySourceNode == null,
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
					}
				]
			}).showAt(e.xy);
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
						disabled: MYOCD.SharedData.featureCategorySourceNode == null,
						handler: pasteCateFunc	
					},
					'-',
					{
						text: 'Security',
						handler: securityFunc
					}
				]
			}).showAt(e.xy);
		}

	},
	onFeatureTemplatesCategoriesContextMenu: function(treePanel, e, eOpts) {
		e.stopEvent();
	},
	onFeatureTemplatesCategoriesTreeEdit: function(editor, e, eOpts) {
		var data = e.record.data;
	    var url;
	    if(data.parentId !== 'root') {
		    url = FEATURE_TEMPLATE_CATEGORY_BASE_URL + data.parentId + '/categories.json'
	    } else {
		    url = FEATURE_TEMPLATE_LIB_BASE_URL + MYOCD.SharedData.currentFeatureTemplatesLibId  + '/categories.json'
	    }
	    var categoryName = data.name;
	    if(categoryName.trim().length == 0){
		    Ext.Msg.alert('Missing Category Name', 'Please enter category name');
		    e.record.stores[0].remove(e.record);
		    e.record.destroy();
		    return;
	    }
	    
	    var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplateStoreController.addNewFeatureTemplatesCategory(url, categoryName, '', this.getFeatureTemplatesTab());
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onFeatureTemplatesCategoriesTreeCancelEdit: function(editor, e, eOpts) {
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onAddNewFeatureTemplateCategoryToolClick : function() {
		var me = this;
		if(MYOCD.SharedData.currentFeatureTemplatesCategory == null || MYOCD.SharedData.currentFeatureTemplatesCategory.data.id == 'root') {
			var root = Ext.getStore('featureTemplate.FeatureTemplatesCategoriesTreeStore').getRootNode();
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
				MYOCD.SharedData.AddingChildOnFeatureTemplateNode = root;
				me.getFeatureTemplatesCategoriesTree().getPlugin('cellEditingPlugin').startEdit(
					newRecord, me.getFeatureTemplatesCategoriesTree().columns[0]);
			});
		} else {
			var record = MYOCD.SharedData.currentFeatureTemplatesCategory;
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
				MYOCD.SharedData.AddingChildOnFeatureTemplateNode = record;
				me.getFeatureTemplatesCategoriesTree().getPlugin('cellEditingPlugin').startEdit(
					newRecord, me.getFeatureTemplatesCategoriesTree().columns[0]);
			});
		}
	},
	onFeatureTemplatesDataViewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: function() {
						if(me.getNewFeatureTemplate()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.featureTemplate.NewFeatureTemplate');
						popup.setTitle('Edit Feature Template');
						popup.down('textfield[name="featureTemplateId"]').setValue(record.get('id'));
						popup.down('textfield[name="featureTemplateName"]').setValue(record.get('name'));
						popup.down('textfield[name="featureTemplateDesc"]').setValue(record.get('description'));
						popup.down('button[name="createNewFeatureTemplateBtn"]').hidden = true;
						popup.down('button[name="updateFeatureTemplateBtn"]').hidden = false;
						var callback = function(product) {
							var parentType;
							if(product.object_types.length > 0) {
								parentType = product.object_types[0];
								popup.down('textfield[name="parentObjectTypeId"]').setValue(parentType.id);
								popup.down('textfield[name="parentObjectType"]').setValue(parentType.name);
							}
						}
						popup.show();
						var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
						featureTemplateStoreController.getFeatureTemplateInfo(record.data.id, callback, popup);
					}
				},
				{
					text: 'Delete',
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Delete Template',
						    msg: 'Do you really want delete this template?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
							    	var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
							    	featureTemplateStoreController.deleteFeatureTemplate(record.get('id'));
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
						popup.down('textfield[name="baseUrl"]').setValue(FEATURE_TEMPLATE_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	},
	onFeatureTemplatesDataViewContextMenu: function(dataview, e, eOpts) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Add New Template',
					handler: function() {
						if(me.getNewFeatureTemplate()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.featureTemplate.NewFeatureTemplate');
						popup.show();
					}
				}
			]
		}).showAt(e.xy);
	},
	onFeatureTemplatesDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		me.getFeatureTemplatesLibraryManager().setVisible(false);
		me.getFeatureTemplateManager().setVisible(true);
		//MYOCD.SharedData.currentFeatureTemplate = record.data;
		MYOCD.SharedData.currentFeatureTemplateId = record.data.id;
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplateStoreController.getFeaturesOfFeatureTemplate(record.data.id, record.data.name, me.getFeatureTemplatesTab());
		featureTemplateStoreController.getProductsOfFeatureTemplate(record.data.id);
		MYOCD.SharedData.featureTemplateSourceNode = null;
		MYOCD.SharedData.currentFeatureTemplateFeature = null;
	},
	onAddNewFeatureTemplateToolClick: function() {
		if(this.getNewFeatureTemplate()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.featureTemplate.NewFeatureTemplate');
		popup.show();
	},
	onFeatureTemplatesLibraryToggleViewToolClick: function(tool) {
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
		this.getFeatureTemplatesLibraryManager().down('dataview[name="featureTemplatesDataView"]').setVisible(!isDataView);
		this.getFeatureTemplatesLibraryManager().down('grid[name="featureTemplatesGrid"]').setVisible(isDataView);
	},
	onUpdateFeatureTemplateCategoryBtnClick: function() {
		var categoryName = this.getEditFeatureTemplateCategory().down('textfield[name="featureTemplateCategoryName"]').getValue();
		var categoryDesc = this.getEditFeatureTemplateCategory().down('textfield[name="featureTemplateCategoryDesc"]').getValue();
		if(categoryName.length == 0) {
			return;
		}
		this.getEditFeatureTemplateCategory().destroy();
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplateStoreController.editFeatureTemplateCategory(categoryName, categoryDesc);
	},
	onFeatureTemplatesDataViewRender: function(dataview, eOpts) {
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
	                    featureTemplateData: dataview.getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onFeatureTemplatesGridRender: function(grid, eOpts) {
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
	                    featureTemplateData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onFeatureTemplateCategoryAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			this.getAuthorizationDialog().destroy();
		}		
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		if (!MYOCD.SharedData.currentFeatureTemplatesCategory || MYOCD.SharedData.currentFeatureTemplatesCategory.data.id == 'root') {
			popup.down('textfield[name="baseUrl"]').setValue(FEATURE_TEMPLATE_LIB_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentFeatureTemplatesLibId);
		} else {
			popup.down('textfield[name="baseUrl"]').setValue(FEATURE_TEMPLATE_CATEGORY_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentFeatureTemplatesCategory.data.id);
		}
		popup.show();
	},
	onFeatureTemplatesDataViewItemClick: function( dataview, record, item, index, e, eOpts ) {
		//MYOCD.SharedData.currentFeatureTemplate = record.data;	
	},
	onFeatureTemplateAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			this.getAuthorizationDialog().destroy();
		}
		if (!MYOCD.SharedData.currentFeatureTemplate) {
			return;
		}
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		popup.down('textfield[name="baseUrl"]').setValue(FEATURE_TEMPLATE_BASE_URL);
		popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentFeatureTemplate.id);
		popup.show(); 
	}
});