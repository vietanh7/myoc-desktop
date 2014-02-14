Ext.define('MYOCD.controller.workspaceToolbar.ProfileEditorController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'workspaceProfileTabPanel',
			selector: 'tabpanel[name="workspaceProfileTabPanel"]'
		},
		{
			ref: 'profileEditorDialog',
			selector: 'profileEditorDialog'
		},
		{
			ref: 'workspace',
			selector: 'workspace'
		}
	],
	init: function() {
		this.control({
			'profileEditorDialog tabpanel[name="workspaceProfileTabPanel"]': {
				render: this.onWorkspaceProfileTabPanelRender,
				tabchange: this.onWorkspaceProfileTabPanelTabChange
			},
			'profileEditorDialog button[text="Update"]': {
				click: this.onUpdateProfileBtnClick
			}
		});
	},
	onWorkspaceProfileTabPanelRender: function(tabpanel, eOpts) {
		var me = this;
		var items = Ext.getStore('Workspace').data.items;
		var currentItemIndex, currentItem;
		for(var i = 0; i < items.length; i++) {
			var item = 	{
					title: items[i].data.name,
					workspaceId: items[i].data.id,
					workspaceType: items[i].data.type
				}
			if(item.workspaceId == gCurrentWorkspaceId ) {
				currentItemIndex = i;
				currentItem = item;
			}
			tabpanel.add(item);	
		} 
		tabpanel.setActiveTab(currentItemIndex);
		if(currentItem.workspaceType == 'PersonalWorkspace') {
			me.getProfileEditorDialog().down('textfield[name="employeeProfileName"]').setVisible(false);
			me.getProfileEditorDialog().down('textfield[name="employeeProfileDepartment"]').setVisible(false);
			me.getProfileEditorDialog().down('textfield[name="employeeProfileRole"]').setVisible(false);
			me.getProfileEditorDialog().down('textfield[name="employeeProfileAddress"]').setFieldLabel('Address');
		} else {
			me.getProfileEditorDialog().down('textfield[name="employeeProfileName"]').setVisible(true);
			me.getProfileEditorDialog().down('textfield[name="employeeProfileDepartment"]').setVisible(true);
			me.getProfileEditorDialog().down('textfield[name="employeeProfileRole"]').setVisible(true);
			me.getProfileEditorDialog().down('textfield[name="employeeProfileAddress"]').setFieldLabel('Business Address');
		}

		var loadProfileCallback = function(profileData) {
			if(profileData.length > 0) {
				me.getProfileEditorDialog().down('textfield[name="workspace"]').setValue(currentItem.workspaceId + '-' + currentItem.workspaceType + '-' + profileData[0].id);
				me.getProfileEditorDialog().down('textfield[name="employeeProfileFirstName"]').setValue(profileData[0].first_name);
				me.getProfileEditorDialog().down('textfield[name="employeeProfileLastName"]').setValue(profileData[0].last_name);
				me.getProfileEditorDialog().down('textfield[name="employeeProfileName"]').setValue(profileData[0].name);
				me.getProfileEditorDialog().down('textfield[name="employeeProfileEmail"]').setValue(profileData[0].email);
				me.getProfileEditorDialog().down('textarea[name="employeeProfileDesc"]').setValue(profileData[0].description);
				me.getProfileEditorDialog().down('textfield[name="employeeProfileSkype"]').setValue(profileData[0].skype_id);
			}
		}
		var profileStore = MYOCD.controller.user.UserWorkspaceProfileStoreController;
		switch(currentItem.workspaceType) {
			case 'PersonalWorkspace': 
				profileStore.loadPersonalProfile(currentItem.workspaceId, me.getProfileEditorDialog(), loadProfileCallback);
				break;
			case 'CompanyWorkspace': 
				profileStore.loadEmployeeProfile(currentItem.workspaceId, me.getProfileEditorDialog(), loadProfileCallback);
				break;
		}
	},
	onWorkspaceProfileTabPanelTabChange: function ( tabPanel, newCard, oldCard, eOpts ) {
		var me = this;
		var loadProfileCallback = function(profileData) {
			if(profileData.length > 0) {
				me.getProfileEditorDialog().down('textfield[name="workspace"]').setValue(newCard.workspaceId + '-' + newCard.workspaceType + '-' + profileData[0].id);
				me.getProfileEditorDialog().down('textfield[name="employeeProfileFirstName"]').setValue(profileData[0].first_name);
				me.getProfileEditorDialog().down('textfield[name="employeeProfileLastName"]').setValue(profileData[0].last_name);
				me.getProfileEditorDialog().down('textfield[name="employeeProfileName"]').setValue(profileData[0].name);
				me.getProfileEditorDialog().down('textfield[name="employeeProfileEmail"]').setValue(profileData[0].email);
				me.getProfileEditorDialog().down('textarea[name="employeeProfileDesc"]').setValue(profileData[0].description);
				me.getProfileEditorDialog().down('textfield[name="employeeProfileSkype"]').setValue(profileData[0].skype_id);
			}
		}

		if(newCard.workspaceType == 'PersonalWorkspace') {
			me.getProfileEditorDialog().down('textfield[name="employeeProfileName"]').setVisible(false);
			me.getProfileEditorDialog().down('textfield[name="employeeProfileDepartment"]').setVisible(false);
			me.getProfileEditorDialog().down('textfield[name="employeeProfileRole"]').setVisible(false);
			me.getProfileEditorDialog().down('textfield[name="employeeProfileAddress"]').setFieldLabel('Address');
		} else {
			me.getProfileEditorDialog().down('textfield[name="employeeProfileName"]').setVisible(true);
			me.getProfileEditorDialog().down('textfield[name="employeeProfileDepartment"]').setVisible(true);
			me.getProfileEditorDialog().down('textfield[name="employeeProfileRole"]').setVisible(true);
			me.getProfileEditorDialog().down('textfield[name="employeeProfileAddress"]').setFieldLabel('Business Address');
		}

		var profileStore = MYOCD.controller.user.UserWorkspaceProfileStoreController;
		switch(newCard.workspaceType) {
			case 'PersonalWorkspace': 
				profileStore.loadPersonalProfile(newCard.workspaceId, me.getProfileEditorDialog(), loadProfileCallback);
				break;
			case 'CompanyWorkspace': 
				profileStore.loadEmployeeProfile(newCard.workspaceId, me.getProfileEditorDialog(), loadProfileCallback);
				break;
		}
	},
	onUpdateProfileBtnClick: function() {
		var me = this;
		var profileEditor = me.getProfileEditorDialog();
		var workspace = profileEditor.down('textfield[name="workspace"]').getValue().split('-');
		var profileFirstName = profileEditor.down('textfield[name="employeeProfileFirstName"]').getValue();
		var profileLastName = profileEditor.down('textfield[name="employeeProfileLastName"]').getValue();
		var profileName = profileEditor.down('textfield[name="employeeProfileName"]').getValue();
		var profileDesc = profileEditor.down('textarea[name="employeeProfileDesc"]').getValue();
		var profileSkype = profileEditor.down('textfield[name="employeeProfileSkype"]').getValue();
		var profileEmail = profileEditor.down('textfield[name="employeeProfileEmail"]').getValue();

		var profileStore = MYOCD.controller.user.UserWorkspaceProfileStoreController;
		var callback = function() {
			if (workspace[0] == gCurrentWorkspaceId) {
				me.getWorkspace().down('splitbutton[name="userButton"]').setText(profileFirstName + ' ' + profileLastName);
			}
		}
		switch(workspace[1]) {
			case 'PersonalWorkspace': 
				profileStore.updatePersonalProfile(workspace[2], profileFirstName, profileLastName, profileDesc, profileEmail, profileSkype, me.getWorkspace(),	callback);
				break;
			case 'CompanyWorkspace': 
				profileStore.updateEmployeeProfile(workspace[2], profileFirstName, profileLastName, profileName, profileDesc, profileEmail, profileSkype, me.getWorkspace(), callback);
				break;
		}
		profileEditor.destroy();
	}
});