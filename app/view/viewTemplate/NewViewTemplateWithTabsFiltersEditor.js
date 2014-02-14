var mathOperators = Ext.create('Ext.data.Store', {
    fields: ['name', 'value'],
    data : [
        {name: '\'+\' plus', value: '+'},
		{name: '\'-\' minus', value: '-'},
		{name: '\'*\' mutiple', value: '*'},
		{name: '\'/\' devide', value: '/'}
    ]
});
var logicalOperators = Ext.create('Ext.data.Store', {
    fields: ['name', 'value'],
    data : [
        {name: '\'&&\' and', value: '&&'},
		{name: '\'||\' or', value: '||'},
		{name: '\'!\' different', value: '!'}
    ]
});
var comparisonOperators = Ext.create('Ext.data.Store', {
    fields: ['name', 'value'],
    data : [
        {name: '\'<\' less than', value: '<'},
		{name: '\'>\' greater than', value: '>'},
		{name: '\'==\' equal', value: '=='},
		{name: '\'.equal()\' equal (string)', value: '.equal()'},
		{name: '\'<=\' equal or less than', value: '<='},
		{name: '\'>=\' equal or greater than', value: '>='},
    ]
});

Ext.define('MYOCD.view.viewTemplate.NewViewTemplateWithTabsFiltersEditor',{
	extend: 'Ext.window.Window',
	requires: ['Ext.form.RadioGroup', 'Ext.form.field.Radio'],
	xtype: 'newViewTemplateWithTabsFiltersEditor',
	title: 'Filters Editor',
	cls: 'customWindow',
	width: 800,
	height: 500,
	layout: 'border',
	items: [
		{
			xtype: 'container',
			style: 'background-color: white',
			region: 'west',
			margin: 1,
			flex: 1,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				// {
				// 	xtype: 'grid',
				// 	flex: 1,
				// 	name: 'filterObjectTypesColumnsGrid',
				// 	viewConfig: {
			 //            plugins: {
			 //                ddGroup: 'availableFilterFields',
			 //                ptype: 'gridviewdragdrop',
			 //                enableDrop: false
			 //            }
			 //        },
				// 	columns: [
				// 		{text: 'Object Type', dataIndex: 'objectTypeName'},
				// 		{text: 'Name', flex: 1, dataIndex: 'fieldName'}
				// 	],
				// 	store: 'viewTemplate.ObjectTypesColumns'
				// }
				{
					xtype: 'tabpanel',
					name: 'filterEditorTabPanel',
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
							name: 'filterEditorObjectTypesGrid',
							flex: 1,
							store: 'viewTemplate.NewViewTemplateObjectTypes',
							columns: [
								{xtype: 'templatecolumn', width: 40, tpl: '<img src="./resources/images/product_icon.png" width="32" height="32">'},
								{text: 'Name', flex: 1, dataIndex: 'name', 
									xtype: 'templatecolumn', tpl: '<div><h3>{name}</h3></div><div>{description}</div>'
								}
							]
						},
						{
							xtype: 'grid',
							title: 'Available Fields',
							name: 'filterEditorAvailbleFieldsGrid',
							flex: 1,
							store: 'viewTemplate.AvailableFields',
							viewConfig: {
					            plugins: {
				    	            ddGroup: 'availableFilterFields',
				        	        ptype: 'gridviewdragdrop',
				            	    enableDrop: false
				            	}
			        		},
							columns: [
								// {text: 'Object Type', dataIndex: 'objectTypeName'},
								{text: 'Name', flex: 1, dataIndex: 'name'}
							]
						}
					]
				}
			]
		},
		{
			xtype: 'container',
			margin: 1,
			region: 'center',
			flex: 1.5,
			layout: 'border',
			items: [
				{
					xtype: 'panel',
					title: 'Operators',
					border: false,
					region: 'north',
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'combobox',
							name: 'mathOperatorsCombobox',
							store: mathOperators,
							queryMode: 'local',
							valueField: 'value',
							displayField: 'name',
							value: '+'
						},
						{
							xtype: 'button',
							margin: 2,
							padding: 2,
							name: 'addMathOperatorbtn',
							text: '+'
						},
						{
							xtype: 'combobox',
							name: 'comparisonOperatorsCombobox',
							flex: 1,
							store: comparisonOperators,
							queryMode: 'local',
							valueField: 'value',
							displayField: 'name',
							value: '<'
						},
						{
							xtype: 'button',
							margin: 2,
							padding: 2,
							name: 'addComparisonOperatorbtn',
							text: '+'
						},
						{
							xtype: 'combobox',
							name: 'logicalOperatorsCombobox',
							flex: 1,
							store: logicalOperators,
							queryMode: 'local',
							valueField: 'value',
							displayField: 'name',
							value: '&&'
						},
						{
							xtype: 'button',
							margin: 2,
							padding: 2,
							name: 'addLogicalOperatorbtn',
							text: '+'
						}
					]
				},
				{
					xtype: 'textarea',
					padding: 5,
					region: 'center',
					flex: 1,
					name: 'filtersEditorView',
					emptyText: 'Edit your filter. Example: (_{546::Width}<=10 && _{546::Height}==5) || (_{546::Type}.equals(\'Chandelier\'))', 
				}
			]
		},
		{
			xtype: 'container',
			region: 'south',
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			items: [
				{
					xtype: 'button',
					text: 'Add Filter',
					name: 'addNewFilterBtn'
				}
			]
		}
	]
});