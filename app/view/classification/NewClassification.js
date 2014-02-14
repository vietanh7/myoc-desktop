Ext.define('MYOCD.view.classification.NewClassification', {
	extend: 'Ext.window.Window',
	xtype: 'newClassification',
	title: 'New Classification',
	cls: 'customWindow',
	constrainHeader: true,
	width: 300,
	height: 180,
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'center'
	},
	items: [
		{
			xtype: 'fieldset',
			defaults: {
				labelWidth: 80
			},
			defaultType: 'textfield',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'center'	
			},
			items: [
				{
					name: 'classificationId',
					hidden: true	
				},
				{
					name: 'classificationName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'classificationDesc',
					fieldLabel: 'Description'
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
				width: 140	
			},
			defaultType: 'button',
			items: [
				{
					name: 'createNewClassificationBtn',
					text: 'Create Classification'
				},
				{
					name: 'updateClassificationBtn',
					text: 'Update Classification',
					hidden: true
				}
			]
		}
	]
});