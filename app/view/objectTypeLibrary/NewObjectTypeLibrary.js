var objectTypeLibAccess = Ext.create('Ext.data.Store', {
	fields: ['name', 'value'],
	data: [
		{name: 'Public', value: 'Public'},
		{name: 'Protected', value: 'Protected'},
		{name: 'Private', value: 'Private'}
	]
});

var objectTypeLibType = Ext.create('Ext.data.Store', {
	fields: ['name', 'value'],
	data: [
		{name: 'Other', value: 'Other'},
		{name: 'Activity', value: 'Activity'},
		{name: 'Spaces', value: 'Spaces'},
		{name: 'Element', value: 'Element'},
		{name: 'Products', value: 'Products'},
		{name: 'Roles', value: 'Roles'}
	]
});

Ext.define('MYOCD.view.objectTypeLibrary.NewObjectTypeLibrary', {
	extend: 'Ext.window.Window',
	requires: [
		'Ext.form.field.ComboBox'
	],
	xtype: 'newObjectTypeLibrary',
	title: 'New Object Type Library',
	cls: 'customWindow',
	constrainHeader: true,
	width: 350,
	height: 250,
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
					name: 'objectTypeLibraryId',
					hidden: true	
				},
				{
					name: 'objectTypeLibraryName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'objectTypeLibraryDesc',
					fieldLabel: 'Description'
				},
				{
					xtype: 'combobox',
					name: 'objectTypeLibraryAccess',
					store: objectTypeLibAccess,
					queryMode: 'local',
					displayField: 'name',
					valueField: 'value',
					fieldLabel: 'Access',
					value: 'Public'
				},
				{
					xtype: 'combobox',
					name: 'objectTypeLibraryType',
					store: objectTypeLibType,
					queryMode: 'local',
					displayField: 'name',
					valueField: 'value',
					fieldLabel: 'Type',
					value: 'Other'
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
					name: 'createNewObjectTypeLibraryBtn',
					text: 'Create Library'
				},
				{
					name: 'updateObjectTypeLibraryBtn',
					text: 'Update Library',
					hidden: true
				}
			]
		}
	]
});