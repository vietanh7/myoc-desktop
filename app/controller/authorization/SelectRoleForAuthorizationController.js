Ext.define('MYOCD.controller.authorization.SelectRoleForAuthorizationController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'	
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'selectRoleForAuthorization',
			selector: 'selectRoleForAuthorization'
		}
	],
	init: function() {
		this.control({
			'selectRoleForAuthorization dataview[name="authorizationRefCompanyRoleDataview"]': {
				render: this.onAuthorizationRefCompanyRolesDataViewRender
			},
			'selectRoleForAuthorization dataview[name="authorizationRefProjectRoleDataview"]': {
				render: this.onAuthorizationRefProjectRolesDataViewRender
			},
			'selectRoleForAuthorization button[name="searchPeopleContactBtn"]': {
				click: this.onSearchPeopleContactBtnClick
			},
			'selectRoleForAuthorization button[name="searchOrgContactBtn"]': {
				click: this.onSearchOrgContactBtnClick
			},
			'selectRoleForAuthorization grid[name="contactPeopleGrid"]': {
				render: this.onContactPeopleGridRender			
			},
			'selectRoleForAuthorization grid[name="contactOrganizationsGrid"]': {
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
	onSearchPeopleContactBtnClick: function(button) {
		var contactDlg = button.up('selectRoleForAuthorization');
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
		var contactDlg = button.up('selectRoleForAuthorization');
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