Ext.define('MYOCD.view.roleLibrary.EditRolesCategory', {
	extend: 'Ext.window.Window',
	xtype: 'editRolesCategory',
	title: 'Edit Roles Category',
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
					name: 'roleCategoryId',
					hidden: true	
				},
				{
					name: 'roleCategoryName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'roleCategoryDesc',
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
					name: 'updateRoleCategoryBtn',
					text: 'Update Category',
				}
			]
		}
	]
});