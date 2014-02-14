Ext.define('MYOCD.controller.project.security.ProjectSecuritySelectRoleController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'projectSecuritySelectRoles',
			selector: 'projectSecuritySelectRoles'
		},
		{
			ref: 'selectPermissionForAuthorization',
			selector: 'selectPermissionForAuthorization dataview[name="authorizationRefRolesDataView"]'
		}
	],
	init: function() {
		this.control({
			'projectSecuritySelectRoles panel[name="authorizationRefCompanyRolePanel"] dataview[name="authorizationRefCompanyRoleDataview"]': {
				render: this.onAuthorizationRefCompanyRolesDataViewRender
			},
			'projectSecuritySelectRoles panel[name="authorizationRefProjectRolesPanel"] dataview[name="authorizationRefProjectRoleDataview"]': {
				render: this.onAuthorizationRefProjectRolesDataViewRender
			},
			'projectSecuritySelectRoles dataview[name="authorizationRefRoleLibraryDataview"]': {
				itemdblclick: this.onAuthorizationRefRoleLibraryDataviewItemDblClick
			},
			'projectSecuritySelectRoles button[name="authorizationRefRoleLibBackButton"]': {
				click: this.onAuthorizationRefRoleLibraryBackButtonClick
			},
			'projectSecuritySelectRoles treepanel[name="authorizationRefRoleCategoriesTree"]': {
				itemclick: this.onAuthorizationRefRoleCategoriesTreeItemClick,
				itemexpand: this.onAuthorizationRefRoleCategoriesTreeItemExpand
			},
			'projectSecuritySelectRoles dataview[name="authorizationRefRolesDataView"]': {
				render: this.onAuthorizationRefRolesDataViewRender
			},
			'projectSecuritySelectRoles button[name="searchPeopleContactBtn"]': {
				click: this.onSearchPeopleContactBtnClick
			},
			'projectSecuritySelectRoles button[name="searchOrgContactBtn"]': {
				click: this.onSearchOrgContactBtnClick
			},
			'projectSecuritySelectRoles grid[name="contactPeopleGrid"]': {
				render: this.onContactPeopleGridRender			
			},
			'projectSecuritySelectRoles grid[name="contactOrganizationsGrid"]': {
				render: this.onContactOrganizationsGridRender			
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
	onAuthorizationRefProjectRolesDataViewRender: function(dataview, e, eOpts) {
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
	onAuthorizationRefRoleLibraryDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefRoleLibrary = record.data;
		this.getProjectSecuritySelectRoles().down('panel[title="Library Role"] panel[name="authorizationRefRoleLibraryPanel"]').setVisible(false);
		this.getProjectSecuritySelectRoles().down('panel[title="Library Role"] panel[name="authorizationRefRolePanel"]').setVisible(true);
		var refRoleStoreController = MYOCD.controller.roleLibrary.RefRoleLibraryStoreController;
		refRoleStoreController.loadCategoriesOfRolesLib(record.data.id, record.data.name, this.getProjectSecuritySelectRoles());
		refRoleStoreController.loadRolesOfRoleLib(record.data.id);
	},
	onAuthorizationRefRoleLibraryBackButtonClick: function() {
		this.getProjectSecuritySelectRoles().down('panel[title="Library Role"] panel[name="authorizationRefRoleLibraryPanel"]').setVisible(true);
		this.getProjectSecuritySelectRoles().down('panel[title="Library Role"] panel[name="authorizationRefRolePanel"]').setVisible(false);
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
	onSearchPeopleContactBtnClick: function(button) {
		var contactDlg = button.up('projectSecuritySelectRoles');
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
		var contactDlg = button.up('projectSecuritySelectRoles');
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