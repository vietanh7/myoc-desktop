var productAttYesNoStore = Ext.create('Ext.data.Store', {
	fields: ['text', 'value'],
	data: [
		{text: 'True', value: true},
		{text: 'False', value: false},
	]
});

Ext.define('MYOCD.view.project.ProjectProductAttributes', {
	extend: 'Ext.Container',
	requires: [
		'Ext.grid.plugin.RowEditing',
		'MYOCD.view.project.NewProjectProductAttribute'
	],
	xtype: 'projectProductAttributes',
	layout: 'border',
	bodyBorder: false,
	defaults: {
	    collapsible: true,
	    split: true,
	},
	items: [
		{
			xtype: 'panel',
			title: 'Product Attributes',
			region: 'center',
			collapsible: false,
			height: '100%',
			width: '60%',
			layout: 'fit',
			items: [
				{
					xtype: 'grid',
					name: 'projectProductAttGrid',
					plugins: [
						{
							ptype: 'rowediting', clicksToEdit: 2
						}
					],
					features: [
						{ftype: 'grouping', groupHeaderTpl: 'Group: {type_group} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'}
					],
					store: 'project.ProjectProductAttributes',
					columns: [
						{text: 'Name', flex: 1, dataIndex: 'name', editor: 'textfield'},
						{text: 'Value', flex: 1, dataIndex: 'value', editor: 'textfield'},
						{
							text: 'Constant', 
							flex: 1, 
							dataIndex: 'constant', 
							editor: {
								xtype: 'combobox',
								displayField: 'text',
								valueField: 'value',
								queryMode: 'local',
								value: true, 
								store: productAttYesNoStore
							}
						},
						{	
							text: 'Default', 
							flex: 1, 
							dataIndex: 'default_value', 
							editor: 'textfield'
						},
						{
							text: 'Mandatory', 
							flex: 1, 
							dataIndex: 'mandatory', 
							editor: {
								xtype: 'combobox',
								displayField: 'text',
								valueField: 'value',
								queryMode: 'local',
								value: true, 
								store: productAttYesNoStore
							}
						},
						{text: 'Formula', flex: 2, dataIndex: 'attribute_value_formula', editor: {
							xtype: 'textfield',
							//editorName: 'productCatalogEditFormulaTextField',
						}},
						{text: 'Description', flex: 2, dataIndex: 'attribute_description', editor: 'textfield'}
					]
				}
			]
		},
		{
			xtype: 'panel',
			//name: 'addProductAttributePanel',
			title: 'Add New Attribute',
			region: 'east',
			collapsed: true,
			height: '100%',
			width: '40%',
			layout: {
				type: 'vbox',
				align: 'stretch',
			},
			items: [
				{
					xtype: 'newProjectProductAttribute'
				}
			]
		}
	]

});