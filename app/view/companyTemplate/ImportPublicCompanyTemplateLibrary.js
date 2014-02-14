Ext.define('MYOCD.view.companyTemplate.ImportPublicCompanyTemplateLibrary',{
	extend: 'Ext.window.Window',
	xtype: 'importPublicCompanyTemplateLibrary',
	title: 'Import Public Company Template Libraries',
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
					name: 'searchPublicCompanyTemplateLibField',
					emptyText: 'Search Public Company Template Libraries ...',
					flex: 1,
					margin: '0 5 0 0'
				},
				{
					xtype: 'button',
					margin: '0 1 0 0',
					text: 'Search',
					name: 'searchPublicCompanyTemplateLibsBtn'
				}
			]
		},
		{
			xtype: 'grid',
			flex: 1,
			name: 'publicCompanyTemplateLibsGrid',
			store: 'companyTemplate.PublicCompanyTemplatesLibs',
			columns: [
				{text: 'Organization'},
				{text: 'Name', dataIndex: 'name', flex: 1},
				{text: 'Version'},
				{text: 'Description'}
			]
		}
	]
});