Ext.define('MYOCD.store.objectTypeLibrary.ObjectTypeAttributes',{
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.objectTypeLibrary.ObjectTypeAttribute',
	model: 'MYOCD.model.objectTypeLibrary.ObjectTypeAttribute',
	groupField: 'type_group'
});