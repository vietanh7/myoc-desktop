var permissionLibAccess = Ext.create('Ext.data.Store', {
	fields: ['name', 'value'],
	data: [
		{name: 'Public', value: 'Public'},
		{name: 'Protected', value: 'Protected'},
		{name: 'Private', value: 'Private'}
	]
});

Ext.define('MYOCD.view.permissionLibrary.NewPermissionLibrary', {
	extend: 'Ext.window.Window',
	xtype: 'newPermissionLibrary',
	title: 'New Permission Library',
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
					name: 'permissionLibraryId',
					hidden: true	
				},
				{
					name: 'permissionLibraryName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'permissionLibraryDesc',
					fieldLabel: 'Description'
				},
				{
					xtype: 'combobox',
					name: 'permissionLibraryAccess',
					store: permissionLibAccess,
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
					name: 'createNewPermissionLibraryBtn',
					text: 'Create Library'
				},
				{
					name: 'updateCompanyTemplatesLibBtn',
					text: 'Update Library',
					hidden: true
				}
			]
		}
	]
});