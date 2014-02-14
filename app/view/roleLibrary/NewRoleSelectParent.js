var roleLibTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/library_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

var roleTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.roleLibrary.NewRoleSelectParent',{
	extend: 'Ext.window.Window',
	xtype: 'newRoleSelectParent',
	width: 600,
	height: 500,
	title: 'Select Parent Role',
	constrainHeader: true,
	cls: 'custom-window',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
	items: [
		{
			xtype: 'panel',
			name: 'newRoleRefRoleLibraryPanel',
			cls: 'product-view',
			flex: 1,
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'start'
			},
			items: [
				{
					xtype: 'dataview',
					flex: 1,
					name: 'newRoleRefRoleLibraryDataview',
					autoScroll: true,
					layout: 'auto',
					store: 'roleLibrary.RefRoleLibraries',
					tpl: roleLibTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				}
			]
		},
		{
			xtype: 'panel',
			name: 'newRoleRefRolePanel',
			hidden: true,
			flex: 1,
			layout: 'border',
			items: [
				{
					xtype: 'panel',
					style: 'background-color: white;',
					margin: 3,
					height: 25,
					region: 'north',
					collapsible: false,
					layout: 'hbox',
					items: [
						{
							xtype: 'button',
							iconCls: 'back-icon',
							name: 'newRoleRefRoleLibBackButton',
							ui: 'default-toolbar'
						}
					]	
				},
				{
					xtype: 'treepanel',
					style: 'background-color: white;',
					name: 'newRoleRefRoleCategoriesTree',
					title: 'Categories',
					region: 'west',
					collapsible: true,
					split: true,
					flex: 1,
					store: 'roleLibrary.RefRoleCategoriesTreeStore',
					displayField: 'name',
					hideHeaders: true,
					useArrows: true,
				},
				{
					xtype: 'panel',
					title: 'Roles',
					layout: {
						type: 'vbox',
						align: 'stretch',
						pack: 'center'
					},
					region: 'center',
					cls: 'product-view',
					flex: 2.5,
					items: [
						{
							xtype: 'dataview',
							flex: 1,
							name: 'newRoleRefRolesDataView',
							autoScroll: true,
							layout: 'auto',
							store: 'roleLibrary.RefRoles',
							tpl: roleTpl,
							itemSelector: 'div .thumb-wrap',
							overItemCls: 'x-view-over',
							trackOver: true
						}
					]
				}
			]
		},
		{
			xtype: 'container',
			margin: '5 0 0 0',
			height: 30,
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			items: [
				{
					xtype: 'button',
					name: 'newRoleAcceptParentBtn',
					text: 'OK',
					width: 80
				}
			]
		}
	]
});