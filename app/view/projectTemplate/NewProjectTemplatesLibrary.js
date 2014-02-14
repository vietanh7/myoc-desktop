var projectTemplateLibAccess = Ext.create('Ext.data.Store', {
	fields: ['name', 'value'],
	data: [
		{name: 'Public', value: 'Public'},
		{name: 'Protected', value: 'Protected'},
		{name: 'Private', value: 'Private'}
	]
});


Ext.define('MYOCD.view.projectTemplate.NewProjectTemplatesLibrary', {
	extend: 'Ext.window.Window',
	xtype: 'newProjectTemplatesLibrary',
	title: 'New Project Templates Library',
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
					name: 'projectTemplatesLibId',
					hidden: true	
				},
				{
					name: 'projectTemplatesLibName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'projectTemplatesLibDesc',
					fieldLabel: 'Description'
				},
				{
					xtype: 'combobox',
					name: 'projectTemplatesLibAccess',
					store: projectTemplateLibAccess,
					queryMode: 'local',
					displayField: 'name',
					valueField: 'value',
					fieldLabel: 'Access',
					value: 'public'
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
					name: 'createNewProjectTemplatesLibBtn',
					text: 'Create Library'
				},
				{
					name: 'updateProjectTemplatesLibBtn',
					text: 'Update Library',
					hidden: true
				}
			]
		}
	]
});