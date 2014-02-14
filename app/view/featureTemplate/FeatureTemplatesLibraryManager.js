var featureTemplateTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.featureTemplate.FeatureTemplatesLibraryManager', {
	extend: 'Ext.Panel',
	requires: [
		'Ext.tree.Panel',
		'Ext.view.View',
		'Ext.grid.plugin.CellEditing',
		'MYOCD.view.featureTemplate.NewFeatureTemplate',
		'MYOCD.view.featureTemplate.EditFeatureTemplateCategory'
	],
	xtype: 'featureTemplatesLibraryManager',
	title: 'Feature Templates Library Manager',
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
					name: 'featureTemplatesLibsBackButton',
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
					name: 'addNewFeatureTemplateCategoryTool'
				}
				// ,
				// {
				// 	xtype: 'tool',
				// 	type: 'gear',
				// 	name: 'featureTemplateCategoryAuthorTool'
				// }
			],
			plugins: [{ptype: 'cellediting', pluginId: 'cellEditingPlugin'}],
			name: 'featureTemplatesCategoriesTree',
			title: 'Categories',
			region: 'west',
			collapsible: true,
			split: true,
			flex: 1,
			store: 'featureTemplate.FeatureTemplatesCategoriesTreeStore',
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
					name: 'featureTemplatesLibraryToggleViewTool',
					cls: 'listview-icon'	
				},
				{
					xtype: 'tool',
					type: 'plus',
					name: 'addNewFeatureTemplateTool'
				}
				// ,
				// {
				// 	xtype: 'tool',
				// 	type: 'gear',
				// 	name: 'featureTemplateAuthorTool'
				// }	
			],
			region: 'center',
			cls: 'product-view',
			flex: 3,
			items: [
				{
					xtype: 'dataview',
					flex: 1,
					name: 'featureTemplatesDataView',
					autoScroll: true,
					layout: 'auto',
					store: 'featureTemplate.FeatureTemplates',
					tpl: featureTemplateTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				},
				{
					xtype: 'grid',
					border: false,
					flex: 1,
					hidden: true,
					name: 'featureTemplatesGrid',
					store: 'featureTemplate.FeatureTemplates',
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