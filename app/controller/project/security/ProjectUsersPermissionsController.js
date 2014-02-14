Ext.define('MYOCD.controller.project.security.ProjectUsersPermissionsController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'projectUsersPermissions',
			selector: 'projectUsersPermissions'
		},
		{
			ref: 'securityDialogSelectPermission',
			selector: 'securityDialogSelectPermission'
		}
	],
	init: function() {
		this.control({
			'projectUsersPermissions grid[name="usersPermissionsGrid"]': {
				render: this.onUsersPermissionsGridRender
			},
			'projectUsersPermissions grid[name="usersPermissionsGrid"] tool[name="selectPermissionTool"]': {
				click: this.onSelectPermissionToolClick
			},
			'projectUsersPermissions': {
				removepermissionfromuser: this.onProjectUsersPermissionRemovePermission
			}
		});
	},
	onUsersPermissionsGridRender: function(grid, e, eOpts) {
		var me = this;
		grid.getStore().removeAll();
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.permissionData) {
					return false;
				}
	            var permissionData = dragData.permissionData;
	            var parent = grid.up('projectUsersPermissions');
				var objectId = parent.down('textfield[name="objectId"]').getValue();
				var baseUrl = parent.down('textfield[name="baseUrl"]').getValue();
				
				if (baseUrl.length == 0) {
					Ext.Msg.alert('Error!', 'Cannot add permission to inherited entity');
					return false;
				}
				var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
				projectStoreController.addPermissionToObject(baseUrl, objectId, permissionData.id, grid.getStore(), parent);
	            return true;
	        }
		});
	},
	onSelectPermissionToolClick: function() {
		if(this.getSecurityDialogSelectPermission()) {
			this.getSecurityDialogSelectPermission().destroy();
		}
		var popup = Ext.create('MYOCD.view.toolbarDialogs.securityDialog.SecurityDialogSelectPermission');
		popup.show();
		var refPermissionStoreController = MYOCD.controller.permissionLibrary.RefPermissionLibraryStoreController;
		refPermissionStoreController.loadPermissionLibraries(MYOCD.SharedData.currentCompanyId, popup);
	},
	onProjectUsersPermissionRemovePermission: function(usersPermissionPanel, grid, objectId, baseUrl, permission) {
		if (baseUrl.length == 0) {
			Ext.Msg.alert('Error!', 'Cannot remove permission from inherited entity');
			return false;
		}
		Ext.Msg.confirm({
		    title: 'Remove Permission',
		    msg: 'Do you really want to remove this permission?',
		    width: 200,
		    buttons: Ext.Msg.YESNO,
		    icon: Ext.Msg.QUESTION,
		    fn: function(btn) {
			    if(btn == 'yes') {
			    	var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
					projectStoreController.removePermissionFromObject(baseUrl, objectId, permission, grid.getStore(), usersPermissionPanel);
			    }
		    }
		});
		
	}
});