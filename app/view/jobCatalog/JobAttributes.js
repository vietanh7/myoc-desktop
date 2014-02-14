Ext.define('MYOCD.view.jobCatalog.JobAttributes',{
	extend: 'Ext.window.Window',
	requires:[
		'MYOCD.view.jobCatalog.JobOwnedAtts'
	],
	xtype: 'jobAttributes',
	width: 960,
	height: 500,
	cls: 'customWindow',
	constrainHeader: true,
	title: 'Job Properties',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
	items: [
		{
			xtype: 'tabpanel',
			plain: true,
			flex: 1,
			tabPosition: 'bottom',
			items: [
				{
					title: 'Attributes',
					xtype: 'jobOwnedAtts' //will also handle inherited
				},
				{
					title: 'Constrains'
				}
			]
		}
	]
});