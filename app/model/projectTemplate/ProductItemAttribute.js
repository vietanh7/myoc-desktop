Ext.define('MYOCD.model.projectTemplate.ProductItemAttribute', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'inherit_security_from_parent'},
		{name: 'constant', type: 'boolean'},
		{name: 'mandatory', type: 'boolean'},
		{name: 'default_value'},
		{name: 'deprecated', type: 'boolean'},
		{name: 'hidden', type: 'boolean'},
		{name: 'value_type'},
		{name: 'id'},
		{name: 'name'},
		{name: 'description'},
		{name: 'type'},
		{name: 'created'},
		{name: 'expired'},
		{name: 'owner_id'},
		{name: 'isInherited', type: 'boolean'}
	]
});