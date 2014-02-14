Ext.define('MYOCD.view.project.SaveFeatureVersion', {
	extend: 'Ext.window.Window',
	xtype: 'saveFeatureVersion',
	title: 'Save A Version',
	modal: true,
	width: 300,
	height: 150,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	cls: 'customWindow',
	constrainHeader:true,
	items: [
		{
			xtype: 'fieldset',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'textfield',
					name: 'featureVersionName',
					fieldLabel: 'Version Name',
					labelWidth: 100
				},
			]	
		},
		{
			xtype: 'container',
			layout: 'hbox',
			items: [
				{xtype: 'tbfill'},
				{
					xtype: 'button',
					name: 'saveFeatureVersionBtn',
					text: 'Save',
					width: 100
				},
				{xtype: 'tbfill'}
			]
		}	
	]
});