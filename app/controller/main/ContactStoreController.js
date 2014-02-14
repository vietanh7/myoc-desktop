Ext.define('MYOCD.controller.main.ContactStoreController', {
	extend: 'Ext.app.Controller',
	singleton: true,
	loadContact: function(onView) {
		if(onView) {
			onView.setLoading('Loading contact ...');
		}
		 Ext.Ajax.request({
			url: CONTACT_API_URL,
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var contactData = Ext.decode(data.responseText);
				Ext.getStore('main.ContactPeople').loadRawData(contactData.user_profiles);
				Ext.getStore('main.ContactOrganizations').loadRawData(contactData.organizations);
				Ext.getStore('authorization.RefContactPeople').loadRawData(contactData.user_profiles);
				Ext.getStore('authorization.RefContactOrganizations').loadRawData(contactData.organizations);
			},
			failure: function() {
				if(onView) {
					onView.setLoading(false);
				}
			}
		});
	},
	loadOrganizationsInSystem: function(onView) {
		if(onView) {
			onView.setLoading('Loading Organizations ...');
		}
		 Ext.Ajax.request({
			url: CONTACT_API_URL,
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var contactData = Ext.decode(data.responseText);
				Ext.getStore('company.SearchCompanies').loadRawData(contactData.organizations);
			},
			failure: function() {
				if(onView) {
					onView.setLoading(false);
				}
			}
		});
	}
});