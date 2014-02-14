Ext.define('MYOCD.view.projectTemplate.ImportPublicProjectTemplateLibrary',{
	extend: 'Ext.window.Window',
	xtype: 'importPublicProjectTemplateLibrary',
	title: 'Import Public Project Template Libraries',
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
					name: 'searchPublicProjectTemplateLibField',
					emptyText: 'Search Public Project Template Libraries ...',
					flex: 1,
					margin: '0 5 0 0'
				},
				{
					xtype: 'button',
					margin: '0 1 0 0',
					text: 'Search',
					name: 'searchPublicProjectTemplateLibsBtn'
				}
			]
		},
		{
			xtype: 'grid',
			flex: 1,
			name: 'publicProjectTemplateLibsGrid',
			store: 'projectTemplate.PublicProjectTemplateLibs',
			columns: [
				{text: 'Organization'},
				{text: 'Name', dataIndex: 'name', flex: 1},
				{text: 'Version'},
				{text: 'Description'}
			]
		}
	]
});