Ext.define('MYOCD.model.objectTypeLibrary.ObjectTypeLibrary', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'inherit_security_from_parent'},
		{name: 'access'},
		{name: 'id'},
		{name: 'name'},
		{name: 'description'},
		{name: 'type'},
		{name: 'created'},
		{name: 'expired'},
		{name: 'owner_id'},
		{name: 'library_type'},
		{name: 'imported'}
	]
});