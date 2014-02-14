var operators = Ext.create('Ext.data.Store', {
    fields: ['name', 'value'],
    data : [
        {name: 'greater than', value: '>'},
		{name: 'less than', value: '<'},
		{name: 'equal to', value: '=='},
		{name: 'not equal to', value: '!='}
    ]
});

Ext.define('MYOCD.view.viewTemplate.NewViewTemplate', {
	extend: 'Ext.window.Window',
	requires: [
		'Ext.grid.plugin.DragDrop',
		'MYOCD.view.viewTemplate.NewViewTemplateSelectObjectType'
	],
	xtype: 'newViewTemplate',
	title: 'New View Template',
	cls: 'customWindow',
	constrainHeader: true,
	width: 900,
	height: 600,
	autoScroll: true,
    overflow: 'auto',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'center'
	},
	items: [
		{
			xtype: 'container',
			flex: 1,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			minWidth: 750,
			minHeight: 800,
			items: [
				{
					xtype: 'fieldset',
					defaults: {
						labelWidth: 80
					},
					defaultType: 'textfield',
					layout: {
						type: 'vbox',
						align: 'stretch',
						pack: 'center'	
					},
					items: [
						{
							name: 'viewTemplateId',
							hidden: true	
						},
						{
							name: 'viewTemplateName',
							fieldLabel: 'Name',
							allowBlank: false,
							listeners: {
								blur: function() {
									this.setValue(this.getValue().trim());
								}
							}
						},
						{
							name: 'viewTemplateDesc',
							fieldLabel: 'Description'
						}
					]
				},
				{
					xtype: 'panel',
					flex: 1,
					layout: 'border',
					items: [
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
									flex: 1,
									name: 'refObjectTypesGrid',
									columns: [
										{xtype: 'templatecolumn', width: 40, tpl: '<img src="./resources/images/product_icon.png" width="32" height="32">'},
										{text: 'Name', flex: 1, dataIndex: 'name', 
											xtype: 'templatecolumn', tpl: '<div><h3>{name}</h3></div><div>{description}</div>'
										}
									],
									store: 'viewTemplate.NewViewTemplateObjectTypes'
								}
							]
						},
						{
							xtype: 'panel',
							style: 'background-color: white;',
							flex: 2.5,
							region: 'center',
							title: 'Attribute Filters',
							layout: {
								type: 'border',
							},
							items: [
								{
									xtype: 'panel',
									region: 'north',
									layout: 'hbox',
									items: [
										{
											xtype: 'checkbox',
											margin: '0 0 0 5',
											name: 'ascCheckBox',
											boxLabel: 'Check to apply ASC sorting',
											flex: 1,
											//checked: true
										},
										{
											xtype: 'label',
											padding: 5,
											text: 'Drag and Drop attribute to reoder sorting, check to group by',
											flex: 1
										}
									]
								},
								{
									xtype: 'grid',
									tools: [
										{
											type: 'help',
											tooltip: 'Drag a field and drop on Selected Fields'
										}
									],
									region: 'west',
									flex: 1,
									name: 'availableFieldsGrid',
									title: 'Available Filter Fields',
									store: 'viewTemplate.AvailableFields',
									columns: [
										{text: 'Name', flex: 1, dataIndex: 'name'}
									]
								},
								{
									xtype: 'grid',
									title: 'Selected Fields',
									region: 'center',
									flex: 1,
									name: 'attributeFilterGrid',
									viewConfig: {
								        plugins: [
									        {
									            ptype: 'gridviewdragdrop',
									            dragText: 'Drag and drop to reorder'
									        }
								        ]
								    },
									columns: [
										{text: 'Name', flex: 1, dataIndex: 'name'},
										{
											xtype: 'actioncolumn',
											text: 'Group By',
											items: [
												{
													icon: 'resources/images/green_check.png',
												}	
											],
											renderer: function(val, metaData, rec) {
									            if(!rec.data.checkedGroupBy) {
										            this.items[0].icon = '';
									            } else {
										            this.items[0].icon = 'resources/images/green_check.png';
									            }
								            }
										}
									]
								},
								{
									xtype: 'container',
									region: 'south',
									flex: 1,
									layout: {
										type: 'vbox',
										align: 'stretch'
									},
									items: [
										{
											xtype: 'fieldset',
											layout: 'hbox',
											items: [
												{
													xtype: 'combobox',
													name: 'filterFieldCombobox',
													fieldLabel: 'Show items when',
													labelWidth: 120,
													flex: 2,
													margin: 2,
													displayField: 'name',
    												valueField: 'name',
    												queryMode: 'local'
												},
												{
													xtype: 'combobox',
													name: 'operatorsCombobox',
													flex: 1,
													margin: 2,
													store: operators,
													displayField: 'name',
    												valueField: 'value',
    												queryMode: 'local'
												},
												{
													xtype: 'textfield',
													name: 'filterValue',
													flex: 1,
													margin: 2
												},
												{
													xtype: 'button',
													name: 'addFilterBtn',
													text: 'Add'
												}
											]
										},
										{
											xtype: 'grid',
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
								}
							]
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
			defaults: {
				width: 150	
			},
			defaultType: 'button',
			items: [
				{
					name: 'createNewViewTemplateBtn',
					text: 'Create View Template'
				},
				{
					name: 'updateViewTemplateBtn',
					text: 'Update View Template',
					hidden: true
				}
			]
		}
	]
});