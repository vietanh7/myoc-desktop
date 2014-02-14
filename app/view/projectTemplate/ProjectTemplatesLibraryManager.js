var projectTemplateTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.projectTemplate.ProjectTemplatesLibraryManager', {
	extend: 'Ext.Panel',
	requires: [
		'Ext.tree.Panel',
		'Ext.view.View',
		'Ext.grid.plugin.CellEditing',
		'MYOCD.view.projectTemplate.NewProjectTemplate',
		'MYOCD.view.projectTemplate.EditProjectTemplateCategory'
	],
	xtype: 'projectTemplatesLibraryManager',
	title: 'Project Templates Library Manager',
	layout: 'border',
	items: [
		{
			xtype: 'panel',
			margin: 3,
			height: 25,
			region: 'north',
			collapsible: false,
			layout: 'hbox',
			items: [
				{
					xtype: 'button',
					iconCls: 'back-icon',
					name: 'projectTemplatesLibsBackButton',
					ui: 'default-toolbar'
				}
			]	
		},
		{
			xtype: 'treepanel',
			tools: [
				{
					xtype: 'tool',
					type: 'plus',
					name: 'addNewProjectTemplateCategoryTool'
				}
				// ,
				// {
				// 	xtype: 'tool',
				// 	type: 'gear',
				// 	name: 'projectTemplateCategoryAuthorTool'
				// }
			],
			plugins: [{ptype: 'cellediting', pluginId: 'cellEditingPlugin'}],
			name: 'projectTemplatesCategoriesTree',
			title: 'Categories',
			region: 'west',
			collapsible: true,
			split: true,
			flex: 1,
			store: 'projectTemplate.ProjectTemplatesCategoriesTreeStore',
			hideHeaders: true,
			useArrows: true,
			columns: [
				{
					xtype: 'treecolumn',
					flex: 1,
					dataIndex: 'name',
					editor: {
						xtype: 'textfield',
						emptyText: 'New Category'
					}
				}
			]
		},
		{
			xtype: 'panel',
			title: 'Templates',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'center'
			},
			tools: [
				{
					xtype: 'tool',
					name: 'projectTemplatesLibraryToggleViewTool',
					cls: 'listview-icon'	
				},
				{
					xtype: 'tool',
					type: 'plus',
					name: 'addNewProjectTemplateTool'
				}
				// ,
				// {
				// 	xtype: 'tool',
				// 	type: 'gear',
				// 	name: 'projectTemplateAuthorTool'
				// }	
			],
			region: 'center',
			cls: 'product-view',
			flex: 3,
			items: [
				{
					xtype: 'dataview',
					flex: 1,
					name: 'projectTemplatesDataView',
					autoScroll: true,
					layout: 'auto',
					store: 'projectTemplate.ProjectTemplates',
					tpl: projectTemplateTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				},
				{
					xtype: 'grid',
					border: false,
					flex: 1,
					hidden: true,
					name: 'projectTemplatesGrid',
					store: 'projectTemplate.ProjectTemplates',
					hideHeaders: true,
					columns: [
						{text: 'Image', xtype: 'templatecolumn', tpl: '<img src="./resources/images/product_icon.png" width="64" height="64">'},
						{text: 'Name', flex: 1, dataIndex: 'name', 
							xtype: 'templatecolumn', tpl: '<div><h3>{name}</h3></div><div>{description}</div>'
						}
					]
				}
			]
		}
	]
}); 