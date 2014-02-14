Ext.define('MYOCD.view.permissionLibrary.NewPermission', {
	extend: 'Ext.window.Window',
	xtype: 'newPermission',
	title: 'New Permission',
	cls: 'customWindow',
	constrainHeader: true,
	width: 300,
	height: 180,
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
					name: 'permissionId',
					hidden: true	
				},
				{
					name: 'permissionName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'permissionDesc',
					fieldLabel: 'Description'
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
				width: 150	
			},
			defaultType: 'button',
			items: [
				{
					name: 'createNewPermissionBtn',
					text: 'Create Permission'
				},
				{
					name: 'updatePermissionBtn',
					text: 'Update Permission',
					hidden: true
				}
			]
		}
	]
});