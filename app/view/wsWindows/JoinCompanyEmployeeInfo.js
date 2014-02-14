Ext.define('MYOCD.view.wsWindows.JoinCompanyEmployeeInfo',{
	extend: 'Ext.Container',
	xtype: 'joinCompanyEmployeeInfo',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	style: 'background-color: white',
	items: [
		{
			xtype: 'container',
			style: 'background-color: white; margin: 5px;',
			height: 30,
			html: '<font size="5" color="green">Employee Profile</font>'
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
					name: 'employeeFirstName'
				},
				{
					fieldLabel: 'Last Name',
					name: 'employeeLastName'
				},
				{
					xtype: 'textarea',
					name: 'employeeDesc',
					fieldLabel: 'Description'
				},
				{
					fieldLabel: 'Email',
					name: 'employeeEmail'
				},
				{
					fieldLabel: 'Skype',
					name: 'employeeSkype'
				},
				{
					fieldLabel: 'Bussiness Address',
					name: 'employeeAddress'
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
							name: 'employeePhone',
							width: '70%'
						},
						{
							xtype: 'textfield',
							margin: '0 1 0 20',
							fieldLabel: 'Ext',
							labelWidth: 30,
							name: 'employeeExt',
							width: '30%'
						},
					]
				},
				{
					xtype: 'container',
					margin: '5 0 5 0',
					layout: 'hbox',
					items: [
						{
							xtype: 'textfield',
							fieldLabel: 'Fax',
							name: 'employeeFax',
							labelWidth: 120,
							width: '70%',
							margin: '0 20 0 0'
						}
					]
				},
				{
					fieldLabel: 'Department',
					name: 'employeeDepartment'
				},
				{
					fieldLabel: 'Role',
					name: 'employeeRole'
				}		
			]
		}
	]
});