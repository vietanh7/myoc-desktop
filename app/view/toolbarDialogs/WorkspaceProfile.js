Ext.define('MYOCD.view.toolbarDialogs.WorkspaceProfile',{
	extend: 'Ext.window.Window',
	xtype: 'workspaceProfile',
	title: 'Workspace Profile',
	width: 600,
	height: 350,
	cls: 'customWindow',
	constrainHeader:true,
	position: 'cascade',
	layout: {
		type: 'vbox',
		align: 'stretch',
	},
	items:[
		{
			xtype: 'fieldset',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'textfield',
					name: 'companyCommName',
					fieldLabel: 'Name',
					labelWidth: 100
				},
				{
					xtype: 'textarea',
					name: 'companyCommDesc',
					fieldLabel: 'Description',
					labelWidth: 100
				},
				{
					xtype: 'textfield',
					name: 'companyCommWeb',
					fieldLabel: 'Website',
					labelWidth: 100
				},
				{
					xtype: 'textfield',
					name: 'companyCommAddr',
					fieldLabel: 'Address',
					labelWidth: 100
				},
				{
					xtype: 'container',
					margin: '5 0 5 0',
					layout: 'hbox',
					items: [
						{
							xtype: 'textfield',
							fieldLabel: 'Phone',
							labelWidth: 100,
							name: 'companyCommPhone',
							width: '60%'
						},
						{
							xtype: 'textfield',
							margin: '0 1 0 20',
							fieldLabel: 'Ext',
							labelWidth: 30,
							name: 'companyCommExt',
							width: '40%'
						},
					]
				},
				{
					xtype: 'textfield',
					name: 'companyCommFax',
					fieldLabel: 'Fax',
					labelWidth: 100
				}
			]
		},
		{
			xtype: 'container',
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			items: [
				{
					xtype: 'button',
					width: 100,
					name: 'workspaceProfileUpdateBtn',
					text: 'Update'
				}
			]
		}
	]
});