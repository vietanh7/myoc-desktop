Ext.define('MYOCD.controller.communityTemplate.CommunityTemplatesController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'communityTemplatesTab',
			selector: 'communityTemplatesTab'
		},
		{
			ref: 'newCommnunityTemplateLibrary',
			selector: 'newCommnunityTemplateLibrary'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'importPublicCommunityTemplateLibrary',
			selector: 'importPublicCommunityTemplateLibrary'
		}
	],
	init: function() {
		this.control({
			'communityTemplatesTab' : {
				show: this.onCommunityTemplatesTabShow
			},
			'communityTemplatesTab grid[name="communityTemplateLibsGrid"]': {
				render: this.onCommunityTemplateLibsGridRender,
				itemdblclick: this.onClassificationLibrariesGridItemDblClick,
				itemcontextmenu: this.onCommunityTemplateLibsGridItemContextMenu,
				edit: this.onCommunityTemplateLibsGridEdit		
			},
			'communityTemplatesTab grid[name="communityTemplateLibsGrid"] tool[name="newCommunityTemplateLibTool"]': {
				click: this.onNewCommunityTemplateLibToolClick
			},
			'newCommnunityTemplateLibrary button[name="createNewCommunityTemplatesLibBtn"]': {
				click: this.onCreateNewCommunityTemplatesLibBtnClick
			},
			'importPublicCommunityTemplateLibrary grid[name="publicCommunityTemplateLibsGrid"]': {
				render: this.onPublicCommunityTemplateLibsGridRender
			}
		});
	},
	onCommunityTemplatesTabShow: function() {
		var communityTemplateStore = MYOCD.controller.communityTemplate.CommunityTemplatesStoreController;
        communityTemplateStore.loadCommunityTemplateLibs( MYOCD.SharedData.currentCompanyId);
	},
	onCommunityTemplateLibsGridRender: function(grid, eOpts) {
		var rowEditingPlugin = grid.getPlugin('rowEditingPlugin');
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'celldblclick'); 
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'itemdblclick'); 

   		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.publicCommunityTemplateLib) {
					return false;
				}
				var communityTemplateStore = MYOCD.controller.communityTemplate.CommunityTemplatesStoreController;
        		communityTemplateStore.importCommunityTemplateLibraries(dragData.publicCommunityTemplateLib.id, grid);
	            return true;
	        }
		});
	},
	onNewCommunityTemplateLibToolClick: function(tool, e, eOpts) {
		var me = this;
		var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Library',
						handler: function () {
							if(me.getNewCommnunityTemplateLibrary()) {
								Ext.WindowManager.bringToFront(me.getNewCommnunityTemplateLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.communityTemplate.NewCommnunityTemplateLibrary');
							popup.down('textfield[name="communityTemplatesLibName"]').setValue(gCurrentWorkspaceName+ ' Community Templates Library');
							popup.show();
						}
							
					},
					{
						text: 'Import Public Library',
						handler: function() {
							if(me.getImportPublicCommunityTemplateLibrary()) {
								Ext.WindowManager.bringToFront(me.getImportPublicCommunityTemplateLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.communityTemplate.ImportPublicCommunityTemplateLibrary');
							popup.show();	
							MYOCD.controller.communityTemplate.RefCommunityTemplatesStoreController.loadPublicCommunityTemplatesLibs('all', popup);
						}
					}
				]
			}).showAt(e.browserEvent.x, e.browserEvent.y);

		
	},
	onCreateNewCommunityTemplatesLibBtnClick: function() {
		var libraryName = this.getNewCommnunityTemplateLibrary().down('textfield[name="communityTemplatesLibName"]').getValue();
		var libraryDesc = this.getNewCommnunityTemplateLibrary().down('textfield[name="communityTemplatesLibDesc"]').getValue();
		var libraryAccess = this.getNewCommnunityTemplateLibrary().down('textfield[name="communityTemplatesLibAccess"]').getValue();
		if(libraryName.length == 0) {
			return;
		}
		this.getNewCommnunityTemplateLibrary().destroy();
		var communityTemplatesStore = MYOCD.controller.communityTemplate.CommunityTemplatesStoreController;
		communityTemplatesStore.addNewCommunityTemplatesLib(libraryName, libraryDesc, libraryAccess, MYOCD.SharedData.currentCompanyId, this.getCommunityTemplatesTab());
	},
	onClassificationLibrariesGridItemDblClick: function( grid, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentCommunityTemplatesLibId = record.get('id');
		this.getCommunityTemplatesTab().down('grid[name="communityTemplateLibsGrid"]').setVisible(false);
		this.getCommunityTemplatesTab().down('communityTemplatesLibraryManager').setVisible(true);
		var communityStoreController = MYOCD.controller.communityTemplate.CommunityTemplatesStoreController;
		communityStoreController.loadCategoriesOfCommunityTemplatesLib(record.get('id'), record.get('name'), this.getCommunityTemplatesTab());
		communityStoreController.loadTemplatesOfCommunityTemplatesLib(record.get('id'));
	},
	onCommunityTemplateLibsGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		if(record.get('imported')) {
			return
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
							    	var communityStoreController = MYOCD.controller.communityTemplate.CommunityTemplatesStoreController;
							    	communityStoreController.deleteCommunityTemplatesLib(record.get('id'), MYOCD.SharedData.currentCompanyId, me.getCommunityTemplatesTab());
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
						popup.down('textfield[name="baseUrl"]').setValue(COMMUNITY_TEMPLATE_LIB_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
			    	}
			    }
			]
		}).showAt(e.xy);
	},
	onCommunityTemplateLibsGridEdit: function( editor, e, eOpts) {
		if(e.record.data.name.trim().length == 0) {
	    	e.cancel = true;
	    	Ext.Msg.alert('Error!', 'Require library name');
	    	e.record.reject();
	    	return false;
    	}
	    var communityStoreController = MYOCD.controller.communityTemplate.CommunityTemplatesStoreController;
		communityStoreController.editCommunityTemplatesLib( 
			e.record.data.id, e.record.data.name, e.record.data.description, e.record.data.access,
			MYOCD.SharedData.currentCompanyId, this.getCommunityTemplatesTab());
	},
	onPublicCommunityTemplateLibsGridRender: function(grid, e, eOpts) {
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
	                    publicCommunityTemplateLib: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	}	
});