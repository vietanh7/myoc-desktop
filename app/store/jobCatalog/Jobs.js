Ext.define('MYOCD.store.jobCatalog.Jobs', {
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.jobCatalog.Job',
	model: 'MYOCD.model.jobCatalog.Job'
});