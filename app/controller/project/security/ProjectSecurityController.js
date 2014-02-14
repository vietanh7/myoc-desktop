Ext.define('MYOCD.controller.project.security.ProjectSecurityController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'projectSecuritySelectRoles',
			selector: 'projectSecuritySelectRoles'
		},
		{
			ref: 'contactsDialog',
			selector: 'contactsDialog'
		},
		{
			ref: 'projectSecurityEditAssignedItem',
			selector: 'projectSecurityEditAssignedItem'
		},
		{
			ref: 'securityDialogSelectPermission',
			selector: 'securityDialogSelectPermission'
		},
		{
			ref: 'projectSecurityEditRole',
			selector: 'projectSecurityEditRole'
		},
		{
			ref: 'projectSecurity',
			selector: 'projectSecurity'
		},
		{
			ref: 'projectUsersPermissions',
			selector: 'projectSecurity projectUsersPermissions'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		}
	],
	init: function() {
		this.control({
			'projectSecurity': {
				show: this.onProjectSecurityShow	
			},
			'projectSecurity checkboxfield[name="inheritCheckBox"]': {
				change: this.onInheritCheckboxChange	
			},
			'projectSecurity grid[name="projectRolesGrid"]': {
				render: this.onProjectRolesGridRender,
				itemcontextmenu: this.onProjectRolesGridItemContextMenu,
				itemclick: this.onProjectRolesGridItemClick,
				itemdblclick: this.onProjectRolesGridItemClick
			},
			'projectSecurity grid[name="projectRolesGrid"] tool[name="projectSecurityAddRoleTool"]': {
				click: this.onProjectSecurityAddRoleToolClick
			},
			'projectSecurity dataview[name="usersAndRolesDataView"]': {
				render: this.onUsersAndRolesDataViewRender,
				itemcontextmenu: this.onUsersAndRolesDataViewItemContextMenu,
				itemdblclick: this.onUsersAndRolesDataViewItemDblClick
			},
			'projectSecurity tool[name="addAuthorizationTool"]': {
				click: this.onAddAuthorizationToolClick
			},
			'projectSecurityEditAssignedItem' : {
				removepermissionfromrole: this.onProjectSecurityEditAssignedItemRemovePermission
			},
			'projectSecurityEditAssignedItem grid[name="editAssignedPermissionsGrid"]': {
				render: this.onEditAssignedPermissionGridRender
			},
			'projectSecurityEditAssignedItem grid[name="editAssignedPermissionsGrid"] tool[name="selectPermissionTool"]': {
				click: this.onSelectPermissionToolClick
			},
			'projectSecurityEditRole grid[name="editRolePermissionsGrid"]': {
				render: this.onEditRolePermissionGridRender
			},
			'projectSecurityEditRole grid[name="editRolePermissionsGrid"] tool[name="selectPermissionTool"]': {
				click: this.onSelectPermissionToolClick
			},
			'projectSecurityEditRole': {
				removepermissionfromrole: this.onProjectSecurityEditRoleRemovePermission,
				show: this.onProjectSecurityEditRoleShow
			}
		});
	},
	onProjectSecurityShow: function() {
		var me = this;
		var callBack = function (object) {
			MYOCD.SharedData.showProjectInheritedAuthContext = object.inherit_security_from_parent == 'true';
			me.getProjectSecurity().down('checkboxfield[name="inheritCheckBox"]').setValue(object.inherit_security_from_parent == 'true');
		}
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectStoreController.getProjectAuthorizedInfo(MYOCD.SharedData.currentProjectId, me.getProjectSecurity(), callBack);	
	},
	onInheritCheckboxChange: function(checkbox, value, oldValue, eOpts) {
		MYOCD.SharedData.showProjectInheritedAuthContext = value;
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		var authorizationDialog = this.getAuthorizationDialog();
		if (authorizationDialog) {
			var baseUrl = authorizationDialog.down('textfield[name="baseUrl"]').getValue();
			var _callback = function() {
				if (baseUrl == PROJECT_BASE_URL) {
					var objectId = authorizationDialog.down('textfield[name="currentObjectId"]').getValue();
					MYOCD.SharedData.showInheritedAuthContext = value;
					var callBack = function (object) {
						MYOCD.SharedData.showInheritedAuthContext = object.inherit_security_from_parent == 'true';
						authorizationDialog.down('checkboxfield[name="inheritCheckBox"]').setValue(object.inherit_security_from_parent == 'true');
					}
					var authorizationStoreController = MYOCD.controller.authorization.AuthorizationStoreController;
					authorizationStoreController.getObjectAuthorizedInfo(baseUrl, objectId, authorizationDialog, callBack);
				}
			}			
			projectStoreController.updateInheritFromParent(MYOCD.SharedData.currentProjectId, value, this.getProjectSecurity(), _callback);
		} else {
			projectStoreController.updateInheritFromParent(MYOCD.SharedData.currentProjectId, value, this.getProjectSecurity());
		}
		
	},
	onProjectRolesGridRender: function(grid, e, eOpts) {
		var me = this;
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.orgContactData && !dragData.peopleContactData && ! dragData.roleData) {
					return false;
				}
				if (dragData.roleData) {
					var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
					projectStoreController.addRoleToProject(MYOCD.SharedData.currentProjectId, dragData.roleData.id, grid);
					return true;
				}
				var partnerId = dragData.orgContactData != null ? dragData.orgContactData.id : dragData.peopleContactData.id;
				var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
				projectStoreController.addPartnerToProject(MYOCD.SharedData.currentProjectId, partnerId, me.getProjectSecurity());
	            return true;
				
	        }
		});
	},
	onProjectSecurityAddRoleToolClick: function(tool, e, eOpts) {
		var me = this;
		e.stopEvent();
		var popup;
		if(me.getProjectSecuritySelectRoles()) {
			popup = me.getSecurityDialogSelectRole();
			Ext.WindowManager.bringToFront(me.getSecurityDialogSelectRole());
		} else {
			var popup = Ext.create('MYOCD.view.project.security.ProjectSecuritySelectRoles');
			popup.show();
			popup.down('tabpanel').setActiveTab(1);
			popup.down('tabpanel').child('[name="authorizationRefCompanyRolePanel"]').tab.hide();
			popup.down('tabpanel').child('[name="authorizationRefProjectRolesPanel"]').tab.hide();
		}
		var refRoleStoreController = MYOCD.controller.roleLibrary.RefRoleLibraryStoreController;
		refRoleStoreController.loadRoleLibraries(MYOCD.SharedData.currentCompanyId, popup);
		MYOCD.controller.main.ContactStoreController.loadContact();
	},
	onProjectRolesGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		if (record.data.isInherited) {
			return;
		} 
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
							    	var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
							    	if (record.data.type == "Role") {
							    		projectStoreController.removeRoleFromProject(MYOCD.SharedData.currentProjectId.toString(), record.data.id, grid);
									} else {
										projectStoreController.removePartnerFromProject(MYOCD.SharedData.currentProjectId, record.data.id, me.getProjectSecurity());
									}
							    	
							    }
						    }
						});
					}
				}
			]
		}).showAt(e.xy);
	},
	onProjectRolesGridItemClick: function( grid, record, item, index, e, eOpts ) {
		var me = this;
		 MYOCD.SharedData.projectSecurityShowInherited = false;
		if (record.data.type == 'Role') {
			this.getProjectSecurity().down('tabpanel[name="projectRoleContentPanel"]').setVisible(true);
			this.getProjectSecurity().down('panel[name="projectUsersContentPanel"]').setVisible(false);
			var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
			projectStoreController.loadAssignedItemsOfProjectRole(record.get('id'));
			
			if (!record.data.isInherited) {
				MYOCD.SharedData.currentSecurityRole = record;
				MYOCD.SharedData.currentProjectRole = record;
				this.getProjectSecurityEditRole().down('textfield[name="roleId"]').setValue(record.get('id'));
				this.getProjectSecurity().down('tool[name="addAuthorizationTool"]').setVisible(true);
				this.getProjectSecurityEditRole().down('grid[name="editRolePermissionsGrid"]').down('tool[name="selectPermissionTool"]').setVisible(true);
				
			} else {
				MYOCD.SharedData.projectSecurityShowInherited = true;
				MYOCD.SharedData.currentSecurityRole = null;
				MYOCD.SharedData.currentProjectRole = null; 
				MYOCD.SharedData.currentProjectInheritedRole = record;
				this.getProjectSecurityEditRole().down('textfield[name="roleId"]').setValue('');
				this.getProjectSecurity().down('tool[name="addAuthorizationTool"]').setVisible(false);
				this.getProjectSecurityEditRole().down('grid[name="editRolePermissionsGrid"]').down('tool[name="selectPermissionTool"]').setVisible(false);
			}
			var permissionStore = this.getProjectSecurityEditRole().down('grid[name="editRolePermissionsGrid"]').getStore();
			projectStoreController.getPermissionsOfProjectRole(record.get('id'), permissionStore);
		} else {
			this.getProjectSecurity().down('tabpanel[name="projectRoleContentPanel"]').setVisible(false);
			this.getProjectSecurity().down('panel[name="projectUsersContentPanel"]').setVisible(true);
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
			if (!record.data.isInherited) {
				this.getProjectUsersPermissions().down('textfield[name="objectId"]').setValue(record.data.id);
				this.getProjectUsersPermissions().down('textfield[name="baseUrl"]').setValue(baseUrl);
				this.getProjectUsersPermissions().down('grid[name="usersPermissionsGrid"]').down('tool[name="selectPermissionTool"]').setVisible(true);
			} else {
				MYOCD.SharedData.projectSecurityShowInherited = true;
				this.getProjectUsersPermissions().down('textfield[name="objectId"]').setValue('');
				this.getProjectUsersPermissions().down('textfield[name="baseUrl"]').setValue('');
				this.getProjectUsersPermissions().down('grid[name="usersPermissionsGrid"]').down('tool[name="selectPermissionTool"]').setVisible(false);
			}
			var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
			projectStoreController.getAssignedPermissionsOfObject(baseUrl, record.data.id, 
				this.getProjectUsersPermissions().down('grid[name="usersPermissionsGrid"]').getStore(), 
				this.getProjectUsersPermissions());
		}
	},
	onAddAuthorizationToolClick: function(tool, e, eOpts) {
		var me = this;
		e.stopEvent();
		if (me.getProjectSecuritySelectRoles()) {
			me.getProjectSecuritySelectRoles().destroy();
		}
		var popup = Ext.create('MYOCD.view.project.security.ProjectSecuritySelectRoles');
		popup.down('tabpanel').setActiveTab(0);
		popup.down('tabpanel').child('[name="authorizationRefRoleLibraryPanel"]').tab.hide();
		popup.show();
		var companiesStoreController = MYOCD.controller.company.CompaniesStoreController;
		companiesStoreController.loadAllRolesOfCompany(MYOCD.SharedData.currentCompanyId, popup);
		MYOCD.controller.main.ContactStoreController.loadContact();
	},
	onUsersAndRolesDataViewRender: function(dataview, e, eOpts) {
		var me = this;
		dataview.dropZone = new Ext.dd.DropZone(dataview.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.orgContactData && !dragData.peopleContactData && !dragData.roleData) {
					return false;
				}
				if (!MYOCD.SharedData.currentProjectRole) {
					Ext.Msg.alert('Error!', 'Please select a project role');
					return false;
				}
				if (dragData.orgContactData) {
					var orgData = dragData.orgContactData ;
		            if (orgData.type == 'Company') {
			            var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
						projectStoreController.assignProjectRoleToCompany(MYOCD.SharedData.currentProjectRole.data.id, orgData.id, dataview);
		            }
		            return true;
				} 
				if (dragData.peopleContactData) {
					var peopleData = dragData.peopleContactData;
		            if (peopleData.type == 'EmployeeProfile') {
			           var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
						projectStoreController.assignProjectRoleToEmployeeProfile(MYOCD.SharedData.currentProjectRole.data.id, peopleData.id, dataview);
		            }
		            if (peopleData.type == 'PersonalProfile') {
			           var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
						projectStoreController.assignProjectRoleToPersonalProfile(MYOCD.SharedData.currentProjectRole.data.id, peopleData.id, dataview);
		            }
		            return true;
				}
				if (dragData.roleData) {
					var roleData = dragData.roleData;
					var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
					projectStoreController.assignRoleToProjectRole(MYOCD.SharedData.currentProjectRole.data.id, roleData.id, dataview);
					return true
				}
				return false;
	        }
		});
	},
	onUsersAndRolesDataViewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
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
								break;
						}
						var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
						projectStoreController.unassignItemFromProjectRole(baseUrl, record.data.id, MYOCD.SharedData.currentProjectRole.data.id, dataview);
					}
				}
			]
		}).showAt(e.browserEvent.x, e.browserEvent.y);	
	}, 
	onUsersAndRolesDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		if (this.getProjectSecurityEditAssignedItem()) {
			return;
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
		var popup = Ext.create('MYOCD.view.project.security.ProjectSecurityEditAssignedItem');
		popup.down('textfield[name="baseUrl"]').setValue(baseUrl);
		popup.down('textfield[name="objectId"]').setValue(record.data.id);
		popup.down('textfield[name="objectName"]').setValue(record.data.name);
		popup.down('textfield[name="objectDesc"]').setValue(record.data.description);
		popup.show();
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectStoreController.getAssignedPermissionsOfObject(baseUrl, record.data.id, popup.down('grid[name="editAssignedPermissionsGrid"]').getStore(), popup);
	},
	onEditAssignedPermissionGridRender: function(grid, e, eOpts) {
		var me = this;
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.permissionData) {
					return false;
				}
	            var permissionData = dragData.permissionData;
	            var parent = grid.up('projectSecurityEditAssignedItem');
				var objectId = parent.down('textfield[name="objectId"]').getValue();
				var baseUrl = parent.down('textfield[name="baseUrl"]').getValue();
	            var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
	            projectStoreController.addPermissionToObject(baseUrl, objectId, permissionData.id, grid.getStore(), parent);
	            return true;
	        }
		});
	}, 
	onProjectSecurityEditAssignedItemRemovePermission: function(editAssginedDialog, grid, objectId, baseUrl, permission) {
		Ext.Msg.confirm({
		    title: 'Remove Permission',
		    msg: 'Do you really want to remove this permission?',
		    width: 200,
		    buttons: Ext.Msg.YESNO,
		    icon: Ext.Msg.QUESTION,
		    fn: function(btn) {
			    if(btn == 'yes') {
			    	var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
					projectStoreController.removePermissionFromObject(baseUrl, objectId, permission, grid.getStore(), editAssginedDialog);
			    }
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
	            var parent = grid.up('projectSecurityEditRole');
				var roleId = parent.down('textfield[name="roleId"]').getValue();
				if (roleId.length == 0) {
					Ext.Msg.alert('Error!', 'Cannot add role to inherited role');
					return false;
				}
				var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
				projectStoreController.addPermissionToProjectRole(roleId, permissionData.id, grid.getStore(), parent);
	            return true;
	        }
		});
	},
	onProjectSecurityEditRoleRemovePermission:  function(editRole, grid, roleId, permission) {
		Ext.Msg.confirm({
		    title: 'Remove Permission',
		    msg: 'Do you really want to remove this permission?',
		    width: 200,
		    buttons: Ext.Msg.YESNO,
		    icon: Ext.Msg.QUESTION,
		    fn: function(btn) {
			    if(btn == 'yes') {
			    	var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
					projectStoreController.removePermissionFromProjectRole(roleId, permission, grid.getStore(), editRole);
			    }
		    }
		});
		
	},
	onProjectSecurityEditRoleShow: function() {
		var permissionStore = this.getProjectSecurityEditRole().down('grid[name="editRolePermissionsGrid"]').getStore();
		if (permissionStore.data.items.length == 0) {
			var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
			var role = MYOCD.SharedData.currentSecurityRole != null ? MYOCD.SharedData.currentSecurityRole : MYOCD.SharedData.currentProjectInheritedRole
			if (role) {
				projectStoreController.getPermissionsOfProjectRole(role.data.id, permissionStore);
			}
			
		}
	}
});