Ext.define('MYOCD.view.project.NewProjectProductAttribute', {
	extend: 'Ext.Container',
	xtype: 'newProjectProductAttribute',
	requires: [
		'Ext.form.CheckboxGroup',
		//'MYOCD.view.productCatalog.NewCatalogProductFormula'
	],
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'center'
	},
	margin: 10,
	autoScroll: true,
    overflow: 'auto',
	items: [
		{
			xtype: 'textfield',
			name: 'projectProductAttName',
			fieldLabel: 'Name',
			labelWidth: 80,
		},
		{
			xtype: 'textfield',
			name: 'projectProductAttDesc',
			fieldLabel: 'Description',
			labelWidth: 80
		},
		{
			xtype: 'checkboxgroup',
			name: 'projectProductAttSettingsCheck',
			columns: 1,
			vertical: true,
			fieldLabel: 'Settings',
			labelWidth: 80,
			items: [
				{boxLabel: 'Hidden', name: 'hiddenCheck', inputValue: '1'},
				{boxLabel: 'Mandatory', name: 'mandatoryCheck', inputValue: '2'},
			]
		},
		{
			xtype: 'textfield',
			name: 'projectProductAttValue',
			fieldLabel: 'Value',
			labelWidth: 80
		},
		{
			xtype: 'combobox',
			name: 'projectProductAttValueType',
			store: 'others.ValueTypes',
			queryMode: 'local',
			displayField: 'name',
			valueField: 'id',
			fieldLabel: 'Value Type',
			labelWidth: 80,
			emptyText: ' Must choose a value type ...'
		},
		{
			xtype: 'textareafield',
			name: 'projectProductAttChoices',
			emptyText: 'Separate by end lines',
			fieldLabel: 'Choices',
			labelWidth: 80,
			grow: true
		},
		{
			xtype: 'combobox',
			name: 'projectProductAttMeasureUnit',
			store: 'others.MeasureUnits',
			queryMode: 'local',
			displayField: 'name',
			valueField: 'id',
			fieldLabel: 'Measure',
			labelWidth: 80,
			emptyText: 'Must choose a measure unit ...'
		},
		{
			xtype: 'checkboxgroup',
			name: 'projectProductAttValueSettingsCheck',
			columns: 1,
			vertical: true,
			fieldLabel: 'Value Settings',
			labelWidth: 80,
			items: [
				{boxLabel: 'Default', name: 'defaultCheck', inputValue: '1'},
				{boxLabel: 'Constant', name: 'constantCheck', inputValue: '2'},
			]
		},
		{
			xtype: 'container',
			layout: {
				type: 'hbox',
				pack: 'center'	
			},
			items: [
				{
					xtype: 'textfield',
					name: 'projectProductAttFormula',
					fieldLabel: 'Formula',
					labelWidth: 80,
				},
				{
					xtype: 'container',
					width: 10
				},
				{
					xtype: 'button',
					name: 'addProjectProductFormulaBtn',
					width: 50,
					text: 'Add'
				}
			]
		},
		{
			xtype: 'button',
			padding: 5,
			text: 'Create',
			name: 'createProjectProductAttBtn'
		}

	]
});