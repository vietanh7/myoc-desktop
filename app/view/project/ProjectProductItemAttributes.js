Ext.define('MYOCD.view.project.ProjectProductItemAttributes',{
	extend: 'Ext.window.Window',
	requires:[
		'MYOCD.view.project.ProjectProductItemOwnedAtts'
	],
	xtype: 'projectProductItemAttributes',
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
					xtype: 'projectProductItemOwnedAtts' //will also handle inherited
				},
				{
					title: 'Constrains'
				}
			]
		}
	]
});