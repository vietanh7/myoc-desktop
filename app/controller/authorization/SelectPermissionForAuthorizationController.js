Ext.define('MYOCD.controller.authorization.SelectPermissionForAuthorizationController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'selectPermissionForAuthorization',
			selector: 'selectPermissionForAuthorization'
		}
	],
	init: function() {
		this.control({
			'authorizationContextPermissions tool[name="selectPermissionTool"]': {
				click: this.onSelectPermissionToolClick
			},
			'selectPermissionForAuthorization dataview[name="selectPermissionRefPermissionLibraryDataview"]': {
				itemdblclick: this.onSelectPermissionRefPermissionLibraryDataviewItemDblClick
			},
			'selectPermissionForAuthorization button[name="selectPermissionRefPermissionLibBackButton"]': {
				click: this.onSelectPermissionRefPermissionLibBackButtonClick
			},
			'selectPermissionForAuthorization treepanel[name="selectPermissionRefPermissionCategoriesTree"]': {
				itemclick: this.onSelectPermissionRefPermissionCategoriesTreeItemClick,
				itemexpand: this.onSelectPermissionRefPermissionCategoriesTreeItemExpand
			},
			'selectPermissionForAuthorization dataview[name="selectPermissionRefPermissionsDataView"]': {
				render: this.onSelectPermissionRefPermissionDataViewRender,
				itemclick: this.onSelectPermissionRefPermissionsDataViewItemClick,
				itemdblclick: this.onSelectPermissionRefPermissionsDataViewItemClick
			},
			'selectPermissionForAuthorization button[name="selectPermissionAcceptPermissionBtn"]': {
				click: this.onSelectPermissionAcceptPermissionBtnClick
			}
		});
	},
	onSelectPermissionToolClick: function() {
		if(this.getSelectPermissionForAuthorization()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.authorization.SelectPermissionForAuthorization');
		popup.show();
		var refPermissionStoreController = MYOCD.controller.permissionLibrary.RefPermissionLibraryStoreController;
		refPermissionStoreController.loadPermissionLibraries(MYOCD.SharedData.currentCompanyId, popup);
	},
	onSelectPermissionRefPermissionLibraryDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefPermissionLibrary = record.data;
		this.getSelectPermissionForAuthorization().down('panel[name="selectPermissionLibraryPanel"]').setVisible(false);
		this.getSelectPermissionForAuthorization().down('panel[name="selectPermissionRefPermissionPanel"]').setVisible(true);
		var refPermissionStoreController = MYOCD.controller.permissionLibrary.RefPermissionLibraryStoreController;
		refPermissionStoreController.loadCategoriesOfPermissionsLib(record.data.id, record.data.name, this.getSelectPermissionForAuthorization());
		refPermissionStoreController.loadPermissionsOfPermissionLib(record.data.id);
	},
	onSelectPermissionRefPermissionLibBackButtonClick: function() {
		this.getSelectPermissionForAuthorization().down('panel[name="selectPermissionLibraryPanel"]').setVisible(true);
		this.getSelectPermissionForAuthorization().down('panel[name="selectPermissionRefPermissionPanel"]').setVisible(false);
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
		this.getSelectPermissionForAuthorization().destroy();
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