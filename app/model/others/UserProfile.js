Ext.define('MYOCD.model.others.UserProfile', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'first_name', mapping: 'user.first_name'},
		{name: 'last_name', mapping: 'user.last_name'},
		{name: 'email', mapping: 'user.email'}
	]
});