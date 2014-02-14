Ext.define('MYOCD.view.wsWindows.JoinCompanyWizard', {
	extend: 'Ext.window.Window',
	xtype: 'joinCompanyWizard',
	requires: [
		'MYOCD.view.wsWindows.JoinCompanyInfo',
		'MYOCD.view.wsWindows.JoinCompanyEmployeeInfo'
	],
	title: 'Join Company',
	width: 600,
	height: 500,
	cls: 'customWindow',
	constrainsHeader: true,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	items: [
		{
			xtype: 'joinCompanyInfo'
		},
		{
			xtype: 'joinCompanyEmployeeInfo',
			hidden: true
		},
		{
			xtype: 'container',
			margin: 10,
			layout: {
				type: 'hbox',
				pack: 'end'
			},
			items: [
				{
					xtype: 'button',
					name: 'joinComBackBtn',
					width: 80,
					text: 'Back',
					disabled: true
				},
				{
					xtype: 'container',
					width: 10
				},
				{
					xtype: 'button',
					name: 'joinComNextBtn',
					width: 80,
					text: 'Next'
				}
			]
		}
	]
});