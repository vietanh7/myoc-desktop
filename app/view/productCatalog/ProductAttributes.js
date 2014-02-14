Ext.define('MYOCD.view.productCatalog.ProductAttributes',{
	extend: 'Ext.window.Window',
	requires:[
		'MYOCD.view.productCatalog.ProductOwnedAtts'
	],
	xtype: 'productAttributes',
	width: 960,
	height: 500,
	cls: 'customWindow',
	constrainHeader: true,
	title: 'Product Properties',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
	items: [
		{
			xtype: 'tabpanel',
			plain: true,
			flex: 1,
			tabPosition: 'bottom',
			items: [
				{
					title: 'Attributes',
					xtype: 'productOwnedAtts' //will also handle inherited
				},
				{
					title: 'Constrains'
				}
			]
		}
	]
});