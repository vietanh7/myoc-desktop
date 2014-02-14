Ext.define('MYOCD.controller.wsWindowsController.JoinCompanyController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'joinCompanyWizard',
			selector: 'joinCompanyWizard'
		},
		{
			ref: 'joinCompanyInfo',
			selector: 'joinCompanyWizard joinCompanyInfo'
		},
		{
			ref: 'joinCompanyEmployeeInfo',
			selector: 'joinCompanyWizard joinCompanyEmployeeInfo'
		},
		{
			ref: 'workspace',
			selector: 'workspace'
		},
		{
	        ref: 'workspaceMenu',
	        selector: 'workspace menu[name="workspaceMenu"]'
        }
	],
	init: function() {
		this.control({
			'workspace menuitem[name="joinComMenu"]': {
				click: this.onJoinComMenuClick
			},
			'joinCompanyWizard button[name="joinComBackBtn"]': {
				click: this.onJoinComBackBtnClick
			},
			'joinCompanyWizard button[name="joinComNextBtn"]': {
				click: this.onJoinComNextBtnClick
			},
			'joinCompanyWizard joinCompanyInfo grid[name="searchCompaniesGrid"]': {
				itemclick: this.onSearchCompaniesGridItemClick,
				itemdblclick: this.onSearchCompaniesGridItemClick
			},
			'joinCompanyWizard joinCompanyInfo textfield[name="searchCompanyField"]': {
				change: this.onSearchCompanyFieldChange
			}
		});
	},
	onJoinComMenuClick: function() {
		if (this.getJoinCompanyWizard()) {
			Ext.WindowManager.bringToFront(this.getJoinCompanyWizard());
			return;
		}
		var popup = Ext.create('MYOCD.view.wsWindows.JoinCompanyWizard');
		popup.show();
		var contactStoreController = MYOCD.controller.main.ContactStoreController;
		contactStoreController.loadOrganizationsInSystem(popup);
	},
	onJoinComBackBtnClick: function(button) {
		button.setDisabled(true);
		this.getJoinCompanyWizard().down('joinCompanyInfo').setVisible(true);
		this.getJoinCompanyWizard().down('joinCompanyEmployeeInfo').setVisible(false);
		this.getJoinCompanyWizard().down('button[name="joinComNextBtn"]').setText('Next');
	},
	onJoinComNextBtnClick: function(button) {
		var me = this;
		if (button.getText() == 'Join') {
			var employeeFirstName = this.getJoinCompanyEmployeeInfo().down('textfield[name="employeeFirstName"]').getValue();
			var employeeLastName = this.getJoinCompanyEmployeeInfo().down('textfield[name="employeeLastName"]').getValue();
			var employeeDesc = this.getJoinCompanyEmployeeInfo().down('textarea[name="employeeDesc"]').getValue();
			var employeeEmail = this.getJoinCompanyEmployeeInfo().down('textfield[name="employeeEmail"]').getValue();
			var employeeSkype = this.getJoinCompanyEmployeeInfo().down('textfield[name="employeeSkype"]').getValue();
			this.getJoinCompanyWizard().destroy();

			var callBack = function(wpData) {
				me.getWorkspaceMenu().removeAll();
	        	for (var i = 0; i < wpData.length; i++) {
                	var icon;
                	if(wpData[i].type == 'PersonalWorkspace') {
                    	icon = 'personal-ws-icon';
                	} else {
                    	if(wpData[i].type == 'CompanyWorkspace') {
	                    	icon = 'company-ws-icon';
                    	} else {
	                    	icon = 'community-ws-icon';
                    	}
                	}
                    me.getWorkspaceMenu().add(
                    	{
	                    	xtype: 'menuitem',
	                    	iconCls: icon,
	                    	text: wpData[i].name,
	                    	workspaceId: wpData[i].id,
	                    	handler: function(menu) {
		                    	menu.up('workspace').down('combobox[name=workspaceType]').setValue(menu.workspaceId);
	                    	}
                    	}
                    )
                }
                var companiesStoreController = MYOCD.controller.company.CompaniesStoreController;
                companiesStoreController.loadCompanies();
        	}

			var workspaceStoreController = MYOCD.controller.workspace.WorkspaceStoreController;
			workspaceStoreController.joinOrganization(MYOCD.SharedData.joinOrgId, employeeFirstName, employeeLastName, employeeEmail, employeeDesc, employeeSkype, this.getWorkspace(), callBack);
			return;
		}
		if (this.getJoinCompanyInfo().down('textfield[name="companyName"]').getValue().length == 0) {
			Ext.Msg.alert('Error!', 'Please choose a company first');
			return;
		}
		button.setText('Join');
		this.getJoinCompanyWizard().down('button[name="joinComBackBtn"]').setDisabled(false);
		this.getJoinCompanyWizard().down('joinCompanyInfo').setVisible(false);
		this.getJoinCompanyWizard().down('joinCompanyEmployeeInfo').setVisible(true);

		var loadProfileCallback = function(profileData) {
			if(profileData.length > 0) {
				me.getJoinCompanyEmployeeInfo().down('textfield[name="employeeFirstName"]').setValue(profileData[0].first_name);
				me.getJoinCompanyEmployeeInfo().down('textfield[name="employeeLastName"]').setValue(profileData[0].last_name);
				me.getJoinCompanyEmployeeInfo().down('textfield[name="employeeEmail"]').setValue(profileData[0].email);
				me.getJoinCompanyEmployeeInfo().down('textarea[name="employeeDesc"]').setValue(profileData[0].description);
				me.getJoinCompanyEmployeeInfo().down('textfield[name="employeeSkype"]').setValue(profileData[0].skype_id);
			}
		}
		var profileStore = MYOCD.controller.user.UserWorkspaceProfileStoreController;
		switch(gCurrentWorkspaceType) {
			case 'PersonalWorkspace': 
				profileStore.loadPersonalProfile(gCurrentWorkspaceId, me.getJoinCompanyEmployeeInfo(), loadProfileCallback);
				break;
			case 'CompanyWorkspace': 
				profileStore.loadEmployeeProfile(gCurrentWorkspaceId, me.getJoinCompanyEmployeeInfo(), loadProfileCallback);
				break;
		}
	},
	onSearchCompaniesGridItemClick: function( grid, record, item, index, e, eOpts ) {
		var companyIndex = Ext.getStore('Workspace').find('name', record.data.name);
		if (companyIndex != -1) {
			Ext.Msg.alert('Error!', 'You already joined into this company');
			return;
		}
		MYOCD.SharedData.joinOrgId = record.data.id;
		this.getJoinCompanyInfo().down('textfield[name="companyName"]').setValue(record.data.name);
	},
	onSearchCompanyFieldChange: function( textfield, newValue, oldValue, eOpts ) {
		Ext.getStore('company.SearchCompanies').clearFilter();
		Ext.getStore('company.SearchCompanies').filter([
		    {filterFn: function(item) {
		    	return item.data.name.toLowerCase().indexOf(newValue.toLowerCase()) > -1 ; 
		    }}
		]);
	}
});