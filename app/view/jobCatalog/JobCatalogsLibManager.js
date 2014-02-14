var jobTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.jobCatalog.JobCatalogsLibManager', {
	extend: 'Ext.Panel',
	requires: [
		'Ext.tree.Panel',
		'Ext.view.View',
		'Ext.grid.plugin.CellEditing',
		'MYOCD.view.jobCatalog.NewJob', 
		'MYOCD.view.jobCatalog.EditJobCatalogCategory',
		'MYOCD.view.jobCatalog.JobAttributes'
	],
	xtype: 'jobCatalogsLibManager',
	title: 'Job Catalog Manager',
	layout: 'border',
	items: [
		{
			xtype: 'panel',
			style: 'background-color: white',
			margin: 3,
			height: 25,
			region: 'north',
			collapsible: false,
			layout: 'hbox',
			items: [
				{
					xtype: 'button',
					iconCls: 'back-icon',
					name: 'jobCatalogsLibsBackButton',
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
					name: 'addNewJobCatalogCategoryTool'
				}
				// ,
				// {
				// 	xtype: 'tool',
				// 	type: 'gear',
				// 	name: 'jobCatalogCategoryAuthorTool'
				// }
			],
			plugins: [{ptype: 'cellediting', pluginId: 'cellEditingPlugin'}],
			name: 'jobCatalogsCategoriesTree',
			title: 'Categories',
			region: 'west',
			collapsible: true,
			split: true,
			flex: 1,
			store: 'jobCatalog.JobCatalogsCategoriesTreeStore',
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
			title: 'Jobs',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'center'
			},
			tools: [
				{
					xtype: 'tool',
					name: 'jobCatalogsLibraryToggleViewTool',
					cls: 'listview-icon'	
				},
				{
					xtype: 'tool',
					type: 'plus',
					name: 'addNewJobTool'
				}
				// ,
				// {
				// 	xtype: 'tool',
				// 	type: 'gear',
				// 	name: 'jobAuthorTool'
				// }	
			],
			region: 'center',
			cls: 'product-view',
			flex: 3,
			items: [
				{
					xtype: 'dataview',
					flex: 1,
					name: 'jobsDataView',
					autoScroll: true,
					layout: 'auto',
					store: 'jobCatalog.Jobs',
					tpl: jobTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				},
				{
					xtype: 'grid',
					border: false,
					flex: 1,
					hidden: true,
					name: 'jobsGrid',
					store: 'jobCatalog.Jobs',
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