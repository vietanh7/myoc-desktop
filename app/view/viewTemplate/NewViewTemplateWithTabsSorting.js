Ext.define('MYOCD.view.viewTemplate.NewViewTemplateWithTabsSorting',{
	extend: 'Ext.panel.Panel',
	xtype: 'newViewTemplateWithTabsSorting',
	title: 'Sorting',
	layout: 'border',
	items: [
		{
			xtype: 'grid',
			title: 'Group by Fields',
			region: 'west',
			flex: 1,
			name: 'groupByFieldsGrid',
			store: 'viewTemplate.GroupByFields',
			columns: [
				{text: 'Object Type', dataIndex: 'objectTypeName'},
				{text: 'Name', flex: 1, dataIndex: 'fieldName'}
			]
		},
		{
			xtype: 'grid',
			tools: [
				{
					type: 'help',
					tooltip: 'Drag a field and drop on Sorting Fields'
				}
			],
			region: 'center',
			flex: 1,
			name: 'availableFieldsSortingGrid',
			title: 'Columns',
			store: 'viewTemplate.ObjectTypesColumns',
			columns: [
				{text: 'Object Type', dataIndex: 'objectTypeName'},
				{text: 'Name', flex: 1, dataIndex: 'fieldName'}
			]
		},
		{
			xtype: 'grid',
			title: 'Sorting Fields',
			region: 'east',
			flex: 1,
			name: 'sortingFieldsGrid',
			store: 'viewTemplate.SortingFields',
			// plugins: [
			// 	{
			// 		ptype: 'rowediting', pluginId: 'rowEditingPlugin'
			// 	}
			// ],
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
				{text: 'Object Types', dataIndex: 'objectTypeName'},
				{text: 'Name', flex: 1, dataIndex: 'fieldName'},
				{text: 'ASC/DESC', dataIndex: 'sorting', xtype: 'componentcolumn',
					renderer: function(sorting, meta, record) { 
		                return { 
		                    store: ['asc', 'desc'],
		                    editable: false, 
		                    value: sorting, 
		                    xtype: 'combobox',
		                    listeners: {
		                    	change: function( combobox, newValue, oldValue, eOpts ) {
		                    		record.set('sorting', newValue),
									record.commit();
									for (var i = 0; i < MYOCD.SharedData.sortingFields.length; i++) {
										if (record.data.objectTypeId == MYOCD.SharedData.sortingFields[i].objectTypeId) {
											MYOCD.SharedData.sortingFields[i].sorting = record.data.sorting;
											break;
										}
									}
		                    	}
		                    } 
		                }; 
		            }
				}
			]
		}
	]
});