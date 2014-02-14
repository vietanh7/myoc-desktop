Ext.define('MYOCD.view.project.GetItemsByView',{
	extend: 'Ext.window.Window',
	xtype: 'getItemsByView',
	requires: [
		'MYOCD.view.project.getItemByView.ItemAttributeInView'
	],
	title: 'Features by Views',
	constrainHeader: true,
	cls: 'customWindow',
	style: 'background-color: white',
	width: 1150,
	height: 700,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	tools: [
		{
			type: 'refresh',
			name: 'refreshViewTool'
		},
		{
			type: 'gear',
			name: 'editViewTemplateTool'
		},
		{
			type: 'print',
			name: 'printViewTemplateTool'
		}
	],
	items: [
		{
			xtype: 'textfield',
			name: 'getProduct',
			hidden: true
		},
		{
			xtype: 'textfield',
			name: 'featureId',
			hidden: true
		},
		{
			xtype: 'textfield',
			name: 'projectId',
			hidden: true
		},
		{
			xtype: 'textfield',
			name: 'viewId',
			hidden: true
		},
		{
			xtype: 'container',
			name: 'mainViewItemContainer',
			autoScroll: true,
    		overflow: 'auto',
    		flex: 1,
			layout: {
				type: 'vbox',
				align: 'stretch'
			}
		}
	]
});