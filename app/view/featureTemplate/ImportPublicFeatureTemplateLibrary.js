Ext.define('MYOCD.view.featureTemplate.ImportPublicFeatureTemplateLibrary',{
	extend: 'Ext.window.Window',
	xtype: 'importPublicFeatureTemplateLibrary',
	title: 'Import Public Feature Template Libraries',
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
					name: 'searchPublicFeatureTemplateLibField',
					emptyText: 'Search Public Feature Template Libraries ...',
					flex: 1,
					margin: '0 5 0 0'
				},
				{
					xtype: 'button',
					margin: '0 1 0 0',
					text: 'Search',
					name: 'searchPublicFeatureTemplateLibsBtn'
				}
			]
		},
		{
			xtype: 'grid',
			flex: 1,
			name: 'publicFeatureTemplateLibsGrid',
			store: 'featureTemplate.PublicFeatureTemplatesLibs',
			columns: [
				{text: 'Organization'},
				{text: 'Name', dataIndex: 'name', flex: 1},
				{text: 'Version'},
				{text: 'Description'}
			]
		}
	]
});