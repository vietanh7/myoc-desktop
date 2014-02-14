Ext.define('MYOCD.model.WeeklyDeal',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'dealId', type: 'int'},
		{name: 'dealTitle', type: 'string'},
		{name: 'dealLikes', type: 'int'},
		{name: 'dealDislikes', type: 'int'},
		{name: 'dealImgLink', type: 'string'}
	]
});