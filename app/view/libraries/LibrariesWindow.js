Ext.define('MYOCD.view.libraries.LibrariesWindow',{
	extend: 'Ext.window.Window',
	requires: [
		'MYOCD.view.classification.ClassificationsTab',
		'MYOCD.view.roleLibrary.RoleLibrariesTab',
		'MYOCD.view.objectTypeLibrary.ObjectTypesTab',
		'MYOCD.view.permissionLibrary.PermissionLibrariesTab'
	],
	xtype: 'librariesWindow',
	title: 'Libraries',
	width: 960,
	height: 600,
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
			name: 'librariesTabPanel',
			tabBar:{
			},
			items: [
				{
					title: 'Object Types',
					xtype: 'objectTypesTab'
				},
				{
			    	title: 'Classifications',
			    	xtype: 'classificationsTab'
			    },
			    {
				    title: 'Activity Definitions'
			    },
			    {
				    title: 'Permissions',
				    xtype: 'permissionLibrariesTab'
			    } 
			]
		}
	]
});