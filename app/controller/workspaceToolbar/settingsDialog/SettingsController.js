Ext.define('MYOCD.controller.workspaceToolbar.settingsDialog.SettingsController', {
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'settingsDialog',
			selector: 'settingsDialog'
		},
		{
			ref: 'newViewTemplateWithTabs',
			selector: 'newViewTemplateWithTabs'
		},
		{
			ref: 'addViewToWorkspace',
			selector: 'addViewToWorkspace'
		},
		{
			ref: 'newViewLibrary',
			selector: 'newViewLibrary'
		}
	],
	init: function() {
		this.control({
			'settingsDialog': {
				show: this.onSettingsDialogShow
			},
			'settingsDialog workspaceViews tool[name="addViewsTool"]': {
				click: this.onAddViewsToolClick
			},
			'settingsDialog workspaceViews dataview[name="viewTemplatesDataView"]': {
				render: this.onViewTemplatesDataViewRender,
				containercontextmenu: this.onViewTemplatesDataViewContextMenu,
				itemcontextmenu: this.onViewTemplatesDataViewItemContextMenu,
				itemdblclick: this.onViewTemplatesDataViewItemDblClick
			},
			'addViewToWorkspace tool[name="addViewTemplateLibTool"]': {
				click: this.onAddViewTemplateLibToolClick
			}
		});
	},
	onSettingsDialogShow: function(settingsDialog, e) {
		MYOCD.controller.company.CompanySettingsController.getCompanyViews(settingsDialog);
	},
	onAddViewsToolClick: function() {
		var me = this;
		if (me.getAddViewToWorkspace()) {
			Ext.WindowManager.bringToFront(me.getAddViewToWorkspace());
			return;
		}
		var popup = Ext.create('MYOCD.view.toolbarDialogs.settingsDialog.AddViewToWorkspace');
		popup.show();
	},
	onViewTemplatesDataViewRender: function(dataview, e, eOpts) {
		var me = this;
		if (MYOCD.SharedData.isExportViewSetting) {
		} else {
			dataview.dropZone = new Ext.dd.DropZone(dataview.getEl(), {
				onContainerOver: function() {
					return this.dropAllowed;
				},
				onContainerDrop : function(dropZone, evtObj, dragData) {
					if (!dragData.viewTemplateData) {
						return false;
					}
					MYOCD.controller.company.CompanySettingsController.addViewToWorkspace(dragData.viewTemplateData.id, me.getSettingsDialog());
					return true;
		        }
			});
		}
		
	},
	onViewTemplatesDataViewContextMenu: function(dataview, e, eOpts) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Import View',
					handler: function() {
						MYOCD.SharedData.isExportViewSetting = false;
						if (me.getAddViewToWorkspace()) {
							me.getAddViewToWorkspace().destroy();
							
						}
						var popup = Ext.create('MYOCD.view.toolbarDialogs.settingsDialog.AddViewToWorkspace');
						popup.show();
					}
				},
				{
					text: 'Create View',
					handler: function() {
						if(me.getNewViewTemplateWithTabs()) {
							me.getNewViewTemplateWithTabs().destroy();
						}
						var popup = Ext.create('MYOCD.view.viewTemplate.NewViewTemplateWithTabs');
						popup.down('textfield[name="viewLocation"]').setValue('workspace');
						popup.show();
					}
				}
			]
		}).showAt(e.xy);
	}, 
	onViewTemplatesDataViewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Export',
					handler: function() {
						if (me.getAddViewToWorkspace()) {
							me.getAddViewToWorkspace().destroy();
							
						}
						MYOCD.SharedData.isExportViewSetting = true;
						var popup = Ext.create('MYOCD.view.toolbarDialogs.settingsDialog.AddViewToWorkspace');
						popup.down('textfield[name="viewId"]').setValue(record.data.id);
						popup.down('panel[name="exportPanel"]').setVisible(true);
						popup.setTitle('Export view template');
						popup.show();
					}
				},
				'-',
				{
					text: 'Edit',
					handler: function() {
						if(me.getNewViewTemplateWithTabs()) {
							me.getNewViewTemplateWithTabs().destroy();
						}
						//MYOCD.SharedData.currentViewTemplate = record.data;
						var popup = Ext.create('MYOCD.view.viewTemplate.NewViewTemplateWithTabs');
						popup.setTitle('Edit View Template');
						popup.down('textfield[name="viewTemplateId"]').setValue(record.get('id'));
						popup.down('textfield[name="viewTemplateName"]').setValue(record.get('name'));
						popup.down('textfield[name="viewTemplateDesc"]').setValue(record.get('description'));
						popup.down('button[name="updateViewTemplateBtn"]').hidden = false;
						popup.down('button[name="createNewViewTemplateBtn"]').hidden = true;
						popup.show();
					}
				},
				{
					text: 'Remove',
					handler: function() {
						MYOCD.controller.company.CompanySettingsController.removeViewFromWorkspace(record.data.id, me.getSettingsDialog())
					}
				}
				
			]
		}).showAt(e.xy);
	},

	onViewTemplatesDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		if(me.getNewViewTemplateWithTabs()) {
			me.getNewViewTemplateWithTabs().destroy();
		}
		//MYOCD.SharedData.currentViewTemplate = record.data;
		var popup = Ext.create('MYOCD.view.viewTemplate.NewViewTemplateWithTabs');
		popup.setTitle('Edit View Template');
		popup.down('textfield[name="viewTemplateId"]').setValue(record.get('id'));
		popup.down('textfield[name="viewTemplateName"]').setValue(record.get('name'));
		popup.down('textfield[name="viewTemplateDesc"]').setValue(record.get('description'));
		popup.down('button[name="updateViewTemplateBtn"]').hidden = false;
		popup.down('button[name="createNewViewTemplateBtn"]').hidden = true;
		popup.show();
	},
	onAddViewTemplateLibToolClick: function() {
		var me = this;
		if(me.getNewViewLibrary()) {
			Ext.WindowManager.bringToFront(me.getNewViewLibrary());
			return
		}
		var popup = Ext.create('MYOCD.view.viewTemplate.NewViewLibrary');
		popup.down('textfield[name="viewLibraryName"]').setValue(gCurrentWorkspaceName + ' Views Library');
		popup.show();
	}
});