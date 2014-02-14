Ext.define('MYOCD.view.projectTemplate.ProjectTemplateFeatureAttributes', {
	extend: 'Ext.Container',
	requires: [	
		'Ext.grid.plugin.CellEditing',
		'MYOCD.view.projectTemplate.ProjectTemplateFeatureOwnedAttributes',
	],
	xtype: 'projectTemplateFeatureAttributes',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
	items: [
		{
			xtype: 'projectTemplateFeatureOwnedAttributes',
			flex: 1
		}
	]
});