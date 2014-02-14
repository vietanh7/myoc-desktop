Ext.define('MYOCD.controller.permissionLibrary.PermissionLibraryController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'newPermissionLibrary',
			selector: 'newPermissionLibrary'
		},
		{
			ref: 'permissionLibrariesTab',
			selector: 'permissionLibrariesTab'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'importPublicPermissionLibrary',
			selector: 'importPublicPermissionLibrary'
		}
	],
	init: function() {
		this.control({
			'permissionLibrariesTab': {
				show: this.onPermissionLibrariesTabShow
			},
			'permissionLibrariesTab grid[name="permissionLibrariesGrid"]': {
				render: this.onPermissionLibrariesGridRender,
				itemdblclick: this.onPermissionLibrariesGridItemDblClick,
				itemcontextmenu: this.onPermissionLibrariesGridItemContextMenu,
				edit: this.onPermissionLibrariesGridEdit
			},
			'permissionLibrariesTab grid[name="permissionLibrariesGrid"] tool[name="newPermissionLibraryTool"]': {
				click: this.onNewPermissionLibraryToolClick
			},
			'newPermissionLibrary button[name="createNewPermissionLibraryBtn"]': {
				click: this.onCreateNewPermissionLibraryBtnClick
			},
			'importPublicPermissionLibrary grid[name="publicPermissionLibsGrid"]': {
				render: this.onPublicPermissionLibsGridRender
			}
		});
	},
	onPermissionLibrariesTabShow: function() {
		var permissionLibraryStore = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
        permissionLibraryStore.loadPermissionLibraries(MYOCD.SharedData.currentCompanyId);
	},
	onPermissionLibrariesGridRender: function(grid, eOpts) {
		var rowEditingPlugin = grid.getPlugin('rowEditingPlugin');
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'celldblclick'); 
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'itemdblclick'); 	

   		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.publicPermissionLib) {
					return false;
				}
				var permissionLibraryStore = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
        		permissionLibraryStore.importPermissionLibraries(dragData.publicPermissionLib.id, grid);
	            return true;
	        }
		});
	},
	onNewPermissionLibraryToolClick: function(tool, e, eOpts) {
		var me = this;
		var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Library',
						handler: function () {
							if(me.getNewPermissionLibrary()) {
								Ext.WindowManager.bringToFront(me.getNewPermissionLibrary());
								return
							}
							var popup = Ext.create('MYOCD.view.permissionLibrary.NewPermissionLibrary');
							popup.down('textfield[name="permissionLibraryName"]').setValue(gCurrentWorkspaceName + ' Permissions Library');
							popup.show();
						}
							
					},
					{
						text: 'Import Public Library',
						handler: function() {
							if(me.getImportPublicPermissionLibrary()) {
								Ext.WindowManager.bringToFront(me.getImportPublicPermissionLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.permissionLibrary.ImportPublicPermissionLibrary');
							popup.show();	
							MYOCD.controller.permissionLibrary.RefPermissionLibraryStoreController.loadPublicPermissionLibraries('all', popup);
						}
					}
				]
			}).showAt(e.browserEvent.x, e.browserEvent.y);
		
	},
	onCreateNewPermissionLibraryBtnClick: function() {
		var libraryName = this.getNewPermissionLibrary().down('textfield[name="permissionLibraryName"]').getValue();
		var libraryDesc = this.getNewPermissionLibrary().down('textfield[name="permissionLibraryDesc"]').getValue();
		var libraryAccess = this.getNewPermissionLibrary().down('textfield[name="permissionLibraryAccess"]').getValue();
		if(libraryName.length == 0) {
			return;
		}
		this.getNewPermissionLibrary().destroy();
		var permissionStoreController = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
		permissionStoreController.addNewPermissionLib(libraryName, libraryDesc, libraryAccess, MYOCD.SharedData.currentCompanyId, this.getPermissionLibrariesTab());
	},
	onPermissionLibrariesGridItemDblClick: function( grid, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentPermissionLibId = record.get('id');
		this.getPermissionLibrariesTab().down('grid[name="permissionLibrariesGrid"]').setVisible(false);
		this.getPermissionLibrariesTab().down('permissionLibraryManager').setVisible(true);
		var permissionStoreController = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
		permissionStoreController.loadCategoriesOfPermissionsLib(record.get('id'), record.get('name'), this.getPermissionLibrariesTab());
		permissionStoreController.loadPermissionsOfPermissionLib(record.get('id'));
	},
	onPermissionLibrariesGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
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
								    var permissionStoreController = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
								    permissionStoreController.deletePermissionsLib(
								    	record.data.id,
								    	MYOCD.SharedData.currentCompanyId,  
								    	me.getPermissionLibrariesTab());
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
						popup.down('textfield[name="baseUrl"]').setValue(PERMISSION_LIBS_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	},
	onPermissionLibrariesGridEdit: function(editor, e, eOpts) {
		var permissionStoreController = MYOCD.controller.permissionLibrary.PermissionLibraryStoreController;
		permissionStoreController.editPermissionsLib(
			e.record.data.name, 
			e.record.data.description,
			e.record.data.access,
			e.record.data.id,
			MYOCD.SharedData.currentCompanyId, 
			this.getPermissionLibrariesTab());
	},
	onPublicPermissionLibsGridRender: function(grid, e, eOpts) {
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
	                    publicPermissionLib: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	}  
});