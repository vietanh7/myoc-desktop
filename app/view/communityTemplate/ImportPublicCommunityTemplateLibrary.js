Ext.define('MYOCD.view.communityTemplate.ImportPublicCommunityTemplateLibrary',{
	extend: 'Ext.window.Window',
	xtype: 'importPublicCommunityTemplateLibrary',
	title: 'Import Public Community Template Libraries',
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
					name: 'searchPublicCommunityTemplateLibField',
					emptyText: 'Search Public Community Template Libraries ...',
					flex: 1,
					margin: '0 5 0 0'
				},
				{
					xtype: 'button',
					margin: '0 1 0 0',
					text: 'Search',
					name: 'searchPublicCommunityTemplateLibsBtn'
				}
			]
		},
		{
			xtype: 'grid',
			flex: 1,
			name: 'publicCommunityTemplateLibsGrid',
			store: 'communityTemplate.PublicCommunityTemplateLibs',
			columns: [
				{text: 'Organization'},
				{text: 'Name', dataIndex: 'name', flex: 1},
				{text: 'Version'},
				{text: 'Description'}
			]
		}
	]
});