Ext.define('MYOCD.view.project.NewProject', {
	extend: 'Ext.window.Window',
	requries: [
		'MYOCD.view.project.SelectRefProjectTemplate'
	],
	xtype: 'newProject',
	title: 'New Project',
	cls: 'customWindow',
	constrainHeader: true,
	width: 370,
	height: 210,
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'center'
	},
	items: [
		{
			xtype: 'fieldset',
			defaults: {
				labelWidth: 120
			},
			defaultType: 'textfield',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'center'	
			},
			items: [
				{
					name: 'projectId',
					hidden: true	
				},
				{
					name: 'projectName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'projectDesc',
					fieldLabel: 'Description'
				},
				{
					xtype: 'container',
					layout: {
						type: 'hbox',
					},
					items: [
						{
							xtype: 'textfield',
							name: 'projectTemplateId',
							hidden: true
						},
						{
							xtype: 'textfield',
							flex: 1,
							disabled: true,
							name: 'projectTemplateName',
							fieldLabel: 'Project Template',
							labelWidth: 120
						},
						{
							xtype: 'button',
							name: 'clearProjectTemplateBtn',
							text: 'x',
							margin: '0 2 0 2',
							hidden: true
						},
						{
							xtype: 'button',
							name: 'selectProjectTemplateBtn',
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
				width: 100	
			},
			defaultType: 'button',
			items: [
				{
					name: 'createNewProjectBtn',
					text: 'Create Project'
				},
				{
					name: 'updateProjectBtn',
					text: 'Update Project',
					hidden: true
				}
			]
		}
	]
});