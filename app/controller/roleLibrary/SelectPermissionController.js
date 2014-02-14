Ext.define('MYOCD.controller.roleLibrary.SelectPermissionController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'newRoleWithCustom',
			selector: 'newRoleWithCustom'
		},
		{
			ref: 'selectPermissionForRole',
			selector: 'selectPermissionForRole'
		}
	],
	init: function() {
		this.control({
			'newRoleWithCustom tool[name="selectPermissionTool"]': {
				click: this.onSelectPermissionToolClick
			},
			'selectPermissionForRole dataview[name="selectPermissionRefPermissionLibraryDataview"]': {
				itemdblclick: this.onSelectPermissionRefPermissionLibraryDataviewItemDblClick
			},
			'selectPermissionForRole button[name="selectPermissionRefPermissionLibBackButton"]': {
				click: this.onSelectPermissionRefPermissionLibBackButtonClick
			},
			'selectPermissionForRole treepanel[name="selectPermissionRefPermissionCategoriesTree"]': {
				itemclick: this.onSelectPermissionRefPermissionCategoriesTreeItemClick,
				itemexpand: this.onSelectPermissionRefPermissionCategoriesTreeItemExpand
			},
			'selectPermissionForRole dataview[name="selectPermissionRefPermissionsDataView"]': {
				render: this.onSelectPermissionRefPermissionDataViewRender
			},
			'selectPermissionForRole button[name="selectPermissionAcceptPermissionBtn"]': {
				click: this.onSelectPermissionAcceptPermissionBtnClick
			},
			'roleLibraryManager grid[name="newRolePermissionsGrid"] tool[name="selectPermissionTool"]': {
				click: this.onSelectPermissionToolClick
			}
		});
	},
	onSelectPermissionToolClick: function() {
		if(this.getSelectPermissionForRole()) {
			Ext.WindowManager.bringToFront(this.getSelectPermissionForRole());
			return;
		}
		var popup = Ext.create('MYOCD.view.roleLibrary.SelectPermissionForRole');
		popup.show();
		var refPermissionStoreController = MYOCD.controller.permissionLibrary.RefPermissionLibraryStoreController;
		refPermissionStoreController.loadPermissionLibraries(MYOCD.SharedData.currentCompanyId, popup);
	},
	onSelectPermissionRefPermissionLibraryDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefPermissionLibrary = record.data;
		this.getSelectPermissionForRole().down('panel[name="selectPermissionLibraryPanel"]').setVisible(false);
		this.getSelectPermissionForRole().down('panel[name="selectPermissionRefPermissionPanel"]').setVisible(true);
		var refPermissionStoreController = MYOCD.controller.permissionLibrary.RefPermissionLibraryStoreController;
		refPermissionStoreController.loadCategoriesOfPermissionsLib(record.data.id, record.data.name, this.getSelectPermissionForRole());
		refPermissionStoreController.loadPermissionsOfPermissionLib(record.data.id);
	},
	onSelectPermissionRefPermissionLibBackButtonClick: function() {
		this.getSelectPermissionForRole().down('panel[name="selectPermissionLibraryPanel"]').setVisible(true);
		this.getSelectPermissionForRole().down('panel[name="selectPermissionRefPermissionPanel"]').setVisible(false);
		Ext.getStore('permissionLibrary.RefPermissions').removeAll();
		Ext.getStore('permissionLibrary.RefPermissionCategoriesTreeStore').setRootNode(null);
		Ext.getStore('permissionLibrary.RefPermissionCategoriesTreeStore').removeAll();
		MYOCD.SharedData.currentSelectedRefPermissionCategory = null;
		MYOCD.SharedData.currentSelectedRefPermission = null;   
	},
	onSelectPermissionRefPermissionCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
		MYOCD.SharedData.currentSelectedRefPermissionCategory = record; 
		var refPermissionStoreController = MYOCD.controller.permissionLibrary.RefPermissionLibraryStoreController;
		if(record.get('id')!=='root') {
			refPermissionStoreController.loadPermissionsOfPermissionCategory(record.get('id'));
		} else {
			refPermissionStoreController.loadPermissionsOfPermissionLib(MYOCD.SharedData.currentRefPermissionLibrary.id);
		}
    },
    onSelectPermissionRefPermissionCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
    	MYOCD.SharedData.currentSelectedRefPermissionCategory = categoryNode; 
		var refPermissionStoreController = MYOCD.controller.permissionLibrary.RefPermissionLibraryStoreController;
		if(categoryNode.data.id !== 'root') {
			refPermissionStoreController.loadPermissionsOfPermissionCategory(categoryNode.data.id);
			refPermissionStoreController.loadCategoriesOfPermissionsCategory(categoryNode.data.id, categoryNode);
		} else {
			refPermissionStoreController.loadPermissionsOfPermissionLib(MYOCD.SharedData.currentRefPermissionLibrary.id);
		}
	},
	onSelectPermissionRefPermissionDataViewRender: function(dataview, e, eOpts) {
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
	onSelectPermissionAcceptPermissionBtnClick: function() {
		this.getSelectPermissionForRole().destroy();
	}
});