Ext.define('MYOCD.view.toolbarDialogs.contactsDialog.SystemContactsDialog',{
	extend: 'Ext.window.Window',
	xtype: 'systemContactsDialog',
	width: 650,
	height: 500,
	title: 'People And Organizations In System',
	cls: 'customWindow',
	constrainHeader:true,
	position: 'cascade',
	layout: 'border',
	items: [
		{
			xtype: 'tabpanel',
			region: 'center',
			flex: 1,
			items: [
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
								}
							]
						},
						{
							xtype: 'grid',
							border: false,
							name: 'contactPeopleGrid',
							flex: 1,
							store: 'main.ContactPeople',
							columns: [
								{xtype: 'templatecolumn', tpl: '<img src="./resources/images/contact_ppl_icon.png" width="32" height="32">', width: 40},
								{text: 'Name', flex: 1, xtype: 'templatecolumn',
									tpl: '<tpl if="name!=null">{name}<tpl else>{first_name} {last_name}</tpl>'
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
								}
							]
						},
						{
							xtype: 'grid',
							border: false,
							flex: 1,
							name: 'contactOrganizationsGrid',
							store: 'main.ContactOrganizations',
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
			xtype: 'panel',
			region: 'south',
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'textfield',
					flex: 1,
					margin: 5,
					emptyText: 'Enter your friends email to invite',
					name: 'emailField'
				},
				{
					xtype: 'button',
					margin: 5,
					text: 'Invite'
				}
			]
		}
	]
}); 