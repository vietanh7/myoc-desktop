Ext.define('MYOCD.store.productCatalog.PublicProductCatalogLibs',{
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.productCatalog.ProductCatalogLib',
	model: 'MYOCD.model.productCatalog.ProductCatalogLib'
});