var featureTemplateLibAccess = Ext.create('Ext.data.Store', {
	fields: ['name', 'value'],
	data: [
		{name: 'Public', value: 'Public'},
		{name: 'Protected', value: 'Protected'},
		{name: 'Private', value: 'Private'}
	]
});


Ext.define('MYOCD.view.featureTemplate.NewFeatureTemplatesLibrary', {
	extend: 'Ext.window.Window',
	xtype: 'newFeatureTemplatesLibrary',
	title: 'New Feature Templates Library',
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
					name: 'featureTemplatesLibId',
					hidden: true	
				},
				{
					name: 'featureTemplatesLibName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'featureTemplatesLibDesc',
					fieldLabel: 'Description'
				},
				{
					xtype: 'combobox',
					name: 'featureTemplatesLibAccess',
					store: featureTemplateLibAccess,
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
					name: 'createNewFeatureTemplatesLibBtn',
					text: 'Create Library'
				},
				{
					name: 'updateFeatureTemplatesLibBtn',
					text: 'Update Library',
					hidden: true
				}
			]
		}
	]
});