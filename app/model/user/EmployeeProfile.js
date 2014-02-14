Ext.define('MYOCD.model.user.EmployeeProfile',{
	extend: 'Ext.data.Model',
	fields: [
		{name:"inherit_security_from_parent"},
		{name:"has_same_address_as_company"},
		{name:"works_at_home"},
		{name:"employee_id"},
		{name:"first_name"},
		{name:"last_name"},
		{name:"skype_id"},
		{name:"email"},
		{name:"id"},
		{name:"name"},
		{name:"description"},
		{name:"type"},
		{name:"created"},
		{name:"expired"},
		{name:"owner_id"}
	]
});