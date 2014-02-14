Ext.define('MYOCD.view.toolbarDialogs.contactsDialog.ContactDetail',{
	extend: 'Ext.window.Window',
	xtype: 'contactDetail',
	title: 'Contact Detail',
	width: 500,
	height: 480,
	cls: 'customWindow',
	constrainHeader: true,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	items: [
		{
			xtype: 'fieldset',
			layout: {
				type: 'vbox',
				align: 'stretch',	
			},
			defaults: {
				xtype: 'textfield',
				labelWidth: 120
			},
			items:[
				{
					fieldLabel: 'First Name',
					name: 'profileFirstName'
				},
				{
					fieldLabel: 'Last Name',
					name: 'profileLastName'
				},
				{
					fieldLabel: 'Name',
					name: 'profileName'
				},
				{
					xtype: 'textarea',
					name: 'profileDesc',
					fieldLabel: 'Description'
				},
				{
					fieldLabel: 'Email',
					name: 'profileEmail'
				},
				{
					fieldLabel: 'Skype',
					name: 'profileSkype'
				},
				{
					fieldLabel: 'Bussiness Address',
					name: 'profileAddress'
				},
				{
					xtype: 'container',
					margin: '5 0 5 0',
					layout: 'hbox',
					items: [
						{
							xtype: 'textfield',
							fieldLabel: 'Phone',
							labelWidth: 120,
							name: 'profilePhone',
							width: '70%'
						},
						{
							xtype: 'textfield',
							margin: '0 1 0 20',
							fieldLabel: 'Ext',
							labelWidth: 30,
							name: 'profileExt',
							width: '30%'
						},
					]
				},
				{
					fieldLabel: 'Fax',
					name: 'profileFax'
				},
				{
					fieldLabel: 'Department',
					name: 'profileDepartment'
				},
				{
					fieldLabel: 'Role',
					name: 'profileRole'
				}		
			]
		}
	]
});