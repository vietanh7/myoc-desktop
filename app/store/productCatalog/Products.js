Ext.define('MYOCD.store.productCatalog.Products', {
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.productCatalog.Product',
	model: 'MYOCD.model.productCatalog.Product'
});