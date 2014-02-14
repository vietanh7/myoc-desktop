Ext.define('MYOCD.view.project.ProjectProductDetail', {
	extend: 'Ext.window.Window',
	requires: [
		'Ext.view.View',
		'MYOCD.view.project.ProjectProductAttributes'
	],
	xtype: 'projectProductDetail',
	width: 920,
	height: 600,
	title: 'Product Detail',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	cls: 'customWindow',
	constrainHeader:true,
	items: [
		{
			xtype: 'textfield',
			hidden: true,
			name: 'projectProductId'	
		},
		{
			xtype: 'tabpanel',
			flex: 1,
			tabPosition: 'bottom',
			items: [
				{
					title: 'Attributes',
					xtype: 'projectProductAttributes'
				},
				{
					title: 'Constraints',
				}
			]
		}
		/*
{
			xtype: 'panel',
			flex: 1,
			border: false,
			style: 'background: white',
			items: [
				{
					xtype: 'grid',
					border: false,
					flex: 1,
					store: 'project.ProjectProductAttributes',
					columnLines: true,
					columns: [
						{text: 'Name', dataIndex: 'name', flex: 1},
						{text: 'Value', dataIndex: 'value', flex: 1.5}
					]
				}
			]
		}
*/
	]
});