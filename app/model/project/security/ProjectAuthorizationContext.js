Ext.define('MYOCD.model.project.security.ProjectAuthorizationContext',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'inherit_security_from_parent'},
		{name: 'type'},
		{name: 'id'},
		{name: 'name'},
		{name: 'first_name'},
		{name: 'last_name'},
		{name: 'isInherited'}
	]
});