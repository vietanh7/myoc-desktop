Ext.define('MYOCD.view.productCatalog.ImportPublicProductCatalogLibrary',{
	extend: 'Ext.window.Window',
	xtype: 'importPublicProductCatalogLibrary',
	title: 'Import Public Product Catalog Libraries',
	cls: 'customWindow',
	constrainHeader: true,
	width: 600,
	height: 500,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	items: [
		{
			xtype: 'container',
			margin: 5,
			layout: {
				type: 'hbox'
			},
			items: [
				{
					xtype: 'textfield',
					inputType: 'search',
					name: 'searchPublicProductCatalogLibField',
					emptyText: 'Search Public Product Catalog Libraries ...',
					flex: 1,
					margin: '0 5 0 0'
				},
				{
					xtype: 'button',
					margin: '0 1 0 0',
					text: 'Search',
					name: 'searchPublicProductCatalogLibsBtn'
				}
			]
		},
		{
			xtype: 'grid',
			flex: 1,
			name: 'publicProductCatalogLibsGrid',
			store: 'productCatalog.PublicProductCatalogLibs',
			columns: [
				{text: 'Organization'},
				{text: 'Name', dataIndex: 'name', flex: 1},
				{text: 'Version'},
				{text: 'Description'}
			]
		}
	]
});