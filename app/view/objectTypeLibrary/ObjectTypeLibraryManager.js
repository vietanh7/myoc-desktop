var objectTypeTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/product_icon.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

var panelObjectTypeParentStore = Ext.create('Ext.data.Store',{
	fields: [
		{name: 'name'},
		{name: 'id'},
		{name: 'version'},
		{name: 'versionId'}
	]
});

var objectTypesAssociatedStore = Ext.create('Ext.data.Store', {
	fields: [
		{name: 'defaultObjectTypeId'},
		{name: 'defaultObjectTypeName'},
		{name: 'associatedName'},
		{name: 'associatedType'},
		{name: 'objectTypeId'},
		{name: 'objectTypeName'},
		{name: 'enabled'},
		{name: 'changed'}
	]
});

Ext.define('MYOCD.view.objectTypeLibrary.ObjectTypeLibraryManager', {
	extend: 'Ext.Panel',
	requires: [
		'Ext.tree.Panel',
		'Ext.view.View',
		'Ext.grid.plugin.CellEditing',
		'MYOCD.view.objectTypeLibrary.NewObjectType', 
		'MYOCD.view.objectTypeLibrary.EditObjectTypesCategory',
		'MYOCD.view.objectTypeLibrary.ObjectTypeAttributes'
	],
	xtype: 'objectTypeLibraryManager',
	title: 'Object Type Library Manager',
	layout: 'border',
	items: [
		{
			xtype: 'panel',
			style: 'background-color: white',
			margin: 3,
			height: 25,
			region: 'north',
			collapsible: false,
			layout: 'hbox',
			items: [
				{
					xtype: 'button',
					iconCls: 'back-icon',
					name: 'objectTypeLibsBackButton',
					ui: 'default-toolbar'
				}
			]	
		},
		{
			xtype: 'treepanel',
			border: false,
			style: 'background-color: white',
			tools: [
				{
					xtype: 'tool',
					type: 'plus',
					name: 'addNewObjectTypeCategoryTool'
				}
				// ,
				// {
				// 	xtype: 'tool',
				// 	type: 'gear',
				// 	name: 'objectTypeCategoryAuthorTool'
				// }
			],
			plugins: [{ptype: 'cellediting', pluginId: 'cellEditingPlugin'}],
			name: 'objectTypeCategoriesTree',
			title: 'Categories',
			region: 'west',
			collapsible: true,
			split: true,
			flex: 1,
			store: 'objectTypeLibrary.ObjectTypeCategoriesTreeStore',
			//displayField: 'name',
			hideHeaders: true,
			useArrows: true,
			//rootVisible: false,
			columns: [
				{
					xtype: 'treecolumn',
					flex: 1,
					dataIndex: 'name',
					editor: {
						xtype: 'textfield',
						emptyText: 'New Category'
					}
				}
			]
		},
		{
			xtype: 'panel',
			title: 'Object Types',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'center'
			},
			tools: [
				{
					xtype: 'tool',
					name: 'objectTypeLibraryToggleViewTool',
					cls: 'listview-icon'	
				},
				{
					xtype: 'tool',
					type: 'plus',
					name: 'addNewObjectTypeTool'
				}
				// ,
				// {
				// 	xtype: 'tool',
				// 	type: 'gear',
				// 	name: 'objectTypeAuthorTool'
				// }	
			],
			region: 'center',
			cls: 'product-view',
			flex: 3,
			items: [
				{
					xtype: 'dataview',
					flex: 1,
					name: 'objectTypesDataView',
					autoScroll: true,
					layout: 'auto',
					store: 'objectTypeLibrary.ObjectTypes',
					tpl: objectTypeTpl,
					itemSelector: 'div .thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				},
				{
					xtype: 'grid',
					border: false,
					flex: 1,
					hidden: true,
					name: 'objectTypesGrid',
					store: 'objectTypeLibrary.ObjectTypes',
					hideHeaders: true,
					columns: [
						{text: 'Image', xtype: 'templatecolumn', tpl: '<img src="./resources/images/product_icon.png" width="64" height="64">'},
						{text: 'Name', flex: 1, dataIndex: 'name', 
							xtype: 'templatecolumn', tpl: '<div><h3>{name}</h3></div><div>{description}</div>'
						}
					]
				}
			]
		},
		{
			xtype: 'panel',
			style: 'background-color: white',
			name: 'addNewObjectTypePanel',
			title: 'Add New Object Type',
			region: 'east',
			collapsible: true,
			split: true,
			collapsed: true,
			flex: 1.5,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'textfield',
					margin: 5,
					name: 'newObjectTypeName',
					fieldLabel: 'Name',
					labelWidth: 80
				},
				{
					xtype: 'textfield',
					margin: 5,
					name: 'newObjectTypeDesc',
					fieldLabel: 'Description',
					labelWidth: 80
				},
				{
					xtype: 'tabpanel',
					flex: 1,
					items: [
						{
							xtype: 'panel',
							title: 'Parents',
							flex: 1,
							layout: {
								type: 'vbox',
								align: 'stretch',
							},
							items: [
								{
									xtype: 'grid',
									flex: 1,
									border: false,
									title: 'Parents',
									tools: [
										{
											xtype: 'tool',
											type: 'plus',
											name: 'addParentTool'
										}
									],
									flex: 1,
									name: 'parentObjectTypesGrid',
									store: panelObjectTypeParentStore,
									columns: [
										{dataIndex: 'name', text: 'Name', flex: 1},
										{dataIndex: 'version', text: 'Version'},
										{
											xtype: 'actioncolumn',
											width: 40,
											items: [
												{
													icon: 'resources/images/green_delete.png',
													handler: function(grid, rowIndex, colIndex) {
														var rec = grid.getStore().getAt(rowIndex);
														grid.getStore().remove(rec);
													}
												}	
											]
										}
									]
								}
							]
						},
						{
							title: 'Associated',
							xtype: 'panel',
							layout: {
								type: 'vbox',
								align: 'stretch'
							},
							items: [
								{
									xtype: 'grid',
									flex: 1,
									name: 'associatedGrid',
									store: objectTypesAssociatedStore,
									columns: [
										{
											text: 'Enabled', dataIndex: 'enabled', xtype: 'componentcolumn', width: 65,
											renderer: function(enabled, meta, record) { 
								                return { 
								                    xtype: 'checkbox',
								                    checked: enabled,
								                    listeners: {
								                    	change: function( checkbox, newValue, oldValue, eOpts ) {
								                    		record.set('enabled', newValue);
								                    		record.commit();							                    	
								                    	}
								                    } 
								                }; 
								            }
										},
										{text: 'Type', dataIndex: 'associatedName', flex: 2},
										{text: 'Object Type', dataIndex: 'objectTypeName', flex: 1},
										{
											xtype: 'actioncolumn',
											width: 40,
											items: [
												{
													icon: 'resources/images/green_delete.png',
													handler: function(grid, rowIndex, colIndex) {
														var rec = grid.getStore().getAt(rowIndex);
														if (rec.data.changed) {
							                    			rec.set('objectTypeId', rec.data.defaultObjectTypeId);
							                    			rec.set('objectTypeName', rec.data.defaultObjectTypeName);
							                    			rec.set('changed', false);
							                    			rec.commit();
							                    		} else {
							                    			rec.set('defaultObjectTypeId', rec.data.objectTypeId);
							                    			rec.set('defaultObjectTypeName', rec.data.objectTypeName);
							                    			var selectObjectType = Ext.ComponentQuery.query('newObjectTypeSelectParent')[0];
								                    		if (selectObjectType) {
								                    			selectObjectType.destroy();
								                    		}
								                    		selectObjectType = Ext.create('MYOCD.view.objectTypeLibrary.NewObjectTypeSelectParent');
															selectObjectType.down('textfield[name="addOrUpdate"]').setValue('add');
															selectObjectType.down('textfield[name="parentOrAssociated"]').setValue(rec.data.associatedType);
															MYOCD.SharedData.currentAssociatedStore = objectTypesAssociatedStore;
															selectObjectType.show();	
							                    		}
													}
												}	
											],
											renderer: function(val, metaData, rec) {
									            if(rec.data.changed) {
									            	this.items[0].icon = 'resources/images/green_delete.png';
									            } else {
										            this.items[0].icon = 'resources/images/ellipsis_icon.png';
									            }
								            }
										}
									],
									listeners: {
										render: function() {
											this.getStore().loadRawData(MYOCD.SharedData.associatedTypes);
										}
									}
								}
							]
						}
					]
				},
				{
					xtype: 'container',
					margin: 5,
					layout: {
						type: 'hbox',
						pack: 'center'
					},
					items: [
						{
							xtype: 'button',
							text: 'Create',
							name: 'createNewObjectTypeBtn'
						}
					]
				}
			]
		}
	]
}); 