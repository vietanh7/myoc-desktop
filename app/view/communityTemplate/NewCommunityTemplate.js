Ext.define('MYOCD.view.communityTemplate.NewCommunityTemplate', {
	extend: 'Ext.window.Window',
	xtype: 'newCommunityTemplate',
	title: 'New Community Template',
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
					name: 'communityTemplateId',
					hidden: true	
				},
				{
					name: 'communityTemplateName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'communityTemplateDesc',
					fieldLabel: 'Description'
				},
				{
					name: 'communityTemplateType',
					fieldLabel: 'Community Group Type'
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
					name: 'createNewCommunityTemplateBtn',
					text: 'Create Template'
				},
				{
					name: 'updateCommunityTemplateBtn',
					text: 'Update Template',
					hidden: true
				}
			]
		}
	]
});