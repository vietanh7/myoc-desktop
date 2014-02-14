Ext.define('MYOCD.model.others.ValueType', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'name', mapping: 'attribute_type.name'},
		{name: 'id', mapping: 'attribute_type.id'}
	]
});