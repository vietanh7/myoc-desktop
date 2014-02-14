Ext.define('MYOCD.store.viewTemplate.AvailableFields',{
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.viewTemplate.AvailableField',
	model: 'MYOCD.model.viewTemplate.AvailableField',
	groupField: 'group'
});