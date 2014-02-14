var usersPermissionsStore = Ext.create('Ext.data.Store', {
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


Ext.define('MYOCD.view.toolbarDialogs.securityDialog.UsersPermissions', {
	extend: 'Ext.Panel',
	xtype: 'usersPermissions',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	items: [
		{
			xtype: 'textfield',
			name: 'objectId',
			hidden: true
		},
		{
			xtype: 'textfield',
			name: 'baseUrl',
			hidden: true
		},
		{
			xtype: 'grid',
			name: 'usersPermissionsGrid',
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
			store: usersPermissionsStore,
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
								var parent = grid.up('usersPermissions');
								var objectId = parent.down('textfield[name="objectId"]').getValue();
								var baseUrl = parent.down('textfield[name="baseUrl"]').getValue();
								parent.fireEvent('removepermissionfromuser',parent, grid, objectId, baseUrl, rec);
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