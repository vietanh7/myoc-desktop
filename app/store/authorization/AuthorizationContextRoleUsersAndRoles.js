Ext.define('MYOCD.store.authorization.AuthorizationContextRoleUsersAndRoles',{
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.authorization.AuthorizationContextRoleUserAndRole',
	model: 'MYOCD.model.authorization.AuthorizationContextRoleUserAndRole'
});