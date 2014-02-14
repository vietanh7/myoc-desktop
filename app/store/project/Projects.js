Ext.define('MYOCD.store.project.Projects', {
	extend: 'Ext.data.Store',
	requires: [
    	'MYOCD.model.project.Projects'
    ],
	model: 'MYOCD.model.project.Projects',
	sorters: ['projectName']
})