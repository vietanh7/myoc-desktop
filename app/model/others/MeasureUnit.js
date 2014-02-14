Ext.define('MYOCD.model.others.MeasureUnit',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'name', mapping: 'unit_of_measure.name'},
		{name: 'id', mapping: 'unit_of_measure.id'},
		{name: 'symbol', mapping: 'unit_of_measure.symbol'}
	]
});