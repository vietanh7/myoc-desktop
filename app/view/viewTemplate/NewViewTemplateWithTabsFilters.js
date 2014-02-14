Ext.define('MYOCD.view.viewTemplate.NewViewTemplateWithTabsFilters',{
	extend: 'Ext.panel.Panel',
	xtype: 'newViewTemplateWithTabsFilters',
	requires: ['MYOCD.view.viewTemplate.NewViewTemplateWithTabsFiltersEditor'],
	tilte: 'Filters',
	layout: 'border',
	items: [
		// {
		// 	xtype: 'panel',
		// 	style: 'background-color: white;',
		// 	title: 'Filters',
		// 	region: 'north',
		// 	layout: 'hbox',
		// 	items: [
		// 		{
		// 			xtype: 'combobox',
		// 			name: 'filterObjectTypesCombobox',
		// 			fieldLabel: 'Object Types',
		// 			flex: 1,
		// 			margin: 2,
		// 			displayField: 'name',
		// 			valueField: 'id',
		// 			queryMode: 'local',
		// 			store: 'viewTemplate.NewViewTemplateObjectTypes'
		// 		},
		// 		{
		// 			xtype: 'combobox',
		// 			name: 'filterFieldCombobox',
		// 			fieldLabel: 'Fields',
		// 			flex: 1,
		// 			margin: 2,
		// 			displayField: 'name',
		// 			valueField: 'name',
		// 			queryMode: 'local',
		// 			store: 'viewTemplate.AvailableFields'
		// 		},
		// 		{
		// 			xtype: 'combobox',
		// 			name: 'operatorsCombobox',
		// 			flex: 1,
		// 			margin: 2,
		// 			store: operators,
		// 			displayField: 'name',
		// 			valueField: 'value',
		// 			queryMode: 'local'
		// 		},
		// 		{
		// 			xtype: 'textfield',
		// 			name: 'filterValue',
		// 			flex: 1,
		// 			margin: 2
		// 		},
		// 		{
		// 			xtype: 'button',
		// 			name: 'addFilterBtn',
		// 			text: 'Add'
		// 		}
		// 	]
		// },
		{
			xtype: 'grid',
			tools: [
				{
					type: 'plus',
					name: 'addFilterTool'
				}
			],
			region: 'center',
			title: 'Filters',
			name: 'filtersGrid',
			flex: 1,
			hideHeaders: true,
			store: 'viewTemplate.Filters',
			columns: [
				{text: 'displayName', dataIndex: 'displayName', flex: 1}
			]
		}
	]
});