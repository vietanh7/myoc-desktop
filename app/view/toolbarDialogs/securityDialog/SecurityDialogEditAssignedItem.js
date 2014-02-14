var EditAssignedItemAllPermissionStore = Ext.create('Ext.data.Store', {
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

Ext.define('MYOCD.view.toolbarDialogs.securityDialog.SecurityDialogEditAssignedItem',{
	extend: 'Ext.window.Window',
	xtype: 'securityDialogEditAssignedItem',
	width: 600,
	height: 500,
	constrainHeader: true,
	cls: 'customWindow',
	title: 'Edit Assigned Permissions',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
	items: [
		{
			xtype: 'panel',
			height: 130,
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
							name: 'objectId',
							hidden: true	
						},
						{
							name: 'baseUrl',
							hidden: true	
						},
						{
							name: 'objectName',
							fieldLabel: 'Name',
							disabled: true
						},
						{
							name: 'objectDesc',
							fieldLabel: 'Description',
							disabled: true
						},
					]
				}
			]
		},
		{
			xtype: 'grid',
			name: 'editAssignedPermissionsGrid',
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
			store: EditAssignedItemAllPermissionStore,
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
								var parent = grid.up('securityDialogEditAssignedItem');
								var objectId = parent.down('textfield[name="objectId"]').getValue();
								var baseUrl = parent.down('textfield[name="baseUrl"]').getValue();
								parent.fireEvent('removepermissionfromrole',parent, grid, objectId, baseUrl, rec);
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