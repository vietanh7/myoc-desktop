var featureVersionProduct = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.project.ProjectFeatureOlderVersions',{
	extend: 'Ext.window.Window',
	xtype: 'projectFeatureOlderVersions',
	width: 800,
	height: 400,
	title: 'Feature Older Versions',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	cls: 'customWindow',
	constrainHeader:true,
	items: [
		{
			xtype: 'textfield',
			name: 'versionFeatureName',
			hidden: true	
		},
		{
			xtype: 'textfield',
			name: 'versionFeatureId',
			hidden: true	
		},
		{
			xtype: 'toolbar',
			layout: 'hbox',
			items: [
				{
					xtype: 'combobox',
					name: 'featureVersionCombobox',
					fieldLabel: 'Versions',
					labelWidth: 70,
					store: 'project.FeatureTagVersions',
					displayField: 'tag',
					valueField: 'timestamp',
					emptyText: 'Select a version',
					queryMode: 'local'
				}
			]
		},
		{
			xtype: 'container',
			flex: 1,
			layout: 'border',
			bodyBorder: false,
			defaults: {
			    collapsible: true,
			    split: true,
			},
			items: [
				{
					xtype: 'treepanel',
					name: 'featureVersionTree',
					title: 'Features',
					store: 'project.FeaturesVersionTreeStore',
					rootVisible: true,
					displayField: 'feature_name',
					width: 300,
					height: '100%',
					region: 'west'
				},
				{
					xtype: 'panel',
					title: 'Products',
					width: 500,
					height: '100%',
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
							name: 'featureVersionProductDataview',
							store: 'project.FeatureVersionProducts',
							tpl: featureVersionProduct,
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