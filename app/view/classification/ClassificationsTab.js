var classificationLibAccess = Ext.create('Ext.data.Store', {
	fields: ['name', 'value'],
	data: [
		{name: 'Public', value: 'Public'},
		{name: 'Protected', value: 'Protected'},
		{name: 'Private', value: 'Private'}
	]
});

Ext.define('MYOCD.view.classification.ClassificationsTab', {
	extend: 'Ext.Container',
	requires: [
		'Ext.grid.Panel',
		'Ext.grid.plugin.RowEditing',
		'Ext.grid.column.Action',
		'MYOCD.view.classification.NewClassificationLibrary',
		'MYOCD.view.classification.ClassificationsLibraryManager',
		'MYOCD.view.classification.ImportPublicClassificationLibrary'
	],
	xtype: 'classificationsTab',
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
			name: 'classificationLibrariesGrid',
			title: 'Classifications Libraries',
			tools: [
				{
					xtype: 'tool',
					name: 'newClassificationsLibTool',
					type: 'plus'
				}
				// ,
				// {
				// 	xtype: 'tool',
				// 	name: 'classificationLibAuthorTool',
				// 	type: 'gear'
				// }
			],
			plugins: [
				{
					ptype: 'rowediting', pluginId: 'rowEditingPlugin'
				}
			],
			columnLines: true,
			store: 'classification.ClassificationsLibraries',
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
						store: classificationLibAccess,
						queryMode: 'local',
						displayField: 'name',
						valueField: 'value',
						value: 'Public'
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
			xtype: 'classificationsLibraryManager',
			hidden: true,
			flex: 1
		}
	]
	
});