Ext.define('MYOCD.model.main.AssociatedType',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'created'},
		{name: 'default_object_type'},
		{name: 'description'},
		{name: 'expired'},
		{name: 'id'},
		{name: 'inherit_security_from_parent'},
		{name: 'key'},
		{name: 'name'},
		{name: 'owner_id'},
		{name: 'type'}
	]
});