Ext.define('MYOCD.view.projectTemplate.NewProjectTemplateFeature', {
	extend: 'Ext.window.Window',
	xtype: 'newProjectTemplateFeature',
	requires: [
		'MYOCD.view.projectTemplate.NewProjectTemplateFeatureFromOtls',
		'MYOCD.view.projectTemplate.NewProjectTemplateFeatureFromTpls'	
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
			border: false,
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
							xtype: 'newProjectTemplateFeatureFromOtls'
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
							xtype: 'newProjectTemplateFeatureFromTpls'
						}
					]
				}
			]
		}
	]
});