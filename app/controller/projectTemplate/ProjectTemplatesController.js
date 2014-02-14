Ext.define('MYOCD.controller.projectTemplate.ProjectTemplatesController', {
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'newProjectTemplatesLibrary',
			selector: 'newProjectTemplatesLibrary'
		},
		{
			ref: 'projectTemplatesTab',
			selector: 'projectTemplatesTab'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'importPublicProjectTemplateLibrary',
			selector: 'importPublicProjectTemplateLibrary'
		}
	],
	init: function() {
		this.control({
			'projectTemplatesTab': {
				show: this.onProjectTemplatesTabShow
			},
			'projectTemplatesTab grid[name="projectTemplatesLibrariesGrid"]': {
				render: this.onProjectTemplatesLibrariesGridRender,
				itemdblclick: this.onProjectTemplatesLibrariesGridItemDblClick,
				itemcontextmenu: this.onProjectTemplatesLibrariesGridItemContextMenu,
				edit: this.onProjectTemplatesLibrariesGridEdit	
			},
			'projectTemplatesTab grid[name="projectTemplatesLibrariesGrid"] tool[name="newProjectTemplatesLibTool"]': {
				click: this.onNewProjectTemplatesLibToolClick
			},
			'newProjectTemplatesLibrary button[name="createNewProjectTemplatesLibBtn"]': {
				click: this.onCreateNewProjectTemplatesLibBtnClick
			},
			'importPublicProjectTemplateLibrary grid[name="publicProjectTemplateLibsGrid"]': {
				render: this.onPublicProjectTemplateLibsGridRender
			}
			
		});
	},
	onProjectTemplatesTabShow: function() {
		var projectTemplatesStore = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
     	projectTemplatesStore.loadProjectTemplatesLibs(MYOCD.SharedData.currentCompanyId);	
	},
	onProjectTemplatesLibrariesGridRender: function( grid, eOpts) {
		var rowEditingPlugin = grid.getPlugin('rowEditingPlugin');
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'celldblclick'); 
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'itemdblclick'); 

   		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.publicProjectTemplateLib) {
					return false;
				}
				var projectTemplatesStore = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
     			projectTemplatesStore.importProjectTemplateLibs(dragData.publicProjectTemplateLib.id, grid);
	            return true;
	        }
		});
		
	},
	onNewProjectTemplatesLibToolClick: function(tool, e, eOpts) {
		var me = this;
		var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Library',
						handler: function () {
							if(me.getNewProjectTemplatesLibrary()) {
								Ext.WindowManager.bringToFront(me.getNewProjectTemplatesLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.projectTemplate.NewProjectTemplatesLibrary');
							popup.down('textfield[name="projectTemplatesLibName"]').setValue(gCurrentWorkspaceName + ' Project Templates Library');
							popup.show();
						}
							
					},
					{
						text: 'Import Public Library',
						handler: function() {
							if(me.getImportPublicProjectTemplateLibrary()) {
								Ext.WindowManager.bringToFront(me.getImportPublicProjectTemplateLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.projectTemplate.ImportPublicProjectTemplateLibrary');
							popup.show();	
							MYOCD.controller.projectTemplate.RefProjectTemplatesStoreController.loadPublicProjectTemplatesLibs('all', popup);
						}
					}
				]
			}).showAt(e.browserEvent.x, e.browserEvent.y);
		
	},
	onCreateNewProjectTemplatesLibBtnClick: function() {
		var libraryName = this.getNewProjectTemplatesLibrary().down('textfield[name="projectTemplatesLibName"]').getValue();
		var libraryDesc = this.getNewProjectTemplatesLibrary().down('textfield[name="projectTemplatesLibDesc"]').getValue();
		var libraryAccess = this.getNewProjectTemplatesLibrary().down('textfield[name="projectTemplatesLibAccess"]').getValue();
		if(libraryName.length == 0) {
			return;
		}
		this.getNewProjectTemplatesLibrary().destroy();
		var ProjectTemplatesStore = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		ProjectTemplatesStore.addNewProjectTemplatesLib(libraryName, libraryDesc, libraryAccess, MYOCD.SharedData.currentCompanyId, this.getProjectTemplatesTab());
	},
	onProjectTemplatesLibrariesGridItemDblClick: function( grid, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentProjectTemplatesLibId = record.get('id');
		this.getProjectTemplatesTab().down('grid[name="projectTemplatesLibrariesGrid"]').setVisible(false);
		this.getProjectTemplatesTab().down('projectTemplatesLibraryManager').setVisible(true);
		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		projectTemplateStoreController.loadCategoriesOfProjectTemplatesLib(record.get('id'), record.get('name'), this.getProjectTemplatesTab());
		projectTemplateStoreController.loadTemplatesOfProjectTemplatesLib(record.get('id'));
	},
	onProjectTemplatesLibrariesGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
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
			        	grid.ownerCt.getPlugin('rowEditingPlugin').startEdit(record, 0);
				    }
			    },
			    {
				    text: 'Delete',
				    handler: function() {
				    	Ext.Msg.confirm({
						    title: 'Delete Library',
						    msg: 'Do you really want delete this library?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
							    	var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
							    	projectTemplateStoreController.deleteProjectTemplatesLib(record.get('id'), MYOCD.SharedData.currentCompanyId, me.getProjectTemplatesTab());
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
						popup.down('textfield[name="baseUrl"]').setValue(PROJECT_TEMPLATE_LIB_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
			    	}
			    }
			]
		}).showAt(e.xy);
	},
	onProjectTemplatesLibrariesGridEdit: function( editor, e, eOpts) {
		if(e.record.data.name.trim().length == 0) {
	    	e.cancel = true;
	    	Ext.Msg.alert('Error!', 'Require library name');
	    	e.record.reject();
	    	return false;
    	}
	    var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		projectTemplateStoreController.editProjectTemplatesLib( 
			e.record.data.id, e.record.data.name, e.record.data.description, e.record.data.access,
			MYOCD.SharedData.currentCompanyId, this.getProjectTemplatesTab());
	},
	onPublicProjectTemplateLibsGridRender: function(grid, e, eOpts) {
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
	                    publicProjectTemplateLib: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	}
});