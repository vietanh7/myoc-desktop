Ext.define('MYOCD.controller.viewTemplate.ViewLibraryManagerController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'viewLibrariesTab',
			selector: 'viewLibrariesTab'	
		},
		{
			ref: 'viewLibraryManager',
			selector: 'viewLibraryManager'
		},
		{
			ref: 'viewCategoriesTree',
			selector: 'viewLibraryManager treepanel[name="viewCategoriesTree"]'
		},
		{
			ref: 'newViewTemplate',
			selector: 'newViewTemplate'
		},
		{
			ref: 'editViewsCategory',
			selector: 'editViewsCategory'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'newViewTemplateWithTabs',
			selector: 'newViewTemplateWithTabs'
		}
	],
	init: function() {
		this.control({
			'viewLibraryManager button[name="viewLibsBackButton"]': {
				click: this.onViewLibsBackButtonClick
			},
			'viewLibraryManager treepanel[name="viewCategoriesTree"]': {
				render: this.onViewCategoriesTreeRender,
				itemclick: this.onViewCategoriesTreeItemClick,
				itemexpand: this.onViewCategoriesTreeItemExpand,
				itemcontextmenu: this.onViewCategoriesTreeItemContextMenu,
				containercontextmenu: this.onPermisstionCategoriesContextMenu,
				edit: this.onViewCategoriesTreeEdit,
				canceledit: this.onViewCategoriesTreeCancelEdit
			},
			'viewLibraryManager tool[name="addNewViewsCategoryTool"]': {
				click: this.onAddNewViewCategoryToolClick
			},
			'viewLibraryManager dataview[name="viewTemplatesDataView"]': {
				itemcontextmenu: this.onViewTemplatesDataViewItemContextMenu,
				containercontextmenu: this.onViewTemplatesDataViewContextMenu,
				itemdblclick: this.onViewTemplatesDataViewItemDblClick,
				render: this.onViewTemplatesDataViewRender,
				itemclick: this.onViewTemplatesDataViewItemClick
			},
			'viewLibraryManager tool[name="addNewViewTemplateTool"]': {
				click: this.onAddNewViewTemplateToolClick
			},
			'viewLibraryManager tool[name="viewLibraryToggleViewTool"]': {
				click: this.onViewLibraryToggleViewToolClick
			},
			'viewLibraryManager grid[name="viewTemplatesGrid"]': {
				itemcontextmenu: this.onViewTemplatesDataViewItemContextMenu,
				containercontextmenu: this.onViewTemplatesDataViewContextMenu,
				itemdblclick: this.onViewTemplatesDataViewItemDblClick,
				render: this.onViewTemplatesGridRender,
				itemclick: this.onViewTemplatesDataViewItemClick
			},
			'editViewsCategory button[name="updateViewCategoryBtn"]': {
				click: this.onUpdateViewCategoryBtnClick
			},
			'viewLibraryManager treepanel tool[name="viewsCategoryAuthorTool"]': {
				click: this.onViewsCategoryAuthorToolClick
			},
			'viewLibraryManager tool[name="viewTemplateAuthorTool"]': {
				click: this.onViewTemplateAuthorToolClick
			}
		});
	},
	onViewLibsBackButtonClick: function() {
		this.getViewLibrariesTab().down('grid[name="viewLibrariesGrid"]').setVisible(true);
		this.getViewLibrariesTab().down('viewLibraryManager').setVisible(false);
		MYOCD.SharedData.currentViewCategory = null;
		Ext.getStore('viewTemplate.ViewTemplates').removeAll();
		Ext.getStore('viewTemplate.ViewCategoriesTreeStore').setRootNode(null);
		Ext.getStore('viewTemplate.ViewCategoriesTreeStore').removeAll();
	},
	onViewCategoriesTreeRender: function(treePanel, eOpts) {
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
	        	MYOCD.SharedData.currentViewTemplateCategoryTreeDropNode = record;
	        	if(data.viewTemplateData) {
	        		treePanel.getSelectionModel().select(record);
	        		var viewLibraryStoreCtl = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
	        		viewLibraryStoreCtl.moveViewTemplate(data.viewTemplateData.id, record, me.getViewLibrariesTab());
	        		return true;
	        	} else {
		        	return false
	        	}
	            return true;
	        }
	    });
    }, 
	onViewCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentViewCategory = record;
		if(record.get('id') == 'root') {
			var viewLibraryStoreCtl = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
			viewLibraryStoreCtl.loadViewTemplatesOfViewLib(MYOCD.SharedData.currentViewLibId);
			return;
		}
		var viewLibraryStoreCtl = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
		viewLibraryStoreCtl.loadViewTemplatesOfViewCategory(record.get('id'));
		//MYOCD.SharedData.currentViewTemplate = null;
	},
	onViewCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		MYOCD.SharedData.currentViewCategory = categoryNode;
		if(categoryNode.get('id') == 'root') {
			var viewLibraryStoreCtl = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
			viewLibraryStoreCtl.loadViewTemplatesOfViewLib(MYOCD.SharedData.currentViewLibId);
			return;
		}
		var viewLibraryStoreCtl = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
		viewLibraryStoreCtl.loadViewTemplatesOfViewCategory(categoryNode.data.id);
		viewLibraryStoreCtl.loadCategoriesOfViewsCategory(categoryNode.data.id, categoryNode);
		//MYOCD.SharedData.currentViewTemplate = null;
	},
	onViewCategoriesTreeItemContextMenu: function( treePanel, record, item, index, e, eOpts ) {
		var me = this;
		MYOCD.SharedData.currentViewsCategoryNodeContextMenu = record;
		e.stopEvent();
		var newCateFunc = function() {
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
				MYOCD.SharedData.AddingChildOnViewNode = record;
				treePanel.ownerCt.getPlugin('cellEditingPlugin').startEdit(newRecord, treePanel.ownerCt.columns[0]);
			});
		}
		var editCateFunc = function() {
			if(me.getEditViewsCategory()) {
				me.getEditViewsCategory().destroy();
			}
			var popup = Ext.create('MYOCD.view.viewTemplate.EditViewsCategory');
			popup.down('textfield[name="viewCategoryName"]').setValue(record.get('name'));
			popup.down('textfield[name="viewCategoryDesc"]').setValue(record.get('description'));
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
					    var viewLibraryStoreCtl = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
					    viewLibraryStoreCtl.deleteViewsCategory();
				    }
			    }
			});
		}
		var copyCateFunc = function() {
			MYOCD.SharedData.viewCategorySourceNode = record;
			MYOCD.SharedData.viewCategorySourceNode.isCut = false;
		}
		var cutCateFunc = function() {
			MYOCD.SharedData.viewCategorySourceNode = record;
			treePanel.ownerCt.getView().addRowCls(record,'opacity-treenode');
			MYOCD.SharedData.currentViewCategoryTree = treePanel;
			MYOCD.SharedData.viewCategorySourceNode.isCut = true;
		}
		var pasteCateFunc = function() {
			var viewLibraryStoreCtl = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
			if(MYOCD.SharedData.viewCategorySourceNode.isCut) {
				viewLibraryStoreCtl.moveViewCategory(MYOCD.SharedData.viewCategorySourceNode, record, me.getViewLibrariesTab());
			} else {
				viewLibraryStoreCtl.copyViewCategory(MYOCD.SharedData.viewCategorySourceNode, record, me.getViewLibrariesTab());

			}
		}
		var securityFunc = function () {
			if(me.getAuthorizationDialog()) {
				me.getAuthorizationDialog().destroy();
			}		
			var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
			if (record.data.id == 'root') {
				popup.down('textfield[name="baseUrl"]').setValue(VIEW_LIB_BASE_URL);
				popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentViewLibId);
			} else {
				popup.down('textfield[name="baseUrl"]').setValue(VIEW_CATEGORY_BASE_URL);
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
						disabled: MYOCD.SharedData.viewCategorySourceNode == null,
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
						disabled: MYOCD.SharedData.viewCategorySourceNode == null,
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
	onViewTemplatesDataViewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: function() {
						if(me.getNewViewTemplateWithTabs()) {
							me.getNewViewTemplateWithTabs().destroy();
						}
						//MYOCD.SharedData.currentViewTemplate = record.data;
						var popup = Ext.create('MYOCD.view.viewTemplate.NewViewTemplateWithTabs');
						popup.setTitle('Edit View Template');
						popup.down('textfield[name="viewTemplateId"]').setValue(record.get('id'));
						popup.down('textfield[name="viewTemplateName"]').setValue(record.get('name'));
						popup.down('textfield[name="viewTemplateDesc"]').setValue(record.get('description'));
						popup.down('button[name="updateViewTemplateBtn"]').hidden = false;
						popup.down('button[name="createNewViewTemplateBtn"]').hidden = true;
						popup.show();
					}
				},
				{
					text: 'Delete',
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Delete View',
						    msg: 'Do you really want to delete this View?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
								    var viewStoreController = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
								    viewStoreController.deleteViewTemplate(record.get('id'), me.getViewLibrariesTab());
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
						popup.down('textfield[name="baseUrl"]').setValue(VIEW_TEMPLATE_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);

	},
	onPermisstionCategoriesContextMenu: function( treePanel, e, eOpts ) {
		var me = this;
		MYOCD.SharedData.currentViewsCategoryNodeContextMenu = null;
		e.stopEvent()
		var root = treePanel.ownerCt.getStore().getRootNode();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Add New Category',
					handler: function() {
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
							MYOCD.SharedData.AddingChildOnViewNode = root;
							treePanel.ownerCt.getPlugin('cellEditingPlugin').startEdit(newRecord, treePanel.ownerCt.columns[0]);
						});
					}
				}
			]
		}).showAt(e.xy);
	},
	onViewCategoriesTreeEdit: function( editor, e, eOpts ) {
		var data = e.record.data;
	    var url;
	    if(data.parentId !== 'root') {
		    url = VIEW_CATEGORY_BASE_URL + data.parentId + '/categories.json'
	    } else {
		    url = VIEW_LIB_BASE_URL + MYOCD.SharedData.currentViewLibId  + '/categories.json'
	    }
	    var categoryName = data.name;
	    if(categoryName.trim().length == 0){
		    Ext.Msg.alert('Missing Category Name', 'Please enter category name');
		    e.record.stores[0].remove(e.record);
		    e.record.destroy();
		    return;
	    }
	    
	    var viewLibraryStoreCtl = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
		viewLibraryStoreCtl.addNewViewCategory(url, categoryName, '', this.getViewLibrariesTab());
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onViewCategoriesTreeCancelEdit: function ( editor, e, eOpts ) {
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onAddNewViewCategoryToolClick: function() {
		var me = this;
		if(MYOCD.SharedData.currentViewCategory == null) {
			var root = Ext.getStore('viewTemplate.ViewCategoriesTreeStore').getRootNode();
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
				MYOCD.SharedData.AddingChildOnViewNode = root;
				me.getViewCategoriesTree().getPlugin('cellEditingPlugin').startEdit(newRecord, me.getViewCategoriesTree().columns[0]);
			});
		} else {
			var record = MYOCD.SharedData.currentViewCategory;
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
				MYOCD.SharedData.AddingChildOnViewNode = record;
				me.getViewCategoriesTree().getPlugin('cellEditingPlugin').startEdit(newRecord, me.getViewCategoriesTree().columns[0]);
			});
		}
	},
	onViewTemplatesDataViewContextMenu: function(dataview, e, eOpts) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Add New View',
					handler: function() {
						if(me.getNewViewTemplateWithTabs()) {
							Ext.WindowManager.bringToFront(me.getNewViewTemplateWithTabs());
							return;
						}
						var popup = Ext.create('MYOCD.view.viewTemplate.NewViewTemplateWithTabs');
						popup.show();
					}
				}
			]
		}).showAt(e.xy);
	},
	onViewTemplatesDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		if(this.getNewViewTemplateWithTabs()) {
			me.getNewViewTemplateWithTabs().destroy();
		}
		//MYOCD.SharedData.currentViewTemplate = record.data;
		var popup = Ext.create('MYOCD.view.viewTemplate.NewViewTemplateWithTabs');
		popup.setTitle('Edit View Template');
		popup.down('textfield[name="viewTemplateId"]').setValue(record.get('id'));
		popup.down('textfield[name="viewTemplateName"]').setValue(record.get('name'));
		popup.down('textfield[name="viewTemplateDesc"]').setValue(record.get('description'));
		popup.down('button[name="updateViewTemplateBtn"]').hidden = false;
		popup.down('button[name="createNewViewTemplateBtn"]').hidden = true;
		popup.show();
	},
	onAddNewViewTemplateToolClick: function() {
		var me = this;
		if(me.getNewViewTemplateWithTabs()) {
			Ext.WindowManager.bringToFront(me.getNewViewTemplateWithTabs());
			return;
		}
		var popup = Ext.create('MYOCD.view.viewTemplate.NewViewTemplateWithTabs');
		popup.show();
	},
	onViewLibraryToggleViewToolClick: function(tool) {
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
		this.getViewLibraryManager().down('dataview[name="viewTemplatesDataView"]').setVisible(!isDataView);
		this.getViewLibraryManager().down('grid[name="viewTemplatesGrid"]').setVisible(isDataView);
	},
	onUpdateViewCategoryBtnClick: function() {
		var categoryName = this.getEditViewsCategory().down('textfield[name="viewCategoryName"]').getValue();
		var categoryDesc = this.getEditViewsCategory().down('textfield[name="viewCategoryDesc"]').getValue();
		if(categoryName.length == 0) {
			return;
		}
		this.getEditViewsCategory().destroy();

		var ViewStoreController = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
		ViewStoreController.editViewsCategory(categoryName, categoryDesc, this.getViewLibrariesTab());
	},
	onViewTemplatesDataViewRender: function(dataview, eOpts) {
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
	                    viewTemplateData: dataview.getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onViewTemplatesGridRender: function(grid, eOpts) {
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
	                    viewTemplateData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onViewsCategoryAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			this.getAuthorizationDialog().destroy();
		}		
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		if (!MYOCD.SharedData.currentViewCategory || MYOCD.SharedData.currentViewCategory.data.id == 'root') {
			popup.down('textfield[name="baseUrl"]').setValue(VIEW_LIB_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentViewLibId);
		} else {
			popup.down('textfield[name="baseUrl"]').setValue(VIEW_CATEGORY_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentViewCategory.data.id);
		}
		popup.show();
	},
	onViewTemplatesDataViewItemClick: function( dataview, record, item, index, e, eOpts ) {
		//MYOCD.SharedData.currentViewTemplate = record.data;	
	},
	onViewTemplateAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			this.getAuthorizationDialog().destroy();
		}
		if (!MYOCD.SharedData.currentViewTemplate) {
			return;
		}
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		popup.down('textfield[name="baseUrl"]').setValue(VIEW_TEMPLATE_BASE_URL);
		popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentViewTemplate.id);
		popup.show(); 
	}
});