var states = Ext.create('Ext.data.Store', {
    fields: ['value', 'name'],
    data : [
        {"value":"personal", "name":"Personal"},
        {"value":"company", "name":"Company"}
    ]
});

Ext.define('MYOCD.view.Workspace',{
	extend: 'Ext.Container',
	xtype: 'workspace',
	requires:[
        'MYOCD.view.workspace.Personal',
        'MYOCD.view.workspace.Company',
        'MYOCD.view.wsWindows.NewCompanyWizard',
        'MYOCD.view.wsWindows.JoinCompanyWizard',
        
        'MYOCD.view.toolbarDialogs.SettingsDialog',
        'MYOCD.view.toolbarDialogs.ContactsDialog',
        'MYOCD.view.toolbarDialogs.SecurityDialog',
        'MYOCD.view.toolbarDialogs.ProfileEditorDialog',
        'MYOCD.view.toolbarDialogs.WorkspaceProfile',
        
        'MYOCD.view.libraries.LibrariesWindow',
        'MYOCD.view.catalogs.CatalogsWindow',
        'MYOCD.view.templates.TemplatesWindow',
        
        'Ext.toolbar.Toolbar',
        
        'MYOCD.view.authorization.AuthorizationDialog',
        'MYOCD.view.attributeAction.AttributeAction',
        'MYOCD.view.attributeAction.SetActionPermission'

    ],
	layout: {
		type: 'vbox',
		align: 'stretch',
	},
	style: 'margin: auto',
	cls: 'workspace',
    autoDestroy: false,
    autoScroll: true,
    overflow: 'auto',
    width: 1500,
	items: [
		{
			xtype: 'toolbar',
			height: 40,
			cls: 'workspaceHeader',
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'container',
					width: '10%',
					html: '<span style="padding-top: 5px; padding-left: 10px; position: absolute; font-size: 16px; color: white; text-shadow: rgba(0, 0, 0, 0.7) 0.05em -0.08em 0; font-weight: bold;">My Home Space</span></div>'
				},
				{
					xtype: 'splitbutton',
					cls: 'user-button', 
					iconCls: 'user-icon',
					name: 'userButton',
					height: 32,
					text: 'User',
					menu: {
						xtype: 'menu',
						items: [
							{
								xtype: 'menuitem',
								name: 'editProfileMenu',
								text: 'Profile'	
							},
							{
								xtype: 'menuitem',
								name: 'accountMenu',
								text: 'Account'
							},
							{
								xtype: 'menuitem',
								name: 'logoutBtn',
								text: 'Logout'
							}
						]
					}	
				},
/*
				{ 
					xtype: 'button', 
					height: 16,
					menu: {
						xtype: 'menu',
						items: [
							{
								xtype: 'menuitem',
								name: 'editProfileMenu',
								text: 'Profile'	
							},
							{
								xtype: 'menuitem',
								name: 'accountMenu',
								text: 'Account'
							},
							{
								xtype: 'menuitem',
								name: 'logoutBtn',
								text: 'Logout'
							}
						]
					}	
				},
*/
				{
					xtype: 'container',
					width: 10
				},	
				{
					xtype: 'container',
					layout: {
						type: 'vbox',
						pack: 'center'
					},
					items: [
						{
							xtype: 'container',
							margin: 3,
							layout: 'hbox',
							cls: 'dialogMenu',
							items: [
								{
									xtype: 'splitbutton',
									text: 'Messages',
									width: 95,
									cls: 'firstMenu'	
								},
								{
									xtype: 'splitbutton',
									name: 'contactsBtn',
									text: 'Contacts',
									width: 95,
									cls: 'notFirstMenu'
								},
								{
									xtype: 'splitbutton',
									name: 'catalogsBtn',
									text: 'Catalogs',
									width: 95,
									cls: 'notFirstMenu'
								},
								{
									xtype: 'splitbutton',
									name: 'templatesBtn',
									text: 'Templates',
									width: 95,
									cls: 'notFirstMenu'
								},
								{
									xtype: 'splitbutton',
									name: 'librariesBtn',
									text: 'Libraries',
									width: 95,
									cls: 'notFirstMenu'
								},
								{
									xtype: 'splitbutton',
									name: 'securityBtn',
									text: 'Security',
									width: 95,
									cls: 'notFirstMenu'
								},
								{
									xtype: 'splitbutton',
									name: 'organizationBtn',
									text: 'Company',
									width: 95,
									cls: 'notFirstMenu'
								},
								{
									xtype: 'splitbutton',
									name: 'settingsBtn',
									text: 'Settings',
									width: 95,
									cls: 'notFirstMenu'
								}
							
							]						
						}
					]
				},
				{
					xtype: 'container',
					width: 10
				},				
				{
					xtype: 'combobox',
					hidden: true,
					name: 'workspaceType',
					store: 'Workspace',
				    queryMode: 'local',
				    displayField: 'name',
				    valueField: 'id',
					value: 'personal',
					tpl: Ext.create('Ext.XTemplate',
				        '<tpl for=".">',
				            '<div class="x-boundlist-item">',
				        	'<tpl if="type.toLowerCase() == \'PersonalWorkspace\'">',
					        	'<span class="avatar"><img src="resources/images/icon_home.png" height="18" width="18"></span>',
					        '<tpl elseif="type.toLowerCase() == \'CompanyWorkspace\'">',
					        	'<span class="avatar"><img src="resources/images/icon_home2.png" height="18" width="18"></span>',
					        '<tpl else>',
					            '<span class="avatar"><img src="resources/images/icon_home3.png" height="18" width="18"></span>',
					        '</tpl>',
				        	'<div class="name">{name}</div>',
				            '</div>',
				        '</tpl>'
				    ),
				},
				{
					xtype: 'tbfill'
				},
				{
					xtype: 'textfield',
					name: 'workspaceSearch',
/* 					cls: 'workspaceSearch', */
					emptyText: 'Search',
					inputType: 'search',
					ui: 'default-toolbar',
					width: 300,
					listeners: {
						render: function() {
							if(!Ext.isMac && Ext.isChrome) {
								this.addCls('workspaceSearch-chrome-notMac');
							} else {
								this.addCls('workspaceSearch');
							}
						}
					}
				},
				{
					xtype: 'button',
					iconCls: 'search-icon',
					padding: 6,
					height: 22,
					width: 35
				},
				{
					iconCls: 'add-icon',
					padding: 6,
					xtype: 'splitbutton',
					name: 'workspaceChangeButton',
					//cls: 'workspace-button-smaller',
					height: 32,
					width: 50,
					menu: {
						xtype: 'menu',
						items: [
							{
								xtype: 'menuitem',
								text: 'Switch Workspace',
								menu: {
									xtype: 'menu',
									name: 'workspaceMenu',
									autoDestroy: false
								}	
							},
							{
								xtype: 'menuitem',
								name: 'joinComMenu',
								text: 'Join a company'
							},
							{
								xtype: 'menuitem',
								name: 'createComMenu',
								text: 'Create a company'
							},
							{
								xtype: 'menuitem',
								name: 'joinCommunityMenu',
								text: 'Join a community group'
							},
							{
								xtype: 'menuitem',
								name: 'createCommunityMenu',
								text: 'Create a community group'
							}
						]
					}	
				},
				{
					xtype: 'tbfill'
				}  
			]
		},
		{
			xtype: 'panel',
			cls: 'workspaceBody',
			flex: 1,
			items: [{
				xtype: 'workspacepersonal'
			}]
		},
		{
			xtype: 'panel',
			cls: 'workspaceFooter',
			height: 45,
		}
	],
});