Ext.define('MYOCD.store.project.ProjectProductAttributes', {
	extend: 'Ext.data.Store',
	requires: ['MYOCD.model.project.ProjectProductAttribute'],
	model: 'MYOCD.model.project.ProjectProductAttribute',
	groupField: 'type_group'
});