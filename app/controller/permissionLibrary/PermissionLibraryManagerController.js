Ext.define('MYOCD.controller.permissionLibrary.PermissionLibraryManagerController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'permissionLibrariesTab',
			selector: 'permissionLibrariesTab'	
		},
		{
			ref: 'permissionLibraryManager',
			selector: 'permissionLibraryManager'
		},
		{
			ref: 'permissonCategoriesTree',
			selector: 'permissionLibraryManager treepanel[name="permissonCategoriesTree"]'
		},
		{
			ref: 'newPermission',
			selector: 'newPermission'
		},
		{
			ref: 'editPermissionsCategory',
			selector: 'editPermissionsCategory'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		}
	],
	init: function() {
		this.control({
			'permissionLibraryManager button[name="permissionLibsBackButton"]': {
				click: this.onPermissionLibsBackButtonClick
			},
			'permissionLibraryManager treepanel[name="permissonCategoriesTree"]': {
				render: this.onPermissionCategoriesTreeRender,
				itemclick: this.onPermissionCategoriesTreeItemClick,
				itemexpand: this.onPermissionCategoriesTreeItemExpand,
				itemcontextmenu: this.onPermissionCategoriesTreeItemContextMenu,
				containercontextmenu: this.onPermisstionCategoriesContextMenu,
				edit: this.onPermissionCategoriesTreeEdit,
				canceledit: this.onPermissionCategoriesTreeCancelEdit
			},
			'permissionLibraryManager tool[name="addNewPermissionsCategoryTool"]': {
				click: this.onAddNewPermissionCategoryToolClick
			},
			'permissionLibraryManager dataview[name="permissionsDataView"]': {
				itemcontextmenu: this.onPermissionsDataViewItemContextMenu,
				containercontextmenu: this.onPermissionsDataViewContextMenu,
				itemdblclick: this.onPermissionsDataViewItemDblClick,
				render: this.onPermissionsDataViewRender,
				itemclick: this.onPermissionDataViewItemClick
			},
			'newPermission button[name="createNewPermissionBtn"]': {
				click: this.onCreateNewPermissionBtnClick
			},
			'permissionLibraryManager tool[name="addNewPermissionTool"]': {
				click: this.onAddNewPermissionToolClick
			},
			'permissionLibraryManager tool[name="permissionLibraryToggleViewTool"]': {
				click: this.onPermissionLibraryToggleViewToolClick
			},
			'permissionLibraryManager grid[name="permissionsGrid"]': {
				itemcontextmenu: this.onPermissionsDataViewItemContextMenu,
				containercontextmenu: this.onPermissionsDataViewContextMenu,
				itemdblclick: this.onPermissionsDataViewItemDblClick,
				render: this.onPermissionsGridRender,
				itemclick: this.onPermissionDataViewItemClick
			},
			'editPermissionsCategory button[name="updatePermissionCategoryBtn"]': {
				click: this.onUpdatePermissionCategoryBtnClick
			},
			'newPermission button[name="updatePermissionBtn"]': {
				click: this.onUpdatePermissionBtnClick
			},
			'permissionLibraryManager treepanel tool[name="permissionCategoryAuthorTool"]': {
				click: this.onPermissionCategoryAuthorToolClick
			},
			'permissionLibraryManager tool[name="permissionAuthorTool"]': {
				click: this.onPermissionAuthorToolClick
			},
			'permissionLibraryManager panel[name="addNewPermissionPanel"] button[name="createNewPermissionBtn"]': {
				click: this.onCreateNewPermissionBtnPanelClick
			}
		});
	},
	onPermissionLibsBackButtonClick: function() {
		this.getPermissionLibrariesTab().down('grid[name="permissionLibrariesGrid"]').setVisible(true);
		this.getPermissionLibrariesTab().down('permissionLibraryManager').setVisible(false);
		MYOCD.SharedData.currentPermissionCategory = null;
		Ext.getStore('permissionLibrary.Permissions').removeAll();
		Ext.getStore('permissionLibrary.PermissionCategoriesTreeStore').setRootNode(null);
		Ext.getStore('permissionLibrary.PermissionCategoriesTreeStore').removeAll();
	},
	onPermissionCategoriesTreeRender: function(treePanel, eOpts) {
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
	        	MYOCD.SharedData.currentPermissionCategoryTreeDropNode = record;
	        	if(data.permissionData) {
	        		treePanel.getSelectionModel().select(record);
	        		var permissionLibraryStoreCtl = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
	        		permissionLibraryStoreCtl.movePermission(data.permissionData.id, record, me.getPermissionLibrariesTab());
	        		return true;
	        	} else {
		        	return false
	        	}
	            return true;
	        }
	    });
    }, 
	onPermissionCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentPermissionCategory = record;
		if(record.get('id') == 'root') {
			var permissionLibraryStoreCtl = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
			permissionLibraryStoreCtl.loadPermissionsOfPermissionLib(MYOCD.SharedData.currentPermissionLibId);
			return;
		}
		var permissionLibraryStoreCtl = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
		permissionLibraryStoreCtl.loadPermissionsOfPermissionCategory(record.get('id'));
		//MYOCD.SharedData.currentPermission = null;
	},
	onPermissionCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		MYOCD.SharedData.currentPermissionCategory = categoryNode;
		if(categoryNode.get('id') == 'root') {
			var permissionLibraryStoreCtl = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
			permissionLibraryStoreCtl.loadPermissionsOfPermissionLib(MYOCD.SharedData.currentPermissionLibId);
			return;
		}
		var permissionLibraryStoreCtl = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
		permissionLibraryStoreCtl.loadPermissionsOfPermissionCategory(categoryNode.data.id);
		permissionLibraryStoreCtl.loadCategoriesOfPermissionsCategory(categoryNode.data.id, categoryNode);
		//MYOCD.SharedData.currentPermission = null;
	},
	onPermissionCategoriesTreeItemContextMenu: function( treePanel, record, item, index, e, eOpts ) {
		var me = this;
		MYOCD.SharedData.currentPermissionsCategoryNodeContextMenu = record;
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
				MYOCD.SharedData.AddingChildOnPermissionNode = record;
				treePanel.ownerCt.getPlugin('cellEditingPlugin').startEdit(newRecord, treePanel.ownerCt.columns[0]);
			});
		}
		var editCateFunc = function() {
			if(me.getEditPermissionsCategory()) {
				return;
			}
			var popup = Ext.create('MYOCD.view.permissionLibrary.EditPermissionsCategory');
			popup.down('textfield[name="permissionCategoryName"]').setValue(record.get('name'));
			popup.down('textfield[name="permissionCategoryDesc"]').setValue(record.get('description'));
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
					    var permissionLibraryStoreCtl = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
					    permissionLibraryStoreCtl.deletePermissionsCategory();
				    }
			    }
			});
		}
		var copyCateFunc = function() {
			MYOCD.SharedData.permissionCategorySourceNode = record;
			MYOCD.SharedData.permissionCategorySourceNode.isCut = false;
		}
		var cutCateFunc = function() {
			MYOCD.SharedData.permissionCategorySourceNode = record;
			treePanel.ownerCt.getView().addRowCls(record,'opacity-treenode');
			MYOCD.SharedData.currentPermissionCategoryTree = treePanel;
			MYOCD.SharedData.permissionCategorySourceNode.isCut = true;
		}
		var pasteCateFunc = function() {
			var permissionLibraryStoreCtl = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
			if(MYOCD.SharedData.permissionCategorySourceNode.isCut) {
				permissionLibraryStoreCtl.movePermissionCategory(MYOCD.SharedData.permissionCategorySourceNode, record, me.getPermissionLibrariesTab());
			} else {
				permissionLibraryStoreCtl.copyPermissionCategory(MYOCD.SharedData.permissionCategorySourceNode, record, me.getPermissionLibrariesTab());

			}
		}
		var securityFunc = function() {
			if(me.getAuthorizationDialog()) {
				me.getAuthorizationDialog().destroy();
			}		
			var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
			if (record.data.id == 'root') {
				popup.down('textfield[name="baseUrl"]').setValue(PERMISSION_LIBS_BASE_URL);
				popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentPermissionLibId);
			} else {
				popup.down('textfield[name="baseUrl"]').setValue(PERMISSION_CATEGORY_BASE_URL);
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
						disabled: MYOCD.SharedData.permissionCategorySourceNode == null,
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
						disabled: MYOCD.SharedData.permissionCategorySourceNode == null,
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
	onPermissionsDataViewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: function() {
						if(me.getNewPermission()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.permissionLibrary.NewPermission');
						popup.setTitle('Edit Permission');
						popup.down('textfield[name="permissionId"]').setValue(record.get('id'));
						popup.down('textfield[name="permissionName"]').setValue(record.get('name'));
						popup.down('textfield[name="permissionDesc"]').setValue(record.get('description'));
						popup.down('button[name="updatePermissionBtn"]').hidden = false;
						popup.down('button[name="createNewPermissionBtn"]').hidden = true;
						popup.show();
					}
				},
				{
					text: 'Delete',
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Delete Permission',
						    msg: 'Do you really want to delete this permission?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
								    var permissionStoreController = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
								    permissionStoreController.deletePermission(record.get('id'), me.getPermissionLibrariesTab());
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
						popup.down('textfield[name="baseUrl"]').setValue(PERMISSION_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);

	},
	onPermisstionCategoriesContextMenu: function( treePanel, e, eOpts ) {
		var me = this;
		MYOCD.SharedData.currentPermissionsCategoryNodeContextMenu = null;
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
							MYOCD.SharedData.AddingChildOnPermissionNode = root;
							treePanel.ownerCt.getPlugin('cellEditingPlugin').startEdit(newRecord, treePanel.ownerCt.columns[0]);
						});
					}
				}
			]
		}).showAt(e.xy);
	},
	onPermissionCategoriesTreeEdit: function( editor, e, eOpts ) {
		var data = e.record.data;
	    var url;
	    if(data.parentId !== 'root') {
		    url = PERMISSION_CATEGORY_BASE_URL + data.parentId + '/categories.json'
	    } else {
		    url = PERMISSION_LIBS_BASE_URL + MYOCD.SharedData.currentPermissionLibId  + '/categories.json'
	    }
	    var categoryName = data.name;
	    if(categoryName.trim().length == 0){
		    Ext.Msg.alert('Missing Category Name', 'Please enter category name');
		    e.record.stores[0].remove(e.record);
		    e.record.destroy();
		    return;
	    }
	    
	    var permissionLibraryStoreCtl = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
		permissionLibraryStoreCtl.addNewPermissionCategory(url, categoryName, '', this.getPermissionLibrariesTab());
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onPermissionCategoriesTreeCancelEdit: function ( editor, e, eOpts ) {
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onAddNewPermissionCategoryToolClick: function() {
		var me = this;
		if(MYOCD.SharedData.currentPermissionCategory == null || MYOCD.SharedData.currentPermissionCategory.data.id == 'root') {
			var root = Ext.getStore('permissionLibrary.PermissionCategoriesTreeStore').getRootNode();
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
				MYOCD.SharedData.AddingChildOnPermissionNode = root;
				me.getPermissonCategoriesTree().getPlugin('cellEditingPlugin').startEdit(newRecord, me.getPermissonCategoriesTree().columns[0]);
			});
		} else {
			var record = MYOCD.SharedData.currentPermissionCategory;
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
				MYOCD.SharedData.AddingChildOnPermissionNode = record;
				me.getPermissonCategoriesTree().getPlugin('cellEditingPlugin').startEdit(newRecord, me.getPermissonCategoriesTree().columns[0]);
			});
		}
	},
	onPermissionsDataViewContextMenu: function(dataview, e, eOpts) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Add New Permission',
					handler: function() {
						// if(me.getNewPermission()) {
						// 	return;
						// }
						// var popup = Ext.create('MYOCD.view.permissionLibrary.NewPermission');
						// popup.show();
						me.getPermissionLibraryManager().down('panel[name="addNewPermissionPanel"]').expand();
					}
				}
			]
		}).showAt(e.xy);
	},
	onPermissionsDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		if(this.getNewPermission()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.permissionLibrary.NewPermission');
		popup.setTitle('Edit Permission');
		popup.down('textfield[name="permissionId"]').setValue(record.get('id'));
		popup.down('textfield[name="permissionName"]').setValue(record.get('name'));
		popup.down('textfield[name="permissionDesc"]').setValue(record.get('description'));
		popup.down('button[name="updatePermissionBtn"]').hidden = false;
		popup.down('button[name="createNewPermissionBtn"]').hidden = true;
		popup.show();
		//MYOCD.SharedData.currentPermission = record.data;
	},
	onCreateNewPermissionBtnClick: function() {
		var permissionName = this.getNewPermission().down('textfield[name="permissionName"]').getValue();
		var permissionDesc = this.getNewPermission().down('textfield[name="permissionDesc"]').getValue();
		if(permissionName.length == 0) {
			return;
		}
		var url;
		if(MYOCD.SharedData.currentPermissionCategory == null || MYOCD.SharedData.currentPermissionCategory.data.id == 'root') {
			url = PERMISSION_LIBS_BASE_URL + MYOCD.SharedData.currentPermissionLibId + '/permissions.json';
		} else {
			url = PERMISSION_CATEGORY_BASE_URL +  MYOCD.SharedData.currentPermissionCategory.data.id + '/permissions.json'; 
		}
		this.getNewPermission().destroy();
		var permissionStoreController = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
		permissionStoreController.addNewPermission(url, permissionName, permissionDesc, this.getPermissionLibrariesTab());
	},
	onAddNewPermissionToolClick: function() {
		// var me = this;
		// if(me.getNewPermission()) {
		// 	return;
		// }
		// var popup = Ext.create('MYOCD.view.permissionLibrary.NewPermission');
		// popup.show();
		this.getPermissionLibraryManager().down('panel[name="addNewPermissionPanel"]').expand();
	},
	onPermissionLibraryToggleViewToolClick: function(tool) {
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
		this.getPermissionLibraryManager().down('dataview[name="permissionsDataView"]').setVisible(!isDataView);
		this.getPermissionLibraryManager().down('grid[name="permissionsGrid"]').setVisible(isDataView);
	},
	onUpdatePermissionCategoryBtnClick: function() {
		var categoryName = this.getEditPermissionsCategory().down('textfield[name="permissionCategoryName"]').getValue();
		var categoryDesc = this.getEditPermissionsCategory().down('textfield[name="permissionCategoryDesc"]').getValue();
		if(categoryName.length == 0) {
			return;
		}
		this.getEditPermissionsCategory().destroy();

		var permissionStoreController = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
		permissionStoreController.editPermissionsCategory(categoryName, categoryDesc, this.getPermissionLibrariesTab());
	},
	onUpdatePermissionBtnClick: function() {
		var permissionId = this.getNewPermission().down('textfield[name="permissionId"]').getValue();
		var permissionName = this.getNewPermission().down('textfield[name="permissionName"]').getValue();
		var permissionDesc = this.getNewPermission().down('textfield[name="permissionDesc"]').getValue();
		if(permissionName.length == 0) {
			return;
		}
	
		this.getNewPermission().destroy();
		
		var permissionStoreController = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
		permissionStoreController.editPermission(permissionId, permissionName, permissionDesc, this.getPermissionLibrariesTab());
	},
	onPermissionsDataViewRender: function(dataview, eOpts) {
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
	                    permissionData: dataview.getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onPermissionsGridRender: function(grid, eOpts) {
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
	                    permissionData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onPermissionCategoryAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}		
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		if (!MYOCD.SharedData.currentPermissionCategory || MYOCD.SharedData.currentPermissionCategory.data.id == 'root') {
			popup.down('textfield[name="baseUrl"]').setValue(PERMISSION_LIBS_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentPermissionLibId);
		} else {
			popup.down('textfield[name="baseUrl"]').setValue(PERMISSION_CATEGORY_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentPermissionCategory.data.id);
		}
		popup.show(); 
	},
	onPermissionDataViewItemClick: function( dataview, record, item, index, e, eOpts ) {
		//MYOCD.SharedData.currentPermission = record.data;
	},
	onPermissionAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}
		if (!MYOCD.SharedData.currentPermission) {
			return;
		}
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		popup.down('textfield[name="baseUrl"]').setValue(PERMISSION_BASE_URL);
		popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentPermission.id);
		popup.show(); 
	},
	onCreateNewPermissionBtnPanelClick: function() {
		var me = this
		var permissionName = me.getPermissionLibraryManager().down('panel[name="addNewPermissionPanel"]').down('textfield[name="newPermissionName"]').getValue();
		var permissionDesc = me.getPermissionLibraryManager().down('panel[name="addNewPermissionPanel"]').down('textfield[name="newPermissionDesc"]').getValue();
		if(permissionName.length == 0) {
			return;
		}
		var url;
		if(MYOCD.SharedData.currentPermissionCategory == null || MYOCD.SharedData.currentPermissionCategory.data.id == 'root') {
			url = PERMISSION_LIBS_BASE_URL + MYOCD.SharedData.currentPermissionLibId + '/permissions.json';
		} else {
			url = PERMISSION_CATEGORY_BASE_URL +  MYOCD.SharedData.currentPermissionCategory.data.id + '/permissions.json'; 
		}
		me.getPermissionLibraryManager().down('panel[name="addNewPermissionPanel"]').down('textfield[name="newPermissionName"]').setValue('');
		me.getPermissionLibraryManager().down('panel[name="addNewPermissionPanel"]').down('textfield[name="newPermissionDesc"]').setValue('');
		var permissionStoreController = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
		permissionStoreController.addNewPermission(url, permissionName, permissionDesc, this.getPermissionLibrariesTab());
	}
});