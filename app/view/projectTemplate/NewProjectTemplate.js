Ext.define('MYOCD.view.projectTemplate.NewProjectTemplate', {
	extend: 'Ext.window.Window',
	requires: [
		'MYOCD.view.projectTemplate.NewProjectTemplateSelectParent'
	],
	xtype: 'newProjectTemplate',
	title: 'New Project Template',
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
					name: 'projectTemplateId',
					hidden: true	
				},
				{
					name: 'projectTemplateName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'projectTemplateDesc',
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
							flex: 1,
							name: 'parentObjectType',
							fieldLabel: 'parent Type',
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
			defaultType: 'button',
			items: [
				{
					name: 'createNewProjectTemplateBtn',
					text: 'Create Project Template'
				},
				{
					name: 'updateProjectTemplateBtn',
					text: 'Update Project Template',
					hidden: true
				}
			]
		}
	]
});