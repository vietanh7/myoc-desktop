Ext.define('MYOCD.controller.projectTemplate.NewProjectTemplateController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'	
		},
		{
			ref: 'projectTemplatesTab',
			selector: 'projectTemplatesTab'	
		},
		{
			ref: 'newProjectTemplate',
			selector: 'newProjectTemplate'
		},
		{
			ref: 'newProjectTemplateSelectParent',
			selector: 'newProjectTemplateSelectParent'
		},
		{
			ref: 'NewTemplateRefObjectTypesDataView',
			selector: 'newProjectTemplateSelectParent dataview[name="newTemplateRefObjectTypesDataView"]'
		}
	],
	init: function() {
		this.control({
			'newProjectTemplate button[name="selectOTParentBtn"]': {
				click: this.onSelectOTParentBtnClick
			},
			'newProjectTemplateSelectParent dataview[name="newTemplateRefOTLDataview"]': {
				itemdblclick: this.onNewTemplateRefOTLDataviewItemDblClick
			},
			'newProjectTemplateSelectParent button[name="newTemplateRefOTLBackButton"]': {
				click: this.onNewTemplateRefOTLBackButtonClick
			},
			'newProjectTemplateSelectParent treepanel[name="newTemplateRefObjectTypeCategoriesTree"]': {
				itemclick: this.onNewTemplateRefObjectTypeCategoriesTreeItemClick,
				itemexpand: this.onNewTemplateRefObjectTypeCategoriesTreeItemExpand
			},
			'newProjectTemplateSelectParent dataview[name="newTemplateRefObjectTypesDataView"]': {
				itemclick: this.onNewTemplateRefObjectTypesDataViewClick,
				itemdblclick: this.onNewTemplateRefObjectTypesDataViewClick
			},
			'newProjectTemplateSelectParent button[name="newTemplateAcceptParentBtn"]': {
				click: this.onNewTemplateAcceptParentBtnClick
			},
			'newProjectTemplate button[name="clearOTParentBtn"]': {
				click: this.onClearOTParentBtnClick
			},
			'newProjectTemplate button[name="createNewProjectTemplateBtn"]': {
				click: this.onCreateNewProjectTemplateBtnClick
			},
			'newProjectTemplate button[name="updateProjectTemplateBtn"]': {
				click: this.onUpdateProjectTemplateBtnClick
			}

		})
	},
	onSelectOTParentBtnClick: function() {
		if(this.getNewProjectTemplateSelectParent()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.projectTemplate.NewProjectTemplateSelectParent');
		popup.show();
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadObjectTypeLibraries(MYOCD.SharedData.currentCompanyId, this.getNewProjectTemplateSelectParent());
	},
	onNewTemplateRefOTLDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefOTL = record.data;
		this.getNewProjectTemplateSelectParent().down('panel[name="newTemplateRefOTLPanel"]').setVisible(false);
		this.getNewProjectTemplateSelectParent().down('panel[name="newTemplateRefOTPanel"]').setVisible(true);
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadCategoriesOfObjectTypesLib(record.data.id, record.data.name, this.getNewProjectTemplateSelectParent());
		refOTLStoreController.loadObjectTypesOfObjectTypeLib(record.data.id);
	},
	onNewTemplateRefOTLBackButtonClick: function() {
		this.getNewProjectTemplateSelectParent().down('panel[name="newTemplateRefOTLPanel"]').setVisible(true);
		this.getNewProjectTemplateSelectParent().down('panel[name="newTemplateRefOTPanel"]').setVisible(false);
		Ext.getStore('objectTypeLibrary.RefObjectTypes').removeAll();
		Ext.getStore('objectTypeLibrary.RefObjectTypeCategoriesTreeStore').setRootNode(null);
		Ext.getStore('objectTypeLibrary.RefObjectTypeCategoriesTreeStore').removeAll();
	},
	onNewTemplateRefObjectTypeCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		if(record.get('id')!=='root') {
			refOTLStoreController.loadObjectTypesOfObjectTypeCategory(record.get('id'));
		} else {
			refOTLStoreController.loadObjectTypesOfObjectTypeLib(MYOCD.SharedData.currentRefOTL.id);
		}
    },
    onNewTemplateRefObjectTypeCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		if(categoryNode.data.id !== 'root') {
			refOTLStoreController.loadObjectTypesOfObjectTypeCategory(categoryNode.data.id);
			refOTLStoreController.loadCategoriesOfObjectTypesCategory(categoryNode.data.id, categoryNode);
		} else {
			refOTLStoreController.loadObjectTypesOfObjectTypeLib(MYOCD.SharedData.currentRefOTL.id);
		}
	},
	onNewTemplateRefObjectTypesDataViewClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentSelectedRefOT = record.data;
	},
	onNewTemplateAcceptParentBtnClick: function() {
		if(!MYOCD.SharedData.currentSelectedRefOT) {
			this.getNewProjectTemplateSelectParent().destroy();
			return;
		}
		this.getNewProjectTemplate().down('textfield[name="parentObjectType"]').setValue(MYOCD.SharedData.currentSelectedRefOT.name);
		this.getNewProjectTemplate().down('textfield[name="parentObjectTypeId"]').setValue(MYOCD.SharedData.currentSelectedRefOT.id);
		this.getNewProjectTemplate().down('button[name="clearOTParentBtn"]').setVisible(true);
		this.getNewProjectTemplateSelectParent().destroy();
	},
	onClearOTParentBtnClick: function(btn) {
		btn.setVisible(false);
		this.getNewProjectTemplate().down('textfield[name="parentObjectType"]').setValue('');
		this.getNewProjectTemplate().down('textfield[name="parentObjectTypeId"]').setValue('');
	}, 
	onCreateNewProjectTemplateBtnClick: function() {
		var templateName = this.getNewProjectTemplate().down('textfield[name="projectTemplateName"]').getValue();
		var templateDesc = this.getNewProjectTemplate().down('textfield[name="projectTemplateDesc"]').getValue();
		var parentType = this.getNewProjectTemplate().down('textfield[name="parentObjectTypeId"]').getValue();
		if(parentType.length == 0) {
			parentType = null;
		}
		if(templateName.length == 0) {
			return;
		}
		var url;
		if(MYOCD.SharedData.currentProjectTemplatesCategory == null || MYOCD.SharedData.currentProjectTemplatesCategory.data.id == 'root') {
			url = PROJECT_TEMPLATE_LIB_BASE_URL + MYOCD.SharedData.currentProjectTemplatesLibId + '/templates.json';
		} else {
			url = PROJECT_TEMPLATE_CATEGORY_BASE_URL + MYOCD.SharedData.currentProjectTemplatesCategory.data.id + '/templates.json';
		}
		this.getNewProjectTemplate().destroy();

		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		projectTemplateStoreController.addNewProjectTemplate(url, templateName, templateDesc, parentType, this.getProjectTemplatesTab());
	},
	onUpdateProjectTemplateBtnClick: function() {
		var templateId = this.getNewProjectTemplate().down('textfield[name="projectTemplateId"]').getValue();
		var templateName = this.getNewProjectTemplate().down('textfield[name="projectTemplateName"]').getValue();
		var templateDesc = this.getNewProjectTemplate().down('textfield[name="projectTemplateDesc"]').getValue();
		var parentType = this.getNewProjectTemplate().down('textfield[name="parentObjectTypeId"]').getValue();
		if(parentType.length == 0) {
			parentType = null;
		}
		if(templateName.length == 0) {
			return;
		}

		this.getNewProjectTemplate().destroy();

		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		projectTemplateStoreController.editProjectTemplate(templateId, templateName, templateDesc, parentType, this.getProjectTemplatesTab());
	}
});