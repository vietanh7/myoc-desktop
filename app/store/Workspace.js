Ext.define('MYOCD.store.Workspace',{
	extend: 'Ext.data.Store',
	requires: [
    	'MYOCD.model.Workspace'
    ],
	model: 'MYOCD.model.Workspace',
    sorters: ['type'],
    grouper: {
        groupFn: function(record) {
            return record.get('type');
        }
    },
	// data: [
	// 	{name: 'Personal', 	value: 'personal'},
	// 	{name: 'Company', 	value: 'company'},
	// ],
	// proxy: {
 //    	type: 'ajax',
 //        url: API_BASE_URL + '/workspaces.json',
 //        withCredentials : true,
 //        useDefaultXhrHeader : false,
 //        reader: {
 //        	type: 'json'
 //        }
 //    }
});