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


Ext.define('MYOCD.view.project.security.ProjectSecurity', {
	extend: 'Ext.Panel',
	requires: [
		'MYOCD.view.project.security.ProjectSecuritySelectRoles',
		'MYOCD.view.project.security.ProjectSecurityEditAssignedItem',
		'MYOCD.view.project.security.ProjectSecurityEditRole',
		'MYOCD.view.project.security.ProjectUsersPermissions'
	],
	xtype: 'projectSecurity',
	height: 533,
	layout: 'border',
	items: [
		{
			xtype: 'checkbox',
			boxLabel: 'Inherit from parent',
			name: 'inheritCheckBox',
			margin: 5,
			region: 'north',
			style: 'background-color: white',
			checked: true
		},
		{
			xtype: 'grid',
			title: 'Project Roles',
			region: 'west',
			flex: 1,
			name: 'projectRolesGrid',
			split: true,
			store: 'project.security.ProjectAuthorizationContexts',
			tools: [
				{
					xtype: 'tool',
					type: 'plus',
					name: 'projectSecurityAddRoleTool'
				}
			],
			hideHeaders: true,
			collapsible: true,
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
					tpl: '<tpl if="isInherited"><font color="gray"><tpl else><font color="green"></tpl><tpl if="name"><span><h3>{name}</h3></span><tpl else><span><h3>{first_name} {last_name}</h3></span></tpl></font>',
				}
			]
		},
		{
			xtype: 'panel',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			region: 'center',
			flex: 5,
			items: [
				{
					xtype: 'tabpanel',
					name: 'projectRoleContentPanel',
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
											name: 'addAuthorizationTool'
										}
									],
									cls: 'product-view',
									items: [
										{
											xtype: 'dataview',
											flex: 1,
											name: 'usersAndRolesDataView',
											autoScroll: true,
											layout: 'auto',
											store: 'project.security.ProjectRoleUsersAndRoles',
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
							xtype: 'projectSecurityEditRole'
						}
					]
				},
				{
					xtype: 'panel',
					name: 'projectUsersContentPanel',
					flex: 1,
					hidden: true,
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'projectUsersPermissions',
							flex: 1
						}
					]
				}
			]
		}
	]
});