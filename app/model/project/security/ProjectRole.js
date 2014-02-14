Ext.define('MYOCD.model.project.security.ProjectRole', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'inherit_security_from_parent'},
		{name: 'base_roles'},
		{name: 'id'},
		{name: 'name'},
		{name: 'description'},
		{name: 'type'},
		{name: 'created'},
		{name: 'expired'},
		{name: 'owner_id'}
	]
});