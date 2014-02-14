Ext.define('MYOCD.controller.project.NewProjectController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'newProject',
			selector: 'newProject'
		},
		{
			ref: 'selectRefProjectTemplate',
			selector: 'selectRefProjectTemplate'
		}
	],
	init: function() {
		this.control({
			'newProject button[name="selectProjectTemplateBtn"]': {
				click: this.onSelectProjectTemplateBtnClick
			},
			'selectRefProjectTemplate dataview[name="projectTemplateLibrariesDataView"]': {
				itemdblclick: this.onProjectTemplateLibrariesDataViewItemDblClick
			},
			'selectRefProjectTemplate button[name="projectTemplateBackBtn"]': {
				click: this.onProjectTemplateBackBtnClick
			},
			'selectRefProjectTemplate treepanel[name="projectTemplateCategoriesTree"]': {
				itemclick: this.onProjectTemplateCategoriesTreeItemClick,
				itemexpand: this.onProjectTemplateCategoriesTreeItemExpand
			},
			'selectRefProjectTemplate button[name="acceptProjectTemplateBtn"]': {
				click: this.onAcceptProjectTemplateBtnClick
			},
			'newProject button[name="clearProjectTemplateBtn"]': {
				click: this.onClearProjectTemplateBtnClick
			}
		});
	},
	onSelectProjectTemplateBtnClick: function() {
		if (this.getSelectRefProjectTemplate()) {
			this.getSelectRefProjectTemplate().destroy();
		}
		var popup = Ext.create('MYOCD.view.project.SelectRefProjectTemplate');
		popup.show();
		var refProjectTemplateStoreController = MYOCD.controller.projectTemplate.RefProjectTemplatesStoreController;
		refProjectTemplateStoreController.loadProjectTemplatesLibs(MYOCD.SharedData.currentCompanyId, popup);
	},
	onProjectTemplateLibrariesDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefProjectTemplate = record.data;
		this.getSelectRefProjectTemplate().down('panel[name="projectTemplateLibrariesPanel"]').setVisible(false);
		this.getSelectRefProjectTemplate().down('panel[name="projectTemplatePanel"]').setVisible(true);
		var refProjectTemplateStoreController = MYOCD.controller.projectTemplate.RefProjectTemplatesStoreController;
		refProjectTemplateStoreController.oadCategoriesOfProjectTemplatesLib(record.data.id, record.data.name, this.getSelectRefProjectTemplate());
		refProjectTemplateStoreController.loadTemplatesOfProjectTemplatesLib(record.data.id);
	},
	onProjectTemplateBackBtnClick: function  (argument) {
		this.getSelectRefProjectTemplate().down('panel[name="projectTemplateLibrariesPanel"]').setVisible(true);
		this.getSelectRefProjectTemplate().down('panel[name="projectTemplatePanel"]').setVisible(false);
		this.getSelectRefProjectTemplate().down('dataview[name="refProjectTemplatesDataView"]').deselectAll();
		Ext.getStore('projectTemplate.RefProjectTemplates').removeAll();
		Ext.getStore('projectTemplate.RefProjectTemplatesCategoriesTreeStore').setRootNode(null);
		Ext.getStore('projectTemplate.RefProjectTemplatesCategoriesTreeStore').removeAll();
	},
	onProjectTemplateCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
		var refProjectTemplateStoreController = MYOCD.controller.projectTemplate.RefProjectTemplatesStoreController;
		if(record.get('id')!=='root') {
			refProjectTemplateStoreController.loadTemplatesOfProjectTemplatesCategory(record.get('id'));
		} else {
			refProjectTemplateStoreController.loadTemplatesOfProjectTemplatesLib(MYOCD.SharedData.currentRefProjectTemplate.id);
		}
    },
    onProjectTemplateCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		var refProjectTemplateStoreController = MYOCD.controller.projectTemplate.RefProjectTemplatesStoreController;
		if(categoryNode.data.id !== 'root') {
			refProjectTemplateStoreController.loadTemplatesOfProjectTemplatesCategory(categoryNode.data.id);
			refProjectTemplateStoreController.loadCategoriesOfProjectTemplatesCategory(categoryNode.data.id, categoryNode);
		} else {
			refProjectTemplateStoreController.loadTemplatesOfProjectTemplatesCategory(MYOCD.SharedData.currentRefTpl.id);
		}
	},
	onAcceptProjectTemplateBtnClick: function() {
		var projectTemplate = this.getSelectRefProjectTemplate().down('dataview[name="refProjectTemplatesDataView"]').getSelectionModel().getSelection()[0];
		if (projectTemplate) {
			this.getNewProject().down('textfield[name="projectTemplateId"]').setValue(projectTemplate.data.id);
			this.getNewProject().down('textfield[name="projectTemplateName"]').setValue(projectTemplate.data.name);
			this.getNewProject().down('button[name="clearProjectTemplateBtn"]').setVisible(true);
		}
		this.getSelectRefProjectTemplate().destroy();
	},
	onClearProjectTemplateBtnClick: function(button) {
		button.setVisible(false);
		this.getNewProject().down('textfield[name="projectTemplateId"]').setValue('');
		this.getNewProject().down('textfield[name="projectTemplateName"]').setValue('');
	}
});