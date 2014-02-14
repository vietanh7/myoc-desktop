Ext.define('MYOCD.store.project.FeaturesVersionTreeStore', {
	extend: 'Ext.data.TreeStore',
	fields: ['id', 'feature_name', 'feature_description', 'deletion_timestamp', 'object_type_id', 'object_type_name']
})