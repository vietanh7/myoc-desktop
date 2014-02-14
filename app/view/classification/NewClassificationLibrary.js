var classificationLibAccess = Ext.create('Ext.data.Store', {
	fields: ['name', 'value'],
	data: [
		{name: 'Public', value: 'Public'},
		{name: 'Protected', value: 'Protected'},
		{name: 'Private', value: 'Private'}
	]
});

Ext.define('MYOCD.view.classification.NewClassificationLibrary', {
	extend: 'Ext.window.Window',
	xtype: 'newClassificationLibrary',
	title: 'New Classification Library',
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
					name: 'classificationLibraryId',
					hidden: true	
				},
				{
					name: 'classificationLibraryName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'classificationLibraryDesc',
					fieldLabel: 'Description'
				},
				{
					xtype: 'combobox',
					name: 'classificationLibraryAccess',
					store: classificationLibAccess,
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
					name: 'createNewClassificationLibraryBtn',
					text: 'Create Library'
				},
				{
					name: 'updateClassificationLibraryBtn',
					text: 'Update Library',
					hidden: true
				}
			]
		}
	]
});