Ext.define('MYOCD.view.wsWindows.NewCompanyWizard',{
	extend: 'Ext.window.Window',
	xtype: 'newCompanyWizard',
	title: 'New Company',
	constrainHeader: true,
	cls: 'customWindow',
	width: 600,
	height: 500,
	items: [
		{
			xtype: 'panel',
			style: 'background-color: white',
			name: 'newCompanyMainPanel',
			height: 400,
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'start'	
			},
			defaultType: 'fieldset',
			items: [
				{
					name: 'companyInfoField',
					flex: 1,
					title: 'New Company Infomation',
					layout: {
						type: 'vbox',
						align: 'stretch',
					},
					defaults: {
						labelWidth: 100
					},
					defaultType: 'textfield',
					items: [
						{
							xtype: 'container',
							margin: '0 0 5 0',
							width: '100%',
							layout: {
								type: 'hbox',
								pack: 'center'
							},
							items: [
								{
									xtype: 'textfield',
									flex: 1,
									name: 'companyTemplateId',
									fieldLabel: 'Template ID',
									labelWidth: 100,
									disabled: true
								},
								{
									xtype: 'button',
									name: 'clearTemplateIdBtn',
									text: 'x',
									margin: '0 2 0 2',
									hidden: true
								},
								{
									xtype: 'button',
									name: 'selectTemplateIdBtn',
									text: '...',
									margin: '0 2 0 2'
								}
							]
						},
						{
							name: 'companyName',
							allowBlank: false,
							fieldLabel: 'Name',
							listeners: {
								blur: function() {
									this.setValue(this.getValue().trim());
								}
							}
						},
						{
							xtype: 'textarea',
							name: 'companyDesc',
							fieldLabel: 'Description'
						},
						{
							name: 'companyWeb',
							fieldLabel: 'Website'
						},
						{
							name: 'companyTaxId',
							fieldLabel: 'Tax ID'	
						},
						{
							name: 'companyAddr',
							fieldLabel: 'Address'
						},
						{
							xtype: 'container',
							margin: '5 0 5 0',
							layout: 'hbox',
							defaults: {
								labelWidth: 100
							},
							defaultType: 'textfield',
							items: [
								{
									fieldLabel: 'Phone',
									name: 'companyPhone',
									width: '60%'
								},
								{
									margin: '0 1 0 20',
									fieldLabel: 'Ext',
									name: 'companyExt',
									width: '40%',
									labelWidth: 30
								},
							]
						},
						{
							name: 'companyFax',
							fieldLabel: 'Fax'
						}
					]
				},
				{
					name: 'paymentField',
					title: 'Payment',
					hidden: true
				},
				{
					name: 'employeeInfoField',
					title: 'Employee Infomation',
					hidden: true,
					layout: {
						type: 'vbox',
						align: 'stretch',
						pack: 'center'
					},
					defaults: {
						labelWidth: 150
					},
					defaultType: 'textfield',
					items: [
						{
							fieldLabel: 'Name',
							name: 'createComEmployeeName'
						},
						{
							fieldLabel: 'Description',
							name: 'createComEmployeeDesc'
						},
						{
							fieldLabel: 'Email',
							name: 'createComEmployeeEmail'
						},
						{
							fieldLabel: 'Skype ID',
							name: 'createComEmployeeSkype'	
						},
						{
							fieldLabel: 'Bussiness Address',
							name: 'createComEmployeeAddress'
						},
						{
							xtype: 'container',
							margin: '5 0 5 0',
							layout: 'hbox',
							defaults: {
								labelWidth: 150
							},
							defaultType: 'textfield',
							items: [
								{
									fieldLabel: 'Phone',
									name: 'createComEmployeePhone',
									width: '60%'
								},
								{
									margin: '0 1 0 20',
									fieldLabel: 'Ext',
									labelWidth: 30,
									name: 'createComEmployeeExt',
									width: '40%'
								},
							]
						},
						{
							fieldLabel: 'Fax',
							name: 'createComEmployeeFax'
						},
						{
							fieldLabel: 'Department',
							name: 'createComEmployeeDepartment'
						},
						{
							fieldLabel: 'Role',
							name: 'createComEmployeeRole'
						}		
					]
				}
			]
		},
		{
			xtype: 'container',
			height: 50,
			layout: {
				type: 'hbox',
				pack: 'end'
			},
			defaults: {
				width: 100,
				margin: 5
			},
			defaultType: 'button',
			items: [
				{
					text: 'Back',
					name: 'newComBackBtn'
				},
				{
					text: 'Next',
					name: 'newComNextBtn'
				}
			]
		}
	]
});