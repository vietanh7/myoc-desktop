Ext.define('MYOCD.controller.user.UserWorkspaceProfileStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadEmployeeProfile: function(companyWorkspaceId, onView, successCallback) {
		if(onView) {
			onView.setLoading('Loading Employee Profile ...');
		}
		Ext.Ajax.request({
			url: COMPANY_WORKSPACE_BASE_URL + companyWorkspaceId + '/employeeprofile.json',
			method: 'GET',
			withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(data) {
            	if(onView) {
					onView.setLoading(false);
				}
	            var profileData = Ext.decode(data.responseText);
	            Ext.getStore('user.EmployeeProfiles').loadRawData(profileData);
	            if(successCallback) {
					successCallback(profileData);
				}
            },
            failure: function(data) {
	            if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading employee profile failure');
            }
		});
	},
	updateEmployeeProfile: function(employeeID, employeeFirstName, employeeLastName, employeeName, employeeDesc, employeeEmail, employeeSkype, onView, successCallback) {
		if (onView) {
			onView.setLoading('Updating Employee Profile');
		}
		Ext.Ajax.request({
			url: EMPLOYEE_PROFILES_BASE_URL + employeeID + '.json',
			method: 'PUT',
			withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
            	employee_profile: {
            		first_name: employeeFirstName,
            		last_name: employeeLastName,
            		name: employeeName,
            		email: employeeEmail,
            		description: employeeDesc,
            		skype_id: employeeSkype
            	}
            },
            success: function(data) {
            	if(onView) {
					onView.setLoading(false);
				}
	            if(successCallback) {
					successCallback();
				}
            },
            failure: function(data) {
	            if(onView) {
					onView.setLoading(false);
				}
				console.log('Update employee profile failure');
            }
		});
	},
	loadPersonalProfile: function(personalWorkspaceId, onView, successCallback) {
		if(onView) {
			onView.setLoading('Loading Personale Profile ...');
		}
		Ext.Ajax.request({
			url: PERSONAL_WORKSPACE_BASE_URL + personalWorkspaceId + '/personalprofiles.json',
			method: 'GET',
			withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(data) {
            	if(onView) {
					onView.setLoading(false);
				}
				
	            var profileData = Ext.decode(data.responseText);
	            Ext.getStore('user.PersonalProfiles').loadRawData(profileData);
	            if(successCallback) {
					successCallback(profileData);
				}
            },
            failure: function(data) {
	            if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading personal profile failure');
            }
		});
	},
	updatePersonalProfile: function(employeeID, employeeFirstName, employeeLastName, employeeDesc, employeeEmail, employeeSkype, onView, successCallback) {
		if (onView) {
			onView.setLoading('Updating Personal Profile');
		}
		Ext.Ajax.request({
			url: PERSONAL_PROFILES_BASE_URL + employeeID + '.json',
			method: 'PUT',
			withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
            	personal_profile: {
            		first_name: employeeFirstName,
            		last_name: employeeLastName,
            		email: employeeEmail,
            		description: employeeDesc,
            		skype_id: employeeSkype
            	}
            },
            success: function(data) {
            	if(onView) {
					onView.setLoading(false);
				}
	            if(successCallback) {
					successCallback();
				}
            },
            failure: function(data) {
	            if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading personal profile failure');
            }
		});
	}
});