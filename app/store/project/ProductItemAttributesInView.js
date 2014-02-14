Ext.define('MYOCD.store.project.ProductItemAttributesInView',{
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.project.ProductItemAttribute',
	model: 'MYOCD.model.project.ProductItemAttribute',
	groupField: 'type_group'
});