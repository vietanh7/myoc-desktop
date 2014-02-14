Ext.define('MYOCD.controller.viewTemplate.ViewLibraryController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'newViewLibrary',
			selector: 'newViewLibrary'
		},
		{
			ref: 'viewLibrariesTab',
			selector: 'viewLibrariesTab'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'importPublicViewTemplateLibrary',
			selector: 'importPublicViewTemplateLibrary'
		}
	],
	init: function() {
		this.control({
			'viewLibrariesTab': {
				show: this.onViewLibrariesTabShow
			},
			'viewLibrariesTab grid[name="viewLibrariesGrid"]': {
				render: this.onViewLibrariesGridRender,
				itemdblclick: this.onViewLibrariesGridItemDblClick,
				itemcontextmenu: this.onViewLibrariesGridItemContextMenu,
				edit: this.onViewLibrariesGridEdit
			},
			'viewLibrariesTab grid[name="viewLibrariesGrid"] tool[name="newViewLibraryTool"]': {
				click: this.onNewViewLibraryToolClick
			},
			'newViewLibrary button[name="createNewViewLibraryBtn"]': {
				click: this.onCreateNewViewLibraryBtnClick
			},
			'importPublicViewTemplateLibrary grid[name="publicViewTemplateLibsGrid"]': {
				render: this.onPublicViewTemplateLibsGridRender
			}
		});
	},
	onViewLibrariesTabShow: function() {
		var viewLibraryStore = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
     	viewLibraryStore.loadViewLibraries(MYOCD.SharedData.currentCompanyId);	
	},
	onViewLibrariesGridRender: function(grid, eOpts) {
		var rowEditingPlugin = grid.getPlugin('rowEditingPlugin');
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'celldblclick'); 
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'itemdblclick'); 	

   		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.publicViewTemplatesLib) {
					return false;
				}
				var viewLibraryStore = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
     			viewLibraryStore.importViewLibraries(dragData.publicViewTemplatesLib.id, grid);
	            return true;
	        }
		});
	},
	onNewViewLibraryToolClick: function(tool, e, eOpts) {
		var me = this;
		var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Library',
						handler: function () {
							if(me.getNewViewLibrary()) {
								Ext.WindowManager.bringToFront(me.getNewViewLibrary());
								return
							}
							var popup = Ext.create('MYOCD.view.viewTemplate.NewViewLibrary');
							popup.down('textfield[name="viewLibraryName"]').setValue(gCurrentWorkspaceName + ' Views Library');
							popup.show();
						}
							
					},
					{
						text: 'Import Public Library',
						handler: function() {
							if(me.getImportPublicViewTemplateLibrary()) {
								Ext.WindowManager.bringToFront(me.getImportPublicViewTemplateLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.viewTemplate.ImportPublicViewTemplateLibrary');
							popup.show();	
							MYOCD.controller.viewTemplate.RefViewLibraryStoreController.loadPublicViewLibraries('all', popup);
						}
					}
				]
			}).showAt(e.browserEvent.x, e.browserEvent.y);

		
	},
	onCreateNewViewLibraryBtnClick: function() {
		var libraryName = this.getNewViewLibrary().down('textfield[name="viewLibraryName"]').getValue();
		var libraryDesc = this.getNewViewLibrary().down('textfield[name="viewLibraryDesc"]').getValue();
		var libraryAccess = this.getNewViewLibrary().down('textfield[name="viewLibraryAccess"]').getValue();
		if(libraryName.length == 0) {
			return;
		}
		this.getNewViewLibrary().destroy();
		var viewStoreController = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
		viewStoreController.addNewViewLib(libraryName, libraryDesc, libraryAccess, MYOCD.SharedData.currentCompanyId, this.getViewLibrariesTab());
	},
	onViewLibrariesGridItemDblClick: function( grid, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentViewLibId = record.get('id');
		this.getViewLibrariesTab().down('grid[name="viewLibrariesGrid"]').setVisible(false);
		this.getViewLibrariesTab().down('viewLibraryManager').setVisible(true);
		var viewStoreController = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
		viewStoreController.loadCategoriesOfViewsLib(record.get('id'), record.get('name'), this.getViewLibrariesTab());
		viewStoreController.loadViewTemplatesOfViewLib(record.get('id'));
	},
	onViewLibrariesGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
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
								    var viewStoreController = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
								    viewStoreController.deleteViewsLib(
								    	record.data.id,
								    	MYOCD.SharedData.currentCompanyId,  
								    	me.getViewLibrariesTab());
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
						popup.down('textfield[name="baseUrl"]').setValue(VIEW_LIB_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	},
	onViewLibrariesGridEdit: function(editor, e, eOpts) {
		var viewStoreController = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
		viewStoreController.editViewsLib(
			e.record.data.name, 
			e.record.data.description,
			e.record.data.access,
			e.record.data.id,
			MYOCD.SharedData.currentCompanyId, 
			this.getViewLibrariesTab());
	},
	onPublicViewTemplateLibsGridRender: function(grid, e, eOpts) {
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
	                    publicViewTemplatesLib: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	} 
});