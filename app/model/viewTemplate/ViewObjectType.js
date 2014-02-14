Ext.define('MYOCD.model.viewTemplate.ViewObjectType',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'inherit_security_from_parent'},
		{name: "base_object_types"},
		{name: "attributes"},
		{name: "inherited_attributes"},
		{name: 'id'},
		{name: 'name'},
		{name: 'description'},
		{name: 'type'},
		{name: 'created'},
		{name: 'expired'},
		{name: 'owner_id'},
		{name: 'primary'}
	]
});