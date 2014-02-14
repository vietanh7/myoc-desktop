Ext.define('MYOCD.controller.jobCatalog.JobCatalogsController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'jobCatalogsTab',
			selector: 'jobCatalogsTab'
		},
		{
			ref: 'newJobCatalogsLibrary',
			selector: 'newJobCatalogsLibrary'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'importPublicJobCatalogLibrary',
			selector: 'importPublicJobCatalogLibrary'
		}
	],
	init: function() {
		this.control({
			'jobCatalogsTab': {
				show: this.onJobCatalogsTabShow
			},
			'jobCatalogsTab grid[name="jobCatalogLibrariesGrid"]': {
				render: this.onJobCatalogLibrariesGridRender,
				itemdblclick: this.onJobCatalogLibrariesGridItemDblClick,
				itemcontextmenu: this.onJobCatalogLibrariesGridItemContextMenu,
				edit: this.onJobCatalogLibrariesGridEdit	
			},
			'jobCatalogsTab grid[name="jobCatalogLibrariesGrid"] tool[name="newJobCatalogsLibTool"]': {
				click: this.onNewJobCatalogsLibToolClick
			},
			'newJobCatalogsLibrary button[name="createNewJobCatalogLibraryBtn"]': {
				click: this.onCreateNewJobCatalogLibraryBtnClick
			},
			'importPublicJobCatalogLibrary grid[name="publicJobCatalogLibsGrid"]': {
				render: this.onPublicJobCatalogLibsGridRender
			}
		});
	},
	onJobCatalogsTabShow: function() {
		var jobCatalogStore = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
        jobCatalogStore.loadJobCatalogsLibs(MYOCD.SharedData.currentCompanyId);
	},
	onJobCatalogLibrariesGridRender: function(grid, eOpts) {
		var rowEditingPlugin = grid.getPlugin('rowEditingPlugin');
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'celldblclick'); 
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'itemdblclick');

   		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.publicJobCatalogLib) {
					return false;
				}
				var jobCatalogStore = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
       			jobCatalogStore.importJobCatalogLibraries(dragData.publicJobCatalogLib.id, grid);
	            return true;
	        }
		});

	},
	onNewJobCatalogsLibToolClick: function(tool, e, eOpts) {
		var me = this;
		var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Library',
						handler: function () {
							if(me.getNewJobCatalogsLibrary()) {
								Ext.WindowManager.bringToFront(me.getNewJobCatalogsLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.jobCatalog.NewJobCatalogsLibrary');
							popup.down('textfield[name="jobCatalogLibraryName"]').setValue(gCurrentWorkspaceName + ' Job Catalogs Library');
							popup.show();
						}
					},
					{
						text: 'Import Public Library',
						handler: function() {
							if(me.getImportPublicJobCatalogLibrary()) {
								Ext.WindowManager.bringToFront(me.getImportPublicJobCatalogLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.jobCatalog.ImportPublicJobCatalogLibrary');
							popup.show();
							MYOCD.controller.jobCatalog.RefJobCatalogsStoreController.loadPublicJobCatalogsLibraries('all', popup);	
						}
					}
				]
			}).showAt(e.browserEvent.x, e.browserEvent.y);
	},
	onCreateNewJobCatalogLibraryBtnClick: function() {
		var libraryName = this.getNewJobCatalogsLibrary().down('textfield[name="jobCatalogLibraryName"]').getValue();
		var libraryDesc = this.getNewJobCatalogsLibrary().down('textfield[name="jobCatalogLibraryDesc"]').getValue();
		var libraryAccess = this.getNewJobCatalogsLibrary().down('textfield[name="jobCatalogLibraryAccess"]').getValue();
		if(libraryName.length == 0) {
			return;
		}
		this.getNewJobCatalogsLibrary().destroy();
		var JobCatalogStore = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
		JobCatalogStore.addNewJobCatalogsLib(libraryName, libraryDesc, libraryAccess, MYOCD.SharedData.currentCompanyId, this.getJobCatalogsTab());
	},
	onJobCatalogLibrariesGridItemDblClick: function( grid, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentJobCatalogLibId = record.get('id');
		this.getJobCatalogsTab().down('grid[name="jobCatalogLibrariesGrid"]').setVisible(false);
		this.getJobCatalogsTab().down('jobCatalogsLibManager').setVisible(true);
		var jobCatalogStore = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
		jobCatalogStore.loadCategoriesOfJobCatalogsLib(record.get('id'), record.get('name'), this.getJobCatalogsTab());
		jobCatalogStore.loadJobsOfJobCatalogsLib(record.get('id'));
	},
	onJobCatalogLibrariesGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
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
								   var jobCatalogStore = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
								   jobCatalogStore.deleteJobCatalogsLib(
								    	record.data.id,
								    	MYOCD.SharedData.currentCompanyId,  
								    	me.getJobCatalogsTab());
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
						popup.down('textfield[name="baseUrl"]').setValue(JOB_CATALOG_LIB_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	},
	onJobCatalogLibrariesGridEdit: function(editor, e, eOpts) {
		var jobCatalogStore = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
		jobCatalogStore.editJobCatalogsLib(
			e.record.data.name, 
			e.record.data.description,
			e.record.data.access,
			e.record.data.id,
			MYOCD.SharedData.currentCompanyId, 
			this.getJobCatalogsTab());
	},
	onJobCatalogsLibAuthorToolClick: function() {
		if (this.getAuthorizationDialog()) {
			return;
		}
		var library = this.getJobCatalogsTab().down('grid[name="jobCatalogLibrariesGrid"]').getSelectionModel().getSelection()[0];
		if (library) {
			var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
			popup.down('textfield[name="baseUrl"]').setValue(JOB_CATALOG_LIB_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(library.data.id);
			popup.show(); 
		}
	},
	onPublicJobCatalogLibsGridRender: function(grid, e, eOpts) {
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
	                    publicJobCatalogLib: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	}  	
});