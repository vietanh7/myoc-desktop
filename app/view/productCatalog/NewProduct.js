

var newProductAssociatedStore = Ext.create('Ext.data.Store', {
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



Ext.define('MYOCD.view.productCatalog.NewProduct', {
	extend: 'Ext.window.Window',
	xtype: 'newProduct',
	title: 'New Product',
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
					name: 'productId',
					hidden: true	
				},
				{
					name: 'productName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'productDesc',
					fieldLabel: 'Description'
				}
			]
		},
		{
			xtype: 'tabpanel',
			width: '100%',
			flex: 1,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'panel',
					title: 'Parents',
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'grid',
							title: 'Parents',
							border: false,
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
							// store: productParentStore,
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
									var productParentStore = Ext.create('Ext.data.Store',{
										requires: 'MYOCD.model.objectTypeLibrary.ParentType',
										model: 'MYOCD.model.objectTypeLibrary.ParentType',
										groupField: 'type_group'
									});
									this.bindStore(productParentStore);
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
							store: newProductAssociatedStore,
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
								{text: 'Type', dataIndex: 'associatedType', flex: 2},
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
					                    			var selectObjectType = Ext.ComponentQuery.query('newProductSelectParent')[0];
						                    		if (selectObjectType) {
						                    			selectObjectType.destroy();
						                    		}
						                    		selectObjectType = Ext.create('MYOCD.view.productCatalog.NewProductSelectParent');
													selectObjectType.down('textfield[name="parentOrAssociated"]').setValue(rec.data.associatedType);
													MYOCD.SharedData.currentProductAssociatedStore = newProductAssociatedStore;
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
				width: 120	
			},
			defaultType: 'button',
			items: [
				{
					name: 'createNewProductBtn',
					text: 'Create Product'
				},
				{
					name: 'updateProductBtn',
					text: 'Update Product',
					hidden: true
				}
			]
		}
	]
});