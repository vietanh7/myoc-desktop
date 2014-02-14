Ext.define('MYOCD.controller.companyTemplate.CompanyTemplatesController', {
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'newCompanyTemplatesLibrary',
			selector: 'newCompanyTemplatesLibrary'
		},
		{
			ref: 'companyTemplatesTab',
			selector: 'companyTemplatesTab'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'importPublicCompanyTemplateLibrary',
			selector: 'importPublicCompanyTemplateLibrary'
		}
	],
	init: function() {
		this.control({
			'companyTemplatesTab': {
				show: this.onCompanyTemplatesTabShow
			},
			'companyTemplatesTab grid[name="companyTemplatesLibrariesGrid"]': {
				render: this.onCompanyTemplatesLibrariesGridRender,
				itemdblclick: this.onCompanyTemplatesLibrariesGridItemDblClick,
				itemcontextmenu: this.onCompanyTemplatesLibrariesGridItemContextMenu,
				edit: this.onCompanyTemplatesLibrariesGridEdit	
			},
			'companyTemplatesTab grid[name="companyTemplatesLibrariesGrid"] tool[name="newCompanyTemplatesLibTool"]': {
				click: this.onNewCompanyTemplatesLibToolClick
			},
			'newCompanyTemplatesLibrary button[name="createNewCompanyTemplatesLibBtn"]': {
				click: this.onCreateNewCompanyTemplatesLibBtnClick
			},
			'importPublicCompanyTemplateLibrary grid[name="publicCompanyTemplateLibsGrid"]': {
				render: this.onPublicCompanyTemplateLibsGridRender
			}
			
		});
	},
	onCompanyTemplatesTabShow: function() {
		var companyTemplatesStore = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
        companyTemplatesStore.loadCompanyTemplatesLibs( MYOCD.SharedData.currentCompanyId);
	},
	onCompanyTemplatesLibrariesGridRender: function( grid, eOpts) {
		var rowEditingPlugin = grid.getPlugin('rowEditingPlugin');
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'celldblclick'); 
   		rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'itemdblclick'); 

   		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.publicCompanyTemplateLib) {
					return false;
				}
				var companyTemplatesStore = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
        		companyTemplatesStore.importCompanyTemplateLibraries(dragData.publicCompanyTemplateLib.id, grid);
	            return true;
	        }
		});
	},
	onNewCompanyTemplatesLibToolClick: function(tool, e, eOpts) {
		var me = this;
		var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Library',
						handler: function () {
							if(me.getNewCompanyTemplatesLibrary()) {
								Ext.WindowManager.bringToFront(me.getNewCompanyTemplatesLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.companyTemplate.NewCompanyTemplatesLibrary');
							popup.down('textfield[name="companyTemplatesLibName"]').setValue(gCurrentWorkspaceName + ' Company Templates Library');
							popup.show();
						}
							
					},
					{
						text: 'Import Public Library',
						handler: function() {
							if(me.getImportPublicCompanyTemplateLibrary()) {
								Ext.WindowManager.bringToFront(me.getImportPublicCompanyTemplateLibrary());
								return;
							}
							var popup = Ext.create('MYOCD.view.companyTemplate.ImportPublicCompanyTemplateLibrary');
							popup.show();	
							MYOCD.controller.companyTemplate.RefCompanyTemplatesStoreController.loadPublicCompanyTemplatesLibs('all', popup);
						}
					}
				]
			}).showAt(e.browserEvent.x, e.browserEvent.y);
	},
	onCreateNewCompanyTemplatesLibBtnClick: function() {
		var libraryName = this.getNewCompanyTemplatesLibrary().down('textfield[name="companyTemplatesLibName"]').getValue();
		var libraryDesc = this.getNewCompanyTemplatesLibrary().down('textfield[name="companyTemplatesLibDesc"]').getValue();
		var libraryAccess = this.getNewCompanyTemplatesLibrary().down('combobox[name="companyTemplatesLibAccess"]').getValue();
		if(libraryName.length == 0) {
			return;
		}
		this.getNewCompanyTemplatesLibrary().destroy();
		var companyTemplatesStore = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
		companyTemplatesStore.addNewCompanyTemplatesLib(libraryName, libraryDesc, libraryAccess, MYOCD.SharedData.currentCompanyId, this.getCompanyTemplatesTab());
	},
	onCompanyTemplatesLibrariesGridItemDblClick: function( grid, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentCompanyTemplatesLibId = record.get('id');
		this.getCompanyTemplatesTab().down('grid[name="companyTemplatesLibrariesGrid"]').setVisible(false);
		this.getCompanyTemplatesTab().down('companyTemplatesLibraryManager').setVisible(true);
		var companyTemplateStoreController = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
		companyTemplateStoreController.loadCategoriesOfCompanyTemplatesLib(record.get('id'), record.get('name'), this.getCompanyTemplatesTab());
		companyTemplateStoreController.loadTemplatesOfCompanyTemplatesLib(record.get('id'));
	},
	onCompanyTemplatesLibrariesGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
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
							    	var companyTemplateStoreController = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
							    	companyTemplateStoreController.deleteCompanyTemplatesLib(
							    		record.get('id'), MYOCD.SharedData.currentCompanyId, me.getCompanyTemplatesTab());
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
						popup.down('textfield[name="baseUrl"]').setValue(COMPANY_TEMPLATE_LIB_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
			    	}
			    }
			]
		}).showAt(e.xy);
	},
	onCompanyTemplatesLibrariesGridEdit: function( editor, e, eOpts) {
		if(e.record.data.name.trim().length == 0) {
	    	e.cancel = true;
	    	Ext.Msg.alert('Error!', 'Require library name');
	    	e.record.reject();
	    	return false;
    	}
	    var companyTemplateStoreController = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
		companyTemplateStoreController.editCompanyTemplatesLib( 
			e.record.data.id, e.record.data.name, e.record.data.description, e.record.data.access,
			MYOCD.SharedData.currentCompanyId, this.getCompanyTemplatesTab());
	},
	onPublicCompanyTemplateLibsGridRender: function(grid, e, eOpts) {
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
	                    publicCompanyTemplateLib: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	}
});