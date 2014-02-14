var allPermissionStore = Ext.create('Ext.data.Store', {
	fields: ['name', 'inherited'],
    data: [
        { name: 'Read', inherited: true },
        { name: 'Create', inherited: true },
        { name: 'Update', inherited: true },
        { name: 'Delete', inherited: true },
        { name: 'User define 1', inherited: false },
        { name: 'User define 2', inherited: false },
        { name: 'User define 3', inherited: false }
    ]
});

var rolePermissionTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<tpl if="inherited">',
				'<div class="thumb"><img src="./resources/images/p_grey.png"></div>',
			'<tpl else>',
				'<div class="thumb"><img src="./resources/images/p_green.png"></div>',
			'</tpl>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.roleLibrary.RoleDetail', {
	extend: 'Ext.window.Window',
	xtype: 'roleDetail',
	title: 'Role Detail',
	cls: 'customWindow',
	width: 500,
	height: 300,
	tools: [
		{
			xtype: 'tool',
			type: 'plus'
		}
	],
	layout: 'fit',
	items: [
		{
			xtype: 'panel',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'center'
			},
			cls: 'product-view',
			flex: 1,
			items: [
				{
					xtype: 'dataview',
					flex: 1,
					name: 'rolesPermission',
					autoScroll: true,
					layout: 'auto',
					store: allPermissionStore,
					tpl: rolePermissionTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				}
			]
		}
	]
});