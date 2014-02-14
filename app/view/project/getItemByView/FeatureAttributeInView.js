Ext.define('MYOCD.view.project.getItemByView.FeatureAttributeInView',{
	extend: 'Ext.panel.Panel',
	xtype: 'featureAttributeInView',
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
	items: [
		{
			xtype: 'container',
			flex: 3,
			region: 'center',
			autoScroll: true,
			overflow: 'auto',
			layout: {
				type: 'hbox',
				align: 'stretch',
				pack: 'center'
			},
			items: [
				{
					xtype: 'grid',
					border: false,
					flex: 1,
					minWidth: 400,
					// plugins:[
					// 	{
					// 		ptype: 'rowediting', pluginId: 'rowEditingPlugin'
					// 	}
					// ],
					name: 'featureOwnedAttributesGrid',
					store: 'project.FeatureAttributesInView',
					columns: [
						{text: 'Name', flex: 1.5, dataIndex: 'name', editor: 'textfield',
							xtype: 'templatecolumn',
							tpl: '<tpl if="isInherited || constant"><font color="gray">{name}</font><tpl else>{name}</tpl>'
						},
						{text: 'Value', flex: 2, dataIndex: 'value', editor: 'textfield',
							xtype: 'templatecolumn',
							tpl: '<tpl if="isInherited || constant"><font color="gray">{value}</font><tpl else>{value}</tpl>'
						}
					]
				}
			]
		}
	]
});