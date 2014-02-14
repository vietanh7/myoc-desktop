Ext.define('MYOCD.controller.projectTemplate.EditProjectTemplateFeatureController', {
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'editProjectTemplateFeature',
			selector: 'editProjectTemplateFeature'
		},
		{
			ref: 'editProjectTemplateFeatureSelectParent',
			selector: 'editProjectTemplateFeatureSelectParent'
		}
	],
	init: function() {
		this.control({
			'editProjectTemplateFeature button[name="selectOTParentBtn"]': {
				click: this.onSelectOTParentBtnClick
			},
			'editProjectTemplateFeature dataview[name="newOTRefOTLDataview"]': {
				itemdblclick: this.onNewOTRefOTLDataviewItemDblClick
			},
			'editProjectTemplateFeatureSelectParent button[name="newOTRefOTLBackButton"]': {
				click: this.onNewOTRefOTLBackButtonClick
			},
			'editProjectTemplateFeatureSelectParent treepanel[name="newOTRefObjectTypeCategoriesTree"]': {
				itemclick: this.onNewOTRefObjectTypeCategoriesTreeItemClick,
				itemexpand: this.onNewOTRefObjectTypeCategoriesTreeItemExpand
			},
			'editProjectTemplateFeatureSelectParent dataview[name="newOTRefObjectTypesDataView"]': {
				itemclick: this.onNewOTRefObjectTypesDataViewClick,
				itemdblclick: this.onNewOTRefObjectTypesDataViewClick
			},
			'editProjectTemplateFeatureSelectParent button[name="newOTAcceptParentBtn"]': {
				click: this.onNewOTAcceptParentBtnClick
			},
			'editProjectTemplateFeature button[name="clearOTParentBtn"]': {
				click: this.onClearOTParentBtnClick
			},
			'editProjectTemplateFeature button[name="updateFeatureBtn"]': {
				click: this.onUpdateFeatureBtnClick
			}
		});
	},
	onSelectOTParentBtnClick: function() {
		if(this.getEditProjectTemplateFeatureSelectParent()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.projectTemplate.EditProjectTemplateFeatureSelectParent');
		popup.show();
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadObjectTypeLibraries(MYOCD.SharedData.currentCompanyId, this.getEditProjectTemplateFeatureSelectParent());
	},
	onNewOTRefOTLDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefOTL = record.data;
		this.getEditProjectTemplateFeatureSelectParent().down('panel[name="newOTRefOTLPanel"]').setVisible(false);
		this.getEditProjectTemplateFeatureSelectParent().down('panel[name="newOTRefOTPanel"]').setVisible(true);
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadCategoriesOfObjectTypesLib(record.data.id, record.data.name, this.getEditProjectTemplateFeatureSelectParent());
		refOTLStoreController.loadObjectTypesOfObjectTypeLib(record.data.id);
	},
	onNewOTRefOTLBackButtonClick: function() {
		this.getEditProjectTemplateFeatureSelectParent().down('panel[name="newOTRefOTLPanel"]').setVisible(true);
		this.getEditProjectTemplateFeatureSelectParent().down('panel[name="newOTRefOTPanel"]').setVisible(false);
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
			this.getEditProjectTemplateFeatureSelectParent().destroy();
			return;
		}
		this.getEditProjectTemplateFeature().down('textfield[name="parentTypeId"]').setValue(MYOCD.SharedData.currentSelectedRefOT.id);
		this.getEditProjectTemplateFeature().down('textfield[name="parentObjectType"]').setValue(MYOCD.SharedData.currentSelectedRefOT.name);
		this.getEditProjectTemplateFeature().down('button[name="clearOTParentBtn"]').setVisible(true);
		this.getEditProjectTemplateFeatureSelectParent().destroy();
	},
	onClearOTParentBtnClick: function(btn) {
		btn.setVisible(false);
		this.getEditProjectTemplateFeature().down('textfield[name="parentObjectType"]').setValue('');
		this.getEditProjectTemplateFeature().down('textfield[name="parentTypeId"]').setValue('');
	},
	onUpdateFeatureBtnClick: function() {
		var featureId = this.getEditProjectTemplateFeature().down('textfield[name="featureId"]').getValue();
		var featureName = this.getEditProjectTemplateFeature().down('textfield[name="featureName"]').getValue();
		var featureDesc = this.getEditProjectTemplateFeature().down('textfield[name="featureDesc"]').getValue();
		var parentIdString = this.getEditProjectTemplateFeature().down('textfield[name="parentTypeId"]').getValue();
		if(featureName.length == 0) {
			return;
		}
		var parentId = parentIdString.length > 0 ? parentIdString : null;
		this.getEditProjectTemplateFeature().destroy();
		var ProjectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		ProjectTemplateStoreController.EditProjectTemplateFeature(featureId, parentId, featureName, featureDesc);
	}
});