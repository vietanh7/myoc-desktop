Ext.define('MYOCD.store.permissionLibrary.PermissionCategoriesTreeStore',{
	extend: 'Ext.data.TreeStore',
	fields: [
		{name: 'inherit_security_from_parent'},
		{name: 'id'},
		{name: 'name'},
		{name: 'description'},
		{name: 'type'},
		{name: 'created'},
		{name: 'expired'},
		{name: 'owner_id'}
	]
});