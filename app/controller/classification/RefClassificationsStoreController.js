Ext.define('MYOCD.controller.classification.RefClassificationsStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadPublicClassificationsLibraries: function(searchText, onView) {
		if(onView) {
			onView.setLoading('Loading Public Classifications Libraries ...');
		}
		Ext.Ajax.request({
			url: CLASSIFICATION_LIB_BASE_URL + 'search/' + searchText + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var libraryData = Ext.decode(data.responseText);
				Ext.getStore('classification.PublicClassificationLibraries').loadRawData(libraryData); 
				Ext.getStore('classification.PublicClassificationLibraries').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading classifications libraries failure');			
			}
		});
	}
});