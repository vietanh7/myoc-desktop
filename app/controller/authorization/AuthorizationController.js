Ext.define('MYOCD.controller.authorization.AuthorizationController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'selectRoleForAuthorization',
			selector: 'selectRoleForAuthorization'
		},
		{
			ref: 'contactsDialog',
			selector: 'contactsDialog'
		},
		{
			ref: 'authorizationContextPermissions',
			selector: 'authorizationContextPermissions'
		},
		{
			ref: 'projectSecurity',
			selector: 'projectSecurity'
		}
	],
	init: function() {
		this.control({
			////////////////
			'authorizationDialog': {
				show: this.onAuthorizationDialogShow,
				setActionPermission: this.onAuthorizationDialogSetActionPermission
			},
			'authorizationDialog checkboxfield[name="inheritCheckBox"]': {
				change: this.onInheritCheckBoxChange
			},
			'authorizationDialog grid[name="authorizationContextsGrid"]': {
				render: this.onAuthorizationContextsGridRender,
				itemdblclick: this.onAuthorizationContextsGridItemDblClick,
				itemclick: this.onAuthorizationContextsGridItemDblClick,
				itemcontextmenu: this.onAuthorizationContextsItemContextMenu
			},
			'authorizationDialog grid[name="authorizationContextsGrid"] tool[name="addAuthContextTool"]': {
				click: this.onAddAuthContextToolClick	
			},
			'authorizationContextPermissions grid[name="authorizationContextPermissionsGrid"]': {
				render: this.onAuthorizationPermissionGridRender
			},
			'authorizationContextPermissions': {
				removePermissionFromAuthorizationContext: this.onRemovePermissionFromAuthorizationContext,
				show: this.onAuthorizationContextPermissionsShow
			},
			'authorizationDialog tool[name="addAuthorizationTool"]': {
				click: this.onAddAuthorizationToolClick
			},
			'authorizationDialog dataview[name="usersAndRolesDataView"]': {
				//render: this.onUsersAndRolesDataViewRender,
				//itemcontextmenu: this.onUsersAndRolesDataViewItemContextMenu
			}
		});
	},
	authorizationStoreController: MYOCD.controller.authorization.AuthorizationStoreController,
	onAuthorizationDialogShow: function(dialog, eOpts) {
		
		var me = this;
		var baseUrl = dialog.down('textfield[name="baseUrl"]').getValue();
		var objectId = dialog.down('textfield[name="currentObjectId"]').getValue();
		var callBack = function (object) {
			MYOCD.SharedData.showInheritedAuthContext = object.inherit_security_from_parent == 'true';
			me.getAuthorizationDialog().down('checkboxfield[name="inheritCheckBox"]').setValue(object.inherit_security_from_parent == 'true');
		}
		var authorizationStoreController = MYOCD.controller.authorization.AuthorizationStoreController;
		authorizationStoreController.getObjectAuthorizedInfo(baseUrl, objectId, dialog, callBack);
		authorizationStoreController.loadActionPermission(baseUrl, objectId);
	},
	onInheritCheckBoxChange: function(checkbox, value, oldValue, eOpts) {
		//this.authorizationStoreController.showInheritedItems(value);
		var me = this;
		var dialog = this.getAuthorizationDialog();
		var baseUrl = dialog.down('textfield[name="baseUrl"]').getValue();
		var objectId = dialog.down('textfield[name="currentObjectId"]').getValue();
		MYOCD.SharedData.showInheritedAuthContext = value;
		var authorizationStoreController = MYOCD.controller.authorization.AuthorizationStoreController;
		var _callback = function() {
			if (baseUrl == PROJECT_BASE_URL) {
				var callBack = function (object) {
					MYOCD.SharedData.showProjectInheritedAuthContext = object.inherit_security_from_parent == 'true';
					me.getProjectSecurity().down('checkboxfield[name="inheritCheckBox"]').setValue(object.inherit_security_from_parent == 'true');
				}
				var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
				projectStoreController.getProjectAuthorizedInfo(MYOCD.SharedData.currentProjectId, me.getProjectSecurity(), callBack);	
			}
		}
		authorizationStoreController.updateInheritFromParent(baseUrl, objectId, value, dialog, _callback);
		
		
	},
	onAuthorizationContextsGridRender: function(grid, e, eOpts) {
		grid.getStore().removeAll();
		var me = this;
		var dialog = this.getAuthorizationDialog();
		var baseUrl = dialog.down('textfield[name="baseUrl"]').getValue();
		var objectId = dialog.down('textfield[name="currentObjectId"]').getValue();
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.roleData && !dragData.orgContactData && !dragData.peopleContactData) {
					return false;
				}
				var contextId;
				if (dragData.roleData) {
					contextId = dragData.roleData.id; 
				}
				if (dragData.orgContactData) {
					contextId = dragData.orgContactData.id; 
				}
				if (dragData.peopleContactData) {
					contextId = dragData.peopleContactData.id; 
				}
	            me.authorizationStoreController.addNewAuthorizationContextToObject(baseUrl, objectId, contextId, dialog);
	            return true;
	        }
		});
	},
	onAddAuthContextToolClick: function(tool, e, eOpts) {
		var me = this;
		e.stopEvent();
		var dialog = this.getAuthorizationDialog();
		var baseUrl = dialog.down('textfield[name="baseUrl"]').getValue();

		if(me.getSelectRoleForAuthorization()) {
			me.getSelectRoleForAuthorization().destroy();
		}
		var popup = Ext.create('MYOCD.view.authorization.SelectRoleForAuthorization');
		popup.show();
		if (baseUrl == PROJECT_BASE_URL || baseUrl == FEATURE_BASE_URL || baseUrl == PRODUCT_ITEMS_BASE_URL) {
			var tabpanel = popup.down('tabpanel');
			tabpanel.child('[name="authorizationRefCompanyRolePanel"]').tab.hide();
			tabpanel.setActiveTab(1); 
		} else {
			var tabpanel = popup.down('tabpanel');
			tabpanel.child('[name="authorizationRefProjectRolesPanel"]').tab.hide();
			tabpanel.setActiveTab(0); 
			var companiesStoreController = MYOCD.controller.company.CompaniesStoreController;
			companiesStoreController.loadAllRolesOfCompany(MYOCD.SharedData.currentCompanyId, popup);
		}
		MYOCD.controller.main.ContactStoreController.loadContact();
	},
	onAuthorizationPermissionGridRender: function(grid, e, eOpts) {
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
				var securityObjectId = me.getAuthorizationDialog().down('textfield[name="currentObjectId"]').getValue();
				var dialog = me.getAuthorizationContextPermissions();
				var permissionStore = dialog.down('grid[name="authorizationContextPermissionsGrid"]').getStore();
				var baseUrl = dialog.down('textfield[name="baseUrl"]').getValue();
				if (baseUrl.length == 0) {
					Ext.Msg.alert('Error!', 'Cannot add permission to inherited context or role');
					return false;
				}
				var authorizationId = dialog.down('textfield[name="authorizationContextId"]').getValue();
	            var permissionData = dragData.permissionData;
	            me.authorizationStoreController.addPermissionToAuthorizationContext(baseUrl, authorizationId, securityObjectId, permissionData.id, permissionStore, dialog);
	            return true;
	        }
		});
	},
	onAuthorizationContextsItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		if (record.data.isInherited) {
			e.stopEvent();
			return;
		}
		var dialog = this.getAuthorizationDialog();
		var baseUrl = dialog.down('textfield[name="baseUrl"]').getValue();
		var objectId = dialog.down('textfield[name="currentObjectId"]').getValue();
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Remove',
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Remove Context',
						    msg: 'Do you really want to remove this context?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
							    	me.authorizationStoreController.removeAuthorizationContextFromObject(baseUrl, objectId, record.data.id, dialog);
							    }
						    }
						});

					}
				}
			]
		}).showAt(e.xy);
	},
	onAuthorizationContextsGridItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		var baseUrl;
		var me = this;
		var authContextPanel = this.getAuthorizationContextPermissions();
		var securityObjectId = this.getAuthorizationDialog().down('textfield[name="currentObjectId"]').getValue();
		var permissionAndAssignedItemsPanel = this.getAuthorizationDialog().down('tabpanel[name="permissionAndAssignedItemsPanel"]');
		var callBack = null;
		MYOCD.SharedData.childSecurityShowInherited = false;
		if (record.data.type == 'Company') {
			baseUrl = COMPANIES_BASE_URL;
			authContextPanel.down('textfield[name="baseUrl"]').setValue(COMPANY_PROFILES_BASE_URL);
			permissionAndAssignedItemsPanel.child('[title="Users and Roles"]').tab.hide();
			permissionAndAssignedItemsPanel.child('[title="Actions Permissions"]').tab.show();
			permissionAndAssignedItemsPanel.setActiveTab(1);
			if (this.getAuthorizationContextPermissions().down('tool[name="selectPermissionTool"]')) {
				this.getAuthorizationContextPermissions().down('tool[name="selectPermissionTool"]').setVisible(true);
			}
			
		}
		if (record.data.type == 'EmployeeProfile') {
			baseUrl = EMPLOYEE_PROFILES_BASE_URL;
			authContextPanel.down('textfield[name="baseUrl"]').setValue(EMPLOYEE_PROFILES_BASE_URL);
			permissionAndAssignedItemsPanel.child('[title="Users and Roles"]').tab.hide();
			permissionAndAssignedItemsPanel.child('[title="Actions Permissions"]').tab.show();
			permissionAndAssignedItemsPanel.setActiveTab(1);
			if (this.getAuthorizationContextPermissions().down('tool[name="selectPermissionTool"]')) {
				this.getAuthorizationContextPermissions().down('tool[name="selectPermissionTool"]').setVisible(true);
			}
		}
		if (record.data.type == 'Role') {
			baseUrl = ROLE_BASE_URL;
			MYOCD.SharedData.childSecurityShowInherited = true;
			//authContextPanel.down('textfield[name="baseUrl"]').setValue(ROLE_BASE_URL);
			authContextPanel.down('textfield[name="baseUrl"]').setValue('');
			this.authorizationStoreController.loadAssignedItemsOfAuthorizedRole(record.data.id);
			permissionAndAssignedItemsPanel.child('[title="Users and Roles"]').tab.show();
			permissionAndAssignedItemsPanel.child('[title="Actions Permissions"]').tab.hide();
			permissionAndAssignedItemsPanel.setActiveTab(0);
			if (this.getAuthorizationContextPermissions().down('tool[name="selectPermissionTool"]')) {
				this.getAuthorizationContextPermissions().down('tool[name="selectPermissionTool"]').setVisible(false);
			}
		}
		if (record.data.type == 'PersonalProfile') {
			baseUrl = PERSONAL_PROFILES_BASE_URL;
			authContextPanel.down('textfield[name="baseUrl"]').setValue(PERSONAL_PROFILES_BASE_URL);
			permissionAndAssignedItemsPanel.child('[title="Users and Roles"]').tab.hide();
			permissionAndAssignedItemsPanel.child('[title="Actions Permissions"]').tab.show();
			permissionAndAssignedItemsPanel.setActiveTab(1);
			if (this.getAuthorizationContextPermissions().down('tool[name="selectPermissionTool"]')) {
				this.getAuthorizationContextPermissions().down('tool[name="selectPermissionTool"]').setVisible(true);
			}
		}
		if (record.data.isInherited) {
			MYOCD.SharedData.childSecurityShowInherited = true;
			authContextPanel.down('textfield[name="baseUrl"]').setValue('');
			if (this.getAuthorizationContextPermissions().down('tool[name="selectPermissionTool"]')) {
				this.getAuthorizationContextPermissions().down('tool[name="selectPermissionTool"]').setVisible(false);
			}
		}
		if (record.data.type != 'Role') {
			callBack = function (loadIntoStore) {
				var authActionPermission = Ext.getStore('authorization.AuthorizationActionsPermissions');
				var actionItems = authActionPermission.data.items;
	            for (var i = 0; i < actionItems.length; i++) {
	            	if (loadIntoStore.find('id', actionItems[i].data.permission.id) != -1) {
	            		var index = authActionPermission.find('secure_action',actionItems[i].data.secure_action);
	            		authActionPermission.getAt(index).set('granted', true);
	            		authActionPermission.getAt(index).set('isInherited', actionItems[i].data.isInherited);
	            		authActionPermission.getAt(index).commit();
	            	}
	            }
			}
		}
		authContextPanel.down('textfield[name="authorizationContextId"]').setValue(record.data.id);
		authContextPanel.down('textfield[name="authorizationContextName"]').setValue(record.data.name);
		var permissionStore = authContextPanel.down('grid[name="authorizationContextPermissionsGrid"]').getStore();
		this.authorizationStoreController.getPermissionsOfAuthorizationContext(baseUrl, record.data.id, securityObjectId, permissionStore, null, callBack);
	},
	onRemovePermissionFromAuthorizationContext: function(authorizationContextPermissionDialog, grid, authorizationContextId, rec) {
		var me = this;
		Ext.Msg.confirm({
		    title: 'Remove Permission',
		    msg: 'Do you really want to remove this permission?',
		    width: 200,
		    buttons: Ext.Msg.YESNO,
		    icon: Ext.Msg.QUESTION,
		    fn: function(btn) {
			    if(btn == 'yes') {
			    	var dialog = authorizationContextPermissionDialog;
					var securityObjectId = me.getAuthorizationDialog().down('textfield[name="currentObjectId"]').getValue();
					var permissionStore = dialog.down('grid[name="authorizationContextPermissionsGrid"]').getStore();
					var baseUrl = dialog.down('textfield[name="baseUrl"]').getValue();
					me.authorizationStoreController.removePermissionFromAuthorizationContext(baseUrl, authorizationContextId, rec, securityObjectId, permissionStore, dialog);
			    }
		    }
		});
		
	},
	onAddAuthorizationToolClick: function(tool, e, eOpts) {
		var me = this;
		e.stopEvent();
		var dialog = this.getAuthorizationDialog();
		var baseUrl = dialog.down('textfield[name="baseUrl"]').getValue();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Assign Role',
					handler: function() {
						if(me.getSelectRoleForAuthorization()) {
							Ext.WindowManager.bringToFront(me.getSelectRoleForAuthorization());
						} else {
							var popup = Ext.create('MYOCD.view.authorization.SelectRoleForAuthorization');
							popup.show();
						}
						
						if (baseUrl == PROJECT_BASE_URL || baseUrl == FEATURE_BASE_URL || baseUrl == PRODUCT_ITEMS_BASE_URL) {
							var companiesStoreController = MYOCD.controller.company.CompaniesStoreController;
							companiesStoreController.loadAllRolesOfCompany(MYOCD.SharedData.currentCompanyId, popup);
						} else {
							var tabpanel = popup.down('tabpanel');
							tabpanel.child('[name="authorizationRefProjectRolesPanel"]').tab.hide();
							tabpanel.setActiveTab(0); 
							var companiesStoreController = MYOCD.controller.company.CompaniesStoreController;
							companiesStoreController.loadAllRolesOfCompany(MYOCD.SharedData.currentCompanyId, popup);
						}
					}
				},
				{
					text: 'Assign Organizations or Users',
					handler: function() {
						if (me.getContactsDialog()) {
							Ext.WindowManager.bringToFront(me.getContactsDialog());
						} else {
							var popup = Ext.create('MYOCD.view.toolbarDialogs.ContactsDialog');
							popup.show();
						}
						
						var contactStoreController = MYOCD.controller.main.ContactStoreController;
						contactStoreController.loadContact(popup);
					}
				}
			]
		}).showAt(e.browserEvent.x, e.browserEvent.y);
	},
	onUsersAndRolesDataViewRender: function(dataview, e, eOpts) {
		var me = this;
		dataview.getStore().removeAll();
		dataview.dropZone = new Ext.dd.DropZone(dataview.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.orgContactData && !dragData.peopleContactData && !dragData.roleData) {
					return false;
				}
				var securityObjectId = me.getAuthorizationDialog().down('textfield[name="currentObjectId"]').getValue();
				var dialog = me.getAuthorizationContextPermissions();
				var roleId = dialog.down('textfield[name="authorizationContextId"]').getValue();
				if (roleId.length == 0) {
					Ext.Msg.alert('Error!', 'Please select a role');
					return false;
				}
				var baseUrl = dialog.down('textfield[name="baseUrl"]').getValue();
				if (baseUrl.length == 0) {
					Ext.Msg.alert('Error!', 'Not allow to assign role or user to role');
					return false;
				}
				if (dragData.orgContactData) {
					var orgData = dragData.orgContactData ;
		            if (orgData.type == 'Company') {
			            me.authorizationStoreController.assignRoleToCompany(roleId, orgData.id, dataview);
		            }
		            return true;
				} 
				if (dragData.peopleContactData) {
					console.log ('People Contact Data', dragData.peopleContactData);
					var peopleData = dragData.peopleContactData;
		            if (peopleData.type == 'EmployeeProfile') {
			            me.authorizationStoreController.assignRoleToEmployeeProfile(roleId, peopleData.id, dataview);
		            }
		            if (peopleData.type == 'PersonalProfile') {
			            me.authorizationStoreController.assignRoleToPersonalProfile(roleId, peopleData.id, dataview);
		            }
		            return true;
				}
				if (dragData.roleData) {
					var roleData = dragData.roleData;
					me.authorizationStoreController.assignRoleToRole(roleId, roleData.id, dataview);
					return true
				}
	            return true;
	        }
		});
	},
	onUsersAndRolesDataViewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		var dialog = me.getAuthorizationContextPermissions();
		var baseUrl = dialog.down('textfield[name="baseUrl"]').getValue();
		if (baseUrl.length == 0) {
			return;
		}
		var roleId = dialog.down('textfield[name="authorizationContextId"]').getValue();
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
						me.authorizationStoreController.unassignItemFromRole(baseUrl, record.data.id, roleId, dataview);
					}
				}
			]
		}).showAt(e.browserEvent.x, e.browserEvent.y);
	},
	onAuthorizationContextPermissionsShow: function() {
		var authContextPanel = this.getAuthorizationContextPermissions();
		var store = authContextPanel.down('grid[name="authorizationContextPermissionsGrid"]').getStore();
		var securityObjectId = this.getAuthorizationDialog().down('textfield[name="currentObjectId"]').getValue();
		var currentObject = authContextPanel.down('textfield[name="authorizationContextId"]').getValue();
		if (currentObject.length == 0) {
			return;
		}
		var baseUrl = authContextPanel.down('textfield[name="baseUrl"]').getValue();
		if (baseUrl.length == 0) {
			baseUrl = ROLE_BASE_URL;
		}
		if (store.data.items.length == 0) {
			this.authorizationStoreController.getPermissionsOfAuthorizationContext(baseUrl, currentObject, securityObjectId, store);
		}
	},
	onAuthorizationDialogSetActionPermission: function(authorizationDialog, actionRecord) {
		var me = this;
		var securityObjectId = authorizationDialog.down('textfield[name="currentObjectId"]').getValue();
		var baseUrl = authorizationDialog.down('authorizationContextPermissions').down('textfield[name="baseUrl"]').getValue();
		var authorizationId = authorizationDialog.down('authorizationContextPermissions').down('textfield[name="authorizationContextId"]').getValue();
		var permissionStore = authorizationDialog.down('authorizationContextPermissions').down('grid[name="authorizationContextPermissionsGrid"]').getStore();
		if (baseUrl.length == 0 || actionRecord.data.isInherited || MYOCD.SharedData.childSecurityShowInherited) {
			Ext.Msg.alert('Error!', 'Cannot edit permissions of inherited context');
			return false;
		}
		if (actionRecord.data.granted) {
			Ext.Msg.confirm({
			    title: 'Remove Permission',
			    msg: 'Do you really want to remove this permission?',
			    width: 200,
			    buttons: Ext.Msg.YESNO,
			    icon: Ext.Msg.QUESTION,
			    fn: function(btn) {
				    if(btn == 'yes') {
				    	var permissionIndex = permissionStore.find('id', actionRecord.data.permission.id);
				    	var permission = permissionStore.getAt(permissionIndex);
						me.authorizationStoreController.removePermissionFromAuthorizationContext(baseUrl, authorizationId, permission, securityObjectId, permissionStore, authorizationDialog);
						actionRecord.set('granted', false);
				    }
			    }
			});
		} else {
			me.authorizationStoreController.addPermissionToAuthorizationContext(baseUrl, authorizationId, securityObjectId, actionRecord.data.permission.id, permissionStore, authorizationDialog);
			actionRecord.set('granted', true);
		}
	} 
});