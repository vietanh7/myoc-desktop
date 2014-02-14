var valueTypeStore = Ext.create('Ext.data.Store',{
	fields: ['name', 'value'],
	data: [
		{name: 'String', value: 'String'},
		{name: 'Number', value: 'Number'},
		{name: 'DateTime', value: 'DateTime'},
		{name: 'True/False', value: 'True/False'}
	]
});

Ext.define('MYOCD.view.objectTypeLibrary.ObjectTypeOwnedAtts', {
	extend: 'Ext.Panel',
	requires: [
		'Ext.grid.Panel', 'Ext.grid.feature.Grouping',
		'Ext.grid.plugin.RowEditing',
	    'Ext.ux.CheckColumn'
	],
	style: 'background-color: white',
	flex: 1,
	xtype: 'objectTypeOwnedAtts',
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
					name: 'objectTypeOwnedAttsGrid',
					store: 'objectTypeLibrary.ObjectTypeAttributes',
					columns: [
						{
							xtype: 'actioncolumn',
							width: 40,
							items: [
								{
									icon: 'resources/images/p_grey_small.png',
								}
							],
							renderer: function(val, metaData, rec) {
					            if(rec.data.isInherited) {
						            this.items[0].icon = 'resources/images/a_grey_small.png';
					            } else {
						            this.items[0].icon = 'resources/images/a_green_small.png';
					            }
		
				            } 
						},
						{text: 'Name', flex: 1.5, dataIndex: 'name', editor: 'textfield',
							xtype: 'templatecolumn',
							tpl: '<tpl if="isInherited"><font color="gray">{name}</font><tpl else>{name}</tpl>'
						},
						{text: 'Description', flex: 2.5, dataIndex: 'description', editor: 'textfield', 
							xtype: 'templatecolumn',
							tpl: '<tpl if="isInherited"><font color="gray">{description}</font><tpl else>{description}</tpl>'
						},
						{text: 'Default Value', flex: 2, dataIndex: 'default_value', editor: 'textfield',
							xtype: 'templatecolumn',
							tpl: '<tpl if="isInherited"><font color="gray">{default_value}</font><tpl else>{default_value}</tpl>'
						},
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
						}},
						{text: 'Group', flex: 2, dataIndex: 'type_group',
							xtype: 'templatecolumn',
							tpl: '<tpl if="isInherited || constant"><font color="gray">{type_group}</font><tpl else>{type_group}</tpl>'
						},
						{
							xtype: 'actioncolumn',
							width: 40,
							items: [
								{
									icon: 'resources/images/green_delete.png',
									handler: function(grid, rowIndex, colIndex) {
										var rec = grid.getStore().getAt(rowIndex);
										var parent = grid.up('objectTypeOwnedAtts');
										parent.fireEvent('removeinheritedattribute', grid, rec);
									}
								}	
							],
							renderer: function(val, metaData, rec) {
					            if(rec.data.isInherited) {
						            this.items[0].icon = '';
					            } else {
						            this.items[0].icon = 'resources/images/green_delete.png';
					            }
				            }
						}
					]
				}
			]
		},
		{
			xtype: 'panel',
			style: 'background-color: white',
			title: 'New Attribute',
			region: 'east',
			flex: 1.5,
			collapsed: true,
			collapsible: true,
			autoScroll: true,
    		overflow: 'auto',
			split: true,
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
							name: 'objectTypeAttName',
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
							name: 'objectTypeAttDesc',
							fieldLabel: 'Description'
						},
						{
							xtype: 'combobox',
							fieldLabel: 'Value Type',
							store: valueTypeStore,
							displayField: 'name',
							valueField: 'value',
							queryMode: 'local',
							name: 'objectTypeAttValueType'
						},
						{
				            xtype: 'fieldcontainer',
				            fieldLabel: 'Settings',
				            defaultType: 'checkboxfield',
				            items: [
				                {
				                    boxLabel  : 'Hidden',
				                    name      : 'objectTypeAttHiddenCheck'
				                }, 
				                {
				                    boxLabel  : 'Constant',
				                    name      : 'objectTypeAttConstantCheck'
				                }, 
				                {
				                    boxLabel  : 'Mandatory',
				                    name      : 'objectTypeAttMandatoryCheck'
				                },
				                {
					                boxLabel  : 'Deprecated',
					                name	  : 'objectTypeAttDeprecatedCheck'
				                }
				            ]
				        },
				        {
					        xtype: 'textfield',
					        name: 'objectTypeAttDefaultValue',
					        fieldLabel: 'Default Value'
				        }
					]	
				},
				{
					xtype: 'setActionPermission',
					name: 'objectTypeAttributeSetAction'
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
							name: 'createObjectTypeAttBtn',
							text: 'Create Attribute'
						}
					]
				}
			]
		}
	]
});