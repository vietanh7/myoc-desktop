Ext.define('MYOCD.controller.roleLibrary.RoleLibraryController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'newRoleLibrary',
			selector: 'newRoleLibrary'
		},
		{
			ref: 'roleLibrariesTab',
			selector: 'roleLibrariesTab'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'importPublicRoleLibrary',
			selector: 'importPublicRoleLibrary'
		}
	],
	init: function() {
		this.control({
			'roleLibrariesTab': {
				show: this.onRoleLibrariesTabShow
			},
			'roleLibrariesTab grid[name="roleLibrariesGrid"]': {
				render: this.onRoleLibrariesGridRender,
				itemdblclick: this.onRoleLibrariesGridItemDblClick,
				itemcontextmenu: this.onRoleLibrariesGridItemContextMenu,
				edit: this.onRoleLibrariesGridEdit
			},
			'roleLibrariesTab grid[name="roleLibrariesGrid"] tool[name="newRoleLibraryTool"]': {
				click: this.onNewRoleLibraryToolClick
			},
			'newRoleLibrary button[name="createNewRoleLibraryBtn"]': {
				click: this.onCreateNewRoleLibraryBtnClick
			},
			'importPublicRoleLibrary grid[name="publicRoleLibsGrid"]': {
				render: this.onPublicRoleLibsGridRender
			}
		});
	},
	onRoleLibrariesTabShow: function() {
		var roleLibraryStore = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
        roleLibraryStore.loadRoleLibraries(MYOCD.SharedData.currentCompanyId);
	},
	onRoleLibrariesGridRender: function(grid, eOpts) {
		var rowEditingPlugin = grid.getPlugin('rowEditingPlugin');
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'celldblclick'); 
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'itemdblclick');

   		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.publicRoleLib) {
					return false;
				}
				var roleLibraryStore = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
        		roleLibraryStore.importRoleLibraries(dragData.publicRoleLib.id, grid);
	            return true;
	        }
		});
	},
	onRoleLibrariesGridItemDblClick: function( grid, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRoleLibId = record.get('id');
		this.getRoleLibrariesTab().down('grid[name="roleLibrariesGrid"]').setVisible(false);
		this.getRoleLibrariesTab().down('roleLibraryManager').setVisible(true);
		var roleStoreController = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
		roleStoreController.loadCategoriesOfRolesLib(record.get('id'), record.get('name'), this.getRoleLibrariesTab());
		roleStoreController.loadRolesOfRoleLib(record.get('id'));
	},
	onNewRoleLibraryToolClick: function(tool, e, eOpts) {
		var me = this;
		var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Library',
						handler: function () {
							if(me.getNewRoleLibrary()) {
								Ext.WindowManager.bringToFront(me.getNewRoleLibrary());
								return
							}
							var popup = Ext.create('MYOCD.view.roleLibrary.NewRoleLibrary');
							popup.down('textfield[name="roleLibraryName"]').setValue(gCurrentWorkspaceName + ' Roles Library');
							popup.show();
						}
							
					},
					{
						text: 'Import Public Library',
						handler: function() {
							if(me.getImportPublicRoleLibrary()) {
								Ext.WindowManager.bringToFront(me.getImportPublicRoleLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.roleLibrary.ImportPublicRoleLibrary');
							popup.show();	
							MYOCD.controller.roleLibrary.RefRoleLibraryStoreController.loadPublicRoleLibraries('all', popup);
						}
					}
				]
			}).showAt(e.browserEvent.x, e.browserEvent.y);
		
	},
	onCreateNewRoleLibraryBtnClick: function() {
		var libraryName = this.getNewRoleLibrary().down('textfield[name="roleLibraryName"]').getValue();
		var libraryDesc = this.getNewRoleLibrary().down('textfield[name="roleLibraryDesc"]').getValue();
		var libraryAccess = this.getNewRoleLibrary().down('textfield[name="roleLibraryAccess"]').getValue();
		if(libraryName.length == 0) {
			return;
		}
		this.getNewRoleLibrary().destroy();
		var roleStoreController = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
		roleStoreController.addNewRoleLib(libraryName, libraryDesc, libraryAccess, MYOCD.SharedData.currentCompanyId, this.getRoleLibrariesTab());
	},
	onRoleLibrariesGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
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
								   var roleStoreController = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
								   roleStoreController.deleteRolesLib(
								    	record.data.id,
								    	MYOCD.SharedData.currentCompanyId,  
								    	me.getRoleLibrariesTab());
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
						popup.down('textfield[name="baseUrl"]').setValue(ROLE_LIBS_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	},
	onRoleLibrariesGridEdit: function(editor, e, eOpts) {
		var roleStoreController = MYOCD.controller.roleLibrary.RoleLibraryStoreController;
		roleStoreController.editRolesLib(
			e.record.data.name, 
			e.record.data.description,
			e.record.data.access,
			e.record.data.id,
			MYOCD.SharedData.currentCompanyId, 
			this.getRoleLibrariesTab());
	},
	onPublicRoleLibsGridRender: function(grid, e, eOpts) {
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
	                    publicRoleLib: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	} 
});