Ext.define('MYOCD.controller.project.getItemByView.ItemInViewController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'itemAttributeInView',
			selector: 'itemAttributeInView'
		},
		{
			ref: 'featureAttributeInView',
			selector: 'featureAttributeInView'
		},
		{
			ref: 'productItemAttributeInView',
			selector: 'productItemAttributeInView'
		}
	],
	init: function() {
		this.control({
			'itemAttributeInView': {
				render: this.onItemAttributeInViewRender
			}
		});
	},
	onItemAttributeInViewRender: function() {
		var me = this;
		var itemId = me.getItemAttributeInView().down('textfield[name="itemId"]').getValue();
		var route  = me.getItemAttributeInView().down('textfield[name="route"]').getValue();
		var itemStoreController = MYOCD.controller.project.getItemByView.ItemInViewStoreController;
		if (route == 'features') {
			var featureAttribute = {
				xtype: 'featureAttributeInView'
			}
			me.getItemAttributeInView().add(featureAttribute);
			// me.getItemAttributeInView().down('featureAttributeInView').hidden = false;
			itemStoreController.loadFeatureAttributes(itemId, me.getItemAttributeInView());
		} else {
			var productItemAttribute = {
				xtype: 'productItemAttributeInView'
			}
			me.getItemAttributeInView().add(productItemAttribute);
			// me.getItemAttributeInView().down('productItemAttributeInView').hidden = false;
			itemStoreController.loadAttributeOfProduct(itemId, me.getItemAttributeInView());
		}
	}
});