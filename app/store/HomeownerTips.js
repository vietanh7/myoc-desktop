Ext.define('MYOCD.store.HomeownerTips',{
	extend: 'Ext.data.Store',
	storeId: 'homeownerTips',
	model: 'MYOCD.model.HomeownerTip',
	data: [
		{tipId: 1, tipTitle: 'Furnace maintenance'},
		{tipId: 2, tipTitle: 'Cleaning hardwood floors'},
		{tipId: 3, tipTitle: 'Furnace maintenance'},
		{tipId: 4, tipTitle: 'Cleaning hardwood floors'},
		{tipId: 5, tipTitle: 'Furnace maintenance'},
		{tipId: 6, tipTitle: 'Cleaning hardwood floors'},
		{tipId: 7, tipTitle: 'Furnace maintenance'},
		{tipId: 8, tipTitle: 'Cleaning hardwood floors'},
	]
});