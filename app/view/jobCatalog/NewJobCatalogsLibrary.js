var jobCatalogLibAccess = Ext.create('Ext.data.Store', {
	fields: ['name', 'value'],
	data: [
		{name: 'Public', value: 'Public'},
		{name: 'Protected', value: 'Protected'},
		{name: 'Private', value: 'Private'}
	]
});

Ext.define('MYOCD.view.jobCatalog.NewJobCatalogsLibrary', {
	extend: 'Ext.window.Window',
	xtype: 'newJobCatalogsLibrary',
	title: 'New Job Catalog Library',
	cls: 'customWindow',
	constrainHeader: true,
	width: 320,
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
					name: 'jobCatalogLibraryId',
					hidden: true	
				},
				{
					name: 'jobCatalogLibraryName',
					fieldLabel: 'Name',
					allowBlank: false,
					listeners: {
						blur: function() {
							this.setValue(this.getValue().trim());
						}
					}
				},
				{
					name: 'jobCatalogLibraryDesc',
					fieldLabel: 'Description'
				},
				{
					xtype: 'combobox',
					name: 'jobCatalogLibraryAccess',
					store: jobCatalogLibAccess,
					queryMode: 'local',
					displayField: 'name',
					valueField: 'value',
					fieldLabel: 'Access',
					value: 'Public'
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
					name: 'createNewJobCatalogLibraryBtn',
					text: 'Create Library'
				},
				{
					name: 'updateJobCatalogLibraryBtn',
					text: 'Update Library',
					hidden: true
				}
			]
		}
	]
});