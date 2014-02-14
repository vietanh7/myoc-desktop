Ext.define('MYOCD.store.jobCatalog.JobCatalogLibs', {
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.jobCatalog.JobCatalogLib',
	model: 'MYOCD.model.jobCatalog.JobCatalogLib'
});