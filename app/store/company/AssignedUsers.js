Ext.define('MYOCD.store.company.AssignedUsers',{
	extend: 'Ext.data.Store',
	requires: 'MYOCD.model.company.AssignedItem',
	model: 'MYOCD.model.company.AssignedItem'
});