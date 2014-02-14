Ext.define('MYOCD.view.featureTemplate.NewFeatureTemplate', {
	extend: 'Ext.window.Window',
	requires: [
		'MYOCD.view.featureTemplate.NewFeatureTemplateSelectParent'
	],
	xtype: 'newFeatureTemplate',
	title: 'New Feature Template',
	cls: 'customWindow',
	constrainHeader: true,
	width: 400,
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
					name: 'featureTemplateId',
					hidden: true	
				},
				{
					name: 'featureTemplateName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'featureTemplateDesc',
					fieldLabel: 'Description'
				},
				{
					xtype: 'container',
					width: '100%',
					layout: {
						type: 'hbox',
						pack: 'center'
					},
					items: [
						{
							xtype: 'textfield',
							name: 'parentObjectTypeId',
							hidden: true	
						},
						{
							xtype: 'textfield',
							flex: 1,
							name: 'parentObjectType',
							fieldLabel: 'Object Type',
							labelWidth: 100,
							disabled: true
						},
						{
							xtype: 'button',
							name: 'clearOTParentBtn',
							text: 'x',
							margin: '0 2 0 2',
							hidden: true
						},
						{
							xtype: 'button',
							name: 'selectOTParentBtn',
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
			defaultType: 'button',
			items: [
				{
					name: 'createNewFeatureTemplateBtn',
					text: 'Create Feature Template'
				},
				{
					name: 'updateFeatureTemplateBtn',
					text: 'Update Feature Template',
					hidden: true
				}
			]
		}
	]
});