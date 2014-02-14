Ext.define('MYOCD.view.project.NewProjectFeature', {
	extend: 'Ext.window.Window',
	xtype: 'newProjectFeature',
	requires: [
		'MYOCD.view.project.NewProjectFeatureFromOtls',
		'MYOCD.view.project.NewProjectFeatureFromTpls'
	],
	title: 'New Feature',
	width: 800,
	height: 600,
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'center'
	},
	cls: 'customWindow',
	constrainHeader:true,
	items: [
		{
			xtype: 'tabpanel',
			flex: 1,
			tabPosition: 'bottom',
			items: [
				{
					xtype: 'container',
					title: 'From Object Type Libraries',
					layout: {
						type: 'vbox',
						align: 'stretch'	
					},
					items: [
						{
							xtype: 'newProjectFeatureFromOtls'
						}
					]
				},
				{
					xtype: 'container',
					title: 'From Templates Libraries',
					layout: {
						type: 'vbox',
						align: 'stretch'	
					},
					items: [
						{
							xtype: 'newProjectFeatureFromTpls'
						}
					]
				}
			]
		}
	]
});