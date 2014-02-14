Ext.define('MYOCD.view.viewTemplate.NewViewTemplateWithTabsGroupBy',{
	extend: 'Ext.panel.Panel',
	xtype: 'newViewTemplateWithTabsGroupBy',
	title: 'Group By',
	layout: 'border',
	items: [
		{
			xtype: 'panel',
			region: 'west',
			flex: 1.2,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'tabpanel',
					name: 'groupByTabPanel',
					items: [
						{title: 'Primary Object Types'},
						{title: 'Secondary Object Types'}
					]
				},
				{
					xtype: 'panel',
					flex: 1,
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'grid',
							title: 'Object Types',
							tools: [
								{
									xtype: 'tool',
									type: 'plus',
									name: 'selectObjectTypeTool'
								}
							],
							name: 'secondaryGroupByObjectTypesGrid',
							flex: 1,
							store: 'viewTemplate.NewViewTemplateObjectTypes',
							columns: [
								{xtype: 'templatecolumn', width: 40, tpl: '<img src="./resources/images/product_icon.png" width="32" height="32">'},
								{text: 'Name', flex: 1, dataIndex: 'name', 
									xtype: 'templatecolumn', tpl: '<div>{name}</div><div>{description}</div>'
								}
							]
						},
						{
							xtype: 'grid',
							title: 'Available Fields',
							name: 'groupByAvailbleFieldsGrid',
							flex: 1,
							store: 'viewTemplate.AvailableFields',
							features: [
								{ftype: 'grouping', groupHeaderTpl: 'Group: {name}'}
							],
							columns: [
								{text: 'Name', flex: 1, dataIndex: 'name', 
									xtype: 'templatecolumn', tpl: '<tpl if="groupBySelected"><div style="font-weight:bold; color: green;">{name}</div><tpl else>{name}</tpl>'
								}
							]
						}
					]
				}
			]
		},
		{
			xtype: 'grid',
			title: 'Group by Fields',
			region: 'center',
			flex: 1,
			name: 'groupByFieldsGrid',
			store: 'viewTemplate.GroupByFields',
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
			columns: [
				{text: 'Object Type', dataIndex: 'objectTypeName'},
				{text: 'Name', flex: 1, dataIndex: 'fieldName'}
			]
		}
	]
});