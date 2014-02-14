Ext.define('MYOCD.controller.main.UserStoreController', {
	extend: 'Ext.app.Controller',
	singleton: true,
	loadUsers: function(onView) {
		if(onView) {
			onView.setLoading('Loading required infomation ...');
		}
		Ext.Ajax.request({
			url: USER_API_URL,
			method: 'GET',
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var usersData = Ext.decode(data.responseText);
				Ext.getStore('main.Users').loadRawData(usersData);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				Ext.Msg.alert('Load required information failure', 'Please reload website');
			}
		});
	}
});