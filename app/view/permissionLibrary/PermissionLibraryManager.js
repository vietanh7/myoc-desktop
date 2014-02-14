var permissionTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.permissionLibrary.PermissionLibraryManager', {
	extend: 'Ext.Panel',
	requires: [
		'Ext.tree.Panel',
		'Ext.view.View',
		'Ext.grid.plugin.CellEditing',
		'MYOCD.view.permissionLibrary.NewPermission',
		'MYOCD.view.permissionLibrary.EditPermissionsCategory'
	],
	xtype: 'permissionLibraryManager',
	title: 'Permission Library Manager',
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
					name: 'permissionLibsBackButton',
					ui: 'default-toolbar'
				}
			]	
		},
		{
			xtype: 'treepanel',
			border: false,
			style: 'background-color: white',
			tools: [
				{
					xtype: 'tool',
					type: 'plus',
					name: 'addNewPermissionsCategoryTool'
				}
				// ,
				// {
				// 	xtype: 'tool',
				// 	type: 'gear',
				// 	name: 'permissionCategoryAuthorTool'
				// }
			],
			plugins: [{ptype: 'cellediting', pluginId: 'cellEditingPlugin'}],
			name: 'permissonCategoriesTree',
			title: 'Categories',
			region: 'west',
			collapsible: true,
			split: true,
			flex: 1,
			store: 'permissionLibrary.PermissionCategoriesTreeStore',
			//displayField: 'name',
			hideHeaders: true,
			useArrows: true,
			//rootVisible: false,
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
			title: 'Permissions',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'center'
			},
			tools: [
				{
					xtype: 'tool',
					name: 'permissionLibraryToggleViewTool',
					cls: 'listview-icon'	
				},
				{
					xtype: 'tool',
					type: 'plus',
					name: 'addNewPermissionTool'
				}
				// ,
				// {
				// 	xtype: 'tool',
				// 	type: 'gear',
				// 	name: 'permissionAuthorTool'
				// }	
			],
			region: 'center',
			cls: 'product-view',
			flex: 3,
			items: [
				{
					xtype: 'dataview',
					flex: 1,
					name: 'permissionsDataView',
					autoScroll: true,
					layout: 'auto',
					store: 'permissionLibrary.Permissions',
					tpl: permissionTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				},
				{
					xtype: 'grid',
					border: false,
					flex: 1,
					hidden: true,
					name: 'permissionsGrid',
					store: 'permissionLibrary.Permissions',
					hideHeaders: true,
					columns: [
						{text: 'Image', xtype: 'templatecolumn', tpl: '<img src="./resources/images/product_icon.png" width="64" height="64">'},
						{text: 'Name', flex: 1, dataIndex: 'name', 
							xtype: 'templatecolumn', tpl: '<div><h3>{name}</h3></div><div>{description}</div>'
						}
					]
				}
			]
		},
		{
			xtype: 'panel',
			style: 'background-color: white',
			title: 'Add New Permission',
			name: 'addNewPermissionPanel',
			region: 'east',
			collapsible: true,
			split: true,
			collapsed: true,
			flex: 1.5,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'textfield',
					margin: 5,
					name: 'newPermissionName',
					fieldLabel: 'Name',
					labelWidth: 80
				},
				{
					xtype: 'textfield',
					margin: 5,
					name: 'newPermissionDesc',
					fieldLabel: 'Description',
					labelWidth: 80
				},
				{
					xtype: 'container',
					layout: {
						type: 'hbox',
						pack: 'center'
					},
					items: [
						{
							xtype: 'button',
							text: 'Create',
							name: 'createNewPermissionBtn'
						}
					]
				}
			]
		}
	]
}); 