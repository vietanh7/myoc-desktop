Ext.define('MYOCD.store.project.FeatureAttributesInView',{
	extend: 'Ext.data.Store',
	requires: ['MYOCD.model.project.FeatureAttribute'],
	model: 'MYOCD.model.project.FeatureAttribute',
	sorters: ['name']
});