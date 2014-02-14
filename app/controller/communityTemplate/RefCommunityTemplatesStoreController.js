Ext.define('MYOCD.controller.communityTemplate.RefCommunityTemplatesStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadPublicCommunityTemplatesLibs: function(searchText, onView) {
		if(onView) {
			onView.setLoading('Loading Public Community Template Libraries ...');
		}
		Ext.Ajax.request({
			url: COMMUNITY_TEMPLATE_LIB_BASE_URL + 'search/' + searchText + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var libraryData = Ext.decode(data.responseText);
				Ext.getStore('communityTemplate.PublicCommunityTemplateLibs').loadRawData(libraryData); 
				Ext.getStore('communityTemplate.PublicCommunityTemplateLibs').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading Community Template libraries failure');			
			}
		});
	}
});