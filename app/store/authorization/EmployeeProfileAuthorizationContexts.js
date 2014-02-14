Ext.define('MYOCD.store.authorization.EmployeeProfileAuthorizationContexts',{
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.authorization.AuthorizationContext',
	model: 'MYOCD.model.authorization.AuthorizationContext'
});