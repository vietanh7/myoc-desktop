Ext.define('MYOCD.view.classification.ImportPublicClassificationLibrary',{
	extend: 'Ext.window.Window',
	xtype: 'importPublicClassificationLibrary',
	title: 'Import Public Classification Libraries',
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
					name: 'searchPublicClassificationLibField',
					emptyText: 'Search Public Classification Libraries ...',
					flex: 1,
					margin: '0 5 0 0'
				},
				{
					xtype: 'button',
					margin: '0 1 0 0',
					text: 'Search',
					name: 'searchPublicClassificationLibsBtn'
				}
			]
		},
		{
			xtype: 'grid',
			flex: 1,
			name: 'publicClassificationLibsGrid',
			store: 'classification.PublicClassificationLibraries',
			columns: [
				{text: 'Organization'},
				{text: 'Name', dataIndex:'name', flex: 1},
				{text: 'Version'},
				{text: 'Description'}
			]
		}
	]
});