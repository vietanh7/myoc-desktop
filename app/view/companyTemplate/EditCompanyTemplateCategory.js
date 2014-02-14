Ext.define('MYOCD.view.companyTemplate.EditCompanyTemplateCategory', {
	extend: 'Ext.window.Window',
	xtype: 'editCompanyTemplateCategory',
	title: 'Edit Company Template Category',
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
					name: 'companyTemplateCategoryId',
					hidden: true	
				},
				{
					name: 'companyTemplateCategoryName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'companyTemplateCategoryDesc',
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
					name: 'updateCompanyTemplateCategoryBtn',
					text: 'Update Category',
				}
			]
		}
	]
});