Ext.define('MYOCD.controller.modules.ModulesStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadModules: function(onView) {
		if (onView) {
			onView.setLoading('Loading modules ...');
		}
		Ext.Ajax.request({
			url: MODULES_URL,
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var modules = Ext.decode(data.responseText);
				MYOCD.SharedData.usersModules = modules;
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Load modules failure');			
			}
		});
	}
});