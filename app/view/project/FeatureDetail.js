Ext.define('MYOCD.view.project.FeatureDetail', {
	extend: 'Ext.window.Window',
	requires: [
		'Ext.tab.Panel',
		'MYOCD.view.project.ProjectFeatureAttributes'
	],
	cls: 'customWindow',
	constrainHeader:true,
	xtype: 'featureDetail',
	width: 920,
	height: 640,
	title: 'Feature Detail',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'center',
	},
	items: [
		{
			xtype: 'textfield',
			hidden: true,
			name: 'featureId'	
		},
		{
			xtype: 'tabpanel',
			flex: 1,
			tabPosition: 'bottom',
			items: [
				{
					title: 'Attributes',
					xtype: 'projectFeatureAttributes'
				},
				{
					title: 'Constraints',
				}
			]
		}
	]
});