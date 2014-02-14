Ext.define('MYOCD.model.main.ContactOrganization',{
	extend: 'Ext.data.Model',
	fields: [
		{name:"inherit_security_from_parent"},
		{name:"company_type"},
		{name:"tax_id"},
		{name:"id"},
		{name:"name"},
		{name:"description"},
		{name:"type"},
		{name:"created"},
		{name:"expired"},
		{name:"owner_id"},
		{name:"errors"}
	]
}); 