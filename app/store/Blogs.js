Ext.define('MYOCD.store.Blogs',{
	extend: 'Ext.data.Store',
	model: 'MYOCD.model.Blog',
	storeId: 'blogs',
	data: [
		{blogId: 1, blogTitle: 'Is earthquake insurance worth it?', liked: 1143, disliked: 12},
		{blogId: 2, blogTitle: 'Buy or rent?', liked: 984, disliked: 31},
		{blogId: 3, blogTitle: 'Green building - The Future?', liked: 2418, disliked: 189},
		{blogId: 4, blogTitle: 'How much for this house?', liked: 589, disliked: 41},
	]
});