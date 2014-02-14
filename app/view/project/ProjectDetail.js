

Ext.define('MYOCD.view.project.ProjectDetail', {
	extend: 'Ext.Container',
	xtype: 'projectDetail',
	requires: [
		'MYOCD.view.project.ProjectEstimating',
		'MYOCD.view.project.security.ProjectSecurity',
		'MYOCD.view.modules.ModulesPackages',
		'MYOCD.view.project.TestingModuleWidget'
	],
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	items: [
		{
			xtype: 'toolbar',
			margin: '0 0 10 0',
			style: 'border-radius: 7px; border-color: #a1ca48; background-image: none; background-color: rgba(255, 255, 255, 0.5) !important;',
			height: 30,
			layout: 'hbox',
			items: [
				{
					xtype: 'button',
					text: 'Back To Home',
					name: 'projectDetailBackBtn',
					//ui: 'default-toolbar',
					iconCls: 'back-icon'
				},
				{
					xtype: 'button',
					text: 'Send Invitation',
					name: 'projectSendInvitation',
					//ui: 'default-toolbar'
				}
			]
		},
		{
			xtype: 'tabpanel',
			//tabPosition: 'bottom',
			name: 'projectDetailTabPanel',
			style: 'border-color: #777',
			plain: true,
			cls: 'projectDetailTabPanel',
			items: [
				{
					title: 'Home',
					xtype: 'container',
					height: 533,
					layout: 'fit',
					items: [
						{
							xtype: 'container',
							layout: 'fit',
							items: [
								{
									xtype: 'panel',
									title: 'Today'
								}
							]
						}
					]
				},
				{
					title: 'Estimating',
					xtype: 'projectEstimating',
					flex: 1
				},
				{
					title: 'Scheduling',
					xtype: 'container',
					height: 533
				},
				{
					title: 'Selections',
					xtype: 'container',
					height: 533
				},
				{
					title: 'Procurement',
					xtype: 'container',
					height: 533
				},
				{
					title: 'Vendors',
					xtype: 'container',
					height: 533
				},
				{
					title: 'Change Orders',
					xtype: 'container',
					height: 533
				},
				{
					title: 'Punch List',
					xtype: 'container',
					height: 533
				},
				{
					title: 'Security',
					xtype: 'projectSecurity',
					flex: 1
				},
				{
					title: 'Settings',
					xtype: 'container',
					height: 533
				}
			]
		}
	]
});