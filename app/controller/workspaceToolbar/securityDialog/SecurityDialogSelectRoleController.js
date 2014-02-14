Ext.define('MYOCD.controller.workspaceToolbar.securityDialog.SecurityDialogSelectRoleController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'	
		},
		{
			ref: 'authorizationTab',
			selector: 'authorizationTab'
		},
		{
			ref: 'securityDialogSelectRole',
			selector: 'securityDialogSelectRole'
		}
	],
	init: function() {
		this.control({
			'securityDialogSelectRole dataview[name="authorizationRefRoleLibraryDataview"]': {
				itemdblclick: this.onAuthorizationRefRoleLibraryDataviewItemDblClick
			},
			'securityDialogSelectRole button[name="authorizationRefRoleLibBackButton"]': {
				click: this.onAuthorizationRefRoleLibraryBackButtonClick
			},
			'securityDialogSelectRole treepanel[name="authorizationRefRoleCategoriesTree"]': {
				itemclick: this.onAuthorizationRefRoleCategoriesTreeItemClick,
				itemexpand: this.onAuthorizationRefRoleCategoriesTreeItemExpand
			},
			'securityDialogSelectRole dataview[name="authorizationRefRolesDataView"]': {
				render: this.onAuthorizationRefRolesDataViewRender,
				itemclick: this.onAuthorizationRefRolesDataViewClick,
				itemdblclick: this.onAuthorizationRefRolesDataViewClick
			},
			'securityDialogSelectRole button[name="authorizationAcceptParentBtn"]': {
				click: this.onAuthorizationAcceptParentBtnClick
			},
			'securityDialogSelectCompanyRole dataview[name="authorizationRefCompanyRoleDataview"]': {
				render: this.onAuthorizationRefCompanyRolesDataViewRender
			},
			'securityDialogSelectCompanyRole button[name="searchPeopleContactBtn"]': {
				click: this.onSearchPeopleContactBtnClick
			},
			'securityDialogSelectCompanyRole button[name="searchOrgContactBtn"]': {
				click: this.onSearchOrgContactBtnClick
			},
			'securityDialogSelectCompanyRole grid[name="contactPeopleGrid"]': {
				render: this.onContactPeopleGridRender			
			},
			'securityDialogSelectCompanyRole grid[name="contactOrganizationsGrid"]': {
				render: this.onContactOrganizationsGridRender			
			},
			'securityDialogSelectRole button[name="searchPeopleContactBtn"]': {
				click: this.onSearchPeopleContactBtnClick
			},
			'securityDialogSelectRole button[name="searchOrgContactBtn"]': {
				click: this.onSearchOrgContactBtnClick
			},
			'securityDialogSelectRole grid[name="contactPeopleGrid"]': {
				render: this.onContactPeopleGridRender			
			},
			'securityDialogSelectRole grid[name="contactOrganizationsGrid"]': {
				render: this.onContactOrganizationsGridRender			
			}

		});
	},
	onAuthorizationRefRoleLibraryDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefRoleLibrary = record.data;
		this.getSecurityDialogSelectRole().down('panel[name="authorizationRefRoleLibraryPanel"]').setVisible(false);
		this.getSecurityDialogSelectRole().down('panel[name="authorizationRefRolePanel"]').setVisible(true);
		var refRoleStoreController = MYOCD.controller.roleLibrary.RefRoleLibraryStoreController;
		refRoleStoreController.loadCategoriesOfRolesLib(record.data.id, record.data.name, this.getSecurityDialogSelectRole());
		refRoleStoreController.loadRolesOfRoleLib(record.data.id);
	},
	onAuthorizationRefRoleLibraryBackButtonClick: function() {
		this.getSecurityDialogSelectRole().down('panel[name="authorizationRefRoleLibraryPanel"]').setVisible(true);
		this.getSecurityDialogSelectRole().down('panel[name="authorizationRefRolePanel"]').setVisible(false);
		Ext.getStore('roleLibrary.RefRoles').removeAll();
		Ext.getStore('roleLibrary.RefRoleCategoriesTreeStore').setRootNode(null);
		Ext.getStore('roleLibrary.RefRoleCategoriesTreeStore').removeAll();
	},
	onAuthorizationRefRoleCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
		var refRoleStoreController = MYOCD.controller.roleLibrary.RefRoleLibraryStoreController;
		if(record.get('id')!=='root') {
			refRoleStoreController.loadRolesOfRoleCategory(record.get('id'));
		} else {
			refRoleStoreController.loadRolesOfRoleLib(MYOCD.SharedData.currentRefRoleLibrary.id);
		}
    },
    onAuthorizationRefRoleCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		var refRoleStoreController = MYOCD.controller.roleLibrary.RefRoleLibraryStoreController;
		if(categoryNode.data.id !== 'root') {
			refRoleStoreController.loadRolesOfRoleCategory(categoryNode.data.id);
			refRoleStoreController.loadCategoriesOfRolesCategory(categoryNode.data.id, categoryNode);
		} else {
			refRoleStoreController.loadRolesOfRoleLib(MYOCD.SharedData.currentRefRoleLibrary.id);
		}
	},
	onAuthorizationRefRolesDataViewClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentSelectedRefRole = record.data;
	},
	onAuthorizationAcceptParentBtnClick: function() {
		this.getSecurityDialogSelectRole().destroy();
	},
	onAuthorizationRefRolesDataViewRender: function(dataview, e, eOpts) {
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
	                    roleData: dataview.getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY; 	        
	        }
	    });
	},
	onAuthorizationRefCompanyRolesDataViewRender: function(dataview, e, eOpts) {
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
	                    roleData: dataview.getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY; 	        
	        }
	    });
	},
	onSearchPeopleContactBtnClick: function(button) {
		var contactDlg = button.up('securityDialogSelectRole');
		if (!contactDlg) {
			contactDlg = button.up('securityDialogSelectCompanyRole');
		}
		var searchPplValue = contactDlg.down('textfield[name="searchPeopleContactTextField"]').getValue();
		if (searchPplValue.length == 0) {
			Ext.getStore('authorization.RefContactPeople').clearFilter();
			return;
		}
		Ext.getStore('authorization.RefContactPeople').clearFilter();
		Ext.getStore('authorization.RefContactPeople').filter([
		    {filterFn: function(item) {
		    	var name = item.get('first_name') != null ? item.get('first_name') + ' ' + item.get('last_name') : '';
		    	if (name.length == 0) {
			    	name = item.get("name") != null ? item.get("name") : ''
		    	}
		    	return name.toLowerCase().indexOf(searchPplValue.toLowerCase()) > -1 ; 
		    }}
		]);
	},
	onSearchOrgContactBtnClick: function(button) {
		var contactDlg = button.up('securityDialogSelectRole');
		if (!contactDlg) {
			contactDlg = button.up('securityDialogSelectCompanyRole');
		}
		var searchOrgValue = contactDlg.down('textfield[name="searchOrgContactTextField"]').getValue();
		if (searchOrgValue.length == 0) {
			Ext.getStore('authorization.RefContactOrganizations').clearFilter();
			return;
		}
		Ext.getStore('authorization.RefContactOrganizations').clearFilter();
		Ext.getStore('authorization.RefContactOrganizations').filter([
		    {filterFn: function(item) {
		    	var name = item.get('first_name') != null ? item.get('first_name') + ' ' + item.get('last_name') : '';
		    	if (name.length == 0) {
			    	name = item.get("name") != null ? item.get("name") : ''
		    	}
		    	return name.toLowerCase().indexOf(searchOrgValue.toLowerCase()) > -1 ; 
		    }}
		]);
	},
	onContactPeopleGridRender: function(grid, e, eOpts) {
		grid.dragZone = new Ext.dd.DragZone(grid.getEl(), {
	        getDragData: function(e) {
	            var sourceEl = e.getTarget(grid.getView().rowSelector, 10);
	            if (sourceEl) {
	                d = sourceEl.cloneNode(true);
	                d.id = Ext.id();
	                return grid.dragData = {
	                    sourceEl: sourceEl,
	                    repairXY: Ext.fly(sourceEl).getXY(),
	                    ddel: d,
	                    peopleContactData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onContactOrganizationsGridRender: function(grid, e, eOpts) {
		grid.dragZone = new Ext.dd.DragZone(grid.getEl(), {
	        getDragData: function(e) {
	            var sourceEl = e.getTarget(grid.getView().rowSelector, 10);
	            if (sourceEl) {
	                d = sourceEl.cloneNode(true);
	                d.id = Ext.id();
	                return grid.dragData = {
	                    sourceEl: sourceEl,
	                    repairXY: Ext.fly(sourceEl).getXY(),
	                    ddel: d,
	                    orgContactData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	}
});