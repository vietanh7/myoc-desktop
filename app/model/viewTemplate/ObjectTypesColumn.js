Ext.define('MYOCD.model.viewTemplate.ObjectTypesColumn',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'objectTypeName'},
		{name: 'objectTypeId'},
		{name: 'fieldName'},
		{name: 'primary'},
		{name: 'index'}
	]
});