var roleTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.toolbarDialogs.securityDialog.RolesTab',{
	extend: 'Ext.Panel',
	requires: [
		'MYOCD.view.toolbarDialogs.securityDialog.SecurityDialogEditRole'
	],
	xtype: 'rolesTab',
/*
	layout: {
        type: 'accordion',
        titleCollapse: true,
        animate: true,
        activeOnTop: true,
        hideCollapseTool: true
    },
*/
	layout: {
		type: 'vbox',
		align: 'stretch'	
	},
	items: [
/*
		{
			xtype: 'panel',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			title: 'Company Roles',
			tools: [
				{
					xtype: 'tool',
					type: 'plus',
					name: 'selectAccountTool'
				}
			],
			cls: 'product-view',
			items: [
				{
					xtype: 'dataview',
					flex: 1,
					name: 'companyRolesDataView',
					autoScroll: true,
					layout: 'auto',
					store: 'company.CompanyRoles',
					tpl: roleTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				}
			]
		},
*/
		{
			xtype: 'panel',
			flex: 1,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			title: 'Assigned Roles',
			cls: 'product-view',
			items: [
				{
					xtype: 'dataview',
					flex: 1,
					name: 'assignedRolesDataView',
					autoScroll: true,
					layout: 'auto',
					store: 'company.AssignedRoles',
					tpl: roleTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				}
			]
		}
	]
});