var valueTypeStore = Ext.create('Ext.data.Store',{
	fields: ['name', 'value'],
	data: [
		{name: 'String', value: 'String'},
		{name: 'Number', value: 'Number'},
		{name: 'DateTime', value: 'DateTime'},
		{name: 'True/False', value: 'True/False'}
	]
});

Ext.define('MYOCD.view.projectTemplate.ProjectTemplateProductItemOwnedAtts', {
	extend: 'Ext.Panel',
	requires: [
		'Ext.grid.Panel',
		'Ext.grid.plugin.RowEditing',
	    'Ext.ux.CheckColumn'
	],
	flex: 1,
	xtype: 'projectTemplateProductItemOwnedAtts',
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
					name: 'productOwnedAttsGrid',
					store: 'projectTemplate.ProductItemAttributes',
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
						},
/*
						{text: 'Value Type', dataIndex: 'value_type',
							editor: {
								xtype: 'combobox',
								store: valueTypeStore,
								displayField: 'name',
								valueField: 'value',
								queryMode: 'local'
							}
						},
*/
						{
							xtype: 'actioncolumn',
							width: 40,
							items: [
								{
									icon: 'resources/images/green_delete.png',
									handler: function(grid, rowIndex, colIndex) {
										var rec = grid.getStore().getAt(rowIndex);
										var parent = grid.up('projectTemplateProductItemOwnedAtts');
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
							name: 'productAttName',
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
							name: 'productAttDesc',
							fieldLabel: 'Description'
						},
						{
							xtype: 'combobox',
							fieldLabel: 'Value Type',
							store: valueTypeStore,
							displayField: 'name',
							valueField: 'value',
							queryMode: 'local',
							name: 'productAttValueType'
						},
						{
				            xtype: 'fieldcontainer',
				            fieldLabel: 'Settings',
				            defaultType: 'checkboxfield',
				            items: [
				                {
				                    boxLabel  : 'Hidden',
				                    name      : 'productAttHiddenCheck'
				                }, 
				                {
				                    boxLabel  : 'Constant',
				                    name      : 'productAttConstantCheck'
				                }, 
				                {
				                    boxLabel  : 'Mandatory',
				                    name      : 'productAttMandatoryCheck'
				                },
				                {
					                boxLabel  : 'Deprecated',
					                name	  : 'productAttDeprecatedCheck'
				                }
				            ]
				        },
				        {
					        xtype: 'textfield',
					        name: 'productAttDefaultValue',
					        fieldLabel: 'Default Value'
				        }
					]	
				},
				{
					xtype: 'setActionPermission',
					name: 'projectTemplateProductSetAction'
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
							name: 'createProductAttBtn',
							text: 'Create Attribute'
						}
					]
				}
			]
		}
	]
});