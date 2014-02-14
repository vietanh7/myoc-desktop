Ext.define('MYOCD.view.companyTemplate.NewCompanyTemplate', {
	extend: 'Ext.window.Window',
	xtype: 'newCompanyTemplate',
	title: 'New Company Template',
	cls: 'customWindow',
	constrainHeader: true,
	width: 350,
	height: 220,
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'center'
	},
	items: [
		{
			xtype: 'fieldset',
			defaults: {
				labelWidth: 110
			},
			defaultType: 'textfield',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'center'	
			},
			items: [
				{
					name: 'companyTemplateId',
					hidden: true	
				},
				{
					name: 'companyTemplateName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'companyTemplateDesc',
					fieldLabel: 'Description'
				},
				{
					name: 'companyTemplateType',
					fieldLabel: 'Company Type'
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
					name: 'createNewCompanyTemplateBtn',
					text: 'Create Template'
				},
				{
					name: 'updateCompanyTemplateBtn',
					text: 'Update Template',
					hidden: true
				}
			]
		}
	]
});