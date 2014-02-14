Ext.define('MYOCD.controller.project.getItemByView.ItemInViewStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadFeatureAttributes: function(featureId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Feature Attributes ...');
		}
		Ext.Ajax.request({
			url: FEATURE_BASE_URL + featureId + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var feature = Ext.decode(data.responseText);
				Ext.getStore('project.FeatureAttributesInView').removeAll();
				for(var i = 0; i < feature.attributes.length; i++) {
					var newAtt = feature.attributes[i];
					newAtt.isInherited = false;
					Ext.getStore('project.FeatureAttributesInView').add(newAtt);
				}
				for(var i = 0; i < feature.inherited_attributes.length; i++) {
					var newAtt = feature.inherited_attributes[i];
					newAtt.isInherited = true;
					Ext.getStore('project.FeatureAttributesInView').add(newAtt);
				}
			}, 
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				Ext.getStore('project.FeatureAttributes').removeAll();
			}
		});
	},

	loadAttributeOfProduct: function(productId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Product Attributes ...');
		}
		Ext.Ajax.request({
			url: PRODUCT_ITEMS_BASE_URL + productId + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				Ext.getStore('project.ProductItemAttributesInView').removeAll();
				var productData = Ext.decode(data.responseText);
				for(var i = 0; i < productData.attributes.length; i++) {
					var att = productData.attributes[i];
					att.isInherited = false;
					Ext.getStore('project.ProductItemAttributesInView').add(att);
				}
				for(var i = 0; i < productData.inherited_attributes.length; i++) {
					var att = productData.inherited_attributes[i];
					att.isInherited = true;
					Ext.getStore('project.ProductItemAttributesInView').add(att);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading Product Attributes failure');			
			}
		});
	}
});