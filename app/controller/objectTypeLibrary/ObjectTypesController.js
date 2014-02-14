Ext.define('MYOCD.controller.objectTypeLibrary.ObjectTypesController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'objectTypesTab',
			selector: 'objectTypesTab'
		},
		{
			ref: 'newObjectTypeLibrary',
			selector: 'newObjectTypeLibrary'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'importPublicObjectTypeLibrary',
			selector: 'importPublicObjectTypeLibrary'
		}
	],
	init: function() {
		this.control({
			'objectTypesTab': {
				show: this.onObjectTypesTabShow
			},
			'objectTypesTab grid[name="objectTypeLibrariesGrid"]': {
				render: this.onObjectTypeLirariesGridRender,
				itemdblclick: this.onObjectTypeLibrariesGridItemDblClick,
				itemcontextmenu: this.onObjectTypeLibrariesGridItemContextMenu,
				edit: this.onObjectTypeLibrariesGridEdit
			},
			'objectTypesTab grid[name="objectTypeLibrariesGrid"] tool[name="newObjectTypeLibraryTool"]': {
				click: this.onNewObjectTypeLibraryToolClick
			},
			'newObjectTypeLibrary button[name="createNewObjectTypeLibraryBtn"]': {
				click: this.onCreateNewObjectTypeLibraryBtnClick
			},
			'objectTypesTab tool[name="objectTypeLibraryAuthorTool"]': {
				click: this.onObjectTypeLibraryAuthorToolClick
			},
			'importPublicObjectTypeLibrary grid[name="publicObjectTypeLibsGrid"]': {
				render: this.onPublicObjectTypeLibsGridRender
			}
		});
	},
	onObjectTypesTabShow: function() {
		var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
        otlStoreController.loadObjectTypeLibraries(MYOCD.SharedData.currentCompanyId);
	},
	onObjectTypeLirariesGridRender: function(grid, e, eOpts) {
		var rowEditingPlugin = grid.getPlugin('rowEditingPlugin');
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'celldblclick'); 
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'itemdblclick');

   		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.publicObjectTypeLib) {
					return false;
				}
				var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
        		otlStoreController.importObjectTypeLibraries(dragData.publicObjectTypeLib.id, grid);
	            return true;
	        }
		});
	},
	onNewObjectTypeLibraryToolClick: function(tool, e, eOpts) {
		var me = this;
		var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Library',
						handler: function () {
							if(me.getNewObjectTypeLibrary()) {
								Ext.WindowManager.bringToFront(me.getNewObjectTypeLibrary());
								return
							}
							var popup = Ext.create('MYOCD.view.objectTypeLibrary.NewObjectTypeLibrary');
							popup.down('textfield[name="objectTypeLibraryName"]').setValue(gCurrentWorkspaceName + ' Object Types Library');
							popup.show();
						}
							
					},
					{
						text: 'Import Public Library',
						handler: function() {
							if(me.getImportPublicObjectTypeLibrary()) {
								Ext.WindowManager.bringToFront(me.getImportPublicObjectTypeLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.objectTypeLibrary.ImportPublicObjectTypeLibrary');
							var refObjectTypeStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController
							popup.show();
							refObjectTypeStoreController.loadPublicObjectTypeLibraries('all',popup);	
						}
					}
				]
			}).showAt(e.browserEvent.x, e.browserEvent.y);
		
	},
	onCreateNewObjectTypeLibraryBtnClick: function() {
		var libraryName = this.getNewObjectTypeLibrary().down('textfield[name="objectTypeLibraryName"]').getValue();
		var libraryDesc = this.getNewObjectTypeLibrary().down('textfield[name="objectTypeLibraryDesc"]').getValue();
		var libraryAccess = this.getNewObjectTypeLibrary().down('combobox[name="objectTypeLibraryAccess"]').getValue();
		var libraryType = this.getNewObjectTypeLibrary().down('combobox[name="objectTypeLibraryType"]').getValue();
		if(libraryName.length == 0) {
			return;
		}
		this.getNewObjectTypeLibrary().destroy();
		var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
		otlStoreController.addNewObjectTypeLib(libraryName, libraryDesc, libraryAccess, libraryType, MYOCD.SharedData.currentCompanyId, this.getObjectTypesTab());
	},
	onObjectTypeLibrariesGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		if (record.get('imported')) {
			return;
		}
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: function() {
						grid.ownerCt.getPlugin('rowEditingPlugin').startEdit(record,0);
					}
				},
				{
					text: 'Delete',
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Delete Library',
						    msg: 'Do you really want to delete this library?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
								   var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
								   otlStoreController.deleteObjectTypesLib(
								    	record.data.id,
								    	MYOCD.SharedData.currentCompanyId,  
								    	me.getObjectTypesTab());
							    }
						    }
						});
					}
				},
				'-',
				{
					text: 'Security',
					handler: function() {
						if (me.getAuthorizationDialog()) {
							me.getAuthorizationDialog().destroy();
						}
						var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
						popup.down('textfield[name="baseUrl"]').setValue(OBJECT_TYPE_LIB_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	},
	onObjectTypeLibrariesGridEdit: function(editor, e, eOpts) {
		var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
		otlStoreController.editObjectTypesLib(
			e.record.data.name, 
			e.record.data.description,
			e.record.data.access,
			e.record.data.library_type,
			e.record.data.id,
			MYOCD.SharedData.currentCompanyId, 
			this.getObjectTypesTab());
	},
	onObjectTypeLibrariesGridItemDblClick: function( grid, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentObjectTypeLibId = record.get('id');
		this.getObjectTypesTab().down('grid[name="objectTypeLibrariesGrid"]').setVisible(false);
		this.getObjectTypesTab().down('objectTypeLibraryManager').setVisible(true);
		var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
		otlStoreController.loadCategoriesOfObjectTypesLib(record.get('id'), record.get('name'), this.getObjectTypesTab());
		otlStoreController.loadObjectTypesOfObjectTypeLib(record.get('id'));	
	},
	onObjectTypeLibraryAuthorToolClick: function() {
		if (this.getAuthorizationDialog()) {
			return;
		}
		var library = this.getObjectTypesTab().down('grid[name="objectTypeLibrariesGrid"]').getSelectionModel().getSelection()[0];
		if (library) {
			var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
			popup.down('textfield[name="baseUrl"]').setValue(OBJECT_TYPE_LIB_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(library.data.id);
			popup.show(); 
		}
	},
	onPublicObjectTypeLibsGridRender: function(grid, e, eOpts) {
		grid.dragZone = new Ext.dd.DragZone(grid.getEl(), {
	        getDragData: function(e) {
	            var sourceEl = e.getTarget(grid.getView().rowSelector, 10);
	            if (sourceEl) {
	                d = sourceEl.cloneNode(true);
	                d.id = Ext.id();
	                return grid.dragData = {
	                    sourceEl: sourceEl,
	                    repairXY: Ext.fly(sourceEl).getXY(),
	                    ddel: d,
	                    publicObjectTypeLib: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	}

});
