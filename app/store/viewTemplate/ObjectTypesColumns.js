Ext.define('MYOCD.store.viewTemplate.ObjectTypesColumns',{
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.viewTemplate.ObjectTypesColumn',
	model: 'MYOCD.model.viewTemplate.ObjectTypesColumn',
	sorters: ['index']
});