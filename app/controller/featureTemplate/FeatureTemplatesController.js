Ext.define('MYOCD.controller.featureTemplate.FeatureTemplatesController', {
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'newFeatureTemplatesLibrary',
			selector: 'newFeatureTemplatesLibrary'
		},
		{
			ref: 'featureTemplatesTab',
			selector: 'featureTemplatesTab'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'importPublicFeatureTemplateLibrary',
			selector: 'importPublicFeatureTemplateLibrary'
		}
	],
	init: function() {
		this.control({
			'featureTemplatesTab': {
				show: this.onFeatureTemplatesTabShow
			},
			'featureTemplatesTab grid[name="featureTemplatesLibrariesGrid"]': {
				render: this.onFeatureTemplatesLibrariesGridRender,
				itemdblclick: this.onFeatureTemplatesLibrariesGridItemDblClick,
				itemcontextmenu: this.onFeatureTemplatesLibrariesGridItemContextMenu,
				edit: this.onFeatureTemplatesLibrariesGridEdit	
			},
			'featureTemplatesTab grid[name="featureTemplatesLibrariesGrid"] tool[name="newFeatureTemplatesLibTool"]': {
				click: this.onNewFeatureTemplatesLibToolClick
			},
			'newFeatureTemplatesLibrary button[name="createNewFeatureTemplatesLibBtn"]': {
				click: this.onCreateNewFeatureTemplatesLibBtnClick
			},
			'importPublicFeatureTemplateLibrary grid[name="publicFeatureTemplateLibsGrid"]': {
				render: this.onPublicFeatureTemplateLibsGridRender
			}
			
		});
	},
	onFeatureTemplatesTabShow: function() {
	    var featureTemplatesStore = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
        featureTemplatesStore.loadFeatureTemplatesLibs(MYOCD.SharedData.currentCompanyId);
	},
	onFeatureTemplatesLibrariesGridRender: function( grid, eOpts) {
		var rowEditingPlugin = grid.getPlugin('rowEditingPlugin');
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'celldblclick'); 
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'itemdblclick'); 

   		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.publicFeatureTemplatesLib) {
					return false;
				}
				var featureTemplatesStore = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
        		featureTemplatesStore.importFeatureTemplatesLibraries(dragData.publicFeatureTemplatesLib.id, grid);
	            return true;
	        }
		});
		
	},
	onNewFeatureTemplatesLibToolClick: function(tool, e, eOpts) {
		var me = this;
		var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Library',
						handler: function () {
							if(me.getNewFeatureTemplatesLibrary()) {
								Ext.WindowManager.bringToFront(me.getNewFeatureTemplatesLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.featureTemplate.NewFeatureTemplatesLibrary');
							popup.down('textfield[name="featureTemplatesLibName"]').setValue(gCurrentWorkspaceName + ' Feature Templates Library');
							popup.show();
						}
							
					},
					{
						text: 'Import Public Library',
						handler: function() {
							if(me.getImportPublicFeatureTemplateLibrary()) {
								Ext.WindowManager.bringToFront(me.getImportPublicFeatureTemplateLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.featureTemplate.ImportPublicFeatureTemplateLibrary');
							popup.show();
							MYOCD.controller.featureTemplate.RefFeatureTemplatesStoreController.loadPublicFeatureTemplatesLibs('all', popup);
						}

					}
				]
			}).showAt(e.browserEvent.x, e.browserEvent.y);

		
	},
	onCreateNewFeatureTemplatesLibBtnClick: function() {
		var libraryName = this.getNewFeatureTemplatesLibrary().down('textfield[name="featureTemplatesLibName"]').getValue();
		var libraryDesc = this.getNewFeatureTemplatesLibrary().down('textfield[name="featureTemplatesLibDesc"]').getValue();
		var libraryAccess = this.getNewFeatureTemplatesLibrary().down('textfield[name="featureTemplatesLibAccess"]').getValue();
		if(libraryName.length == 0) {
			return;
		}
		this.getNewFeatureTemplatesLibrary().destroy();
		var featureTemplatesStore = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplatesStore.addNewFeatureTemplatesLib(libraryName, libraryDesc, libraryAccess, MYOCD.SharedData.currentCompanyId, this.getFeatureTemplatesTab());
	},
	onFeatureTemplatesLibrariesGridItemDblClick: function( grid, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentFeatureTemplatesLibId = record.get('id');
		this.getFeatureTemplatesTab().down('grid[name="featureTemplatesLibrariesGrid"]').setVisible(false);
		this.getFeatureTemplatesTab().down('featureTemplatesLibraryManager').setVisible(true);
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplateStoreController.loadCategoriesOfFeatureTemplatesLib(record.get('id'), record.get('name'), this.getFeatureTemplatesTab());
		featureTemplateStoreController.loadTemplatesOfFeatureTemplatesLib(record.get('id'));
	},
	onFeatureTemplatesLibrariesGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
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
							    	var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
							    	featureTemplateStoreController.deleteFeatureTemplatesLib(record.get('id'), MYOCD.SharedData.currentCompanyId, me.getFeatureTemplatesTab());
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
						popup.down('textfield[name="baseUrl"]').setValue(FEATURE_TEMPLATE_LIB_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
			    	}
			    }
			]
		}).showAt(e.xy);
	},
	onFeatureTemplatesLibrariesGridEdit: function( editor, e, eOpts) {
		if(e.record.data.name.trim().length == 0) {
	    	e.cancel = true;
	    	Ext.Msg.alert('Error!', 'Require library name');
	    	e.record.reject();
	    	return false;
    	}
	    var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplateStoreController.editFeatureTemplatesLib( 
			e.record.data.id, e.record.data.name, e.record.data.description, e.record.data.access,
			MYOCD.SharedData.currentCompanyId, this.getFeatureTemplatesTab());
	},
	onPublicFeatureTemplateLibsGridRender: function(grid, e, eOpts) {
		console.log('public feature template grid render');
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
	                    publicFeatureTemplatesLib: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	}
});