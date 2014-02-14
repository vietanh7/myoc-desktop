Ext.define('MYOCD.store.productCatalog.RefProductCatalogLibs', {
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.productCatalog.ProductCatalogLib',
	model: 'MYOCD.model.productCatalog.ProductCatalogLib'
});