Ext.define('MYOCD.view.toolbarDialogs.ContactsDialog',{
	extend: 'Ext.window.Window',
	requires: [
		'MYOCD.view.toolbarDialogs.contactsDialog.SystemContactsDialog',
		'MYOCD.view.toolbarDialogs.contactsDialog.ContactDetail'
	],
	xtype: 'contactsDialog',
	width: 650,
	height: 500,
	title: 'Contacts',
	cls: 'customWindow',
	constrainHeader:true,
	position: 'cascade',
	layout: {
		type: 'vbox',
		align: 'stretch'	
	},
	items: [
		{
			xtype: 'tabpanel',
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
							store: 'main.ContactPeople',
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
							store: 'main.ContactOrganizations',
							columns: [
								{xtype: 'templatecolumn', tpl: '<img src="./resources/images/contact_org_icon.png" width="32" height="32">', width: 40},
								{text: 'Name', dataIndex: 'name', flex: 1}
							]
						}
					]
				}
			]
		}
	]
});