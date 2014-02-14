Ext.define('MYOCD.view.featureTemplate.NewFeature', {
	extend: 'Ext.window.Window',
	xtype: 'newFeature',
	requires: [
		'MYOCD.view.featureTemplate.NewFeatureTemplateFeatureFromOtls',
		'MYOCD.view.featureTemplate.NewFeatureTemplateFeatureFromTpls'	
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
							xtype: 'newFeatureTemplateFeatureFromOtls'
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
							xtype: 'newFeatureTemplateFeatureFromTpls'
						}
					]
				}
			]
		}
	]
});