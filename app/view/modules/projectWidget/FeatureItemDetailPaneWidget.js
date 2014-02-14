Ext.define('MYOCD.view.modules.projectWidget.FeatureItemDetailPaneWidget',{
	extend: 'Ext.Panel',
	xtype: 'featureItemDetailPaneWidget',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	requires: [
		'MYOCD.model.project.ProjectProduct',
		'MYOCD.controller.modules.projectWidget.FeatureItemDetailController',
		'MYOCD.view.modules.projectWidget.FeatureAttributesWidget'
	],
	controllerName: 'MYOCD.controller.modules.projectWidget.FeatureItemDetailController',
	items: [
		{
			xtype: 'tabpanel',
			name: 'mainTabPanel',
			flex: 1,
			tabPosition: 'bottom',
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
											xtype: 'featureAttributesWidget',
											parentType: 'featureItemDetailPaneWidget'
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
							name: 'productPanel',
							flex: 3,
							tools: [
								{
									xtype: 'tool',
									cls: 'listview-icon',
									name: 'projectToggleViewTool'					
								},
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
	],
	listeners: {
		render: function() {
			var controller = Ext.create(this.controllerName);
			controller.mainXtype = this.parentType;
			controller.init();
		}
	}
});