Ext.define('MYOCD.view.catalogs.CatalogsWindow',{
	extend: 'Ext.window.Window',
	requires: [
		'MYOCD.view.productCatalog.ProductCatalogsTab',
		'MYOCD.view.jobCatalog.JobCatalogsTab'
	],
	xtype: 'catalogsWindow',
	title: 'Catalogs',
	width: 960,
	height: 600,
	cls: 'customWindow',
	constrainHeader:true,
	position: 'cascade',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	items: [
		{
			xtype: 'tabpanel',
			flex: 1,
			name: 'allCatalogsTabPanel',
			items: [
				{
					title: 'Products',
					xtype: 'productCatalogsTab'
				},
				{
					title: 'Jobs',
					xtype: 'jobCatalogsTab'
				}
			]	
		}
		
	]
});