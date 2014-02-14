
var updateObjectTypesAssociatedStore = Ext.create('Ext.data.Store', {
	fields: [
		{name: 'defaultObjectTypeId'},
		{name: 'defaultObjectTypeName'},
		{name: 'associatedName'},
		{name: 'associatedType'},
		{name: 'objectTypeId'},
		{name: 'objectTypeName'},
		{name: 'enabled'},
		{name: 'changed'}
	]
});

Ext.define('MYOCD.view.objectTypeLibrary.NewObjectType', {
	extend: 'Ext.window.Window',
	requires: [
		'Ext.form.field.Checkbox',
		'MYOCD.view.objectTypeLibrary.NewObjectTypeSelectParent'
	],
	xtype: 'newObjectType',
	title: 'New Object Type',
	cls: 'customWindow',
	constrainHeader: true,
	width: 400,
	height: 600,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	items: [
		{
			xtype: 'fieldset',
			defaults: {
				labelWidth: 100
			},
			defaultType: 'textfield',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'center'	
			},
			items: [
				{
					name: 'objectTypeId',
					hidden: true	
				},
				{
					name: 'objectTypeName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'objectTypeDesc',
					fieldLabel: 'Description'
				}
			]
		},
		{
			xtype: 'tabpanel',
			flex: 1,
			items: [
				{
					xtype: 'panel',
					title: 'Parents',
					flex: 1,
					layout: {
						type: 'vbox',
						align: 'stretch',
					},
					items: [
						{
							xtype: 'grid',
							flex: 1,
							border: false,
							title: 'Parents',
							tools: [
								{
									xtype: 'tool',
									type: 'plus',
									name: 'addParentTool'
								}
							],
							flex: 1,
							features: [
								{ftype: 'grouping', groupHeaderTpl: 'Group: {name}'}
							],
							name: 'parentObjectTypesGrid',
							// store: objectTypeParentStore,
							columns: [
								{dataIndex: 'name', text: 'Name', flex: 1},
								{dataIndex: 'version', text: 'Version'},
								{
									xtype: 'actioncolumn',
									width: 40,
									items: [
										{
											icon: 'resources/images/green_delete.png',
											handler: function(grid, rowIndex, colIndex) {
												var rec = grid.getStore().getAt(rowIndex);
												grid.getStore().remove(rec);
											}
										}	
									]
								}
							],
							listeners: {
								render: function() {
									var objectTypeParentStore = Ext.create('Ext.data.Store',{
										requires: 'MYOCD.model.objectTypeLibrary.ParentType',
										model: 'MYOCD.model.objectTypeLibrary.ParentType',
										groupField: 'type_group'
									});
									this.bindStore(objectTypeParentStore);
								}
							}
						}
					]
				},
				{
					title: 'Associated',
					xtype: 'panel',
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'grid',
							flex: 1,
							name: 'associatedGrid',
							store: updateObjectTypesAssociatedStore,
							columns: [
								{
									text: 'Enabled', dataIndex: 'enabled', xtype: 'componentcolumn', width: 65,
									renderer: function(enabled, meta, record) { 
						                return { 
						                    xtype: 'checkbox',
						                    checked: enabled,
						                    listeners: {
						                    	change: function( checkbox, newValue, oldValue, eOpts ) {
						                    		record.set('enabled', newValue);
						                    		record.commit();							                    	
						                    	}
						                    } 
						                }; 
						            }
								},
								{text: 'Type', dataIndex: 'associatedName', flex: 2},
								{text: 'Object Type', dataIndex: 'objectTypeName', flex: 1},
								{
									xtype: 'actioncolumn',
									width: 40,
									items: [
										{
											icon: 'resources/images/green_delete.png',
											handler: function(grid, rowIndex, colIndex) {
												var rec = grid.getStore().getAt(rowIndex);
												if (rec.data.changed) {
					                    			rec.set('objectTypeId', rec.data.defaultObjectTypeId);
					                    			rec.set('objectTypeName', rec.data.defaultObjectTypeName);
					                    			rec.set('changed', false);
					                    			rec.commit();
					                    		} else {
					                    			rec.set('defaultObjectTypeId', rec.data.objectTypeId);
					                    			rec.set('defaultObjectTypeName', rec.data.objectTypeName);
						                    		selectObjectType = Ext.create('MYOCD.view.objectTypeLibrary.NewObjectTypeSelectParent');
													selectObjectType.down('textfield[name="addOrUpdate"]').setValue('update');
													selectObjectType.down('textfield[name="parentOrAssociated"]').setValue(rec.data.associatedType);
													MYOCD.SharedData.currentAssociatedStore = updateObjectTypesAssociatedStore;
													selectObjectType.show();	
					                    		}
											}
										}	
									],
									renderer: function(val, metaData, rec) {
							            if(rec.data.changed) {
							            	this.items[0].icon = 'resources/images/green_delete.png';
							            } else {
								            this.items[0].icon = 'resources/images/ellipsis_icon.png';
							            }
						            }
								}
							],
							listeners: {
								render: function() {
									this.getStore().loadRawData(MYOCD.SharedData.associatedTypes);
								}
							}
						}
					]
				}
			]
		},
		{
			xtype: 'container',
			margin: 5,
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			defaults: {
				width: 140	
			},
			defaultType: 'button',
			items: [
				{
					name: 'createNewObjectTypeBtn',
					text: 'Create Object Type'
				},
				{
					name: 'updateObjectTypeBtn',
					text: 'Update Object Type',
					hidden: true
				}
			]
		}
	]
});