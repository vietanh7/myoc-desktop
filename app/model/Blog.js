Ext.define('MYOCD.model.Blog',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'blogId', type: 'int'},
		{name: 'blogTitle', type: 'string'},
		{name: 'liked', type: 'int'},
		{name: 'disliked', type: 'int'}
	]
});