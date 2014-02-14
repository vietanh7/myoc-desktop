Ext.define('MYOCD.view.wsWindows.JoinCompanyInfo', {
	extend: 'Ext.Container',
	xtype: 'joinCompanyInfo',
	style: 'background-color: white',
	flex: 1,
	layout: 'border',
	items: [
		{
			xtype: 'panel',
			border: false,
			flex: 1,
			region: 'west',
			split: true,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'textfield',
					name: 'searchCompanyField',
					inputType: 'search',
					emptyText: 'Search Company ...',
					height: 20,
					margin: 2						
				},
				{
					xtype: 'grid',
					name: 'searchCompaniesGrid',
					store: 'company.SearchCompanies',
					hideHeaders: true,
					margin: 2,
					flex: 1,
					columns: [
						{dataIndex: 'name', text: 'Name', flex: 1}
					]	
				}
			]
		},
		{
			xtype: 'panel',
			flex: 1.5,
			region: 'center',
			title: 'Company Profile',
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
						labelWidth: 80,
						disabled: true,
						labelAlign: 'right'
					},
					items:[
						{
							name: 'companyId',
							hidden: true
						},
						{
							fieldLabel: 'Name',
							name: 'companyName'
						},
						{
							xtype: 'textarea',
							name: 'companyDesc',
							fieldLabel: 'Description'
						},
						{
							fieldLabel: 'Website',
							name: 'companyWebsite'
						},
						{
							xtype: 'container',
							margin: '5 0 5 0',
							layout: 'hbox',
							disabled: false,
							defaults: {
								labelAlign: 'right',
								disabled: true,
								xtype: 'textfield'
							},
							items: [
								{
									fieldLabel: 'Phone',
									labelWidth: 80,
									name: 'employeeProfilePhone',
									width: '70%'
								},
								{
									margin: '0 1 0 20',
									fieldLabel: 'Ext',
									labelWidth: 30,
									name: 'employeeProfileExt',
									width: '30%'
								}
							]
						},
						{
							xtype: 'container',
							margin: '5 0 5 0',
							layout: 'hbox',
							disabled: false,
							defaults: {
								labelAlign: 'right',
								disabled: true
							},
							items: [
								{
									xtype: 'textfield',
									fieldLabel: 'Fax',
									name: 'companyFax',
									labelWidth: 80,
									width: '70%',
									margin: '0 20 0 0'
								}
							]
						}	
					]
				}
			]
		}
	]
});