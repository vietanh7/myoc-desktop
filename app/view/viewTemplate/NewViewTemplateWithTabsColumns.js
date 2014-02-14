Ext.define('MYOCD.view.viewTemplate.NewViewTemplateWithTabsColumns',{
	extend: 'Ext.panel.Panel',
	requires: [
		'Ext.grid.plugin.DragDrop'
	],
	xtype: 'newViewTemplateWithTabsColumns',
	title: 'Columns',
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
	items: [
		{
			xtype: 'panel',
			flex: 2,
			layout: 'border',
			items: [
				{
					xtype: 'tabpanel',
					region: 'north',
					name: 'mainColumnsTab',
					items: [
						{
							title: 'Primary Object Types',
						},
						{
							title: 'Secondary Object Types',
						}
					]
				},
				{
					xtype: 'panel',
					flex: 1,
					region: 'west',
					title: 'Object Types',
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					tools: [
						{
							xtype: 'tool',
							type: 'plus',
							name: 'selectObjectTypeTool'
						}
					],
					items: [
						{
							xtype: 'grid',
							name: 'primaryObjectTypesGrid',
							flex: 1,
							store: 'viewTemplate.NewViewTemplateObjectTypes',
							columns: [
								{xtype: 'templatecolumn', width: 40, tpl: '<img src="./resources/images/product_icon.png" width="32" height="32">'},
								{text: 'Name', flex: 1, dataIndex: 'name', 
									xtype: 'templatecolumn', tpl: '<div>{name}</div><div>{description}</div>'
								}
							]
						}
					]
				},
				{
					xtype: 'panel',
					flex: 1,
					region: 'center',
					title: 'Available Fields',
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'grid',
							name: 'primaryObjectTypesAvailbleFieldsGrid',
							flex: 1,
							features: [
								{ftype: 'grouping', groupHeaderTpl: 'Group: {name}'}
							],
							columns: [
								{text: 'Name', flex: 1, dataIndex: 'name', 
									xtype: 'templatecolumn', tpl: '<tpl if="columnSelected"><div style="font-weight:bold; color: green">{name}</div><tpl else>{name}</tpl>'
								}
							],
							store: 'viewTemplate.AvailableFields'
						}
					]
				}
			]
		},
		{
			xtype: 'panel',
			flex: 1.5,
			region: 'east',
			title: 'Columns',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			tools: [
				{
					xtype: 'tool',
					type: 'help',
					tooltip: 'Drag-Drop to reorder columns',
				}
			],
			items: [
				{
					xtype: 'grid',
					flex: 1,
					viewConfig: { 
				        plugins: [
					        {
					            ptype: 'gridviewdragdrop',
					            dragText: 'Drag and drop to reorder'
					        }
				        ],
				        listeners: {
				        	drop: function( node, data, overModel, dropPosition, eOpts ) {
				        		console.log('drop');
				        		data.view.ownerCt.fireEvent('drop', node, data, overModel, dropPosition, eOpts );
				        	}
				        }
				    },
					name: 'primaryObjectTypesColumnsGrid',
					columns: [
						{text: 'Object Type', dataIndex: 'objectTypeName'},
						{text: 'Name', flex: 1, dataIndex: 'fieldName', 
							xtype: 'templatecolumn', tpl: '<tpl if="fieldName==\'Name\'"><a href=#>{fieldName}</a><tpl else>{fieldName}</tpl>'
						}
					],
					store: 'viewTemplate.ObjectTypesColumns'
				}
			]
		}
	]
});