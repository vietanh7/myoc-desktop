Ext.define('MYOCD.view.attributeAction.AttributeAction',{
	extend: 'Ext.window.Window',
	requires: [
		'MYOCD.view.attributeAction.SelectPermissionForAction'
	],
	xtype: 'attributeAction',
	width: 500,
	height: 300,
	cls: 'customWindow',
	constrainsHeader: true,
	title: 'Attribute\'s Actions',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	items: [
		{
			xtype: 'textfield',
			hidden: true,
			name: 'attributeId'	
		},
		{
			xtype: 'grid',
			flex: 1,
			name: 'attributeActionsGrid',
			store: 'attributeAction.AttributeActions',
			columns: [
				{text: 'Action', flex: 1.5, dataIndex: 'action_display_name'},
				{text: 'Permission', flex: 2, dataIndex: 'permission', xtype: 'templatecolumn', tpl: '{permission.name}'},
				{
					xtype: 'actioncolumn',
					width: 40,
					items: [
						{
							icon: 'resources/images/ellipsis_icon.png',
							handler: function(grid, rowIndex, colIndex) {
								var rec = grid.getStore().getAt(rowIndex);
								this.up('attributeAction').fireEvent('editaction', this.up('attributeAction'), rec);
							}
						}
					]
				}
			]
		}
	]
});