Ext.define('MYOCD.store.productCatalog.ProductAttributes',{
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.productCatalog.ProductAttribute',
	model: 'MYOCD.model.productCatalog.ProductAttribute',
	groupField: 'type_group'
});