Ext.define('MYOCD.model.viewTemplate.Aggregation',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'name'},
		{name: 'operator'},
		{name: 'formula'},
		{name: 'display_column'},
		{name: 'column'},
		{name: 'objectTypeId'},
		{name: 'objectTypeName'}
	]
});