var refProjectTemplateLibTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/library_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

var refProjectTemplateTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.project.SelectRefProjectTemplate', {
	extend: 'Ext.window.Window',
	xtype: 'selectRefProjectTemplate',
	width: 600,
	height: 500,
	title: 'Select Project Template',
	cls: 'customWindow',
	constrainHeader: true,
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
	items: [
		{
			xtype: 'panel',
			name: 'projectTemplateLibrariesPanel',
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
					name: 'projectTemplateLibrariesDataView',
					autoScroll: true,
					layout: 'auto',
					store: 'projectTemplate.RefProjectTemplatesLibs',
					tpl: refProjectTemplateLibTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				}
			]
		},
		{
			xtype: 'panel',
			name: 'projectTemplatePanel',
			hidden: true,
			flex: 1,
			layout: 'border',
			items: [
				{
					xtype: 'panel',
					margin: 3,
					height: 25,
					region: 'north',
					collapsible: false,
					layout: 'hbox',
					items: [
						{
							xtype: 'button',
							iconCls: 'back-icon',
							name: 'projectTemplateBackBtn',
							ui: 'default-toolbar'
						}
					]	
				},
				{
					xtype: 'treepanel',
					name: 'projectTemplateCategoriesTree',
					title: 'Categories',
					region: 'west',
					collapsible: true,
					split: true,
					flex: 1,
					store: 'projectTemplate.RefProjectTemplatesCategoriesTreeStore',
					displayField: 'name',
					hideHeaders: true,
					useArrows: true,
				},
				{
					xtype: 'panel',
					title: 'Project Templates',
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
							name: 'refProjectTemplatesDataView',
							autoScroll: true,
							layout: 'auto',
							store: 'projectTemplate.RefProjectTemplates',
							tpl: refProjectTemplateTpl,
							itemSelector: 'div .thumb-wrap',
							overItemCls: 'x-view-over',
							trackOver: true
						}
					]
				}
			]
		},
		{
			xtype: 'container',
			margin: '5 0 0 0',
			height: 30,
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			items: [
				{
					xtype: 'button',
					name: 'acceptProjectTemplateBtn',
					text: 'OK',
					width: 80
				}
			]
		}
	]
});