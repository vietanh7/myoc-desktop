Ext.define('MYOCD.view.featureTemplate.FeatureAttributes', {
	extend: 'Ext.Container',
	requires: [	
		'Ext.grid.plugin.CellEditing',
		'MYOCD.view.featureTemplate.FeatureOwnedAttributes',
	],
	xtype: 'featureAttributes',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
	items: [
		{
			xtype: 'featureOwnedAttributes',
			flex: 1
		}
	]
});