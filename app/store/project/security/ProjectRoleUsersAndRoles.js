Ext.define('MYOCD.store.project.security.ProjectRoleUsersAndRoles', {
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.project.security.ProjectRoleUserAndRole',
	model: 'MYOCD.model.project.security.ProjectRoleUserAndRole'
});