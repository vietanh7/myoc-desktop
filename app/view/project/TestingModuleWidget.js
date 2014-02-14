Ext.define('MYOCD.view.project.TestingModuleWidget',{
	extend: 'Ext.Panel',
	requires: [
		'MYOCD.view.modules.ModulesPackages'
	],
	height: 533,
	xtype: 'testingModuleWidget',
	layout: 'border',
	items: [
		{
			xtype: 'panel',
			flex: 1,
			region: 'west',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'projectExplorerWidget',
					flex: 1,
					parentType: 'testingModuleWidget'
				}
			]
		},
		{
			xtype: 'panel',
			flex: 2,
			region: 'center',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'featureItemDetailPaneWidget',
					flex: 1,
					parentType: 'testingModuleWidget'
				}
			]
		}
	]
});