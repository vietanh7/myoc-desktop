Ext.define('MYOCD.store.featureTemplate.FeatureTemplateFeatureTreeStore', {
	extend: 'Ext.data.TreeStore',
	fields: [
		{name: 'inherit_security_from_parent'},
		{name: 'object_types'},
		{name: 'attributes'},
		{name: 'inherited_attributes'},
		{name: 'id'},
		{name: 'name'},
		{name: 'description'},
		{name: 'type'},
		{name: 'created'},
		{name: 'expired'},
		{name: 'owner_id'}
	]
});