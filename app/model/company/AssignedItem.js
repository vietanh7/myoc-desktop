Ext.define('MYOCD.model.company.AssignedItem',{
	extend: 'Ext.data.Model',
	fields: [
		{name:"inherit_security_from_parent"},
		{name:"name"},
		{name:"owner_id"},
		{name:"type"},
		{name:"id"},
		{name:'first_name'},
		{name:'last_name'}
	]
});