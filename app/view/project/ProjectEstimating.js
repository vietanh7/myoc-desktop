var projectProductTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

var projectEstimatingProductAttTpl = new Ext.XTemplate (
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


Ext.define('MYOCD.view.project.ProjectEstimating',{
	extend: 'Ext.Panel',
	requires: [
		'Ext.view.View',
		'Ext.tree.Panel',
		'Ext.grid.Panel',
		'Ext.grid.plugin.CellEditing',
		'MYOCD.view.project.NewProjectFeature',
		'MYOCD.view.project.EditProjectFeature',
		'MYOCD.view.project.SaveFeatureVersion',
		'MYOCD.view.project.SaveFeatureTemplate',
		'MYOCD.view.project.NewProjectProduct',
		'MYOCD.view.project.ProjectProductDetail',
		'MYOCD.view.project.ProjectFeatureOlderVersions',
		'MYOCD.view.project.FeatureDetail',
		'MYOCD.view.project.ProjectFeatureAttributes',
		'MYOCD.view.project.ProjectAddProduct',
		'MYOCD.view.project.GetItemsByView'		
	],
	height: 533,
	xtype: 'projectEstimating',
	layout: 'border',
	items: [
		{
			xtype: 'panel',
			title: 'Features',
			split: true,
			region: 'west',
			title: 'Features',
			collapsible: true,
			collapseDirection: 'left',
			flex: 1,
			tools: [
				{
					type: 'plus',
					name: 'projectFeatureTreeAddTool',
					xtype: 'tool',
				}
				// ,
				// {
				// 	xtype: 'tool',
				// 	type: 'gear',
				// 	name: 'featureAuthorTool'
				// }
			],
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'center'
			},
			items: [
				{
					xtype: 'toolbar',
					cls: 'feature-toolbar-cls',
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
							//name: 'featureVersionCombobox',
							fieldLabel: 'Version',
							labelWidth: 70,
							store: 'project.FeatureTagVersions',
							displayField: 'tag',
							valueField: 'timestamp',
							emptyText: 'Saved versions',
							queryMode: 'local'
						},
						{
							xtype: 'button',
							name: 'projectFeatureTreeSaveTool',
							text: 'Save',
							flex: 1
						}
					]	

				},
				{
					xtype: 'treepanel',
					style: 'background-color: white',
					
					name: 'projectFeaturesTree',
					plugins: [{ptype: 'cellediting', pluginId: 'cellEditingPlugin'}],
					flex: 1,
					store: 'project.FeaturesTreeStore',
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
			region: 'center',
			style: 'background-color: #777777',
			name: 'belongFeatureTabpanel',
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
							style: 'background-color: #777777',
							title: 'Detail',
							layout: 'fit',
							items: [
								{
									xtype: 'tabpanel',
									flex: 1,
									items: [
										{
											title: 'Attributes',
											xtype: 'projectFeatureAttributes'
										},
										{
											title: 'Constraints',
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
									name: 'projectToggleViewTool'					
								},
								// {
								// 	xtype: 'tool',
								// 	type: 'gear',
								// 	name: 'projectProductAuthorTool'	
								// },
								{
									type: 'plus',
									xtype: 'tool',
									name: 'projectAddProductTool'					
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
									name: 'projectProductDataview',
									store: 'project.ProjectProducts',
									autoScroll: true,
									layout: 'auto',
									tpl: projectProductTpl,
									itemSelector: 'div .thumb-wrap',
									overItemCls: 'x-view-over',
									trackOver: true
								},
								{
									xtype: 'grid',
									flex: 1,
									hidden: true,
									name: 'projectProductGrid',
									store: 'project.ProjectProducts',
									//hideHeaders: true,
									columns: [
										{text: 'Image', xtype: 'templatecolumn', tpl: '<img src="./resources/images/product_icon.png" width="64" height="64">'},
										{text: 'Name', flex: 1, dataIndex: 'name'},
										{text: 'Quantity', xtype: 'templatecolumn', tpl: '{cost_info.quantity}', align:'center'},
										{text: 'Unit Cost', xtype: 'templatecolumn', tpl: '{cost_info.price}', align:'center'},
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