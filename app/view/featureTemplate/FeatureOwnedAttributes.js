var valueTypeStore = Ext.create('Ext.data.Store',{
	fields: ['name', 'value'],
	data: [
		{name: 'String', value: 'String'},
		{name: 'Number', value: 'Number'},
		{name: 'DateTime', value: 'DateTime'},
		{name: 'True/False', value: 'True/False'}
	]
});

Ext.define('MYOCD.view.featureTemplate.FeatureOwnedAttributes', {
	extend: 'Ext.Panel',
	requires: [
		'Ext.grid.Panel',
		'Ext.grid.plugin.RowEditing',
	    'Ext.ux.CheckColumn'
	],
	xtype: 'featureOwnedAttributes',
	style: 'background-color: white',
	layout: 'border',
	items: [
		{
			xtype: 'container',
			flex: 3,
			region: 'center',
			autoScroll: true,
			overflow: 'auto',
			layout: {
				type: 'hbox',
				align: 'stretch',
				pack: 'center'
			},
			items: [
				{
					xtype: 'grid',
					border: false,
					flex: 1,
					minWidth: 900,
					plugins:[
						{
							ptype: 'rowediting', pluginId: 'rowEditingPlugin'
						}
					],
					name: 'featureOwnedAttributesGrid',
					store: 'featureTemplate.FeatureAttributes',
					columns: [
						{text: 'Name', flex: 1.5, dataIndex: 'name', editor: 'textfield',
							xtype: 'templatecolumn',
							tpl: '<tpl if="isInherited || constant"><font color="gray">{name}</font><tpl else>{name}</tpl>'
						},
/*
						{text: 'Description', flex: 2.5, dataIndex: 'description', editor: 'textfield', 
							xtype: 'templatecolumn',
							tpl: '<tpl if="isInherited || constant"><font color="gray">{description}</font><tpl else>{description}</tpl>'
						},
*/
						{text: 'Default Value', flex: 2, dataIndex: 'default_value', editor: 'textfield',
							xtype: 'templatecolumn',
							tpl: '<tpl if="isInherited || constant"><font color="gray">{default_value}</font><tpl else>{default_value}</tpl>'
						}/*
,
						{text: 'Value Type', dataIndex: 'value_type',
							editor: {
								xtype: 'combobox',
								store: valueTypeStore,
								displayField: 'name',
								valueField: 'value',
								queryMode: 'local',
							}
						},
						{text: 'Constant', xtype: 'checkcolumn', dataIndex: 'constant', editor: 'checkbox', listeners: {
							beforecheckchange: function() {
								return false;
							}
						}},
						{text: 'Mandatory', xtype: 'checkcolumn', dataIndex: 'mandatory', editor: 'checkbox', listeners: {
							beforecheckchange: function() {
								return false;
							}
						}},
						{text: 'Deprecated', xtype: 'checkcolumn', dataIndex: 'deprecated', editor: 'checkbox', listeners: {
							beforecheckchange: function() {
								return false;
							}
						}},
						{text: 'Hidden', xtype: 'checkcolumn', dataIndex: 'hidden', editor: 'checkbox', listeners: {
							beforecheckchange: function() {
								return false;
							}
						}}
*/
					]
				}
			]
		},
		{
			xtype: 'panel',
			title: 'New Attribute',
			region: 'east',
			flex: 1.5,
			collapsed: true,
			collapsible: true,
			split: true,
			autoScroll: true,
   			overflow: 'auto',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'start'
			},
			items: [
				{
					xtype: 'container',
					margin: 5,
					layout: {
						type: 'vbox',
						align: 'stretch',
						pack: 'start'
					},
					defaults: {
						labelWidth: 100	
					},
					items: [
						{
							xtype: 'textfield',
							name: 'featureAttName',
							fieldLabel: 'Name',
							allowBlank: false,
							listeners: {
								blur: function() {
									this.setValue(this.getValue().trim());
								}
							}
						},
						{
							xtype: 'textfield',
							name: 'featureAttDesc',
							fieldLabel: 'Description'
						},
						{
							xtype: 'combobox',
							fieldLabel: 'Value Type',
							store: valueTypeStore,
							displayField: 'name',
							valueField: 'value',
							queryMode: 'local',
							name: 'featureAttValueType'
						},
						{
				            xtype: 'fieldcontainer',
				            fieldLabel: 'Settings',
				            defaultType: 'checkboxfield',
				            items: [
				                {
				                    boxLabel  : 'Hidden',
				                    name      : 'featureAttHiddenCheck'
				                }, 
				                {
				                    boxLabel  : 'Constant',
				                    name      : 'featureAttConstantCheck'
				                }, 
				                {
				                    boxLabel  : 'Mandatory',
				                    name      : 'featureAttMandatoryCheck'
				                },
				                {
					                boxLabel  : 'Deprecated',
					                name	  : 'featureAttDeprecatedCheck'
				                }
				            ]
				        },
				        {
					        xtype: 'textfield',
					        name: 'featureAttDefaultValue',
					        fieldLabel: 'Default Value'
				        }
					]	
				},
				{
					xtype: 'setActionPermission',
					name: 'featureTemplateFeatureSetActionPermission'
				},
				{
					xtype: 'container',
					margin: 5,
					layout: {
						type: 'hbox',
						pack: 'center'
					},
					items: [
						{
							xtype: 'button',
							name: 'createFeatureAttBtn',
							text: 'Create Attribute'
						}
					]
				}
			]
		}
	]
});