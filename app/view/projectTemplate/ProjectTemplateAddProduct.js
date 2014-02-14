Ext.define('MYOCD.view.projectTemplate.ProjectTemplateAddProduct', {
	extend: 'Ext.window.Window',
	requires: [
		'MYOCD.view.projectTemplate.ProjectTemplateAddProductSelectParent'
	],
	xtype: 'projectTemplateAddProduct',
	title: 'Add New Product',
	cls: 'customWindow',
	constrainHeader: true,
	width: 500,
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
				labelWidth: 130
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
				},
				{
					xtype: 'container',
					hidden: true,
					width: '100%',
					layout: {
						type: 'hbox',
						pack: 'center'
					},
					items: [
						{
							xtype: 'textfield',
							name: 'parentProductId',
							hidden: true	
						},
						{
							xtype: 'textfield',
							flex: 1,
							name: 'parentProduct',
							fieldLabel: 'Reference Product',
							labelWidth: 130,
							disabled: true
						},
						{
							xtype: 'button',
							name: 'clearParentProductBtn',
							text: 'x',
							margin: '0 2 0 2',
							hidden: true
						},
						{
							xtype: 'button',
							name: 'selectParentProductBtn',
							text: '...',
							margin: '0 2 0 2',
						}
					]
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
					name: 'addNewProductBtn',
					text: 'Add Product'
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