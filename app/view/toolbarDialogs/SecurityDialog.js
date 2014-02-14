Ext.define('MYOCD.view.toolbarDialogs.SecurityDialog',{
	extend: 'Ext.window.Window',
	requires: [
		'MYOCD.view.toolbarDialogs.securityDialog.AuthorizationTab',
		'MYOCD.view.toolbarDialogs.securityDialog.RolesTab'
	],
	xtype: 'securityDialog',
	width: 750,
	height: 500,
	title: 'Security',
	cls: 'customWindow',
	constrainHeader:true,
	position: 'cascade',
	layout: {
		type: 'vbox',
		align: 'stretch'	
	},
	items: [
		{
			xtype: 'tabpanel',
			flex: 1,
			items: [
				{
					title: 'Authorization',
					xtype: 'authorizationTab'
				},
				{
					title: 'Assigned Roles',
					xtype: 'rolesTab'
				}
			]
		}
	]
});