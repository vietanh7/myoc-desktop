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

Ext.define('MYOCD.view.authorization.SelectRoleForAuthorization',{
	extend: 'Ext.window.Window',
	xtype: 'selectRoleForAuthorization',
	width: 600,
	height: 500,
	title: 'Add New Authorization Context',
	constrainHeader: true,
	cls: 'customWindow',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
	items: [
		{
			xtype: 'tabpanel',
			flex: 1,
			items: [
				{
					xtype: 'panel',
					title: 'Company Role',
					name: 'authorizationRefCompanyRolePanel',
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
							name: 'authorizationRefCompanyRoleDataview',
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
				{
					xtype: 'panel',
					name: 'authorizationRefProjectRolesPanel',
					title: 'Project Role',
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
							name: 'authorizationRefProjectRoleDataview',
							autoScroll: true,
							layout: 'auto',
							store: 'project.security.ProjectRoles',
							tpl: roleTpl,
							itemSelector: 'div .thumb-wrap',
							overItemCls: 'x-view-over',
							trackOver: true
						}
					]
				},
				{
					title: 'People',
					xtype: 'panel',
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'panel',
							layout: {
								type: 'hbox',
								align: 'stretch'
							},
							items: [
								{
									xtype: 'textfield',
									padding: 5,
									inputType: 'search',
									emptyText: 'Search people',
									name: 'searchPeopleContactTextField',
									flex: 1
								},
								{
									xtype: 'button',
									margin: 5,
									name: 'searchPeopleContactBtn',
									text: 'Search'
								},
								{
									xtype: 'button',
									margin: 5,
									text: '+'
								}
							]
						},
						{
							xtype: 'grid',
							border: false,
							name: 'contactPeopleGrid',
							flex: 1,
							store: 'authorization.RefContactPeople',
							columns: [
								{xtype: 'templatecolumn', tpl: '<img src="./resources/images/contact_ppl_icon.png" width="32" height="32">', width: 40},
								{text: 'Name', flex: 1, xtype: 'templatecolumn',
									tpl: '<tpl if="name != null && name.length &gt; 0">{name}<tpl else>{first_name} {last_name}</tpl>'
								}
							]
						}
					]
				},
				{
					title: 'Organizations',
					xtype: 'panel',
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'panel',
							layout: {
								type: 'hbox',
								align: 'stretch'
							},
							items: [
								{
									xtype: 'textfield',
									padding: 5,
									inputType: 'search',
									emptyText: 'Search organization',
									name: 'searchOrgContactTextField',
									flex: 1
								},
								{
									xtype: 'button',
									margin: 5,
									name: 'searchOrgContactBtn',
									text: 'Search'
								},
								{
									xtype: 'button',
									margin: 5,
									text: '+'
								}
							]
						},
						{
							xtype: 'grid',
							border: false,
							flex: 1,
							name: 'contactOrganizationsGrid',
							store: 'authorization.RefContactOrganizations',
							columns: [
								{xtype: 'templatecolumn', tpl: '<img src="./resources/images/contact_org_icon.png" width="32" height="32">', width: 40},
								{text: 'Name', dataIndex: 'name', flex: 1}
							]
						}
					]
				}
			]
		},
		{
			xtype: 'container',
			hidden: true,
			margin: '5 0 0 0',
			height: 30,
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			items: [
				{
					xtype: 'button',
					name: 'authorizationAcceptParentBtn',
					text: 'OK',
					width: 80
				}
			]
		}
	]
});