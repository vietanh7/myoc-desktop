Ext.define('MYOCD.store.productCatalog.RefProducts', {
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.productCatalog.Product',
	model: 'MYOCD.model.productCatalog.Product'
});