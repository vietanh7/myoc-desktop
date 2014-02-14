Ext.define('MYOCD.view.viewTemplate.NewViewTemplateWithTabsAggregations',{
	extend: 'Ext.panel.Panel',
	xtype: 'newViewTemplateWithTabsAggregations',
	requires: [
		'MYOCD.view.viewTemplate.NewViewTemplateWithTabsAggregationsEditor'
	],
	layout: 'border',
	items: [
		{
			xtype: 'grid',
			// tools: [
			// 	{
			// 		xtype: 'tool',
			// 		type: 'plus',
			// 		name: 'addNewAggregationTool'
			// 	}
			// ],
			// plugins: [
			// 	{
			// 		ptype: 'rowediting', pluginId: 'rowEditingPlugin'
			// 	}
			// ],
			title: 'Aggregation Fields',
			region: 'center',
			flex: 1,
			name: 'aggregationsGrid',
			store: 'viewTemplate.Aggregations',
			columns: [
				// {text: 'Name', flex: 1, dataIndex: 'name'},
				// {text: 'Formula', flex: 3, dataIndex: 'formula'},
				{text: 'Object Type', flex: 1, dataIndex: 'objectTypeName'},
				{text: 'Column', flex: 3, dataIndex: 'column'},
				{text: 'Function', flex: 1, dataIndex: 'operator', xtype: 'componentcolumn', 
					// editor: {
					// 	xtype: 'combobox',
					// 	name: 'aggregationEditorCombobox',
					// 	store: ['SUM', 'MULTIPLY', 'COUNT', 'AVERAGE', 'MIN', 'MAX']
					// }
					renderer: function(operator, meta, record) { 
		                return { 
		                    store: [' ', 'SUM', 'MULTIPLY', 'COUNT', 'AVERAGE', 'MIN', 'MAX'], 
		                    editable: false, 
		                    value: operator, 
		                    xtype: 'combobox',
		                    listeners: {
		                    	change: function( combobox, newValue, oldValue, eOpts ) {
		                    		var stringId = record.data.name + record.data.formula + record.data.display_column;
		                    		record.set('name', newValue),
		                    		record.set('operator', newValue);
		                    		record.commit();
									MYOCD.SharedData.aggregations = [];
									for (var i = 0; i < Ext.getStore('viewTemplate.Aggregations').data.items.length; i++) {
										if (Ext.getStore('viewTemplate.Aggregations').data.items[i].data.name && Ext.getStore('viewTemplate.Aggregations').data.items[i].data.name.trim().length > 0) {
											MYOCD.SharedData.aggregations.push(Ext.getStore('viewTemplate.Aggregations').data.items[i].data);
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