Ext.define('MYOCD.controller.attributeAction.AttributeActionStoreController', {
	extend: 'Ext.app.Controller',
	singleton: true,
	loadActionsOfAttribute: function(attributeId, onView) {
		if (onView) {
			onView.setLoading('Loading Attribute Actions...')
		}
		Ext.Ajax.request({
			url: ATTRIBUTE_BASE_URL + attributeId + '/actions.json',
			method: 'GET',
			withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            var attributeAction = Ext.decode(data.responseText);
	            Ext.getStore('attributeAction.AttributeActions').loadRawData(attributeAction);
	            Ext.getStore('attributeAction.AttributeActions').sort('name', 'ASC');
	            
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            console.log('Load Attribute Actions failure'); 
            }
		});
	},
	editActionPermission: function(attributeId, actionName, permissionId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Update Attribute Action Permission...')
		}
		Ext.Ajax.request({
			url: ATTRIBUTE_BASE_URL + attributeId + '/actions/' + actionName + '.json',
			method: 'POST',
			withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
            	object_id : attributeId,
	            permission_id : permissionId.toString(),
	            secure_action : actionName
            },
            success: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            me.loadActionsOfAttribute(attributeId, onView);
	            
            },
            failure: function(data) {
	            if(onView) {
		            onView.setLoading(false);
	            }
	            console.log('Upadte Attribute Action Permission failure'); 
            }
		});
	}
});