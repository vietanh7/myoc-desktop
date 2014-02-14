Ext.define('MYOCD.model.authorization.AuthorizationContextRoleUserAndRole', {
	extend: 'Ext.data.Model',
	fields: [
		{name:"inherit_security_from_parent"},
		{name:"name"},
		{name:"owner_id"},
		{name:"type"},
		{name:"id"},
		{name: 'first_name'},
		{name: 'last_name'}
	]
});