Ext.define('MYOCD.store.project.FeatureAttributes',{
	extend: 'Ext.data.Store',
	requires: ['MYOCD.model.project.FeatureAttribute'],
	model: 'MYOCD.model.project.FeatureAttribute',
	groupField: 'type_group'
});