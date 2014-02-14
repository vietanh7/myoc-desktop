Ext.define('MYOCD.controller.classification.ClassificationsController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'classificationsTab',
			selector: 'classificationsTab'
		},
		{
			ref: 'newClassificationLibrary',
			selector: 'newClassificationLibrary'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'importPublicClassificationLibrary',
			selector: 'importPublicClassificationLibrary'
		}
	],
	init: function() {
		this.control({
			'classificationsTab': {
				show: this.onClassificationsTabShow
			},
			'classificationsTab grid[name="classificationLibrariesGrid"]': {
				render: this.onClassificationLibrariesGridRender,
				itemdblclick: this.onClassificationLibrariesGridItemDblClick,
				itemcontextmenu: this.onClassificationLibrariesGridItemContextMenu,
				edit: this.onClassificationLibrariesGridEdit	
			},
			'classificationsTab grid[name="classificationLibrariesGrid"] tool[name="newClassificationsLibTool"]': {
				click: this.onNewClassificationsLibToolClick
			},
			'newClassificationLibrary button[name="createNewClassificationLibraryBtn"]': {
				click: this.onCreateNewClassificationBtnClick
			},
			'importPublicClassificationLibrary grid[name="publicClassificationLibsGrid"]': {
				render: this.onPublicClassificationLibsGridRender
			}
		});
	},
	onClassificationsTabShow: function() {
		var classificationStore = MYOCD.controller.classification.ClassificationsStoreController;
        classificationStore.loadClassificationsLibs(MYOCD.SharedData.currentCompanyId);
	},
	onClassificationLibrariesGridRender: function(grid, eOpts) {
		var rowEditingPlugin = grid.getPlugin('rowEditingPlugin');
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'celldblclick'); 
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'itemdblclick'); 

   		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.publicClassificationLib) {
					return false;
				}
				var classificationStore = MYOCD.controller.classification.ClassificationsStoreController;
        		classificationStore.importClassificationLibraries(dragData.publicClassificationLib.id, grid);
	            return true;
	        }
		});
	},
	onNewClassificationsLibToolClick: function(tool, e, eOpst) {
		var me = this;
		var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Library',
						handler: function () {
							if(me.getNewClassificationLibrary()) {
								Ext.WindowManager.bringToFront(me.getNewClassificationLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.classification.NewClassificationLibrary');
							popup.down('textfield[name="classificationLibraryName"]').setValue(gCurrentWorkspaceName + ' Classifications Library');
							popup.show();
						}
							
					},
					{
						text: 'Import Public Library',
						handler: function() {
							if(me.getImportPublicClassificationLibrary()) {
								Ext.WindowManager.bringToFront(me.getImportPublicClassificationLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.classification.ImportPublicClassificationLibrary');
							popup.show();
							MYOCD.controller.classification.RefClassificationsStoreController.loadPublicClassificationsLibraries('all', popup);	
						}
					}
				]
			}).showAt(e.browserEvent.x, e.browserEvent.y);

		
	},
	onCreateNewClassificationBtnClick: function() {
		var libraryName = this.getNewClassificationLibrary().down('textfield[name="classificationLibraryName"]').getValue();
		var libraryDesc = this.getNewClassificationLibrary().down('textfield[name="classificationLibraryDesc"]').getValue();
		var libraryAccess = this.getNewClassificationLibrary().down('textfield[name="classificationLibraryAccess"]').getValue();
		if(libraryName.length == 0) {
			return;
		}
		this.getNewClassificationLibrary().destroy();
		var classificationStore = MYOCD.controller.classification.ClassificationsStoreController;
		classificationStore.addNewClassificationsLib(libraryName, libraryDesc, libraryAccess, MYOCD.SharedData.currentCompanyId, this.getClassificationsTab());
	},
	onClassificationLibrariesGridItemDblClick: function( grid, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentClassificationsLibId = record.get('id');
		this.getClassificationsTab().down('grid[name="classificationLibrariesGrid"]').setVisible(false);
		this.getClassificationsTab().down('classificationsLibraryManager').setVisible(true);
		var classificationStoreController = MYOCD.controller.classification.ClassificationsStoreController;
		classificationStoreController.loadCategoriesOfClassificationsLib(record.get('id'), record.get('name'), this.getClassificationsTab());
		classificationStoreController.loadClassificationsOfClassificationsLib(record.get('id'));
	},
	onClassificationLibrariesGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
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
								    var classificationStoreCtl = MYOCD.controller.classification.ClassificationsStoreController;
								    classificationStoreCtl.deleteClassificationsLib(
								    	record.data.id,
								    	MYOCD.SharedData.currentCompanyId,  
								    	me.getClassificationsTab());
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
						popup.down('textfield[name="baseUrl"]').setValue(CLASSIFICATION_LIB_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	},
	onClassificationLibrariesGridEdit: function(editor, e, eOpts) {
		var classificationStoreCtl = MYOCD.controller.classification.ClassificationsStoreController;
		classificationStoreCtl.editClassificationsLib(
			e.record.data.name, 
			e.record.data.description,
			e.record.data.access,
			e.record.data.id,
			MYOCD.SharedData.currentCompanyId, 
			this.getClassificationsTab());
	},
	onPublicClassificationLibsGridRender: function(grid, e, eOpts) {
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
	                    publicClassificationLib: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	}	
});