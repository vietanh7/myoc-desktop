var viewTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.toolbarDialogs.settingsDialog.WorkspaceViews',{
	extend: 'Ext.Panel',
	requires: [
		'MYOCD.view.toolbarDialogs.settingsDialog.AddViewToWorkspace'
	],
	xtype: 'workspaceViews',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	items: [
		{
			xtype: 'panel',
			flex: 1,
			title: 'Workspace Views',
			cls: 'product-view',
			tools: [
				{
					type: 'plus',
					name: 'addViewsTool'
				}
			],
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'dataview',
					flex: 1,
					store: 'company.WorkspaceViews',
					name: 'viewTemplatesDataView',
					autoScroll: true,
					layout: 'auto',
					tpl: viewTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				}
			]
		}
	]
});