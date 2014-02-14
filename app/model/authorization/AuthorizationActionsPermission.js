Ext.define('MYOCD.model.authorization.AuthorizationActionsPermission',{
	extend: 'Ext.data.Model',
	fields: [
		{name: "inherit_security_from_parent"},
		{name: "type"},
		{name: "action_display_name"},
		{name: "secure_action"},
		{name: "object_id"},
		{name: "permission"},
		{name: 'granted'},
		{name: 'isInherited'}
	]
});