var allPermissionStore = Ext.create('Ext.data.Store', {
	fields: [
		{name: 'inherit_security_from_parent'},
		{name: 'id'},
		{name: 'name'},
		{name: 'description'},
		{name: 'type'},
		{name: 'created'},
		{name: 'expired'},
		{name: 'owner_id'},
		{name: 'path'},
		{name: 'isInherited'}
	]
});

Ext.define('MYOCD.view.roleLibrary.NewRoleWithCustom',{
	extend: 'Ext.window.Window',
	requires: [
		'MYOCD.view.roleLibrary.NewRoleSelectParent',
		'MYOCD.view.roleLibrary.SelectPermissionForRole'
	],
	xtype: 'newRoleWithCustom',
	width: 600,
	height: 500,
	constrainHeader: true,
	cls: 'customWindow',
	title: 'New Role',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
	items: [
		{
			xtype: 'panel',
			height: 100,
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'start'
			},
			items: [
				{
					xtype: 'fieldset',
					layout: {
						type: 'vbox',
						align: 'stretch',
						pack: 'start'
					},
					defaults: {
						labelWidth:  80
					},
					defaultType: 'textfield',
					items: [
						{
							name: 'roleId',
							hidden: true	
						},
						{
							name: 'newRoleName',
							fieldLabel: 'Name'
						},
						{
							name: 'newRoleDesc',
							fieldLabel: 'Description'
						},
						{
							xtype: 'container',
							hidden: true,
							width: '100%',
							layout: {
								type: 'hbox',
								align: 'stretch'
							},
							items: [
								{
									xtype: 'textfield',
									name: 'parentRoleId',
									hidden: true	
								},
								{
									xtype: 'textfield',
									flex: 1,
									name: 'parentRole',
									disabled: true,
									labelWidth: 80,
									fieldLabel: 'Parent Role'
								},
								{
									xtype: 'button',
									margin: 2,
									name: 'clearRoleParentBtn',
									hidden: true,
									text: 'x'
								},
								{
									xtype: 'button',
									margin: 2, 
									name: 'selectParentRoleBtn',
									text: '...'
								}
							]
						}
					]
				}
			]
		},
		{
			xtype: 'grid',
			name: 'newRolePermissionsGrid',
			margin: '0 1 0 1',
			flex: 1,
			border: false,
			title: 'Permissions',
			tools: [
				{
					xtype: 'tool',
					type: 'plus',
					name: 'selectPermissionTool'
				}
			],
			columnLines: true,
			store: allPermissionStore,
			columns: [
				{
					xtype: 'actioncolumn',
					width: 40,
					items: [
						{
							icon: 'resources/images/p_grey_small.png',
						}
					],
					renderer: function(val, metaData, rec) {
			            if(rec.data.isInherited) {
				            this.items[0].icon = 'resources/images/p_grey_small.png';
			            } else {
				            this.items[0].icon = 'resources/images/p_green_small.png';
			            }

		            } 
				},
				{text: 'Name', flex: 1, dataIndex: 'name'},
				{text: 'Path', flex: 2, dataIndex: 'path'},
				{
					xtype: 'actioncolumn',
					width: 40,
					items: [
						{
							icon: 'resources/images/green_delete.png',
							handler: function(grid, rowIndex, colIndex) {
								var rec = grid.getStore().getAt(rowIndex);
								var parent = grid.up('newRoleWithCustom');
								var roleId = parent.down('textfield[name="roleId"]').getValue();
								parent.fireEvent('removepermissionfromrole',parent, grid, roleId, rec);
							}
						}	
					],
					renderer: function(val, metaData, rec) {
			            if(rec.data.isInherited) {
				            this.items[0].icon = '';
			            } else {
				            this.items[0].icon = 'resources/images/green_delete.png';
			            }
		            }
				}
			]
		},
		{
			xtype: 'container',
			margin: 5,
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			items: [
				{
					xtype: 'button',
					name: 'createNewRoleBtn',
					text: 'Create Role'
				},
				{
					xtype: 'button',
					name: 'updateRoleBtn',
					text: 'Update Role',
					hidden: true
				}
			]
		}
	]
});