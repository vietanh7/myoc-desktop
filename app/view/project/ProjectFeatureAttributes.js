Ext.define('MYOCD.view.project.ProjectFeatureAttributes', {
	extend: 'Ext.Container',
	requires: [	
		'Ext.grid.plugin.CellEditing',
		'MYOCD.view.project.ProjectFeatureOwnedAttributes',
		//'MYOCD.view.project.FeatureInheritedAttributes'
	],
	xtype: 'projectFeatureAttributes',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
	items: [
		{
			xtype: 'projectFeatureOwnedAttributes',
			flex: 1
		}
	]
});