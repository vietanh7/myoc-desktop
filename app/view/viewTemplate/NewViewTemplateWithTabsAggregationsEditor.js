Ext.define('MYOCD.view.viewTemplate.NewViewTemplateWithTabsAggregationsEditor',{
	extend: 'Ext.window.Window',
	requires: ['Ext.form.RadioGroup', 'Ext.form.field.Radio'],
	xtype: 'newViewTemplateWithTabsAggregationsEditor',
	title: 'Aggregations Editor',
	cls: 'customWindow',

	constrainHeader: true,
	width: 500,
	height: 250,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	items: [
		{
			xtype: 'fieldset',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			flex: 1,
			items: [
				// {
				// 	xtype: 'textfield',
				// 	fieldLabel: 'Name',
				// 	name: 'aggregationName'
				// },
				{
					xtype: 'combobox',
					fieldLabel: 'Operator',
					name: 'aggregationOperator',
					store: ['SUM', 'MULTIPLY', 'COUNT', 'AVERAGE', 'MIN', 'MAX'],
					value: 'SUM'
				},
				// {
				// 	xtype: 'label',
				// 	html: '<font color="gray" font="12">Define function</font>'
				// },
				{
					xtype: 'container',
					margin: '0 0 0 0',
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'container',
							margin: '0 0 0 0',
							flex: 1,
							layout: {
								type: 'vbox'
							},
							defaults: {
								width: '100%'
							},
							items: [
								{
						            xtype      : 'radiogroup',
						            name       : 'radioTypeGroup',
						            fieldLabel : 'Type',
						            defaultType: 'radiofield',
						            defaults: {
						                flex: 1
						            },
						            layout: 'hbox',
						            items: [
						                {
						                    boxLabel  : 'Primary Types',
						                    name      : 'typeRadio',
						                    inputValue: 'primary',
						                    checked: true
						                }, {
						                    boxLabel  : 'Secondary Types',
						                    name      : 'typeRadio',
						                    inputValue: 'secondary'
						                }
						            ]
						        },
								{
									xtype: 'combobox',
									name: 'aggregationObjectTypes',
									store: 'viewTemplate.NewViewTemplateObjectTypes',
									fieldLabel: 'Object Type',
									displayField: 'name',
									valueField: 'id',
									queryMode: 'local'
								},
								{
									xtype: 'combobox',
									name: 'aggregationAvailableFields',
									fieldLabel: 'Attributes',
									displayField: 'name',
									valueField: 'name',
									queryMode: 'local',
									store: 'viewTemplate.AvailableFields'
								}
								// ,
								// {
								// 	xtype: 'container',
								// 	layout: {
								// 		type: 'hbox',
								// 		pack: 'end'
								// 	},
								// 	items: [
								// 		{
								// 			xtype: 'button',
								// 			name: 'addKeywordBtn',
								// 			width: 100,
								// 			text: 'Add keyword'
								// 		}
								// 	]
								// }
							]
						}
						// ,
						// {
						// 	xtype: 'container',
						// 	margin: '0 0 0 10',
						// 	flex: 1,
						// 	layout: {
						// 		type: 'vbox',
						// 		align: 'stretch'
						// 	},
						// 	items: [
						// 		{
						// 			xtype: 'container',
						// 			layout: {
						// 				type: 'hbox',
						// 				pack: 'end'
						// 			},
						// 			items: [
						// 				{
						// 					xtype: 'combobox',
						// 					name: 'formulaOperator',
						// 					flex: 1,
						// 					fieldLabel: 'Operator',
						// 					store: ['+', '*'],
						// 					value: '+'
						// 				},
						// 				{
						// 					xtype: 'button',
						// 					name: 'addFormulaBtn',
						// 					width: 100,
						// 					margin: 2,
						// 					text: 'Add Operator'
						// 				}
						// 			]
						// 		},
						// 		{
						// 			xtype: 'container',
						// 			layout: {
						// 				type: 'hbox',
						// 				pack: 'end'
						// 			},
						// 			items: [
						// 				{
						// 					xtype: 'textfield',
						// 					name: 'formularValue',
						// 					flex: 1,
						// 					fieldLabel: 'Value'
						// 				},
						// 				{
						// 					xtype: 'button',
						// 					name: 'formulaAddValueBtn',
						// 					margin: 2,
						// 					width: 100,
						// 					text: 'Add Value'
						// 				}
						// 			]
						// 		}
						// 	]
						// }
					]
				}
				// ,
				// {
				// 	xtype: 'textarea',
				// 	name: 'aggregationFormula',
				// 	disabled: true,
				// 	fieldLabel: 'Function'
				// }
			]
		},
		{
			xtype: 'container',
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			defaults: {
				width: 100,
				margin: 5	
			},
			defaultType: 'button',
			items: [
				// {
				// 	name: 'clearFunction',
				// 	text: 'Clear function'
				// },
				{
					name: 'addAggregationBtn',
					text: 'Add'
				}
			]
		}
	]
});