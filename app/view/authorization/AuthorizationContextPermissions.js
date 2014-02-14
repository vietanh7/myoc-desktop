var authorizationPermissionsStore = Ext.create('Ext.data.Store', {
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

Ext.define('MYOCD.view.authorization.AuthorizationContextPermissions',{
	extend: 'Ext.Panel',
	xtype: 'authorizationContextPermissions',
 	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
	items: [
		{
			xtype: 'panel',
			hidden: true,
			height: 70,
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
							name: 'baseUrl',
							hidden: true	
						},
						{
							name: 'authorizationContextId',
							hidden: true	
						},
						{
							name: 'authorizationContextName',
							fieldLabel: 'Name',
							hidden: true
						}
					]
				}
			]
		},
		{
			xtype: 'grid',
			style: 'background-color: white',
			name: 'authorizationContextPermissionsGrid',
			flex: 1,
			border: false,
			title: 'Permissions',
			tools: [
				{
					xtype: 'tool',
					type: 'plus',
					name: 'selectPermissionTool',
					hidden: true
				}
			],
			columnLines: true,
			store: authorizationPermissionsStore,
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
								var parent = grid.up('authorizationContextPermissions');
								var authorizationContextId = parent.down('textfield[name="authorizationContextId"]').getValue();
								var baseUrl = parent.down('textfield[name="baseUrl"]').getValue();
								if (baseUrl.length == 0) {
									Ext.Msg.alert('Error!', 'Cannot remove permission from inherited context');
									return;
								}
								parent.fireEvent('removePermissionFromAuthorizationContext', parent, grid, authorizationContextId, rec);
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
		}
	]
});