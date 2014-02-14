Ext.define('MYOCD.controller.featureTemplate.NewFeatureTemplateController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'	
		},
		{
			ref: 'newFeatureTemplate',
			selector: 'newFeatureTemplate'
		},
		{
			ref: 'newFeatureTemplateSelectParent',
			selector: 'newFeatureTemplateSelectParent'
		},
		{
			ref: 'newOTRefObjectTypesDataView',
			selector: 'newFeatureTemplateSelectParent dataview[name="newOTRefObjectTypesDataView"]'
		}
	],
	init: function() {
		this.control({
			'newFeatureTemplate button[name="selectOTParentBtn"]': {
				click: this.onSelectOTParentBtnClick
			},
			'newFeatureTemplateSelectParent dataview[name="newOTRefOTLDataview"]': {
				itemdblclick: this.onNewOTRefOTLDataviewItemDblClick
			},
			'newFeatureTemplateSelectParent button[name="newOTRefOTLBackButton"]': {
				click: this.onNewOTRefOTLBackButtonClick
			},
			'newFeatureTemplateSelectParent treepanel[name="newOTRefObjectTypeCategoriesTree"]': {
				itemclick: this.onNewOTRefObjectTypeCategoriesTreeItemClick,
				itemexpand: this.onNewOTRefObjectTypeCategoriesTreeItemExpand
			},
			'newFeatureTemplateSelectParent dataview[name="newOTRefObjectTypesDataView"]': {
				itemclick: this.onNewOTRefObjectTypesDataViewClick,
				itemdblclick: this.onNewOTRefObjectTypesDataViewClick
			},
			'newFeatureTemplateSelectParent button[name="newOTAcceptParentBtn"]': {
				click: this.onNewOTAcceptParentBtnClick
			},
			'newFeatureTemplate button[name="clearOTParentBtn"]': {
				click: this.onClearOTParentBtnClick
			},
			'newFeatureTemplate button[name="createNewFeatureTemplateBtn"]': {
				click: this.onCreateNewFeatureTemplateBtnClick
			},
			'newFeatureTemplate button[name="updateFeatureTemplateBtn"]': {
				click: this.onUpdateFeatureTemplateBtnClick
			}

		})
	},
	onSelectOTParentBtnClick: function() {
		if(this.getNewFeatureTemplateSelectParent()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.featureTemplate.NewFeatureTemplateSelectParent');
		popup.show();
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadObjectTypeLibraries(MYOCD.SharedData.currentCompanyId, this.getNewFeatureTemplateSelectParent());
	},
	onNewOTRefOTLDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefOTL = record.data;
		this.getNewFeatureTemplateSelectParent().down('panel[name="newOTRefOTLPanel"]').setVisible(false);
		this.getNewFeatureTemplateSelectParent().down('panel[name="newOTRefOTPanel"]').setVisible(true);
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadCategoriesOfObjectTypesLib(record.data.id, record.data.name, this.getNewFeatureTemplateSelectParent());
		refOTLStoreController.loadObjectTypesOfObjectTypeLib(record.data.id);
	},
	onNewOTRefOTLBackButtonClick: function() {
		this.getNewFeatureTemplateSelectParent().down('panel[name="newOTRefOTLPanel"]').setVisible(true);
		this.getNewFeatureTemplateSelectParent().down('panel[name="newOTRefOTPanel"]').setVisible(false);
		Ext.getStore('objectTypeLibrary.RefObjectTypes').removeAll();
		Ext.getStore('objectTypeLibrary.RefObjectTypeCategoriesTreeStore').setRootNode(null);
		Ext.getStore('objectTypeLibrary.RefObjectTypeCategoriesTreeStore').removeAll();
	},
	onNewOTRefObjectTypeCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		if(record.get('id')!=='root') {
			refOTLStoreController.loadObjectTypesOfObjectTypeCategory(record.get('id'));
		} else {
			refOTLStoreController.loadObjectTypesOfObjectTypeLib(MYOCD.SharedData.currentRefOTL.id);
		}
    },
    onNewOTRefObjectTypeCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		if(categoryNode.data.id !== 'root') {
			refOTLStoreController.loadObjectTypesOfObjectTypeCategory(categoryNode.data.id);
			refOTLStoreController.loadCategoriesOfObjectTypesCategory(categoryNode.data.id, categoryNode);
		} else {
			refOTLStoreController.loadObjectTypesOfObjectTypeLib(MYOCD.SharedData.currentRefOTL.id);
		}
	},
	onNewOTRefObjectTypesDataViewClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentSelectedRefOT = record.data;
	},
	onNewOTAcceptParentBtnClick: function() {
		if(!MYOCD.SharedData.currentSelectedRefOT) {
			this.getNewFeatureTemplateSelectParent().destroy();
			return;
		}
		this.getNewFeatureTemplate().down('textfield[name="parentObjectType"]').setValue(MYOCD.SharedData.currentSelectedRefOT.name);
		this.getNewFeatureTemplate().down('textfield[name="parentObjectTypeId"]').setValue(MYOCD.SharedData.currentSelectedRefOT.id);
		this.getNewFeatureTemplate().down('button[name="clearOTParentBtn"]').setVisible(true);
		this.getNewFeatureTemplateSelectParent().destroy();
	},
	onClearOTParentBtnClick: function(btn) {
		btn.setVisible(false);
		this.getNewFeatureTemplate().down('textfield[name="parentObjectType"]').setValue('');
		this.getNewFeatureTemplate().down('textfield[name="parentObjectTypeId"]').setValue('');
	}, 
	onCreateNewFeatureTemplateBtnClick: function() {
		var templateName = this.getNewFeatureTemplate().down('textfield[name="featureTemplateName"]').getValue();
		var templateDesc = this.getNewFeatureTemplate().down('textfield[name="featureTemplateDesc"]').getValue();
		var parentType = this.getNewFeatureTemplate().down('textfield[name="parentObjectTypeId"]').getValue();
		if(parentType.length == 0) {
			parentType = null;
		}
		if(templateName.length == 0) {
			return;
		}
		var url;
		if(MYOCD.SharedData.currentFeatureTemplatesCategory == null || MYOCD.SharedData.currentFeatureTemplatesCategory.data.id == 'root') {
			url = FEATURE_TEMPLATE_LIB_BASE_URL + MYOCD.SharedData.currentFeatureTemplatesLibId + '/templates.json';
		} else {
			url = FEATURE_TEMPLATE_CATEGORY_BASE_URL + MYOCD.SharedData.currentFeatureTemplatesCategory.data.id + '/templates.json';
		}
		this.getNewFeatureTemplate().destroy();

		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplateStoreController.addNewFeatureTemplate(url, templateName, templateDesc, parentType, this.getMain());
	},
	onUpdateFeatureTemplateBtnClick: function() {
		var templateId = this.getNewFeatureTemplate().down('textfield[name="featureTemplateId"]').getValue();
		var templateName = this.getNewFeatureTemplate().down('textfield[name="featureTemplateName"]').getValue();
		var templateDesc = this.getNewFeatureTemplate().down('textfield[name="featureTemplateDesc"]').getValue();
		var parentType = this.getNewFeatureTemplate().down('textfield[name="parentObjectTypeId"]').getValue();
		if(parentType.length == 0) {
			parentType = null;
		}
		if(templateName.length == 0) {
			return;
		}

		this.getNewFeatureTemplate().destroy();

		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplateStoreController.editFeatureTemplate(templateId, templateName, templateDesc, parentType, this.getMain());
	}
});