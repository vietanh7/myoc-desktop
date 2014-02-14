var contextItemTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

var assignedItemTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<tpl if="type==\'Company\'">',
				'<div class="thumb"><img src="./resources/images/contact_org_icon.png" width="32" height="32"></div>',
			'<tpl elseif="type == \'Role\'">',
				'<div class="thumb"><img src="./resources/images/user_grid_icon.png" width="32" height="32"></div>',
			'<tpl else>',
				'<div class="thumb"><img src="./resources/images/contact_ppl_icon.png" width="32" height="32"></div>',
			'</tpl>',
			'<tpl if="name">',
				'<span><h3>{name}</h3></span>',
			'<tpl else>',
				'<span><h3>{first_name} {last_name}</h3></span>',
			'</tpl>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.authorization.AuthorizationDialog', {
	extend: 'Ext.window.Window',
	requires: [
		'MYOCD.view.authorization.SelectPermissionForAuthorization',
		'MYOCD.view.authorization.SelectRoleForAuthorization',
		'MYOCD.view.authorization.AuthorizationContextPermissions'
	],
	cls: 'customWindow',
	xtype: 'authorizationDialog',
	title: 'Authorization',
	width: 750,
	height: 500,
	layout: 'border',
	constrainHeader: true,
	items: [
		{
			xtype: 'textfield',
			name: 'baseUrl',
			hidden: true	
		},
		{
			xtype: 'textfield',
			name: 'currentObjectId',
			hidden: true	
		},
		{
			xtype: 'panel',
			style: 'background-color: white;',
			height: 30,
			region: 'north',
			collapsible: false,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'checkbox',
					margin: '0 0 0 5',
					name: 'inheritCheckBox',
					boxLabel: 'Inherit from parent',
					flex: 1,
					checked: true
				}
			]
		},
		{
			xtype: 'panel',
			flex: 1.2,
			region: 'west',
			split: true,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'grid',
					style: 'background-color: white',
					flex: 1,
					border: false,
					title: 'Authorization Contexts',
					name: 'authorizationContextsGrid',
					store: 'authorization.AuthorizationContexts',
					hideHeaders: true,
					tools: [
						{
							xtype: 'tool',
							type: 'plus',
							name: 'addAuthContextTool'
						}
					],
					columns: [
						{
							xtype: 'actioncolumn',
							width: 40,
							items: [
								{
									icon: 'resources/images/user_grid_icon.png',
									width: 32,
									height: 32
								}
							],
							renderer: function(val, metaData, rec) {
								switch (rec.data.type) {
									case 'Role': 
										this.items[0].icon = 'resources/images/user_grid_icon.png';
										break;
									case 'PersonalProfile':
									case 'EmployeeProfile': 
										this.items[0].icon = 'resources/images/contact_ppl_icon.png';
										break;
									case 'Company': 
										this.items[0].icon = 'resources/images/contact_org_icon.png';
										break;
								}
				            } 
						},
						{text: 'Name', dataIndex: 'name', flex: 1, xtype: 'templatecolumn', 
							tpl: '<tpl if="isInherited"><font color="gray"><tpl else><font color="green"></tpl><tpl if="name != null && name.length &gt; 0"><span><h3>{name}</h3></span><tpl else><span><h3>{first_name} {last_name}</h3></span></tpl></font>',
						}
					]
				}
			]
		},
		{
			xtype: 'tabpanel',
			name: 'permissionAndAssignedItemsPanel',
			flex: 3,
			region: 'center',
			items: [
				{
					title: 'Users and Roles',
					xtype: 'panel',
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'panel',
							flex: 1,
							title: 'Users and Roles',
							layout: {
								type: 'vbox',
								align: 'stretch'
							},
							/*
tools: [
								{
									xtype: 'tool',
									type: 'plus',
									name: 'addAuthorizationTool'
								}
							],
*/
							cls: 'product-view',
							items: [
								{
									xtype: 'dataview',
									flex: 1,
									name: 'usersAndRolesDataView',
									autoScroll: true,
									layout: 'auto',
									store: 'authorization.AuthorizationContextRoleUsersAndRoles',
									tpl: assignedItemTpl,
									itemSelector: 'div .thumb-wrap',
									overItemCls: 'x-view-over',
									trackOver: true
								}
							]
						}
					]	
				},
				{
					title: 'Permissions',
					xtype: 'authorizationContextPermissions'
				},
				{
					title: 'Actions Permissions',
					hidden: true,
					xtype: 'grid',
					name: 'AuthorizationActionsPermissionsGrid',
					store: 'authorization.AuthorizationActionsPermissions',
					flex: 1,
					columnLines: true,
					columns: [
						{text: 'Action', flex: 1.5, dataIndex: 'action_display_name'},
						{text: 'Permission', flex: 2, dataIndex: 'permission', xtype: 'templatecolumn', tpl: '{permission.name}'},
						{
							xtype: 'actioncolumn',
							width: 20,
							items: [
								{
									icon: 'resources/images/checked.gif',
									handler: function(grid, rowIndex, colIndex) {
										var rec = grid.getStore().getAt(rowIndex);
										this.up('authorizationDialog').fireEvent('setActionPermission', this.up('authorizationDialog'), rec);
									}
								},
							],
							renderer: function(val, metaData, rec) {
								if (rec.data.granted) {
									this.items[0].icon = 'resources/images/checked.gif';
								} else {
									this.items[0].icon = 'resources/images/unchecked.gif';
								}
				            }
						}
					]
				}
			]
		}
		
	] 
});