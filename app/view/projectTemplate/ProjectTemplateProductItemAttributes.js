Ext.define('MYOCD.view.projectTemplate.ProjectTemplateProductItemAttributes',{
	extend: 'Ext.window.Window',
	requires:[
		'MYOCD.view.projectTemplate.ProjectTemplateProductItemOwnedAtts'
	],
	xtype: 'projectTemplateProductItemAttributes',
	width: 960,
	height: 500,
	cls: 'custom-window',
	constrainHeader: true,
	title: 'Product Properties',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
	items: [
		{
			xtype: 'tabpanel',
			plain: true,
			flex: 1,
			tabPosition: 'bottom',
			items: [
				{
					title: 'Attributes',
					xtype: 'projectTemplateProductItemOwnedAtts' //will also handle inherited
				},
				{
					title: 'Constrains'
				}
			]
		}
	]
});