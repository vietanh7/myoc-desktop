Ext.define('MYOCD.view.productCatalog.GetProductsByView',{
	extend: 'Ext.window.Window',
	xtype: 'getProductsByView',
	title: 'Products by Views',
	constrainHeader: true,
	cls: 'customWindow',
	style: 'background-color: white',
	width: 1150,
	height: 700,
	autoScroll: true,
    overflow: 'auto',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	items: [
		{
			xtype: 'textfield',
			name: 'productCatalogId',
			hidden: true
		},
		{
			xtype: 'textfield',
			name: 'productCategoryId',
			hidden: true
		},
		{
			xtype: 'textfield',
			name: 'viewId',
			hidden: true
		}
	]
});