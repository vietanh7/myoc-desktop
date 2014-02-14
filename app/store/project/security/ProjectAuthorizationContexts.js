Ext.define('MYOCD.store.project.security.ProjectAuthorizationContexts', {
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.project.security.ProjectAuthorizationContext',
	model: 'MYOCD.model.project.security.ProjectAuthorizationContext'
});