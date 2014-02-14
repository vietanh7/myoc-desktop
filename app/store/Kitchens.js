Ext.define('MYOCD.store.Kitchens',{
	extend: 'Ext.data.Store',
	model: 'MYOCD.model.Kitchen',
	storeId: 'kitchens',
	data: [
		{kitchenId: 1, kitchenImg: 'resources/images/SampleData/1.jpeg'},
		{kitchenId: 2, kitchenImg: 'resources/images/SampleData/2.jpeg'},
		{kitchenId: 3, kitchenImg: 'resources/images/SampleData/3.jpeg'},
		{kitchenId: 4, kitchenImg: 'resources/images/SampleData/4.jpeg'},
		{kitchenId: 5, kitchenImg: 'resources/images/SampleData/5.jpeg'},
		{kitchenId: 6, kitchenImg: 'resources/images/SampleData/6.jpeg'},
		{kitchenId: 7, kitchenImg: 'resources/images/SampleData/7.jpeg'},
	]
});