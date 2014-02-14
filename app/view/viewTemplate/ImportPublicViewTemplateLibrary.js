Ext.define('MYOCD.view.viewTemplate.ImportPublicViewTemplateLibrary',{
	extend: 'Ext.window.Window',
	xtype: 'importPublicViewTemplateLibrary',
	title: 'Import Public View Template Libraries',
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
					name: 'searchPublicViewTemplateLibField',
					emptyText: 'Search Public View Template Libraries ...',
					flex: 1,
					margin: '0 5 0 0'
				},
				{
					xtype: 'button',
					margin: '0 1 0 0',
					text: 'Search',
					name: 'searchPublicViewTemplateLibsBtn'
				}
			]
		},
		{
			xtype: 'grid',
			flex: 1,
			name: 'publicViewTemplateLibsGrid',
			store: 'viewTemplate.PublicViewLibraries',
			columns: [
				{text: 'Organization'},
				{text: 'Name', dataIndex: 'name', flex: 1},
				{text: 'Version'},
				{text: 'Description'}
			]
		}
	]
});