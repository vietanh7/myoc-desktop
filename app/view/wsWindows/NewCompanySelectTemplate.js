var companyTemplateLibTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/library_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

var templateTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.wsWindows.NewCompanySelectTemplate',{
	extend: 'Ext.window.Window',
	xtype: 'newCompanySelectTemplate',
	width: 600,
	height: 500,
	title: 'Select Company Template',
	cls: 'customWindow',
	constrainsHeader: true,
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
	items: [
		{
			xtype: 'panel',
			name: 'newCompanyRefComTempLibPanel',
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
					name: 'newCompanyRefComTempLibDataview',
					autoScroll: true,
					layout: 'auto',
					store: 'companyTemplate.RefCompanyTemplatesLibs',
					tpl: companyTemplateLibTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				}
			]
		},
		{
			xtype: 'panel',
			name: 'newCompanyRefCompanyTemplatePanel',
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
							name: 'newCompanyRefComTempLibBackButton',
							ui: 'default-toolbar'
						}
					]	
				},
				{
					xtype: 'treepanel',
					name: 'newCompanyRefComTempCategoriesTree',
					title: 'Categories',
					region: 'west',
					collapsible: true,
					split: true,
					flex: 1,
					store: 'companyTemplate.RefCompanyTemplatesCategoriesTreeStore',
					displayField: 'name',
					hideHeaders: true,
					useArrows: true,
				},
				{
					xtype: 'panel',
					title: 'Object Types',
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
							name: 'newCompanyRefComTemplatesDataView',
							autoScroll: true,
							layout: 'auto',
							store: 'companyTemplate.RefCompanyTemplates',
							tpl: templateTpl,
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
					name: 'newCompanyAcceptParentBtn',
					text: 'OK',
					width: 80
				}
			]
		}
	]
});