var refCatalogItemTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/library_icon.png" ></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

var refCatalogProductItemTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.project.NewProjectProduct', {
	extend: 'Ext.window.Window',
	requires: [
		'Ext.view.View'
	],
	xtype: 'newProjectProduct',
	title: 'New Product',
	height: 600,
	width: 800,
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'center'
	},
	cls: 'customWindow',
	constrainHeader:true,
	items: [
		{
			xtype: 'panel',
			flex: 1,
			title: 'Product Catalogs',
			name: 'newProjProductRefCatalogsPanel',
			cls: 'product-view',
			items: [
				{
					xtype: 'dataview',
					flex: 1,
					autoScroll: true,
					layout: 'auto',
					name: 'newProjProductRefCatalogsDataView',
					store: 'productCatalog.RefProductCatalogs',
					tpl: refCatalogItemTpl,
					itemSelector: 'div.thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				}
			]
		},
		{
			xtype: 'container',
			name: 'newProjProductRefProductsContainer',
			flex: 1,
			hidden: true,
			layout: 'border',
			bodyBorder: false,
			defaults: {
			    collapsible: true,
			    split: true,
			},
			items: [
				{
					xtype: 'panel',
					title: 'Drag And Drop Product',
					minHeight: '12%',
					maxHeight: '12%',
					region: 'north',
					collapsible: false,
					items: [
						{
							xtype: 'button',
							text: 'Back To Referenced Libraries',
							name: 'newProjectProductBackBtn',
							ui: 'default-toolbar',
							iconCls: 'back-icon'
						},
					]	
				},
				{
					xtype: 'treepanel',
					name: 'newProjectProductRefCatalogCateTree',
					title: 'Categories',
					store: 'productCatalog.RefCatalogCateTreeStore',
					rootVisible: true,
					displayField: 'name',
					width: 300,
					height: '88%',
					region: 'west'
				},
				{
					xtype: 'panel',
					title: 'Products',
					width: 500,
					height: '88%',
					region: 'center',
					collapsible: false,
					layout: 'fit',
					cls: 'product-view',
					items: [
						{
							xtype: 'dataview',
							flex: 1,
							autoScroll: true,
							layout: 'auto',
							name: 'newProjectProductRefProductsTypeDataView',
							store: 'productCatalog.RefCatalogProducts',
							tpl: refCatalogProductItemTpl,
							itemSelector: 'div.thumb-wrap',
							overItemCls: 'x-view-over',
							trackOver: true
						}
					]
				}
			]
		}
	]
});