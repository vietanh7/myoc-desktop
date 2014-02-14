Ext.define('MYOCD.store.project.ProjectProducts', {
	extend: 'Ext.data.Store',
	requires: ['MYOCD.model.project.ProjectProduct'],
	model: 'MYOCD.model.project.ProjectProduct'
});