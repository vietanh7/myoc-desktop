var productCatalogLibTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/library_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

var productTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.featureTemplate.FeatureTemplateAddProductSelectParent',{
	extend: 'Ext.window.Window',
	xtype: 'featureTemplateAddProductSelectParent',
	width: 800,
	height: 500,
	title: 'Select Product',
	cls: 'customWindow',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
	items: [
		{
			xtype: 'panel',
			name: 'addProductRefProductCatalogPanel',
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
					name: 'addProductRefProductCatalogDataView',
					autoScroll: true,
					layout: 'auto',
					store: 'productCatalog.RefProductCatalogLibs',
					tpl: productCatalogLibTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				}
			]
		},
		{
			xtype: 'panel',
			name: 'addProductRefProductPanel',
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
							name: 'addProductBackBtn',
							ui: 'default-toolbar'
						}
					]	
				},
				{
					xtype: 'treepanel',
					name: 'addProductRefProductCategoriesTree',
					title: 'Categories',
					region: 'west',
					collapsible: true,
					split: true,
					flex: 1,
					store: 'productCatalog.RefProductCatalogsCategoriesTreeStore',
					displayField: 'name',
					hideHeaders: true,
					useArrows: true,
				},
				{
					xtype: 'panel',
					title: 'Product',
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
							name: 'addProductRefProductDataView',
							autoScroll: true,
							layout: 'auto',
							store: 'productCatalog.RefProducts',
							tpl: productTpl,
							itemSelector: 'div .thumb-wrap',
							overItemCls: 'x-view-over',
							trackOver: true
						}
					]
				}/*
,
				{
					xtype: 'grid',
					name: 'newOTRefOTVersionGrid',
					flex: 1,
					title: 'Object Type Versions',
					region: 'east',
					collapsible: true,
					collapsed: true,
					store: 'objectTypeLibrary.RefObjectTypeVersions',
					columns: [
						{
							xtype: 'actioncolumn',
							width: 40,
							items: [
								{
									icon: 'resources/images/green_check.png',
								}	
							],
							renderer: function(val, metaData, rec) {
					            if(!rec.data.selected) {
						            this.items[0].icon = '';
					            } else {
						            this.items[0].icon = 'resources/images/green_check.png';
					            }
				            }
						},
						{text: 'Name', flex: 1, dataIndex: 'name'}
					]
				}
*/
			]
		},
		{
			xtype: 'container',
			hidden: true,
			margin: '5 0 0 0',
			height: 30,
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			items: [
				{
					xtype: 'button',
					name: 'addProductAcceptParentBtn',
					text: 'OK',
					width: 80
				}
			]
		}
	]
});