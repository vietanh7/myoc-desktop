Ext.define('MYOCD.view.modules.projectWidget.EditProjectProductWidget', {
	extend: 'Ext.window.Window',
	requires: [
		'MYOCD.controller.modules.projectWidget.EditProjectProductController'
	],
	xtype: 'editProjectProductWidget',
	title: 'Edit Product',
	cls: 'customWindow',
	constrainHeader: true,
	width: 500,
	height: 250,
	createdId: '',
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
				},
				{
					xtype: 'textfield',
					name: 'productPrice',
					fieldLabel: 'Price'
				},
				{
					xtype: 'textfield',
					name: 'productQuantity',
					fieldLabel: 'Quantity'
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
	],
	listeners: {
		render: function() {
			var d = new Date();
			var n = d.getTime();
			this.createdId = n.toString();
			var controller = Ext.create('MYOCD.controller.modules.projectWidget.EditProjectProductController');
			controller.objectCreatedId = n.toString();
			controller.init();
		}
	}
});