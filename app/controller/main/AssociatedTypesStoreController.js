Ext.define('MYOCD.controller.main.AssociatedTypesStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadAssociatedTypes: function(onView) {
		if (onView) {
			onView.setLoading('Loading Associated Types ...');
		}
		Ext.Ajax.request({
			url: ASSOCIATED_TYPE_URL,
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var associatedTypesData = Ext.decode(data.responseText);
				MYOCD.SharedData.associatedTypes = [];
				for (var i = 0; i < associatedTypesData.length; i++) {
					var newType = {
						associatedName: associatedTypesData[i].name,
						associatedType: associatedTypesData[i].key,
						objectTypeId: associatedTypesData[i].default_object_type[0].id,
						objectTypeName: associatedTypesData[i].default_object_type[0].name,
						enabled: false
					}
					MYOCD.SharedData.associatedTypes.push(newType);
				}
				Ext.getStore('main.AssociatedTypes').loadRawData(associatedTypesData);
			},
			failure: function() {
				if(onView) {
					onView.setLoading(false);
				}
			}
		});
	}
});