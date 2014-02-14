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


Ext.define('MYOCD.view.toolbarDialogs.securityDialog.AuthorizationTab', {
	extend: 'Ext.Panel',
	requires: [
		'MYOCD.view.toolbarDialogs.securityDialog.UsersPermissions',
		'MYOCD.view.toolbarDialogs.securityDialog.SecurityDialogSelectRole',
		'MYOCD.view.toolbarDialogs.securityDialog.SecurityDialogSelectPermission',
		'MYOCD.view.toolbarDialogs.securityDialog.SecurityDialogSelectCompanyRole'
	],
	xtype: 'authorizationTab',
	layout: 'border',
	constrainHeader: true,
	items: [
		{
			xtype: 'grid',
			name: 'authorizationRoleGrid',
			tools: [
				{
					xtype: 'tool',
					type: 'plus',
					name: 'addAuthorizationTool'
				}
			],
			border: false,
			style: 'background-color: white',
			title: 'Authorized Entities',
			region: 'west',
			collapsible: true,
			split: true,
			flex: 1.2,
			store: 'company.AuthorizationEntities',
			hideHeaders: true,
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
					tpl: '<tpl if="name"><span><h3>{name}</h3></span><tpl else><span><h3>{first_name} {last_name}</h3></span></tpl>',
				}
			]
		},
		{
			xtype: 'panel',
			flex: 3,
			region: 'center',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'tabpanel',
					name: 'roleContentPanel',
					flex: 1,
					items: [
						{
							title: 'Users And Roles',
							xtype: 'panel',
							layout: {
								type: 'vbox',
								align: 'stretch'
							},
							items: [
								{
									xtype: 'panel',
									flex: 1,
									title: 'Users And Roles',
									layout: {
										type: 'vbox',
										align: 'stretch'
									},
									tools: [
										{
											xtype: 'tool',
											type: 'plus',
											name: 'assignAuthorizationTool'
										}
									],
									cls: 'product-view',
									items: [
										{
											xtype: 'dataview',
											flex: 1,
											name: 'assignedOrgsDataView',
											autoScroll: true,
											layout: 'auto',
											store: 'company.AssignedOrgs',
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
							xtype: 'securityDialogEditRole'
						}
					]
				},
				{
					xtype: 'panel',
					name: 'usersPermissionPanel',
					flex: 1,
					hidden: true,
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'usersPermissions',
							flex: 1						
						}
					]
				}
			]
		}
	] 
});