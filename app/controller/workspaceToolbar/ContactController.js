Ext.define('MYOCD.controller.workspaceToolbar.ContactController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'systemContactsDialog',
			selector: 'systemContactsDialog'
		},
		{
			ref: 'contactDetail',
			selector: 'contactDetail'
		}
	],
	init: function() {
		this.control({
			'contactsDialog button[name="searchPeopleContactBtn"]': {
				click: this.onSearchPeopleContactBtnClick
			},
			'contactsDialog button[name="searchOrgContactBtn"]': {
				click: this.onSearchOrgContactBtnClick
			},
			'contactsDialog grid[name="contactPeopleGrid"]': {
				render: this.onContactPeopleGridRender,
				itemdblclick: this.onContactPeopleGridItemDblClick
			},
			'contactsDialog grid[name="contactOrganizationsGrid"]': {
				render: this.onContactOrganizationsGridRender,
				itemdblclick: this.onContactOrganizationsGridItemDblClick
			},
			'contactsDialog button[text="+"]': {
				click: this.onAddMoreContactBtnClick
			}
		});
	},
	onSearchPeopleContactBtnClick: function(button) {
		var contactDlg = button.up('contactsDialog');
		var searchPplValue = contactDlg.down('textfield[name="searchPeopleContactTextField"]').getValue();
		if (searchPplValue.length == 0) {
			Ext.getStore('main.ContactPeople').clearFilter();
			return;
		}
		Ext.getStore('main.ContactPeople').clearFilter();
		Ext.getStore('main.ContactPeople').filter([
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
		var contactDlg = button.up('contactsDialog');
		var searchOrgValue = contactDlg.down('textfield[name="searchOrgContactTextField"]').getValue();
		if (searchOrgValue.length == 0) {
			Ext.getStore('main.ContactOrganizations').clearFilter();
			return;
		}
		Ext.getStore('main.ContactOrganizations').clearFilter();
		Ext.getStore('main.ContactOrganizations').filter([
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
	},
	onAddMoreContactBtnClick: function() {
		if (this.getSystemContactsDialog()) {
			return
		}
		var popup = Ext.create('MYOCD.view.toolbarDialogs.contactsDialog.SystemContactsDialog');
		popup.show();
	},
	onContactPeopleGridItemDblClick: function( grid, record, item, index, e, eOpts ) {
		var me = this;
		if (me.getContactDetail()) {
			me.getContactDetail().destroy();
		}
		var popup = Ext.create('MYOCD.view.toolbarDialogs.contactsDialog.ContactDetail');
		popup.down('textfield[name="profileName"]').setValue(record.data.name);
		popup.down('textfield[name="profileName"]').setVisible(false);
		popup.down('textfield[name="profileFirstName"]').setValue(record.data.first_name);
		popup.down('textfield[name="profileLastName"]').setValue(record.data.last_name);
		popup.down('textfield[name="profileDesc"]').setValue(record.data.description);
		popup.down('textfield[name="profileSkype"]').setValue(record.data.skype_id);
		popup.down('textfield[name="profileEmail"]').setValue(record.data.email);
		popup.show();
	},
	onContactOrganizationsGridItemDblClick: function ( grid, record, item, index, e, eOpts ) {
		var me = this;
		if (me.getContactDetail()) {
			me.getContactDetail().destroy();
		}
		var popup = Ext.create('MYOCD.view.toolbarDialogs.contactsDialog.ContactDetail');
		popup.down('textfield[name="profileName"]').setValue(record.data.name);
		popup.down('textfield[name="profileFirstName"]').setVisible(false);
		popup.down('textfield[name="profileLastName"]').setVisible(false);
		popup.down('textfield[name="profileLastName"]').setValue(record.data.first_name);
		popup.down('textfield[name="profileLastName"]').setValue(record.data.last_name);
		popup.down('textfield[name="profileDesc"]').setValue(record.data.description);
		popup.down('textfield[name="profileSkype"]').setValue(record.data.skype_id);
		popup.down('textfield[name="profileEmail"]').setValue(record.data.email);
		popup.show();
	}
});
