var communityTemplateLibAccess = Ext.create('Ext.data.Store', {
	fields: ['name', 'value'],
	data: [
		{name: 'Public', value: 'Public'},
		{name: 'Protected', value: 'Protected'},
		{name: 'Private', value: 'Private'}
	]
});


Ext.define('MYOCD.view.communityTemplate.NewCommnunityTemplateLibrary', {
	extend: 'Ext.window.Window',
	xtype: 'newCommnunityTemplateLibrary',
	title: 'New Community Templates Library',
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
					name: 'communityTemplatesLibId',
					hidden: true	
				},
				{
					name: 'communityTemplatesLibName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'communityTemplatesLibDesc',
					fieldLabel: 'Description'
				},
				{
					xtype: 'combobox',
					name: 'communityTemplatesLibAccess',
					store: communityTemplateLibAccess,
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
					name: 'createNewCommunityTemplatesLibBtn',
					text: 'Create Library'
				},
				{
					name: 'updateCommunityTemplatesLibBtn',
					text: 'Update Library',
					hidden: true
				}
			]
		}
	]
});