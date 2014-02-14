Ext.define('MYOCD.controller.workspaceToolbar.securityDialog.SecurityDialogSelectPermissionController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'authorizationTab',
			selector: 'authorizationTab'
		},
		{
			ref: 'securityDialogSelectPermission',
			selector: 'securityDialogSelectPermission'
		}
	],
	init: function() {
		this.control({
			'securityDialogSelectPermission dataview[name="selectPermissionRefPermissionLibraryDataview"]': {
				itemdblclick: this.onSelectPermissionRefPermissionLibraryDataviewItemDblClick
			},
			'securityDialogSelectPermission button[name="selectPermissionRefPermissionLibBackButton"]': {
				click: this.onSelectPermissionRefPermissionLibBackButtonClick
			},
			'securityDialogSelectPermission treepanel[name="selectPermissionRefPermissionCategoriesTree"]': {
				itemclick: this.onSelectPermissionRefPermissionCategoriesTreeItemClick,
				itemexpand: this.onSelectPermissionRefPermissionCategoriesTreeItemExpand
			},
			'securityDialogSelectPermission dataview[name="selectPermissionRefPermissionsDataView"]': {
				render: this.onSelectPermissionRefPermissionDataViewRender,
				itemclick: this.onSelectPermissionRefPermissionsDataViewItemClick,
				itemdblclick: this.onSelectPermissionRefPermissionsDataViewItemClick
			},
			'securityDialogSelectPermission button[name="selectPermissionAcceptPermissionBtn"]': {
				click: this.onSelectPermissionAcceptPermissionBtnClick
			}
		});
	},
	onSelectPermissionRefPermissionLibraryDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefPermissionLibrary = record.data;
		this.getSecurityDialogSelectPermission().down('panel[name="selectPermissionLibraryPanel"]').setVisible(false);
		this.getSecurityDialogSelectPermission().down('panel[name="selectPermissionRefPermissionPanel"]').setVisible(true);
		var refPermissionStoreController = MYOCD.controller.permissionLibrary.RefPermissionLibraryStoreController;
		refPermissionStoreController.loadCategoriesOfPermissionsLib(record.data.id, record.data.name, this.getSecurityDialogSelectPermission());
		refPermissionStoreController.loadPermissionsOfPermissionLib(record.data.id);
	},
	onSelectPermissionRefPermissionLibBackButtonClick: function() {
		this.getSecurityDialogSelectPermission().down('panel[name="selectPermissionLibraryPanel"]').setVisible(true);
		this.getSecurityDialogSelectPermission().down('panel[name="selectPermissionRefPermissionPanel"]').setVisible(false);
		Ext.getStore('permission.RefPermissions').removeAll();
		Ext.getStore('permission.RefPermissionCategoriesTreeStore').setRootNode(null);
		Ext.getStore('permission.RefPermissionCategoriesTreeStore').removeAll();
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
	onSelectPermissionRefPermissionsDataViewItemClick: function ( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentSelectedRefPermission = record.data;
		console.log(MYOCD.SharedData.currentSelectedRefPermissionCategory);
	},
	onSelectPermissionAcceptPermissionBtnClick: function() {
		this.getSecurityDialogSelectPermission().destroy();
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
	}

});