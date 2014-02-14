Ext.define('MYOCD.model.projectTemplate.Product',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'inherit_security_from_parent'},
		{name: "attributes"},
		{name: "inherited_attributes"},
		{name: 'id'},
		{name: 'name'},
		{name: 'description'},
		{name: 'type'},
		{name: 'created'},
		{name: 'expired'},
		{name: 'owner_id'},
		{name: 'products'},
		{name: 'errors'}
	]
});