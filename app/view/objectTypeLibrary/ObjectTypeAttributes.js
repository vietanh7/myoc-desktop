Ext.define('MYOCD.view.objectTypeLibrary.ObjectTypeAttributes',{
	extend: 'Ext.window.Window',
	requires:[
		'MYOCD.view.objectTypeLibrary.ObjectTypeOwnedAtts'
	],
	xtype: 'objectTypeAttributes',
	width: 960,
	height: 500,
	cls: 'customWindow',
	constrainHeader: true,
	title: 'Object Type Properties',
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
					xtype: 'objectTypeOwnedAtts' //will also handle inherited
				},
				{
					title: 'Constrains'
				}
			]
		}
	]
});