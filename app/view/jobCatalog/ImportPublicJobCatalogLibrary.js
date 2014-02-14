Ext.define('MYOCD.view.jobCatalog.ImportPublicJobCatalogLibrary',{
	extend: 'Ext.window.Window',
	xtype: 'importPublicJobCatalogLibrary',
	title: 'Import Public Job Catalog Libraries',
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
					name: 'searchPublicJobCatalogLibField',
					emptyText: 'Search Public Job Catalog Libraries ...',
					flex: 1,
					margin: '0 5 0 0'
				},
				{
					xtype: 'button',
					margin: '0 1 0 0',
					text: 'Search',
					name: 'searchPublicJobCatalogLibsBtn'
				}
			]
		},
		{
			xtype: 'grid',
			flex: 1,
			name: 'publicJobCatalogLibsGrid',
			store: 'jobCatalog.PublicJobCatalogLibraries',
			columns: [
				{text: 'Organization'},
				{text: 'Name', dataIndex: 'name', flex: 1},
				{text: 'Version'},
				{text: 'Description'}
			]
		}
	]
});