Ext.define('MYOCD.view.productCatalog.EditProductCatalogCategory', {
	extend: 'Ext.window.Window',
	xtype: 'editProductCatalogCategory',
	title: 'Edit Product Catalog Category',
	cls: 'customWindow',
	constrainHeader: true,
	width: 300,
	height: 180,
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
					name: 'productCatalogCategoryId',
					hidden: true	
				},
				{
					name: 'productCatalogCategoryName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'productCatalogCategoryDesc',
					fieldLabel: 'Description'
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
				width: 120	
			},
			defaultType: 'button',
			items: [
				{
					name: 'updateProductCatalogCategoryBtn',
					text: 'Update Category',
				}
			]
		}
	]
});