Ext.define('MYOCD.view.permissionLibrary.EditPermissionsCategory', {
	extend: 'Ext.window.Window',
	xtype: 'editPermissionsCategory',
	title: 'Edit Permissions Category',
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
					name: 'permissionCategoryId',
					hidden: true	
				},
				{
					name: 'permissionCategoryName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'permissionCategoryDesc',
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
				width: 120	
			},
			defaultType: 'button',
			items: [
				{
					name: 'updatePermissionCategoryBtn',
					text: 'Update Category',
				}
			]
		}
	]
});