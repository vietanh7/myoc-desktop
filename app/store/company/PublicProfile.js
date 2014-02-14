Ext.define('MYOCD.store.company.PublicProfile',{
    extend: 'Ext.data.Store',
    requires: [
        'MYOCD.model.company.PublicProfile'
    ],
	storeId: 'OTLAccess',
    model: 'MYOCD.model.company.PublicProfile',
});