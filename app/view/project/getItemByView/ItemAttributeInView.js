Ext.define('MYOCD.view.project.getItemByView.ItemAttributeInView',{
	extend: 'Ext.window.Window',
	xtype: 'itemAttributeInView',
	requires: [
		'MYOCD.view.project.getItemByView.FeatureAttributeInView',
		'MYOCD.view.project.getItemByView.ProductItemAttributeInView'
	],
	title: 'Items\' Attributes',
	constrainHeader: true,
	cls: 'customWindow',
	style: 'background-color: white',
	width: 600,
	height: 500,
	autoScroll: true,
    overflow: 'auto',
    layout: {
    	type: 'vbox',
    	align: 'stretch'
    },
    items: [
    	{
    		xtype: 'textfield',
    		name: 'itemId',
    		hidden: true
    	},
    	{
    		xtype: 'textfield',
    		name: 'route',
    		hidden: true
    	},
    	// {
    	// 	xtype: 'featureAttributeInView',
    	// 	hidden: true
    	// },
    	// {
    	// 	xtype: 'productItemAttributeInView',
    	// 	hidden: true
    	// }
    ]
});