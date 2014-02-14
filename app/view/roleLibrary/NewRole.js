Ext.define('MYOCD.view.roleLibrary.NewRole', {
	extend: 'Ext.window.Window',
	xtype: 'newRole',
	title: 'New Role',
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
					name: 'roleId',
					hidden: true	
				},
				{
					name: 'roleName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'roleDesc',
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
				width: 100	
			},
			defaultType: 'button',
			items: [
				{
					name: 'createNewRoleBtn',
					text: 'Create Role'
				},
				{
					name: 'updateRoleBtn',
					text: 'Update Role',
					hidden: true
				}
			]
		}
	]
});