Ext.define('MYOCD.controller.workspaceToolbar.securityDialog.SecurityController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'securityDialog',
			selector: 'securityDialog'	
		},
		{
			ref: 'authorizationTab',
			selector: 'authorizationTab'
		},
		{
			ref: 'securityDialogSelectRole',
			selector: 'securityDialogSelectRole'
		},
		{
			ref: 'rolesTab',
			selector: 'rolesTab'
		},
		{
			ref: 'securityDialogEditRole',
			selector: 'securityDialogEditRole'
		},
		{
			ref: 'securityDialogSelectPermission',
			selector: 'securityDialogSelectPermission'
		},
		{
			ref: 'contactsDialog',
			selector: 'contactsDialog'
		},
		{
			ref: 'securityDialogEditAssignedItem',
			selector: 'authorizationTab securityDialogEditAssignedItem'
		},
		{
			ref: 'usersPermissions',
			selector: 'authorizationTab usersPermissions'
		},
		{
			ref: 'securityDialogSelectCompanyRole',
			selector: 'securityDialogSelectCompanyRole'
		}

		
	],
	companyStoreController: MYOCD.controller.company.CompaniesStoreController,
	init: function() {
		this.control({
			'rolesTab tool[name="selectAccountTool"]': {
				click: this.onAuthorizationTabSelectAccountToolClick
			},
			'rolesTab dataview[name="companyRolesDataView"]': {
				render: this.onCompanyRolesDataViewRender,
				itemdblclick: this.onCompanyRolesDataViewItemDblClick,
				itemcontextmenu: this.onCompanyRolesDataViewItemContextMenu
			},
			'securityDialogEditRole' : {
				removepermissionfromrole: this.onSecurityDialogEditRoleRemovePermission,
				show: this.onSecurityEditRoleShow
			},
			'securityDialogEditRole grid[name="editRolePermissionsGrid"]': {
				render: this.onEditRolePermissionGridRender
			},
			'securityDialogEditRole grid[name="editRolePermissionsGrid"] tool[name="selectPermissionTool"]': {
				click: this.onSelectPermissionToolClick
			},
			'authorizationTab tool[name="openContactTool"]': {
				click: this.onOpenContactToolClick
			},
			'authorizationTab tool[name="addAuthorizationTool"]': {
				click: this.onAddAuthorizationToolClick
			},
			'authorizationTab tool[name="assignAuthorizationTool"]': {
				click: this.onAssignAuthorizationToolClick
			},
			'authorizationTab grid[name="authorizationRoleGrid"]': {
				render: this.onAuthorizationRoleGridRender,
				itemclick: this.onAuthorizationRoleGridItemClick,
				itemdblclick: this.onAuthorizationRoleGridItemClick,
				itemcontextmenu: this.onAuthorizationRoleGridItemContextMenu	
			},
			'authorizationTab dataview[name="assignedOrgsDataView"]': {
				render: this.onAssignedOrgsDataViewRender,
				//itemdblclick: this.onAssgnedItemDblClick,
				itemcontextmenu: this.onAssignedItemContextMenu
			},
			'securityDialogEditAssignedItem' : {
				removepermissionfromrole: this.onSecurityDialogEditAssignedItemRemovePermission
			},
			'securityDialogEditAssignedItem grid[name="editAssignedPermissionsGrid"]': {
				render: this.onEditAssignedPermissionGridRender
			},
			'securityDialogEditAssignedItem grid[name="editAssignedPermissionsGrid"] tool[name="selectPermissionTool"]': {
				click: this.onSelectPermissionToolClick
			},
			'authorizationTab usersPermissions grid[name="usersPermissionsGrid"]': {
				render: this.onUsersPermissionsGridRender
			},
			'authorizationTab usersPermissions grid[name="usersPermissionsGrid"] tool[name="selectPermissionTool"]': {
				click: this.onSelectPermissionToolClick
			},
			'usersPermissions' : {
				removepermissionfromuser: this.onUsersPermissionsItemRemovePermission
			},
		});
	},
	onAuthorizationTabSelectAccountToolClick: function(tool, e, eOpts) {
		var me = this;
		var popup;
		if(me.getSecurityDialogSelectRole()) {
			popup = me.getSecurityDialogSelectRole();
			Ext.WindowManager.bringToFront(me.getSecurityDialogSelectRole());
		} else {
			popup = Ext.create('MYOCD.view.toolbarDialogs.securityDialog.SecurityDialogSelectRole');
			popup.show();
		}
		var refRoleStoreController = MYOCD.controller.roleLibrary.RefRoleLibraryStoreController;
		refRoleStoreController.loadRoleLibraries(MYOCD.SharedData.currentCompanyId, popup);
	},
	onCompanyRolesDataViewRender: function(dataview, e, eOpts) {
		var me = this;
		dataview.getStore().removeAll()
		dataview.dropZone = new Ext.dd.DropZone(dataview.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.roleData) {
					return false;
				}
	            var roleData = dragData.roleData;
	            var companyStoreController = MYOCD.controller.company.CompaniesStoreController;
	            companyStoreController.addRoleToCompany(MYOCD.SharedData.currentCompanyId, roleData.id, dataview);
	            return true;
	        }
		});
	},
	onCompanyRolesDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		var popup;
		if (this.getSecurityDialogEditRole()) {
			popup = this.getSecurityDialogEditRole();
			Ext.WindowManager.bringToFront(this.getSecurityDialogEditRole());
		} else {
			var popup = Ext.create('MYOCD.view.toolbarDialogs.securityDialog.SecurityDialogEditRole');
			popup.show();
		}
		popup.down('textfield[name="roleId"]').setValue(record.data.id)
		popup.down('textfield[name="roleName"]').setValue(record.data.name);
		popup.down('textfield[name="roleDesc"]').setValue(record.data.description);
		
		var companyStoreController = MYOCD.controller.company.CompaniesStoreController;
		companyStoreController.getPermissionsOfRole(record.data.id, popup.down('grid[name="editRolePermissionsGrid"]').getStore(), popup);
	},
	onCompanyRolesDataViewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Remove',
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Remove Role',
						    msg: 'Do you really want to remove this role?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
							    	var companyStoreController = MYOCD.controller.company.CompaniesStoreController;
							    	companyStoreController.deleteRole(MYOCD.SharedData.currentCompanyId.toString(), record.data.id);
							    }
						    }
						});
					}
				}
			]
		}).showAt(e.xy);	
	},
	onSecurityDialogEditRoleRemovePermission: function(editRoleDialog, grid, roleId, permission) {
		Ext.Msg.confirm({
		    title: 'Remove Permission',
		    msg: 'Do you really want to remove this permission?',
		    width: 200,
		    buttons: Ext.Msg.YESNO,
		    icon: Ext.Msg.QUESTION,
		    fn: function(btn) {
			    if(btn == 'yes') {
			    	var companyStoreController = MYOCD.controller.company.CompaniesStoreController;
					companyStoreController.removePermissionFromRole(roleId, permission, grid.getStore(), editRoleDialog);
			    }
		    }
		});
	},
	onSecurityEditRoleShow: function() {
		var roleId = this.getSecurityDialogEditRole().down('textfield[name="roleId"]').getValue();
		var store = this.getSecurityDialogEditRole().down('grid[name="editRolePermissionsGrid"]').getStore();
		if (roleId.length == 0 || store.data.items.length > 0) {
			return;
		}
		var companyStoreController = MYOCD.controller.company.CompaniesStoreController;
		companyStoreController.getPermissionsOfRole(roleId, store);
	},
	onSelectPermissionToolClick: function() {
		var popup;
		if(this.getSecurityDialogSelectPermission()) {
			popup = this.getSecurityDialogSelectPermission();
			Ext.WindowManager.bringToFront(this.getSecurityDialogSelectPermission())
		} else {
			popup = Ext.create('MYOCD.view.toolbarDialogs.securityDialog.SecurityDialogSelectPermission');
			popup.show();
		}
		var refPermissionStoreController = MYOCD.controller.permissionLibrary.RefPermissionLibraryStoreController;
		refPermissionStoreController.loadPermissionLibraries(MYOCD.SharedData.currentCompanyId, popup);
	},
	onEditRolePermissionGridRender: function(grid, e, eOpts) {
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
	            var parent = grid.up('securityDialogEditRole');
				var roleId = parent.down('textfield[name="roleId"]').getValue();
	            var companyStoreController = MYOCD.controller.company.CompaniesStoreController;
	            companyStoreController.addPermissionToRole(roleId, permissionData.id, grid.getStore(), parent);
	            return true;
	        }
		});
	},
	onAddAuthorizationToolClick: function(tool, e, eOpts) {
		var me = this;
		e.stopEvent();
		var popup;
		if(me.getSecurityDialogSelectRole()) {
			popup = me.getSecurityDialogSelectRole();
			Ext.WindowManager.bringToFront(me.getSecurityDialogSelectRole());
		} else {
			popup = Ext.create('MYOCD.view.toolbarDialogs.securityDialog.SecurityDialogSelectRole');
			popup.show();
		}
		var refRoleStoreController = MYOCD.controller.roleLibrary.RefRoleLibraryStoreController;
		refRoleStoreController.loadRoleLibraries(MYOCD.SharedData.currentCompanyId, popup);
		MYOCD.controller.main.ContactStoreController.loadContact();
	},
	onAssignAuthorizationToolClick: function(tool, e, eOpts) {
		var me = this;
		e.stopEvent();
		var popup;
		if(me.getSecurityDialogSelectCompanyRole()) {
			popup = me.getSecurityDialogSelectCompanyRole();
			Ext.WindowManager.bringToFront(me.getSecurityDialogSelectCompanyRole());
		} else {
			popup = Ext.create('MYOCD.view.toolbarDialogs.securityDialog.SecurityDialogSelectCompanyRole');
			popup.show();
		}	
		MYOCD.controller.main.ContactStoreController.loadContact();
	},
	onOpenContactToolClick: function() {
		if (this.getContactsDialog()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.toolbarDialogs.ContactsDialog');
		popup.show();
		var contactStoreController = MYOCD.controller.main.ContactStoreController;
		contactStoreController.loadContact(popup);	
	},
	onAuthorizationRoleGridRender: function(grid, e, eOpts) {
		var me = this;
		grid.getStore().removeAll();
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.orgContactData && !dragData.peopleContactData && ! dragData.roleData) {
					return false;
				}
				if (dragData.roleData) {
					var companyStoreController = MYOCD.controller.company.CompaniesStoreController;
					companyStoreController.addRoleToCompany(MYOCD.SharedData.currentCompanyId, dragData.roleData.id, grid);
					return true;
				}
				var partnerId = dragData.orgContactData != null ? dragData.orgContactData.id : dragData.peopleContactData.id;
				me.companyStoreController.addPartnerToCompany(MYOCD.SharedData.currentCompanyId, partnerId, me.getSecurityDialog());
	            return true;
	        }
		});
	},
	onAuthorizationRoleGridItemClick: function( grid, record, item, index, e, eOpts )  {
		var me = this;
		if (record.data.type == 'Role') {
			MYOCD.SharedData.currentSecurityRole = record;
			this.companyStoreController.loadAssignedItemsOfRole(record.data.id);
			this.getSecurityDialogEditRole().down('textfield[name="roleId"]').setValue(record.data.id)
			var companyStoreController = MYOCD.controller.company.CompaniesStoreController;
			companyStoreController.getPermissionsOfRole(record.data.id, this.getSecurityDialogEditRole().down('grid[name="editRolePermissionsGrid"]').getStore());
			this.getAuthorizationTab().down('tabpanel[name="roleContentPanel"]').setVisible(true);
			this.getAuthorizationTab().down('panel[name="usersPermissionPanel"]').setVisible(false);
		} else {
			this.getAuthorizationTab().down('tabpanel[name="roleContentPanel"]').setVisible(false);
			this.getAuthorizationTab().down('panel[name="usersPermissionPanel"]').setVisible(true);
			var baseUrl;
			switch(record.data.type) {
				case 'Company': 
					baseUrl = COMPANIES_BASE_URL;
					break;
				case 'EmployeeProfile': 
					baseUrl = EMPLOYEE_PROFILES_BASE_URL;
					break;
				case 'PersonalProfile':
					baseUrl = PERSONAL_PROFILES_BASE_URL;
					break;
			}
			this.getUsersPermissions().down('textfield[name="objectId"]').setValue(record.data.id);
			this.getUsersPermissions().down('textfield[name="baseUrl"]').setValue(baseUrl);
			this.companyStoreController.getAssignedPermissionsOfObject(baseUrl, record.data.id, 
				this.getUsersPermissions().down('grid[name="usersPermissionsGrid"]').getStore(), 
				this.getUsersPermissions());
		}
		
	},
	onAuthorizationRoleGridItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Remove',
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Remove Authorized Entities',
						    msg: 'Do you really want to remove this entity?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
							    	var companyStoreController = MYOCD.controller.company.CompaniesStoreController;
							    	if (record.data.type == "Role") {
							    		companyStoreController.deleteRole(MYOCD.SharedData.currentCompanyId.toString(), record.data.id, me.getSecurityDialog());
									} else {
										companyStoreController.removePartnerFromCompany(MYOCD.SharedData.currentCompanyId, record.data.id, me.getSecurityDialog());
									}
							    	
							    }
						    }
						});
					}
				}
			]
		}).showAt(e.xy);	
	},
	onAssignedOrgsDataViewRender: function(dataview, e, eOpts) {
		var me = this;
		dataview.dropZone = new Ext.dd.DropZone(dataview.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.orgContactData && !dragData.peopleContactData && !dragData.roleData) {
					return false;
				}
				if (!MYOCD.SharedData.currentSecurityRole) {
					Ext.Msg.alert('Error!', 'Please select a role');
					return false;
				}
				if (dragData.orgContactData) {
					var orgData = dragData.orgContactData ;
		            if (orgData.type == 'Company') {
			            me.companyStoreController.assignRoleToCompany(MYOCD.SharedData.currentSecurityRole.data.id, orgData.id, dataview);
		            }
		            return true;
				} 
				if (dragData.peopleContactData) {
					console.log ('People Contact Data', dragData.peopleContactData);
					var peopleData = dragData.peopleContactData;
		            if (peopleData.type == 'EmployeeProfile') {
			            me.companyStoreController.assignRoleToEmployeeProfile(MYOCD.SharedData.currentSecurityRole.data.id, peopleData.id, dataview);
		            }
		            if (peopleData.type == 'PersonalProfile') {
			            me.companyStoreController.assignRoleToPersonalProfile(MYOCD.SharedData.currentSecurityRole.data.id, peopleData.id, dataview);
		            }
		            return true;
				}
				if (dragData.roleData) {
					var roleData = dragData.roleData;
					me.companyStoreController.assignRoleToRole(MYOCD.SharedData.currentSecurityRole.data.id, roleData.id, dataview);
					return true
				}
				return false;
	            
	        }
		});
	},
	onAssgnedItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		var popup;
		if (this.getSecurityDialogEditAssignedItem()) {
			Ext.WindowManager.bringToFront(this.getSecurityDialogEditAssignedItem());
			popup = this.getSecurityDialogEditAssignedItem();
		} else {
			 popup = Ext.create('MYOCD.view.toolbarDialogs.securityDialog.SecurityDialogEditAssignedItem');
			 popup.show();
		}
		var baseUrl;
		switch(record.data.type) {
			case 'Role': 
				baseUrl = ROLE_BASE_URL;
				break;
			case 'Company': 
				baseUrl = COMPANIES_BASE_URL;
				return;
				break;
			case 'EmployeeProfile': 
				baseUrl = EMPLOYEE_PROFILES_BASE_URL;
				return;
				break;
			case 'PersonalProfile': 
				baseUrl = PERSONAL_PROFILES_BASE_URL;
				return;
				break;
		}
		popup.down('textfield[name="baseUrl"]').setValue(baseUrl);
		popup.down('textfield[name="objectId"]').setValue(record.data.id);
		popup.down('textfield[name="objectName"]').setValue(record.data.name);
		popup.down('textfield[name="objectDesc"]').setValue(record.data.description);
		me.companyStoreController.getAssignedPermissionsOfObject(baseUrl, record.data.id, popup.down('grid[name="editAssignedPermissionsGrid"]').getStore(), popup);
	},
	onAssignedItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Unassigned this',
					handler: function() {
						var baseUrl;
						switch(record.data.type) {
							case 'Role': 
								baseUrl = ROLE_BASE_URL;
								break;
							case 'Company': 
								baseUrl = COMPANIES_BASE_URL;
								break;
							case 'EmployeeProfile': 
								baseUrl = EMPLOYEE_PROFILES_BASE_URL;
								break;
							case 'PersonalProfile': 
								baseUrl = PERSONAL_PROFILES_BASE_URL;
								break
						}
						me.companyStoreController.unassignItemFromRole(baseUrl, record.data.id, MYOCD.SharedData.currentSecurityRole.data.id, dataview);
					}
				}
			]
		}).showAt(e.browserEvent.x, e.browserEvent.y);	
	},
	onEditAssignedPermissionGridRender: function(grid, e, eOpts) {
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
	            var parent = grid.up('securityDialogEditAssignedItem');
				var objectId = parent.down('textfield[name="objectId"]').getValue();
				var baseUrl = parent.down('textfield[name="baseUrl"]').getValue();
	            var companyStoreController = MYOCD.controller.company.CompaniesStoreController;
	            companyStoreController.addPermissionToObject(baseUrl, objectId, permissionData.id, grid.getStore(), parent);
	            return true;
	        }
		});
	}, 
	onSecurityDialogEditAssignedItemRemovePermission: function(editAssginedDialog, grid, objectId, baseUrl, permission) {
		var companyStoreController = MYOCD.controller.company.CompaniesStoreController;
		companyStoreController.removePermissionFromObject(baseUrl, objectId, permission, grid.getStore(), editAssginedDialog);
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
	            var parent = grid.up('usersPermissions');
				var objectId = parent.down('textfield[name="objectId"]').getValue();
				var baseUrl = parent.down('textfield[name="baseUrl"]').getValue();
	            var companyStoreController = MYOCD.controller.company.CompaniesStoreController;
	            companyStoreController.addPermissionToObject(baseUrl, objectId, permissionData.id, grid.getStore(), parent);
	            return true;
	        }
		});
	},
	onUsersPermissionsItemRemovePermission: function(usersPermissionPanel, grid, objectId, baseUrl, permission) {
		Ext.Msg.confirm({
		    title: 'Remove Permission',
		    msg: 'Do you really want to remove this permission?',
		    width: 200,
		    buttons: Ext.Msg.YESNO,
		    icon: Ext.Msg.QUESTION,
		    fn: function(btn) {
			    if(btn == 'yes') {
			    	var companyStoreController = MYOCD.controller.company.CompaniesStoreController;
					companyStoreController.removePermissionFromObject(baseUrl, objectId, permission, grid.getStore(), usersPermissionPanel);
			    	
			    }
		    }
		});
	}
});