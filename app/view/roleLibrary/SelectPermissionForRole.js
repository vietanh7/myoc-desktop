var permissionLibTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/library_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

var permisionTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.roleLibrary.SelectPermissionForRole',{
	extend: 'Ext.window.Window',
	xtype: 'selectPermissionForRole',
	width: 600,
	height: 500,
	title: 'Select Permission',
	constrainHeader: true,
	cls: 'customWindow',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
	tools: [
		{
		    type:'help',
		    tooltip: 'Drag and Drop permission to permission grid'
		}
	],
	items: [
		{
			type: 'textfield',
			name: 'addOrUpdate',
			hidden: true
		},
		{
			xtype: 'panel',
			name: 'selectPermissionLibraryPanel',
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
					name: 'selectPermissionRefPermissionLibraryDataview',
					autoScroll: true,
					layout: 'auto',
					store: 'permissionLibrary.RefPermissionLibraries',
					tpl: permissionLibTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				}
			]
		},
		{
			xtype: 'panel',
			name: 'selectPermissionRefPermissionPanel',
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
							name: 'selectPermissionRefPermissionLibBackButton',
							ui: 'default-toolbar'
						}
					]	
				},
				{
					xtype: 'treepanel',
					style: 'background-color: white;',
					name: 'selectPermissionRefPermissionCategoriesTree',
					title: 'Categories',
					region: 'west',
					collapsible: true,
					split: true,
					flex: 1,
					store: 'permissionLibrary.RefPermissionCategoriesTreeStore',
					displayField: 'name',
					hideHeaders: true,
					useArrows: true,
				},
				{
					xtype: 'panel',
					title: 'Permissions',
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
							name: 'selectPermissionRefPermissionsDataView',
							autoScroll: true,
							layout: 'auto',
							store: 'permissionLibrary.RefPermissions',
							tpl: permisionTpl,
							itemSelector: 'div .thumb-wrap',
							overItemCls: 'x-view-over',
							trackOver: true
						}
					]
				}
			]
		}//,
		// {
		// 	xtype: 'container',
		// 	margin: '5 0 0 0',
		// 	height: 30,
		// 	layout: {
		// 		type: 'hbox',
		// 		pack: 'center'
		// 	},
		// 	items: [
		// 		{
		// 			xtype: 'button',
		// 			name: 'selectPermissionAcceptPermissionBtn',
		// 			text: 'OK',
		// 			width: 80
		// 		}
		// 	]
		// }
	]
});