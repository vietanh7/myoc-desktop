Ext.define('MYOCD.view.toolbarDialogs.ProfileEditorDialog',{
	extend: 'Ext.window.Window',
	xtype: 'profileEditorDialog',
	width: 550,
	minHeight: 480,
	title: 'Profile',
	cls: 'customWindow',
	constrainHeader:true,
	position: 'cascade',
	layout: {
		type: 'fit',
	},
	items: [
		{
			xtype: 'textfield',
			hidden: true,
			name: 'workspace'
		},
		{
			xtype: 'panel',
			layout: {
				type: 'vbox',
				align: 'stretch',	
			},
			items: [
				{
					xtype: 'tabpanel',
					autoDestroy: false,
					name: 'workspaceProfileTabPanel',	
				},
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
							name: 'employeeProfileFirstName'
						},
						{
							fieldLabel: 'Last Name',
							name: 'employeeProfileLastName'
						},
						{
							fieldLabel: 'Name',
							name: 'employeeProfileName'
						},
						{
							xtype: 'textarea',
							name: 'employeeProfileDesc',
							fieldLabel: 'Description'
						},
						{
							fieldLabel: 'Email',
							name: 'employeeProfileEmail'
						},
						{
							fieldLabel: 'Skype',
							name: 'employeeProfileSkype'
						},
						{
							fieldLabel: 'Bussiness Address',
							name: 'employeeProfileAddress'
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
									name: 'employeeProfilePhone',
									width: '70%'
								},
								{
									xtype: 'textfield',
									margin: '0 1 0 20',
									fieldLabel: 'Ext',
									labelWidth: 30,
									name: 'employeeProfileExt',
									width: '30%'
								},
							]
						},
						{
							fieldLabel: 'Fax',
							name: 'employeeProfileFax'
						},
						{
							fieldLabel: 'Department',
							name: 'employeeProfileDepartment'
						},
						{
							fieldLabel: 'Role',
							name: 'employeeProfileRole'
						}		
					]
				},
				{
					xtype: 'container',
					layout: {
						type: 'hbox',
						pack: 'end'
					},
					items: [
						{
							xtype: 'button',
							name: 'updateEmployeeProfileBtn',
							text: 'Update',
							margin: 5,
							width: 100
						}
					]
				}
			]
		}
	]
});