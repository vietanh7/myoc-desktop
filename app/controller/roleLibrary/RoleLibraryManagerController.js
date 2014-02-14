Ext.define('MYOCD.controller.roleLibrary.RoleLibraryManagerController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'roleLibrariesTab',
			selector: 'roleLibrariesTab'	
		},
		{
			ref: 'roleLibraryManager',
			selector: 'roleLibraryManager'
		},
		{
			ref: 'roleCategoriesTree',
			selector: 'roleLibraryManager treepanel[name="roleCategoriesTree"]'
		},
		{
			ref: 'newRole',
			selector: 'newRole'
		},
		{
			ref: 'editRolesCategory',
			selector: 'editRolesCategory'
		},
		{
			ref: 'roleDetail',
			selector: 'roleDetail'
		},
		{
			ref: 'newRoleWithCustom',
			selector: 'newRoleWithCustom'
		},
		{
			ref: 'newRolePermissionsGrid',
			selector: 'newRoleWithCustom grid[name="newRolePermissionsGrid"]'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizatonDialog'
		}
	],
	init: function() {
		this.control({
			'roleLibraryManager button[name="roleLibsBackButton"]': {
				click: this.onRoleLibsBackButtonClick
			},
			'roleLibraryManager treepanel[name="roleCategoriesTree"]': {
				render: this.onRoleCategoriesTreeRender,
				itemclick: this.onRoleCategoriesTreeItemClick,
				itemexpand: this.onRoleCategoriesTreeItemExpand,
				itemcontextmenu: this.onRoleCategoriesTreeItemContextMenu,
				containercontextmenu: this.onRoleCategoriesContextMenu,
				edit: this.onRoleCategoriesTreeEdit,
				canceledit: this.onRoleCategoriesTreeCancelEdit
			},
			'roleLibraryManager tool[name="addNewRoleCategoryTool"]': {
				click: this.onAddNewRoleCategoryToolClick
			},
			'roleLibraryManager dataview[name="rolesDataView"]': {
				itemcontextmenu: this.onRolesDataViewItemContextMenu,
				containercontextmenu: this.onRolesDataViewContextMenu,
				itemdblclick: this.onRolesDataViewItemDblClick,
				render: this.onRolesDataViewRender,
				itemclick: this.onRolesDataViewItemClick
			},
			'roleLibraryManager tool[name="addNewRoleTool"]': {
				click: this.onAddNewRoleToolClick
			},
			'roleLibraryManager tool[name="roleLibraryToggleViewTool"]': {
				click: this.onRoleLibraryToggleViewToolClick
			},
			'roleLibraryManager grid[name="rolesGrid"]': {
				itemcontextmenu: this.onRolesDataViewItemContextMenu,
				containercontextmenu: this.onRolesDataViewContextMenu,
				itemdblclick: this.onRolesDataViewItemDblClick,
				render: this.onRolesGridRender,
				itemclick: this.onRolesDataViewItemClick
			},
			'editRolesCategory button[name="updateRoleCategoryBtn"]': {
				click: this.onUpdateRoleCategoryBtnClick
			},
			'roleLibraryManager treepanel tool[name="roleCategoryAuthorTool"]': {
				click: this.onRoleCategoryAuthorToolClick
			},
			'roleLibraryManager tool[name="roleAuthorTool"]': {
				click: this.onRoleAuthorToolClick
			} 
		});
	},
	onRoleLibsBackButtonClick: function() {
		this.getRoleLibrariesTab().down('grid[name="roleLibrariesGrid"]').setVisible(true);
		this.getRoleLibrariesTab().down('roleLibraryManager').setVisible(false);
		MYOCD.SharedData.currentRoleCategory = null;
		Ext.getStore('roleLibrary.Roles').removeAll();
		Ext.getStore('roleLibrary.RoleCategoriesTreeStore').setRootNode(null);
		Ext.getStore('roleLibrary.RoleCategoriesTreeStore').removeAll();
	},
	onRoleCategoriesTreeRender: function(treePanel, eOpts) {
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
	        	MYOCD.SharedData.currentRoleCategoryTreeDropNode = record;
	        	if(data.roleData) {
	        		treePanel.getSelectionModel().select(record);
	        		var roleLibraryStoreCtl = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
	        		roleLibraryStoreCtl.moveRole(data.roleData.id, record, me.getRoleLibrariesTab());
	        		return true;
	        	} else {
		        	return false
	        	}
	            return true;
	        }
	    });
    },
    onRoleCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
	    MYOCD.SharedData.currentRoleCategory = record;
		var roleLibraryStoreCtl = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
		if(record.get('id')!=='root') {
			roleLibraryStoreCtl.loadRolesOfRoleCategory(record.get('id'));
		} else {
			roleLibraryStoreCtl.loadRolesOfRoleLib(MYOCD.SharedData.currentRoleLibId);
		}
		//MYOCD.SharedData.currentRole = null;
    },
    onRoleCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		MYOCD.SharedData.currentRoleCategory = categoryNode;
		var roleLibraryStoreCtl = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
		if(categoryNode.data.id !== 'root') {
			roleLibraryStoreCtl.loadRolesOfRoleCategory(categoryNode.data.id);
			roleLibraryStoreCtl.loadCategoriesOfRolesCategory(categoryNode.data.id, categoryNode);
		} else {
			roleLibraryStoreCtl.loadRolesOfRoleLib(MYOCD.SharedData.currentRoleLibId);
			//roleLibraryStoreCtl.loadCategoriesOfRolesCategory(categoryNode.data.id, categoryNode);
		}
		//MYOCD.SharedData.currentRole = null;
	},
	onRoleCategoriesTreeItemContextMenu: function( treePanel, record, item, index, e, eOpts ) {
		var me = this;
		MYOCD.SharedData.currentRolesCategoryNodeContextMenu = record;
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
				MYOCD.SharedData.AddingChildOnRoleNode = record;
				treePanel.ownerCt.getPlugin('cellEditingPlugin').startEdit(newRecord, treePanel.ownerCt.columns[0]);
			});
		}
		var editCateFunc = function() {
			if(me.getEditRolesCategory()) {
				return;
			}
			var popup = Ext.create('MYOCD.view.roleLibrary.EditRolesCategory');
			popup.down('textfield[name="roleCategoryName"]').setValue(record.get('name'));
			popup.down('textfield[name="roleCategoryDesc"]').setValue(record.get('description'));
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
					    var roleLibraryStoreCtl = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
					    roleLibraryStoreCtl.deleteRolesCategory();
				    }
			    }
			});
		}
		var copyCateFunc = function() {
			MYOCD.SharedData.roleCategorySourceNode = record;
			MYOCD.SharedData.roleCategorySourceNode.isCut = false;
		}
		var cutCateFunc = function() {
			MYOCD.SharedData.roleCategorySourceNode = record;
			treePanel.ownerCt.getView().addRowCls(record,'opacity-treenode');
			MYOCD.SharedData.currentRoleCategoryTree = treePanel;
			MYOCD.SharedData.roleCategorySourceNode.isCut = true;
		}
		var pasteCateFunc = function() {
			var roleLibraryStoreCtl = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
			if(MYOCD.SharedData.roleCategorySourceNode.isCut) {
				roleLibraryStoreCtl.moveRoleCategory(MYOCD.SharedData.roleCategorySourceNode, record, me.getRoleLibrariesTab());
			} else {
				roleLibraryStoreCtl.copyRoleCategory(MYOCD.SharedData.roleCategorySourceNode, record, me.getRoleLibrariesTab());

			}
		}
		var securityFunc = function () {
			if(me.getAuthorizationDialog()) {
				me.getAuthorizationDialog().destroy();
			}		
			var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
			if (record.data.id == 'root') {
				popup.down('textfield[name="baseUrl"]').setValue(ROLE_LIBS_BASE_URL);
				popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentRoleLibId);
			} else {
				popup.down('textfield[name="baseUrl"]').setValue(ROLE_CATEGORY_BASE_URL);
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
						disabled: MYOCD.SharedData.roleCategorySourceNode == null,
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
						disabled: MYOCD.SharedData.roleCategorySourceNode == null,
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
	onRoleCategoriesContextMenu: function(treePanel, e, eOpts) {
		e.stopEvent();
	},
	onRoleCategoriesTreeEdit: function(editor, e, eOpts) {
		var data = e.record.data;
	    var url;
	    if(data.parentId !== 'root') {
		    url = ROLE_CATEGORY_BASE_URL + data.parentId + '/categories.json'
	    } else {
		    url = ROLE_LIBS_BASE_URL + MYOCD.SharedData.currentRoleLibId  + '/categories.json'
	    }
	    var categoryName = data.name;
	    if(categoryName.trim().length == 0){
		    Ext.Msg.alert('Missing Category Name', 'Please enter category name');
		    e.record.stores[0].remove(e.record);
		    e.record.destroy();
		    return;
	    }
	    
	    var roleLibraryStoreCtl = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
		roleLibraryStoreCtl.addNewRoleCategory(url, categoryName, '', this.getRoleLibrariesTab());
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onRoleCategoriesTreeCancelEdit: function(editor, e, eOpts) {
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onAddNewRoleCategoryToolClick : function() {
		var me = this;
		if(MYOCD.SharedData.currentRoleCategory == null || MYOCD.SharedData.currentRoleCategory.data.id == 'root') {
			var root = Ext.getStore('roleLibrary.RoleCategoriesTreeStore').getRootNode();
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
				MYOCD.SharedData.AddingChildOnRoleNode = root;
				me.getRoleCategoriesTree().getPlugin('cellEditingPlugin').startEdit(newRecord, me.getRoleCategoriesTree().columns[0]);
			});
		} else {
			var record = MYOCD.SharedData.currentRoleCategory;
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
				MYOCD.SharedData.AddingChildOnRoleNode = record;
				me.getRoleCategoriesTree().getPlugin('cellEditingPlugin').startEdit(newRecord, me.getRoleCategoriesTree().columns[0]);
			});
		}
	},
	onRolesDataViewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: function() {
						if(me.getNewRoleWithCustom()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.roleLibrary.NewRoleWithCustom');
						popup.setTitle('Edit Role');
						popup.down('textfield[name="roleId"]').setValue(record.get('id'));
						popup.down('textfield[name="newRoleName"]').setValue(record.get('name'));
						popup.down('textfield[name="newRoleDesc"]').setValue(record.get('description'));
						popup.down('button[name="updateRoleBtn"]').hidden = false;
						popup.down('button[name="createNewRoleBtn"]').hidden = true;
						popup.show();
						var callback = function(role) {
							var parentRole = role.base_roles[0];
							if(parentRole) {
								popup.down('textfield[name="parentRoleId"]').setValue(parentRole.id);
								popup.down('textfield[name="parentRole"]').setValue(parentRole.name);
								popup.down('button[name="clearRoleParentBtn"]').setVisible(true);
							}
						}
						var roleStoreController = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
						//roleStoreController.getRoleInfo(record.get('id'), popup, callback);
						roleStoreController.getPermissionsOfRole(record.get('id'), me.getNewRolePermissionsGrid().getStore());
					}
				},
				{
					text: 'Delete',
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Delete Role',
						    msg: 'Do you really want to delete this role?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
								    var roleStoreController = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
								    roleStoreController.deleteRole(record.get('id'), me.getRoleLibrariesTab());
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
						popup.down('textfield[name="baseUrl"]').setValue(ROLE_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	},
	onRolesDataViewContextMenu: function(dataview, e, eOpts) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Add New Role',
					handler: function() {
						// if(me.getNewRoleWithCustom()) {
						// 	return;
						// }
						// var popup = Ext.create('MYOCD.view.roleLibrary.NewRoleWithCustom');
						// popup.show();
						// me.getNewRolePermissionsGrid().getStore().removeAll();
						me.getRoleLibraryManager().down('panel[name="addNewRolePanel"]').down('grid[name="newRolePermissionsGrid"]').getStore().removeAll();
						me.getRoleLibraryManager().down('panel[name="addNewRolePanel"]').expand();
					}
				}
			]
		}).showAt(e.xy);
	},
	onAddNewRoleToolClick: function() {
		// if(this.getNewRoleWithCustom()) {
		// 	return
		// }
		// var popup = Ext.create('MYOCD.view.roleLibrary.NewRoleWithCustom');
		// popup.show();
		// this.getNewRolePermissionsGrid().getStore().removeAll();
		this.getRoleLibraryManager().down('panel[name="addNewRolePanel"]').down('grid[name="newRolePermissionsGrid"]').getStore().removeAll();
		this.getRoleLibraryManager().down('panel[name="addNewRolePanel"]').expand();
	},
	onRoleLibraryToggleViewToolClick: function(tool) {
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
		this.getRoleLibraryManager().down('dataview[name="rolesDataView"]').setVisible(!isDataView);
		this.getRoleLibraryManager().down('grid[name="rolesGrid"]').setVisible(isDataView);
	},
	onUpdateRoleCategoryBtnClick: function() {
		var categoryName = this.getEditRolesCategory().down('textfield[name="roleCategoryName"]').getValue();
		var categoryDesc = this.getEditRolesCategory().down('textfield[name="roleCategoryDesc"]').getValue();
		if(categoryName.length == 0) {
			return;
		}
		this.getEditRolesCategory().destroy();

		var roleStoreController = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
		roleStoreController.editRolesCategory(categoryName, categoryDesc, this.getRoleLibrariesTab());
	},
	onRolesDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		if(this.getNewRoleWithCustom()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.roleLibrary.NewRoleWithCustom');
		popup.setTitle('Edit Role');
		popup.down('textfield[name="roleId"]').setValue(record.get('id'));
		popup.down('textfield[name="newRoleName"]').setValue(record.get('name'));
		popup.down('textfield[name="newRoleDesc"]').setValue(record.get('description'));
		popup.down('button[name="updateRoleBtn"]').hidden = false;
		popup.down('button[name="createNewRoleBtn"]').hidden = true;
		popup.show();
		
		var callback = function(role) {
			var parentRole = role.base_roles[0];
			if(parentRole) {
				popup.down('textfield[name="parentRoleId"]').setValue(parentRole.id);
				popup.down('textfield[name="parentRole"]').setValue(parentRole.name);
				popup.down('button[name="clearRoleParentBtn"]').setVisible(true);
			}
		}
		//MYOCD.SharedData.currentRole = record.data;
		var roleStoreController = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
		//roleStoreController.getRoleInfo(record.get('id'), popup, callback);
		roleStoreController.getPermissionsOfRole(record.get('id'), this.getNewRolePermissionsGrid().getStore());
	},
	onRolesDataViewRender: function(dataview, eOpts) {
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
	                    roleData: dataview.getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onRolesGridRender: function(grid, eOpts) {
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
	                    roleData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onRoleCategoryAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}		
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		if (!MYOCD.SharedData.currentRoleCategory || MYOCD.SharedData.currentRoleCategory.data.id == 'root') {
			popup.down('textfield[name="baseUrl"]').setValue(ROLE_LIBS_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentRoleLibId);
		} else {
			popup.down('textfield[name="baseUrl"]').setValue(ROLE_CATEGORY_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentRoleCategory.data.id);
		}
		popup.show(); 
	},
	onRolesDataViewItemClick: function( dataview, record, item, index, e, eOpts ) {
		//MYOCD.SharedData.currentRole = record.data;
	},
	onRoleAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}
		if (!MYOCD.SharedData.currentRole) {
			return;
		}
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		popup.down('textfield[name="baseUrl"]').setValue(ROLE_BASE_URL);
		popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentRole.id);
		popup.show(); 
	}
});