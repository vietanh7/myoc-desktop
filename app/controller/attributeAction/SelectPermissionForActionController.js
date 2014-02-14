Ext.define('MYOCD.controller.attributeAction.SelectPermissionForActionController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'attributeAction',
			selector: 'attributeAction'
		},
		{
			ref: 'selectPermissionForAction',
			selector: 'selectPermissionForAction'
		}
	],
	init: function() {
		this.control({
			'selectPermissionForAction dataview[name="selectPermissionRefPermissionLibraryDataview"]': {
				itemdblclick: this.onSelectPermissionRefPermissionLibraryDataviewItemDblClick
			},
			'selectPermissionForAction button[name="selectPermissionRefPermissionLibBackButton"]': {
				click: this.onSelectPermissionRefPermissionLibBackButtonClick
			},
			'selectPermissionForAction treepanel[name="selectPermissionRefPermissionCategoriesTree"]': {
				itemclick: this.onSelectPermissionRefPermissionCategoriesTreeItemClick,
				itemexpand: this.onSelectPermissionRefPermissionCategoriesTreeItemExpand
			},
			'selectPermissionForAction dataview[name="selectPermissionRefPermissionsDataView"]': {
				itemclick: this.onSelectPermissionRefPermissionsDataViewItemClick,
				itemdblclick: this.onSelectPermissionRefPermissionsDataViewItemClick
			},
			'selectPermissionForAction button[name="selectPermissionAcceptPermissionBtn"]': {
				click: this.onSelectPermissionAcceptPermissionBtnClick
			}
		});
	},
	onSelectPermissionRefPermissionLibraryDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefPermissionLibrary = record.data;
		this.getSelectPermissionForAction().down('panel[name="selectPermissionLibraryPanel"]').setVisible(false);
		this.getSelectPermissionForAction().down('panel[name="selectPermissionRefPermissionPanel"]').setVisible(true);
		var refPermissionStoreController = MYOCD.controller.permissionLibrary.RefPermissionLibraryStoreController;
		refPermissionStoreController.loadCategoriesOfPermissionsLib(record.data.id, record.data.name, this.getSelectPermissionForAction());
		refPermissionStoreController.loadPermissionsOfPermissionLib(record.data.id);
	},
	onSelectPermissionRefPermissionLibBackButtonClick: function() {
		this.getSelectPermissionForAction().down('panel[name="selectPermissionLibraryPanel"]').setVisible(true);
		this.getSelectPermissionForAction().down('panel[name="selectPermissionRefPermissionPanel"]').setVisible(false);
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
	},
	onSelectPermissionAcceptPermissionBtnClick: function() {
		var setPermissionActionName = this.getSelectPermissionForAction().down('textfield[name="setActionPermission"]').getValue();
		if ((!this.getAttributeAction() && setPermissionActionName.length == 0) || !MYOCD.SharedData.currentSelectedRefPermission ) {
			this.getSelectPermissionForAction().destroy();
			return;
		}
		if (setPermissionActionName.length > 0) {
			var actionName = this.getSelectPermissionForAction().down('textfield[name="actionName"]').getValue();
			var setActionPermissionQuery = 'setActionPermission[name="'+setPermissionActionName+'"]';
			var currentSetActionPermission = Ext.ComponentQuery.query(setActionPermissionQuery)[0];
			var actionStore = currentSetActionPermission.down('grid[name="actionPermissionsGrid"]').getStore();
			var actionRecordIndex = actionStore.findExact('action_name', actionName);
			console.log(actionRecordIndex);
			var actionRecord = actionStore.getAt(actionRecordIndex);
			actionRecord.set('permission_id', MYOCD.SharedData.currentSelectedRefPermission.id);
			actionRecord.set('permission_name', MYOCD.SharedData.currentSelectedRefPermission.name);
			actionRecord.commit();
			

		} else {
			var attributeId = this.getAttributeAction().down('textfield[name="attributeId"]').getValue();
			var attributeActionName = this.getSelectPermissionForAction().down('textfield[name="actionName"]').getValue();
			var attributeActionStoreController = MYOCD.controller.attributeAction.AttributeActionStoreController;
			attributeActionStoreController.editActionPermission(attributeId, attributeActionName, MYOCD.SharedData.currentSelectedRefPermission.id, this.getAttributeAction());
		}
		this.getSelectPermissionForAction().destroy();
		MYOCD.SharedData.currentSelectedRefPermission = null;
	}

});