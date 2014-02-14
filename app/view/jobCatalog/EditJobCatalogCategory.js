Ext.define('MYOCD.view.jobCatalog.EditJobCatalogCategory', {
	extend: 'Ext.window.Window',
	xtype: 'editJobCatalogCategory',
	title: 'Edit Job Catalog Category',
	cls: 'custom-window',
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
					name: 'jobCatalogCategoryId',
					hidden: true	
				},
				{
					name: 'jobCatalogCategoryName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'jobCatalogCategoryDesc',
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
				width: 120	
			},
			defaultType: 'button',
			items: [
				{
					name: 'updateJobCatalogCategoryBtn',
					text: 'Update Category',
				}
			]
		}
	]
});