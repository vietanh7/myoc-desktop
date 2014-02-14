Ext.define('MYOCD.controller.roleLibrary.NewRoleController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'	
		},
		{
			ref: 'newRoleWithCustom',
			selector: 'newRoleWithCustom'
		},
		{
			ref: 'newRoleSelectParent',
			selector: 'newRoleSelectParent'
		},
		{
			ref: 'newRoleRefRolesDataView',
			selector: 'newRoleSelectParent dataview[name="newRoleRefRolesDataView"]'
		},
		{
			ref: 'newRolePermissionsGrid',
			selector: 'newRoleWithCustom grid[name="newRolePermissionsGrid"]'
		},
		{
			ref: 'roleLibrariesTab',
			selector: 'roleLibrariesTab'
		},
		{
			ref: 'roleLibraryManager',
			selector: 'roleLibraryManager'
		}
	],
	init: function() {
		this.control({
			'newRoleWithCustom': {
				removepermissionfromrole: this.onNewRoleWithCustomRemovePermissionFromRole
			},
			'newRoleWithCustom button[name="selectParentRoleBtn"]': {
				click: this.onSelectParentRoleBtnClick
			},
			'newRoleSelectParent dataview[name="newRoleRefRoleLibraryDataview"]': {
				itemdblclick: this.onNewRoleRefRoleLibraryDataviewItemDblClick
			},
			'newRoleSelectParent button[name="newRoleRefRoleLibBackButton"]': {
				click: this.onNewRoleRefRoleLibraryBackButtonClick
			},
			'newRoleSelectParent treepanel[name="newRoleRefRoleCategoriesTree"]': {
				itemclick: this.onNewRoleRefRoleCategoriesTreeItemClick,
				itemexpand: this.onNewRoleRefRoleCategoriesTreeItemExpand
			},
			'newRoleSelectParent dataview[name="newRoleRefRolesDataView"]': {
				itemclick: this.onNewRoleRefRolesDataViewClick,
				itemdblclick: this.onNewRoleRefRolesDataViewClick
			},
			'newRoleSelectParent button[name="newRoleAcceptParentBtn"]': {
				click: this.onNewRoleAcceptParentBtnClick
			},
			'newRoleWithCustom button[name="clearRoleParentBtn"]': {
				click: this.onClearRoleParentBtnClick
			},
			'newRoleWithCustom button[name="createNewRoleBtn"]': {
				click: this.onCreateNewRoleBtnClick
			},
			'newRoleWithCustom button[name="updateRoleBtn"]': {
				click: this.onUpdateRoleBtnClick
			},
			'newRoleWithCustom grid[name="newRolePermissionsGrid"]': {
				render: this.onNewRolePermissionsGridRender
			},
			'roleLibraryManager grid[name="newRolePermissionsGrid"]': {
				render: this.onNewRolePermissionsGridPanelRender
			},
			'roleLibraryManager panel[name="addNewRolePanel"] button[name="createNewRoleBtn"]': {
				click: this.onCreateNewRoleBtnPanelClick
			} 

		});
	},
	onSelectParentRoleBtnClick: function() {
		if(this.getNewRoleSelectParent()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.roleLibrary.NewRoleSelectParent');
		popup.show();
		var refRoleStoreController = MYOCD.controller.roleLibrary.RefRoleLibraryStoreController;
		refRoleStoreController.loadRoleLibraries(MYOCD.SharedData.currentCompanyId, this.getNewRoleSelectParent());
	},
	onNewRoleRefRoleLibraryDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefRoleLibrary = record.data;
		this.getNewRoleSelectParent().down('panel[name="newRoleRefRoleLibraryPanel"]').setVisible(false);
		this.getNewRoleSelectParent().down('panel[name="newRoleRefRolePanel"]').setVisible(true);
		var refRoleStoreController = MYOCD.controller.roleLibrary.RefRoleLibraryStoreController;
		refRoleStoreController.loadCategoriesOfRolesLib(record.data.id, record.data.name, this.getNewRoleSelectParent());
		refRoleStoreController.loadRolesOfRoleLib(record.data.id);
	},
	onNewRoleRefRoleLibraryBackButtonClick: function() {
		this.getNewRoleSelectParent().down('panel[name="newRoleRefRoleLibraryPanel"]').setVisible(true);
		this.getNewRoleSelectParent().down('panel[name="newRoleRefRolePanel"]').setVisible(false);
		Ext.getStore('roleLibrary.RefRoles').removeAll();
		Ext.getStore('roleLibrary.RefRoleCategoriesTreeStore').setRootNode(null);
		Ext.getStore('roleLibrary.RefRoleCategoriesTreeStore').removeAll();
	},
	onNewRoleRefRoleCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
		var refRoleStoreController = MYOCD.controller.roleLibrary.RefRoleLibraryStoreController;
		if(record.get('id')!=='root') {
			refRoleStoreController.loadRolesOfRoleCategory(record.get('id'));
		} else {
			refRoleStoreController.loadRolesOfRoleLib(MYOCD.SharedData.currentRefRoleLibrary.id);
		}
    },
    onNewRoleRefRoleCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		var refRoleStoreController = MYOCD.controller.roleLibrary.RefRoleLibraryStoreController;
		if(categoryNode.data.id !== 'root') {
			refRoleStoreController.loadRolesOfRoleCategory(categoryNode.data.id);
			refRoleStoreController.loadCategoriesOfRolesCategory(categoryNode.data.id, categoryNode);
		} else {
			refRoleStoreController.loadRolesOfRoleLib(MYOCD.SharedData.currentRefRoleLibrary.id);
		}
	},
	onNewRoleRefRolesDataViewClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentSelectedRefRole = record.data;
	},
	onNewRoleAcceptParentBtnClick: function() {
		if(!MYOCD.SharedData.currentSelectedRefRole) {
			this.getNewRoleSelectParent().destroy();
			return;
		}
		var me = this;
		var permissionsStore = me.getNewRolePermissionsGrid().getStore();
		this.getNewRoleWithCustom().down('textfield[name="parentRole"]').setValue(MYOCD.SharedData.currentSelectedRefRole.name);
		this.getNewRoleWithCustom().down('textfield[name="parentRoleId"]').setValue(MYOCD.SharedData.currentSelectedRefRole.id);
		this.getNewRoleWithCustom().down('button[name="clearRoleParentBtn"]').setVisible(true);
		this.getNewRoleSelectParent().destroy();
		var callback = function(permissionsData) {
			var records = permissionsStore.data.items;
			var items = [];
			for(var i = 0; i < records.length; i++) {
				if(records[i].data.isInherited) {
					items.push(records[i]);
				}
			}
			permissionsStore.remove(items);
			for(var i = 0; i < permissionsData.permissions.length; i++) {
				var permission = permissionsData.permissions[i];
				permission.isInherited = true;
				permissionsStore.add(permission);
			}
			for(var i = 0; i < permissionsData.inherited_permissions.length; i++) {
				var permission = permissionsData.inherited_permissions[i];
				permission.isInherited = true;
				permissionsStore.add(permission);
			}
		}
		var roleStoreController = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
		roleStoreController.getPermissionsOfRole_callback(MYOCD.SharedData.currentSelectedRefRole.id, callback);
	},
	onClearRoleParentBtnClick: function(btn) {
		btn.setVisible(false);
		this.getNewRoleWithCustom().down('textfield[name="parentRole"]').setValue('');
		this.getNewRoleWithCustom().down('textfield[name="parentRoleId"]').setValue('');
		var me = this;
		var permissionsStore = me.getNewRolePermissionsGrid().getStore();
		var records = permissionsStore.data.items;
		var items = [];
		for(var i = 0; i < records.length; i++) {
			if(records[i].data.isInherited) {
				items.push(records[i]);
			}
		}
		permissionsStore.remove(items);

	}, 
	onCreateNewRoleBtnClick: function() {
		var roleName = this.getNewRoleWithCustom().down('textfield[name="newRoleName"]').getValue();
		var roleDesc = this.getNewRoleWithCustom().down('textfield[name="newRoleDesc"]').getValue();
		var parentIdString = this.getNewRoleWithCustom().down('textfield[name="parentRoleId"]').getValue();
		if(roleName.length == 0) {
			return;
		}
		var parentId = parentIdString.length > 0 ? parentIdString : null;
		var url;
		if(MYOCD.SharedData.currentRoleCategory == null || MYOCD.SharedData.currentRoleCategory.data.id == 'root') {
			url = ROLE_LIBS_BASE_URL + MYOCD.SharedData.currentRoleLibId + '/roles.json'
		} else {
			url = ROLE_CATEGORY_BASE_URL + MYOCD.SharedData.currentRoleCategory.data.id + '/roles.json'
		}
		var permissionsStore = this.getNewRolePermissionsGrid().getStore();
		var records = permissionsStore.data.items;
		var newPermissionArr = [];
		for(var i = 0; i < records.length; i++) {
			if(!records[i].data.isInherited) {
				newPermissionArr.push(records[i].data.id);
			}
		}
		this.getNewRoleWithCustom().destroy();
		var roleLibraryStoreCtl = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
		roleLibraryStoreCtl.addNewRole(url, roleName, roleDesc, parentId, newPermissionArr, this.getRoleLibrariesTab());
	},
	onUpdateRoleBtnClick: function() {
		var roleId = this.getNewRoleWithCustom().down('textfield[name="roleId"]').getValue();
		var roleName = this.getNewRoleWithCustom().down('textfield[name="newRoleName"]').getValue();
		var roleDesc = this.getNewRoleWithCustom().down('textfield[name="newRoleDesc"]').getValue();
		var parentId = this.getNewRoleWithCustom().down('textfield[name="parentRoleId"]').getValue();
		if(roleName.length == 0) {
			return;
		}
		if(parentId.length == 0) {
			parentId = null;
		}
		this.getNewRoleWithCustom().destroy();
		var roleLibraryStoreController = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
		roleLibraryStoreController.editRole(roleId, roleName, roleDesc, parentId, this.getRoleLibrariesTab());
	},
	onNewRoleWithCustomRemovePermissionFromRole: function(panel, grid, roleId, rec) {
		if(roleId.length > 0) {
			var roleLibraryStoreCtl = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
			roleLibraryStoreCtl.removePermissionFromRole(roleId, rec, grid.getStore(), panel);
		} else {
			grid.getStore().remove(rec);
		}
	}, 
	onNewRolePermissionsGridRender: function(grid, e, eOpts) {
		var me = this;
		var parent = grid.up('newRoleWithCustom');
		var newRolePermissionStore = parent.down('grid[name="newRolePermissionsGrid"]').getStore();
		var roleId = parent.down('textfield[name="roleId"]').getValue();
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.permissionData) {
					return false;
				}
				var permissionData = dragData.permissionData;
				var existedRecord = newRolePermissionStore.findRecord('id', permissionData.id);
				if (existedRecord) {
					return true;
				}
				if (roleId.length > 0) {
					var roleStoreController = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
					roleStoreController.addPermissionToRole(roleId, permissionData.id, newRolePermissionStore, me.getNewRoleWithCustom());
					return true;
				} else {
					var path = '';
					if(MYOCD.SharedData.currentSelectedRefPermissionCategory) {
						var node = MYOCD.SharedData.currentSelectedRefPermissionCategory;
						while (node) {
							path = node.data.name + '\\' + path;
							node = node.parentNode;
						}
					} else {
						path = MYOCD.SharedData.currentRefPermissionLibrary.name;
					}
					permissionData.path = path;
					newRolePermissionStore.add(permissionData);
					return true;
				}
	            return false;
	        }
		});
	},
	onNewRolePermissionsGridPanelRender: function(grid, e, eOpts) {
		var me = this;
		var parent = grid.up('newRoleWithCustom');
		var newRolePermissionStore = grid.getStore();
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.permissionData) {
					return false;
				}
				var permissionData = dragData.permissionData;
				var existedRecord = newRolePermissionStore.findRecord('id', permissionData.id);
				if (existedRecord) {
					return true;
				}
				var path = '';
				if(MYOCD.SharedData.currentSelectedRefPermissionCategory) {
					var node = MYOCD.SharedData.currentSelectedRefPermissionCategory;
					while (node) {
						path = node.data.name + '\\' + path;
						node = node.parentNode;
					}
				} else {
					path = MYOCD.SharedData.currentRefPermissionLibrary.name;
				}
				permissionData.path = path;
				newRolePermissionStore.add(permissionData);
				return true;
	        }
		});
	},
	onCreateNewRoleBtnPanelClick: function() {
		var createNewRole = this.getRoleLibraryManager().down('panel[name="addNewRolePanel"]');
		var roleName = createNewRole.down('textfield[name="newRoleName"]').getValue();
		var roleDesc = createNewRole.down('textfield[name="newRoleDesc"]').getValue();
		if(roleName.length == 0) {
			return;
		}
		var url;
		if(MYOCD.SharedData.currentRoleCategory == null || MYOCD.SharedData.currentRoleCategory.data.id == 'root') {
			url = ROLE_LIBS_BASE_URL + MYOCD.SharedData.currentRoleLibId + '/roles.json'
		} else {
			url = ROLE_CATEGORY_BASE_URL + MYOCD.SharedData.currentRoleCategory.data.id + '/roles.json'
		}
		var permissionsStore = createNewRole.down('grid[name="newRolePermissionsGrid"]').getStore();
		var records = permissionsStore.data.items;
		var newPermissionArr = [];
		for(var i = 0; i < records.length; i++) {
			if(!records[i].data.isInherited) {
				newPermissionArr.push(records[i].data.id);
			}
		}
		var roleLibraryStoreCtl = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
		roleLibraryStoreCtl.addNewRole(url, roleName, roleDesc, null, newPermissionArr, this.getRoleLibrariesTab());
	}  
});