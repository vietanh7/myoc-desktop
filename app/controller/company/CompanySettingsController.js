Ext.define('MYOCD.controller.company.CompanySettingsController',{
	singleton: true,
	extend: 'Ext.app.Controller',
	getCompanyViews: function(onView) {
		if (onView) {
			onView.setLoading('Loading Workspace Views ...');
		}
		Ext.Ajax.request({
			url: HOME_URL + 'views.json',
			method: 'GET',
			withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            var viewData = Ext.decode(data.responseText);
	            Ext.getStore('company.WorkspaceViews').loadRawData(viewData);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            console.log('Load Workspace Views failure'); 
            }
		});
	},
	addViewToWorkspace: function(viewTemplateId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Adding New View ...');
		}
		Ext.Ajax.request({
			url: VIEW_BASE_URL + 'import.json',
			method: 'POST',
			withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
            	view_id: viewTemplateId
            },
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            me.getCompanyViews(onView);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
	            console.log('Adding New View failure'); 
            }
		});
	},
	removeViewFromWorkspace: function(viewTemplateId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Removing View ...');
		}
		Ext.Ajax.request({
			url: HOME_URL + 'views/' + viewTemplateId + '.json',
			method: 'DELETE',
			withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
            	view_id: viewTemplateId
            },
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            me.getCompanyViews(onView);
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
	            console.log('Adding New View failure'); 
            }
		});
	},
	exportViewToViewLibrary: function(viewId, viewLibraryId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Exporting View ...');
		}
		Ext.Ajax.request({
			url: VIEW_BASE_URL + viewId + '/export.json',
			method: 'POST',
			withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
            	view_template_library_id: viewLibraryId
            },
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
	            console.log('Export View failure'); 
            }
		});
	},
	exportViewToViewCategory: function(viewId, viewCategoryId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Exporting View ...');
		}
		Ext.Ajax.request({
			url: VIEW_BASE_URL + viewId + '/export.json',
			method: 'POST',
			withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
            	view_template_category_id: viewCategoryId
            },
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
	            console.log('Export View failure'); 
            }
		});
	}
});