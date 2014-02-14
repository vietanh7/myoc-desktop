Ext.define('MYOCD.controller.workspaceToolbar.settingsDialog.AddViewToWorkspaceController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'addViewToWorkspace',
			selector: 'addViewToWorkspace'
		}
	],
	init: function() {
		this.control({
			'addViewToWorkspace': {
				show: this.onAddViewToWorkspaceShow
			},
			'addViewToWorkspace dataview[name="refViewLibrariesDataView"]': {
				itemdblclick: this.onRefViewLibrariesDataViewItemDblClick
			},
			'addViewToWorkspace button[name="refViewLibrariesBackBtn"]': {
				click: this.onRefViewLibrariesBackBtnClick
			},
			'addViewToWorkspace treepanel[name="refViewCategoriesTreePanel"]': {
				itemclick: this.onRefViewCategoriesTreeItemClick,
				itemexpand: this.onRefViewCategoriesTreeItemExpand
			},
			'addViewToWorkspace dataview[name="refViewDataView"]': {
				render: this.onRefViewDataViewRender
			},
			'addViewToWorkspace button[text="Export"]': {
				click: this.onExportViewTemplate
			}
		});
	},
	onAddViewToWorkspaceShow: function(addViewDlg, e) {
		MYOCD.SharedData.currentRefViewLibId = null;
		MYOCD.SharedData.currentViewCategory = null;
		MYOCD.controller.viewTemplate.RefViewLibraryStoreController.loadViewLibraries(MYOCD.SharedData.currentCompanyId, addViewDlg);
	},
	onRefViewLibrariesDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefViewLibId = record.get('id');
		this.getAddViewToWorkspace().down('panel[name="selectViewLibraryPanel"]').setVisible(false);
		this.getAddViewToWorkspace().down('panel[name="selectRefPermissionPanel"]').setVisible(true);
		var viewStoreController = MYOCD.controller.viewTemplate.RefViewLibraryStoreController;
		viewStoreController.loadCategoriesOfViewsLib(record.get('id'), record.get('name'), this.getAddViewToWorkspace());
		viewStoreController.loadViewTemplatesOfViewLib(record.get('id'));
	},
	onRefViewLibrariesBackBtnClick: function() {
		MYOCD.SharedData.currentRefViewLibId = null;
		MYOCD.SharedData.currentRefViewCategoryId = null;
		this.getAddViewToWorkspace().down('panel[name="selectViewLibraryPanel"]').setVisible(true);
		this.getAddViewToWorkspace().down('panel[name="selectRefPermissionPanel"]').setVisible(false);
	},
	onRefViewCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts ) {
		
		if(record.get('id') == 'root') {
			var viewLibraryStoreCtl = MYOCD.controller.viewTemplate.RefViewLibraryStoreController;
			viewLibraryStoreCtl.loadViewTemplatesOfViewLib(MYOCD.SharedData.currentRefViewLibId);
			MYOCD.SharedData.currentRefViewCategoryId = null
			return;
		}
		MYOCD.SharedData.currentRefViewCategoryId = record.get('id');
		var viewLibraryStoreCtl = MYOCD.controller.viewTemplate.RefViewLibraryStoreController;
		viewLibraryStoreCtl.loadViewTemplatesOfViewCategory(record.get('id'));
	},
	onRefViewCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		if(categoryNode.get('id') == 'root') {
			var viewLibraryStoreCtl = MYOCD.controller.viewTemplate.RefViewLibraryStoreController;
			viewLibraryStoreCtl.loadViewTemplatesOfViewLib(MYOCD.SharedData.currentViewLibId);
			MYOCD.SharedData.currentRefViewCategoryId = null;
			return;
		}
		MYOCD.SharedData.currentRefViewCategoryId = categoryNode.get('id');
		var viewLibraryStoreCtl = MYOCD.controller.viewTemplate.RefViewLibraryStoreController;
		viewLibraryStoreCtl.loadViewTemplatesOfViewCategory(categoryNode.data.id);
		viewLibraryStoreCtl.loadCategoriesOfViewsCategory(categoryNode.data.id, categoryNode);
	},
	onRefViewDataViewRender: function(dataview, e, eOpts) {
		dataview.dragZone = new Ext.dd.DragZone(dataview.getEl(), {
	        getDragData: function(e) {
	            var sourceEl = e.getTarget(dataview.itemSelector, 10);
	            if (sourceEl) {
	                d = sourceEl.cloneNode(true);
	                d.id = Ext.id();
	                return dataview.dragData = {
	                    sourceEl: sourceEl,
	                    repairXY: Ext.fly(sourceEl).getXY(),
	                    ddel: d,
	                    viewTemplateData: dataview.getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onExportViewTemplate: function() {
		var viewTemplateId = this.getAddViewToWorkspace().down('textfield[name="viewId"]').getValue();
		if (!MYOCD.SharedData.currentRefViewLibId) {
			Ext.Msg.alert('Error!', 'Please select a library or a category');
			return
		}
		this.getAddViewToWorkspace().destroy();
		if (MYOCD.SharedData.currentRefViewCategoryId) {
			MYOCD.controller.company.CompanySettingsController.exportViewToViewCategory(viewTemplateId, MYOCD.SharedData.currentRefViewCategoryId, null);
		} else {
			MYOCD.controller.company.CompanySettingsController.exportViewToViewLibrary(viewTemplateId, MYOCD.SharedData.currentRefViewLibId, null);
		}
		
	}
});