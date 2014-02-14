var objectTypeLibAccess = Ext.create('Ext.data.Store', {
	fields: ['name', 'value'],
	data: [
		{name: 'Public', value: 'Public'},
		{name: 'Protected', value: 'Protected'},
		{name: 'Private', value: 'Private'}
	]
});

var objectTypeLibType = Ext.create('Ext.data.Store', {
	fields: ['name', 'value'],
	data: [
		{name: 'Other', value: 'Other'},
		{name: 'Activity', value: 'Activity'},
		{name: 'Spaces', value: 'Spaces'},
		{name: 'Element', value: 'Element'},
		{name: 'Products', value: 'Products'},
		{name: 'Roles', value: 'Roles'}
	]
});
Ext.define('MYOCD.view.objectTypeLibrary.ObjectTypesTab', {
	extend: 'Ext.Container',
	requires: [
		'Ext.grid.Panel',
		'Ext.grid.plugin.RowEditing',
		'Ext.grid.column.Action',
		'MYOCD.view.objectTypeLibrary.NewObjectTypeLibrary'	,
		'MYOCD.view.objectTypeLibrary.ObjectTypeLibraryManager',
		'MYOCD.view.objectTypeLibrary.ImportPublicObjectTypeLibrary'
	],
	xtype: 'objectTypesTab',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'center'
	},
	items: [
		{
			xtype: 'grid',
			flex: 1,
			border: false,
			name: 'objectTypeLibrariesGrid',
			title: 'Object Types Libraries',
			tools: [
				{
					xtype: 'tool',
					name: 'newObjectTypeLibraryTool',
					type: 'plus'
				}
				// ,
				// {
				// 	xtype: 'tool',
				// 	name: 'objectTypeLibraryAuthorTool',
				// 	type: 'gear'
				// }
			],
			plugins: [
				{
					ptype: 'rowediting', pluginId: 'rowEditingPlugin'
				}
			],
			columnLines: true,
			store: 'objectTypeLibrary.ObjectTypeLibraries',
			columns: [
				{
					xtype: 'actioncolumn',
					width: 40,
					items: [
						{
							icon: 'resources/images/row_edit_icon.png',
							handler: function(grid, rowIndex, colIndex) {
								var rec = grid.getStore().getAt(rowIndex);
				                grid.ownerCt.getPlugin('rowEditingPlugin').startEdit(rec,0);
							}
						}
					],
					renderer: function(val, metaData, rec) {
			            if(rec.data.imported) {
				            this.items[0].icon = '';
			            } else {
				            this.items[0].icon = 'resources/images/row_edit_icon.png';
			            }
		            }
				},
				{text: 'Name', flex: 1, dataIndex: 'name', editor: 'textfield'},
				{text: 'Description', flex: 1.5, dataIndex: 'description', editor: 'textfield'},
				{text: 'Access', flex: 0.5, dataIndex: 'access', 
					editor: {
						xtype: 'combobox',
						store: objectTypeLibAccess,
						queryMode: 'local',
						displayField: 'name',
						valueField: 'value',
						value: 'Public'
					}
				},
				{text: 'Type', flex: 0.5, dataIndex: 'library_type',
					editor: {
						xtype: 'combobox',
						store: objectTypeLibType,
						queryMode: 'local',
						displayField: 'name',
						valueField: 'value',
						value: 'Other'
					}
				},
				{text: 'Owner', flex: 0.5},
				{
					xtype: 'actioncolumn',
					width: 40,
					items: [
						{
							icon: 'resources/images/ellipsis_icon.png',
							handler: function(grid, rowIndex, colIndex) {
								var rec = grid.getStore().getAt(rowIndex);
								grid.fireEvent('itemdblclick', grid, rec, rowIndex);
							}
						}
					],
					renderer: function(val, metaData, rec) {
			            if(rec.data.imported) {
				            this.items[0].icon = '';
			            } else {
				            this.items[0].icon = 'resources/images/ellipsis_icon.png';
			            }
		            }
				}
			]
		},
		{
			xtype: 'objectTypeLibraryManager',
			flex: 1,
			hidden: true
		}
	]
	
});
