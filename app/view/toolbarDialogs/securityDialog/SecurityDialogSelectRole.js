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

Ext.define('MYOCD.view.toolbarDialogs.securityDialog.SecurityDialogSelectRole',{
	extend: 'Ext.window.Window',
	xtype: 'securityDialogSelectRole',
	width: 600,
	height: 500,
	title: 'Select New Entity',
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
					layout: {
						type: 'vbox',
						align: 'stretch',
						pack: 'start'
					},
					title: 'Library Roles',
					items: [
						{
							xtype: 'panel',
							name: 'authorizationRefRoleLibraryPanel',
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
									name: 'authorizationRefRoleLibraryDataview',
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
							name: 'authorizationRefRolePanel',
							hidden: true,
							flex: 1,
							layout: 'border',
							items: [
								{
									xtype: 'panel',
									margin: 3,
									height: 25,
									region: 'north',
									collapsible: false,
									layout: 'hbox',
									items: [
										{
											xtype: 'button',
											iconCls: 'back-icon',
											name: 'authorizationRefRoleLibBackButton',
											ui: 'default-toolbar'
										}
									]	
								},
								{
									xtype: 'treepanel',
									name: 'authorizationRefRoleCategoriesTree',
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
											name: 'authorizationRefRolesDataView',
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