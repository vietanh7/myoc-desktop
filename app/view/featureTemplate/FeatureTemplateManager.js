var featureTemplateProductTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

var featureTemplateEstimatingProductAttTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="attribute">',
			'<div class="label" style="float: left; width : 20%">{name}:</div>',
			'<tpl if="value!==null || value.lenght!==0">',
				'<div class="value"><font size="3">{value}</font></div>',
			'<tpl else>',
				'<div class="value"><font size="3">No Value</font></div>',
			'</tpl>',
		'</div>',
	'</tpl>'
);


Ext.define('MYOCD.view.featureTemplate.FeatureTemplateManager',{
	extend: 'Ext.Panel',
	requires: [
		'Ext.view.View',
		'Ext.tree.Panel',
		'Ext.grid.Panel',
		'Ext.grid.plugin.CellEditing',
		'MYOCD.view.featureTemplate.FeatureAttributes',
		'MYOCD.view.featureTemplate.NewFeature',
		'MYOCD.view.featureTemplate.FeatureTemplateAddProduct',
		'MYOCD.view.featureTemplate.FeatureTemplateProductItemAttributes'	
	],
	title: 'Feature Template Manager',
	xtype: 'featureTemplateManager',
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
					name: 'featureTemplatesBackButton',
					ui: 'default-toolbar'
				}
			]	
		},
		{
			xtype: 'panel',
			title: 'Features',
			split: true,
			region: 'west',
			title: 'Features',
			collapsible: true,
			collapseDirection: 'left',
			flex: 1.5,
			tools: [
				{
					type: 'plus',
					name: 'featureTemplateFeatureTreeAddTool',
					xtype: 'tool'
				}
			],
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'center'
			},
			items: [
				{
					xtype: 'panel',
					border: false,
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'tbspacer',
							width: 10	
						},
						{
							xtype: 'combobox',
							fieldLabel: 'Version',
							labelWidth: 70,
							displayField: 'tag',
							valueField: 'timestamp',
							emptyText: 'Saved versions',
							queryMode: 'local'
						},
						{
							xtype: 'button',
							text: 'Save',
							flex: 1,
							ui: 'default-toolbar'
						}
					]	

				},
				{
					xtype: 'treepanel',
					name: 'featureTemplateFeatureTree',
					store: 'featureTemplate.FeatureTemplateFeatureTreeStore',
					plugins: [{ptype: 'cellediting', pluginId: 'cellEditingPlugin'}],
					flex: 1,
					useArrows: true,
					hideHeaders: true,
					columns: [
						{
							xtype: 'treecolumn',
							flex: 1,
							dataIndex: 'name',
							editor: 'textfield'
						}
					]
				}
			]			
		},
		{
			xtype: 'tabpanel',
			border: false,
			cls: 'custom-tab-bar-background',
			region: 'center',
			tabPosition: 'bottom',
			flex: 3,
			layout: 'fit',
			items: [
				{
					title: 'Feature',
					xtype: 'container',
					layout: 'fit',
					items: [
						{
							xtype: 'panel',
							title: 'Detail',
							layout: 'fit',
							items: [
								{
									xtype: 'tabpanel',
									cls: 'custom-tab-bar-background',
									border: false,
									flex: 1,
									items: [
										{
											title: 'Attributes',
											xtype: 'featureAttributes'
										},
										{
											title: 'Constraints'
										}
									]
								}
							]
						}
					]	
				},
				{
					title: 'Products',
					xtype: 'container',
					layout: {
						type: 'vbox',
						align: 'stretch',
					},
					items: [
						{
							xtype: 'panel',
							flex: 3,
							tools: [
								{
									xtype: 'tool',
									cls: 'listview-icon',
									name: 'featureTemplateToggleViewTool'					
								},
								{
									type: 'plus',
									xtype: 'tool',
									name: 'featureTemplateAddProductTool'					
								}
							],
							cls: 'product-view',
							title: 'Products',
							layout: 'fit',
							items: [
								{
									xtype: 'dataview',
									flex: 1,
									title: 'Products',
									name: 'featureTemplateProductDataview',
									store: 'featureTemplate.Products',
									autoScroll: true,
									layout: 'auto',
									tpl: featureTemplateProductTpl,
									itemSelector: 'div .thumb-wrap',
									overItemCls: 'x-view-over',
									trackOver: true
								},
								{
									xtype: 'grid',
									flex: 1,
									hidden: true,
									name: 'featureTemplateProductGrid',
									store: 'featureTemplate.Products',
									//hideHeaders: true,
									columns: [
										{text: 'Image', xtype: 'templatecolumn', tpl: '<img src="./resources/images/product_icon.png" width="64" height="64">'},
										{text: 'Name', flex: 1, dataIndex: 'name'},
										{text: 'Quantity'},
										{text: 'Unit Cost'},
										{text: 'Discount'},
										{text: 'Markup'},
										{text: 'Extended Cost'}
									]
								}
							]
						}
					]
				},
				{
					title: 'Jobs',
					xtype: 'container',
					items: [
						{
							xtype: 'panel',
							title: 'Jobs',
							tools: [
								{
									type: 'plus',
									xtype: 'tool'
								}
							],
						}
					]
				},
				{
					title: 'Tools',
					xtype: 'container',
					items: [
						{
							xtype: 'panel',
							title: 'Tools',
							tools: [
								{
									type: 'plus',
									xtype: 'tool'
								}
							]
						}
					]
				}
			]
		}
	]
});