Ext.define('MYOCD.controller.jobCatalog.RefJobCatalogsStoreController', {
	extend: 'Ext.app.Controller',
	singleton: true,
	loadPublicJobCatalogsLibraries: function(searchText, onView) {
		if(onView) {
			onView.setLoading('Loading Public Job Catalogs Libraries ...');
		}
		Ext.Ajax.request({
			url: JOB_CATALOG_LIB_BASE_URL + 'search/' + searchText + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var libraryData = Ext.decode(data.responseText);
				Ext.getStore('jobCatalog.PublicJobCatalogLibraries').loadRawData(libraryData); 
				Ext.getStore('jobCatalog.PublicJobCatalogLibraries').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading product Job libraries failure');			
			}
		});
	},
});