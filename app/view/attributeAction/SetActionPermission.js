
Ext.define('MYOCD.view.attributeAction.SetActionPermission', {
	extend: 'Ext.Panel',
	xtype: 'setActionPermission',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	border: false,
	items: [
		{
			xtype: 'grid',
			name: 'actionPermissionsGrid',
			border: false,
			store: new Ext.data.Store({
				fields: [
					{name: 'action_name'},
					{name: 'display_action'},
					{name: 'permission_name'},
					{name: 'permission_id'}
				]
			}),
			columns: [
				{text: 'Action', dataIndex: 'display_action', flex: 1},
				{text: 'Pemission', dataIndex: 'permission_name', flex: 0.5},
				{
					xtype: 'actioncolumn',
					width: 70,
					items: [
						{
							icon: 'resources/images/ellipsis_icon.png',
							handler: function(grid, rowIndex, colIndex) {
								var rec = grid.getStore().getAt(rowIndex);
								this.up('setActionPermission').fireEvent('selectPermissionForAction', this.up('setActionPermission'), rec);
							}
						},
						{
							icon: 'resources/images/refresh_icon.png',
							handler: function(grid, rowIndex, colIndex) {
								var rec = grid.getStore().getAt(rowIndex);
								rec.set('permission_name', '');
								rec.set('permission_id','');
								rec.commit();
							}
						}
					]
				}
			]
		}
	]
});