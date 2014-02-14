var valueTypeStore = Ext.create('Ext.data.Store',{
	fields: ['name', 'value'],
	data: [
		{name: 'String', value: 'String'},
		{name: 'Number', value: 'Number'},
		{name: 'DateTime', value: 'DateTime'},
		{name: 'True/False', value: 'True/False'}
	]
});

Ext.define('MYOCD.view.project.ProjectFeatureOwnedAttributes', {
	extend: 'Ext.Panel',
	requires: [
		'Ext.grid.Panel',
		'Ext.grid.plugin.RowEditing',
	    'Ext.ux.CheckColumn',
	    'Ext.grid.feature.Grouping'
	],
	xtype: 'projectFeatureOwnedAttributes',
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
					features: [
						{ftype: 'grouping', groupHeaderTpl: 'Group: {name}'}
					],
					name: 'featureOwnedAttributesGrid',
					store: 'project.FeatureAttributes',
					columns: [
						{text: 'Name', flex: 1.5, dataIndex: 'name', editor: 'textfield',
							xtype: 'templatecolumn',
							tpl: '<tpl if="isInherited || constant"><font color="gray">{name}</font><tpl else>{name}</tpl>'
						},
						{text: 'Value', flex: 2, dataIndex: 'value', editor: 'textfield',
							xtype: 'templatecolumn',
							tpl: '<tpl if="isInherited || constant"><font color="gray">{value}</font><tpl else>{value}</tpl>'
						}
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
					name: 'projectFeatureSetAction'
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