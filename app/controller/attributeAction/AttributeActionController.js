Ext.define('MYOCD.controller.attributeAction.AttributeActionController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'attributeAction',
			selector: 'attributeAction'
		},
		{
			ref: 'selectPermissionForAction',
			selector: 'selectPermissionForAction'
		},
		{
			ref: 'setActionPermission',
			selector: 'setActionPermission'
		}
	],
	init: function() {
		this.control({
			'attributeAction': {
				show: this.onAttributeActionShow,
				editaction: this.onAttributeActionEditAction,
				destroy: this.onAttributeActionDestroy
			},
			'setActionPermission grid[name="actionPermissionsGrid"]': {
				render: this.onActionPermissionsGridRender
			},
			'setActionPermission': {
				selectPermissionForAction: this.onSetActionPermissionSelectPermission,
				setPermissionForAction: this.onSetActionPermissionSetPermission
			}
		});
	},
	onAttributeActionShow: function() {
		var attributeId = this.getAttributeAction().down('textfield[name="attributeId"]').getValue();
		var attributeActionStoreController = MYOCD.controller.attributeAction.AttributeActionStoreController;
		attributeActionStoreController.loadActionsOfAttribute(attributeId, this.getAttributeAction());
	},
	onAttributeActionEditAction: function(attributeAction, actionRecord) {
		if (this.getSelectPermissionForAction()) {
			this.getSelectPermissionForAction().destroy();
		}
		var popup = Ext.create('MYOCD.view.attributeAction.SelectPermissionForAction');
		popup.down('textfield[name="actionName"]').setValue(actionRecord.data.secure_action);
		popup.show();
		var refPermissionStoreController = MYOCD.controller.permissionLibrary.RefPermissionLibraryStoreController;
		refPermissionStoreController.loadPermissionLibraries(MYOCD.SharedData.currentCompanyId, popup);
	},
	onAttributeActionDestroy: function() {
		if (this.getSelectPermissionForAction()) {
			this.getSelectPermissionForAction().destroy();
		}
	},
	
	onActionPermissionsGridRender: function(grid, e, eOpts) {
		grid.getStore().removeAll();
		grid.getStore().loadRawData([
				{'action_name': 'find', 'display_action': 'Read Attribute', 'permission_name': '', 'permission_id': ''},
				{'action_name': 'update_attributes', 'display_action': 'Update Attribute', 'permission_name': '', 'permission_id': ''},
				{'action_name': 'read_value', 'display_action': 'Read Attribute Value', 'permission_name': '', 'permission_id': ''},
				{'action_name': 'write_value', 'display_action': 'Write Attribute Value', 'permission_name': '', 'permission_id': ''}
			]);
	},
	onSetActionPermissionSelectPermission: function(actionPermission, actionRecord) {
		if (this.getSelectPermissionForAction()) {
			this.getSelectPermissionForAction().destroy();
		}
		var popup = Ext.create('MYOCD.view.attributeAction.SelectPermissionForAction');
		popup.down('textfield[name="setActionPermission"]').setValue(actionPermission.name);
		popup.down('textfield[name="actionName"]').setValue(actionRecord.data.action_name);
		popup.show();
		var refPermissionStoreController = MYOCD.controller.permissionLibrary.RefPermissionLibraryStoreController;
		refPermissionStoreController.loadPermissionLibraries(MYOCD.SharedData.currentCompanyId, popup);
	},
	onSetActionPermissionSetPermission: function(setActionPermission, attributeId) {
		var attributeActionStoreController = MYOCD.controller.attributeAction.AttributeActionStoreController;
		var actionStore = setActionPermission.down('grid[name="actionPermissionsGrid"]').getStore();
		var actionItems = actionStore.data.items;
		for (var i = 0; i < actionItems.length; i++) {
			if (actionItems[i].data.permission_name.length > 0) {
				attributeActionStoreController.editActionPermission(attributeId, actionItems[i].data.action_name, actionItems[i].data.permission_id);
			}
		}
	}
});