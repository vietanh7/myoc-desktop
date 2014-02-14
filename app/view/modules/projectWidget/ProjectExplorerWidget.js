Ext.define('MYOCD.view.modules.projectWidget.ProjectExplorerWidget',{
	extend: 'Ext.Panel',
	xtype: 'projectExplorerWidget',
	title: 'Features',
	requires: [
		'MYOCD.controller.modules.projectWidget.ProjectExplorerWidgetController'
	],
	controllerName: 'MYOCD.controller.modules.projectWidget.ProjectExplorerWidgetController',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	tools: [
		{
			type: 'plus',
			name: 'projectFeatureTreeAddTool',
			xtype: 'tool',
		}
	],
	items: [
		{
			xtype: 'toolbar',
			cls: 'feature-toolbar-cls',
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'tbspacer',
					width: 10	
				},
				{
					xtype: 'combobox',
					fieldLabel: 'Version',
					labelWidth: 70,
					store: 'project.FeatureTagVersions',
					displayField: 'tag',
					valueField: 'timestamp',
					emptyText: 'Saved versions',
					queryMode: 'local'
				},
				{
					xtype: 'button',
					name: 'projectFeatureTreeSaveTool',
					text: 'Save',
					flex: 1
				}
			]	
		},
		{
			xtype: 'treepanel',
			style: 'background-color: white',
			name: 'projectFeaturesTree',
			plugins: [{ptype: 'cellediting', pluginId: 'cellEditingPlugin'}],
			flex: 1,
			store: 'project.FeaturesTreeStore',
			useArrows: true,
			hideHeaders: true,
			columns: [
				{
					xtype: 'treecolumn',
					flex: 1,
					dataIndex: 'name',
					editor: 'textfield'
				}
			]
		}
	],
	listeners: {
		render: function() {
			var controller = Ext.create(this.controllerName);
			controller.mainXtype = this.parentType;
			controller.init();
		}
	}	
});