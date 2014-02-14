Ext.define('MYOCD.view.jobCatalog.NewJob', {
	extend: 'Ext.window.Window',
	xtype: 'newJob',
	title: 'New Job',
	cls: 'customWindow',
	constrainHeader: true,
	width: 400,
	height: 200,
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'center'
	},
	items: [
		{
			xtype: 'fieldset',
			defaults: {
				labelWidth: 100
			},
			defaultType: 'textfield',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'center'	
			},
			items: [
				{
					name: 'jobId',
					hidden: true	
				},
				{
					name: 'jobName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'jobDesc',
					fieldLabel: 'Description'
				},
				{
					xtype: 'container',
					width: '100%',
					layout: {
						type: 'hbox',
						pack: 'center'
					},
					items: [
						{
							xtype: 'textfield',
							name: 'parentObjectTypeId',
							hidden: true	
						},
						{
							xtype: 'textfield',
							name: 'parentObjectTypeVersion',
							hidden: true	
						},
						{
							xtype: 'textfield',
							flex: 1,
							name: 'parentObjectType',
							fieldLabel: 'Object Type',
							labelWidth: 100,
							disabled: true
						},
						{
							xtype: 'button',
							name: 'clearOTParentBtn',
							text: 'x',
							margin: '0 2 0 2',
							hidden: true
						},
						{
							xtype: 'button',
							name: 'selectOTParentBtn',
							text: '...',
							margin: '0 2 0 2',
						}
					]
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
				width: 120	
			},
			defaultType: 'button',
			items: [
				{
					name: 'createNewJobBtn',
					text: 'Create Job'
				},
				{
					name: 'updateJobBtn',
					text: 'Update Job',
					hidden: true
				}
			]
		}
	]
});