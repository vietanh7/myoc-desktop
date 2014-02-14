Ext.define('MYOCD.view.toolbarDialogs.SettingsDialog',{
	extend: 'Ext.window.Window',
	requires: [
		'MYOCD.view.toolbarDialogs.settingsDialog.WorkspaceViews'
	],
	xtype: 'settingsDialog',
	width: 600,
	height: 500,
	title: 'Settings',
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
			name: 'settingsTab',
			flex: 1,
			items: [
				{
					xtype: 'workspaceViews',
					title: 'Views'
				}
			]
		}	
	]
});