Ext.define('MYOCD.view.objectTypeLibrary.ImportPublicObjectTypeLibrary',{
	extend: 'Ext.window.Window',
	xtype: 'importPublicObjectTypeLibrary',
	title: 'Import Public Object Type Libraries',
	cls: 'customWindow',
	constrainHeader: true,
	width: 700,
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
					name: 'searchPublicObjectTypeLibField',
					emptyText: 'Search Public Object Type Libraries ...',
					flex: 1,
					margin: '0 5 0 0'
				},
				{
					xtype: 'button',
					margin: '0 1 0 0',
					text: 'Search',
					name: 'searchPublicObjectTypeLibsBtn'
				}
			]
		},
		{
			xtype: 'grid',
			flex: 1,
			name: 'publicObjectTypeLibsGrid',
			store: 'objectTypeLibrary.PublicObjectTypeLibraries',
			columns: [
				{text: 'Organization'},
				{text: 'Name', dataIndex: 'name', flex: 1},
				{text: 'Version'},
				{text: 'Description', dataIndex: 'description', flex: 1}
			]
		}
	]
});