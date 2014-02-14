Ext.define('MYOCD.model.Workspace',{
	extend: 'Ext.data.Model',
	fields: [
		/*
{name: 'value', 			mapping: 'workspace.id'},
        {name: 'name', 				mapping: 'workspace.name'},
        {name: 'type', 				mapping: 'workspace.workspace_type'},
        {name: 'desc', 				mapping: 'workspace.description'},
        {name: 'company', 			mapping: 'workspace.company'},
        {name: 'commGroup', 		mapping: 'workspace.community_group'},
*/
		{name: 'inherit_security_from_parent'},
		{name: 'id'},
		{name: 'name'},
		{name: 'description'},
		{name: 'type'},
		{name: 'created'},
		{name: 'expired'},
		{name: 'owner_id'},
		{name: 'organization'}
	]
});