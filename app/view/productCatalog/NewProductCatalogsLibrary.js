var productCatalogLibAccess = Ext.create('Ext.data.Store', {
	fields: ['name', 'value'],
	data: [
		{name: 'Public', value: 'Public'},
		{name: 'Protected', value: 'Protected'},
		{name: 'Private', value: 'Private'}
	]
});

Ext.define('MYOCD.view.productCatalog.NewProductCatalogsLibrary', {
	extend: 'Ext.window.Window',
	xtype: 'newProductCatalogsLibrary',
	title: 'New Product Catalog Library',
	cls: 'customWindow',
	constrainHeader: true,
	width: 320,
	height: 200,
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'center'
	},
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
					name: 'productCatalogLibraryId',
					hidden: true	
				},
				{
					name: 'productCatalogLibraryName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'productCatalogLibraryDesc',
					fieldLabel: 'Description'
				},
				{
					xtype: 'combobox',
					name: 'productCatalogLibraryAccess',
					store: productCatalogLibAccess,
					queryMode: 'local',
					displayField: 'name',
					valueField: 'value',
					fieldLabel: 'Access',
					value: 'Public'
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
				width: 100	
			},
			defaultType: 'button',
			items: [
				{
					name: 'createNewProductCatalogLibraryBtn',
					text: 'Create Library'
				},
				{
					name: 'updateProductCatalogLibraryBtn',
					text: 'Update Library',
					hidden: true
				}
			]
		}
	]
});
