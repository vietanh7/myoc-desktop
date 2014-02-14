var roleTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

var panelAllPermissionStore = Ext.create('Ext.data.Store', {
	fields: [
		{name: 'inherit_security_from_parent'},
		{name: 'id'},
		{name: 'name'},
		{name: 'description'},
		{name: 'type'},
		{name: 'created'},
		{name: 'expired'},
		{name: 'owner_id'},
		{name: 'path'},
		{name: 'isInherited'}
	]
});

Ext.define('MYOCD.view.roleLibrary.RoleLibraryManager', {
	extend: 'Ext.Panel',
	requires: [
		'Ext.tree.Panel',
		'Ext.view.View',
		'Ext.grid.plugin.CellEditing',
		'MYOCD.view.roleLibrary.NewRole', 
		'MYOCD.view.roleLibrary.EditRolesCategory',
		'MYOCD.view.roleLibrary.RoleDetail',
		'MYOCD.view.roleLibrary.NewRoleWithCustom'
	],
	xtype: 'roleLibraryManager',
	title: 'Role Library Manager',
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
					name: 'roleLibsBackButton',
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
					name: 'addNewRoleCategoryTool'
				}
				// ,
				// {
				// 	xtype: 'tool',
				// 	type: 'gear',
				// 	name: 'roleCategoryAuthorTool'
				// }
			],
			plugins: [{ptype: 'cellediting', pluginId: 'cellEditingPlugin'}],
			name: 'roleCategoriesTree',
			title: 'Categories',
			region: 'west',
			collapsible: true,
			split: true,
			flex: 1,
			store: 'roleLibrary.RoleCategoriesTreeStore',
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
			title: 'Roles',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'center'
			},
			tools: [
				{
					xtype: 'tool',
					name: 'roleLibraryToggleViewTool',
					cls: 'listview-icon'	
				},
				{
					xtype: 'tool',
					type: 'plus',
					name: 'addNewRoleTool'
				}
				// ,
				// {
				// 	xtype: 'tool',
				// 	type: 'gear',
				// 	name: 'roleAuthorTool'
				// }	
			],
			region: 'center',
			cls: 'product-view',
			flex: 3,
			items: [
				{
					xtype: 'dataview',
					flex: 1,
					name: 'rolesDataView',
					autoScroll: true,
					layout: 'auto',
					store: 'roleLibrary.Roles',
					tpl: roleTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				},
				{
					xtype: 'grid',
					border: false,
					flex: 1,
					hidden: true,
					name: 'rolesGrid',
					store: 'roleLibrary.Roles',
					hideHeaders: true,
					columns: [
						{text: 'Image', xtype: 'templatecolumn', tpl: '<img src="./resources/images/product_icon.png" width="64" height="64">'},
						{text: 'Name', flex: 1, dataIndex: 'name'}
					]
				}
			]
		},
		{
			xtype: 'panel',
			style: 'background-color: white',
			title: 'Add New Role',
			name: 'addNewRolePanel',
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
					name: 'newRoleName',
					fieldLabel: 'Name',
					labelWidth: 80
				},
				{
					xtype: 'textfield',
					margin: 5,
					name: 'newRoleDesc',
					fieldLabel: 'Description',
					labelWidth: 80
				},
				{
					xtype: 'grid',
					name: 'newRolePermissionsGrid',
					flex: 1,
					border: false,
					title: 'Permissions',
					tools: [
						{
							xtype: 'tool',
							type: 'plus',
							name: 'selectPermissionTool'
						}
					],
					columnLines: true,
					store: panelAllPermissionStore,
					columns: [
						{
							xtype: 'actioncolumn',
							width: 40,
							items: [
								{
									icon: 'resources/images/p_green_small.png',
								}
							]
						},
						{text: 'Name', flex: 1, dataIndex: 'name'},
						{text: 'Path', flex: 2, dataIndex: 'path'},
						{
							xtype: 'actioncolumn',
							width: 40,
							items: [
								{
									icon: 'resources/images/green_delete.png',
									handler: function(grid, rowIndex, colIndex) {
										var rec = grid.getStore().getAt(rowIndex);
										grid.getStore().remove(rec);
									}
								}	
							]
						}
					]
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
							name: 'createNewRoleBtn'
						}
					]
				}
			]
		}
	]
}); 