var operators = Ext.create('Ext.data.Store', {
    fields: ['name', 'value'],
    data : [
        {name: 'greater than', value: '>'},
		{name: 'less than', value: '<'},
		{name: 'equal to', value: '=='},
		{name: 'not equal to', value: '!='}
    ]
});

Ext.define('MYOCD.view.viewTemplate.NewViewTemplateWithTabs',{
	extend: 'Ext.window.Window',
	requires: [
		'Ext.grid.plugin.DragDrop',
		'MYOCD.view.viewTemplate.NewViewTemplateSelectObjectType',
		'MYOCD.view.viewTemplate.NewViewTemplateWithTabsColumns',
		'MYOCD.view.viewTemplate.NewViewTemplateWithTabsGroupBy',
		'MYOCD.view.viewTemplate.NewViewTemplateWithTabsSorting',
		'MYOCD.view.viewTemplate.NewViewTemplateWithTabsFilters',
		'MYOCD.view.viewTemplate.NewViewTemplateWithTabsAggregations'
	],
	xtype: 'newViewTemplateWithTabs',
	title: 'New View Template',
	cls: 'customWindow',
	constrainHeader: true,
	width: 900,
	height: 600,
	autoScroll: true,
    overflow: 'auto',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'center'
	},
	items: [
		{
			xtype: 'panel',
			style: 'background-color: white',
			defaults: {
				labelWidth: 80
			},
			defaultType: 'textfield',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'center'	
			},
			defaults: {
				border: false
			},
			items: [
				{
					name: 'viewLocation',
					hidden: true
				},
				{
					name: 'viewTemplateId',
					hidden: true	
				},
				{
					name: 'viewTemplateName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'viewTemplateDesc',
					fieldLabel: 'Description'
				}
			]
		},
		{
			xtype: 'tabpanel',
			name: 'newViewTemplateWithTabMainPanel',
			flex: 1,
			tabPosition: 'bottom',
			defaults: {
				border: false
			},
			items: [
				{
					title: 'Columns',
					xtype: 'newViewTemplateWithTabsColumns',

				},
				{
					xtype: 'newViewTemplateWithTabsGroupBy',
					title: 'Group by'
			
				},
				{
					xtype: 'newViewTemplateWithTabsSorting',
					title: 'Sorting'
				},
				{
					xtype: 'newViewTemplateWithTabsFilters',
					title: 'Filters'
				},
				{
					xtype: 'newViewTemplateWithTabsAggregations',
					title: 'Aggregations'
				},
				{
					xtype: 'panel',
					title: 'Settings'
				}
			]
		},
		{
			xtype: 'container',
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			defaults: {
				width: 150	
			},
			defaultType: 'button',
			items: [
				{
					name: 'createNewViewTemplateBtn',
					text: 'Create View Template'
				},
				{
					name: 'updateViewTemplateBtn',
					text: 'Update View Template',
					hidden: true
				}
			]
		}
	]
});