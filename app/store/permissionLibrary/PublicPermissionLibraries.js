Ext.define('MYOCD.store.permissionLibrary.PublicPermissionLibraries',{
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.permissionLibrary.PermissionLibrary',
	model: 'MYOCD.model.permissionLibrary.PermissionLibrary'
});