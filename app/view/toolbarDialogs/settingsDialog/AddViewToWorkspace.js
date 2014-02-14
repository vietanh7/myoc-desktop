var viewLibTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/library_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

var viewTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.toolbarDialogs.settingsDialog.AddViewToWorkspace',{
	extend: 'Ext.window.Window',
	xtype: 'addViewToWorkspace',
	width: 600,
	height: 500,
	title: 'Add View to Workspace',
	constrainHeader: true,
	cls: 'customWindow',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	tools: [
		{
			type: 'plus',
			xtype: 'tool',
			name: 'addViewTemplateLibTool',
			hidden: true,
			listeners: {
				render: function() {
					this.hidden = !MYOCD.SharedData.isExportViewSetting;
				}
			}
		}
	],
	items: [
		{
			xtype: 'textfield',
			name: 'viewId',
			hidden: true
		},
		{
			xtype: 'panel',
			name: 'selectViewLibraryPanel',
			cls: 'product-view',
			flex: 1,
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'start'
			},
			items: [
				{
					xtype: 'dataview',
					flex: 1,
					name: 'refViewLibrariesDataView',
					autoScroll: true,
					layout: 'auto',
					store: 'viewTemplate.RefViewLibraries',
					tpl: viewLibTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				}
			]
		},
		{
			xtype: 'panel',
			name: 'selectRefPermissionPanel',
			hidden: true,
			flex: 1,
			layout: 'border',
			items: [
				{
					xtype: 'panel',
					style: 'background-color: white;',
					margin: 3,
					height: 25,
					region: 'north',
					collapsible: false,
					layout: 'hbox',
					items: [
						{
							xtype: 'button',
							iconCls: 'back-icon',
							name: 'refViewLibrariesBackBtn',
							ui: 'default-toolbar'
						}
					]	
				},
				{
					xtype: 'treepanel',
					style: 'background-color: white;',
					name: 'refViewCategoriesTreePanel',
					title: 'Categories',
					region: 'west',
					collapsible: true,
					split: true,
					flex: 1,
					store: 'viewTemplate.RefViewCategoriesTreeStore',
					displayField: 'name',
					hideHeaders: true,
					useArrows: true,
				},
				{
					xtype: 'panel',
					title: 'Views',
					layout: {
						type: 'vbox',
						align: 'stretch',
						pack: 'center'
					},
					region: 'center',
					cls: 'product-view',
					flex: 2.5,
					items: [
						{
							xtype: 'dataview',
							flex: 1,
							name: 'refViewDataView',
							autoScroll: true,
							layout: 'auto',
							store: 'viewTemplate.RefViewTemplates',
							tpl: viewTpl,
							itemSelector: 'div .thumb-wrap',
							overItemCls: 'x-view-over',
							trackOver: true
						}
					]
				}
			]
		},
		{
			xtype: 'panel',
			name: 'exportPanel',
			hidden: true,
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			items: [
				{
					xtype: 'button',
					text: 'Export'
				}
			]
		}
	]
});