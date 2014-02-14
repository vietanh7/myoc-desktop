var featureTemplateLibTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/library_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

var featureTemplateTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.project.NewProjectFeatureFromTpls',{
	extend: 'Ext.Container',
	requires: [
		'Ext.view.View',
		'Ext.tree.Panel'
	],
	xtype: 'newProjectFeatureFromTpls',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'center'
	},
	flex: 1,
	items: [
		{
			xtype: 'panel',
			name: 'newFeatureRefTplPanel',
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
					name: 'newFeatureRefTplDataview',
					autoScroll: true,
					layout: 'auto',
					store: 'featureTemplate.RefFeatureTemplatesLibs',
					tpl: featureTemplateLibTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				}
			]
		},
		{
			xtype: 'panel',
			name: 'newFeatureRefFeatureTemplatePanel',
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
							name: 'newFeatureRefTPLBackButton',
							ui: 'default-toolbar'
						}
					]	
				},
				{
					xtype: 'treepanel',
					name: 'newFeatureRefFeatureTemplateCategoriesTree',
					title: 'Categories',
					region: 'west',
					collapsible: true,
					split: true,
					flex: 1,
					store: 'featureTemplate.RefFeatureTemplatesCategoriesTreeStore',
					displayField: 'name',
					hideHeaders: true,
					useArrows: true
				},
				{
					xtype: 'panel',
					title: 'Feature Template',
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
							name: 'newFeatureRefFeatureTemplatesDataView',
							autoScroll: true,
							layout: 'auto',
							store: 'featureTemplate.RefFeatureTemplates',
							tpl: featureTemplateTpl,
							itemSelector: 'div .thumb-wrap',
							overItemCls: 'x-view-over',
							trackOver: true
						}
					]
				}
			]
		}
	]
});