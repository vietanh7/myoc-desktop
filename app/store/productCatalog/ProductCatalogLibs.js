Ext.define('MYOCD.store.productCatalog.ProductCatalogLibs', {
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.productCatalog.ProductCatalogLib',
	model: 'MYOCD.model.productCatalog.ProductCatalogLib'
});