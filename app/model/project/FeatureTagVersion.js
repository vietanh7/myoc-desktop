Ext.define('MYOCD.model.project.FeatureTagVersion', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', mapping: 'tree_snapshot_tag.id'},
		{name: 'tag', mapping: 'tree_snapshot_tag.tag'},
		{name: 'timestamp', mapping: 'tree_snapshot_tag.timestamp'}
	]
});