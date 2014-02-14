Ext.define('MYOCD.model.objectTypeLibrary.ObjectTypeVersion',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'inherit_security_from_parent'},
		{name: 'timestamp'},
		{name: 'id'},
		{name: 'name'},
		{name: 'description'},
		{name: 'type'},
		{name: 'created'},
		{name: 'expired'},
		{name: 'owner_id'},
		{name: 'error'},
		{name: 'selected'}
	]
});