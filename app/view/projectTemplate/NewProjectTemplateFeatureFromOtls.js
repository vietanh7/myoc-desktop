var objectTypeLibTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/library_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

var objectTypeTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.projectTemplate.NewProjectTemplateFeatureFromOtls',{
	extend: 'Ext.Container',
	requires: [
		'Ext.view.View',
		'Ext.tree.Panel'
	],
	xtype: 'newProjectTemplateFeatureFromOtls',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'center'
	},
	flex: 1,
	items: [
		{
			xtype: 'panel',
			name: 'newFeatureRefOTLPanel',
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
					name: 'newFeatureRefOTLDataview',
					autoScroll: true,
					layout: 'auto',
					store: 'objectTypeLibrary.RefObjectTypeLibraries',
					tpl: objectTypeLibTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				}
			]
		},
		{
			xtype: 'panel',
			name: 'newFeatureRefOTPanel',
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
							name: 'newFeatureRefOTLBackButton',
							ui: 'default-toolbar'
						}
					]	
				},
				{
					xtype: 'treepanel',
					name: 'newFeatureRefObjectTypeCategoriesTree',
					title: 'Categories',
					region: 'west',
					collapsible: true,
					split: true,
					flex: 1,
					store: 'objectTypeLibrary.RefObjectTypeCategoriesTreeStore',
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
							name: 'newFeatureRefObjectTypesDataView',
							autoScroll: true,
							layout: 'auto',
							store: 'objectTypeLibrary.RefObjectTypes',
							tpl: objectTypeTpl,
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