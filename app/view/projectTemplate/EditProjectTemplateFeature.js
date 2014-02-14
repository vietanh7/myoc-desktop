Ext.define('MYOCD.view.projectTemplate.EditProjectTemplateFeature', {
	extend: 'Ext.window.Window',
	xtype: 'editProjectTemplateFeature',
	title: 'Edit Feature',
	width: 400,
	height: 200,
	layout: {
		type: 'vbox',
		align: 'stretch',
	},
	cls: 'customWindow',
	constrainHeader:true,
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
					name: 'featureId',
					hidden: true	
				},
				{
					name: 'featureName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'featureDesc',
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
							hidden: true,
							name: 'parentTypeId'	
						},
						{
							xtype: 'textfield',
							flex: 1,
							name: 'parentObjectType',
							fieldLabel: 'Parent Type',
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
					name: 'updateFeatureBtn',
					text: 'Update Feature',
				}
			]
		}
	]
});