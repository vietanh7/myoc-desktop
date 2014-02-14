Ext.define('MYOCD.store.company.SearchCompanyProfiles', {
	extend: 'Ext.data.Store',
	requires: ['MYOCD.model.company.SearchCompanyProfile'],
	model: 'MYOCD.model.company.SearchCompanyProfile',
	data: [
		{
			'name': ' ',
			'description': ' ',
			'address': ' ',
			'phone': ' ',
			'id': ' '
		}
	]
});