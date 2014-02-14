Ext.define('MYOCD.controller.featureTemplate.EditFeatureController', {
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'editFeature',
			selector: 'editFeature'
		},
		{
			ref: 'editFeatureSelectParent',
			selector: 'editFeatureSelectParent'
		}
	],
	init: function() {
		this.control({
			'editFeature button[name="selectOTParentBtn"]': {
				click: this.onSelectOTParentBtnClick
			},
			'editFeatureSelectParent dataview[name="newOTRefOTLDataview"]': {
				itemdblclick: this.onNewOTRefOTLDataviewItemDblClick
			},
			'editFeatureSelectParent button[name="newOTRefOTLBackButton"]': {
				click: this.onNewOTRefOTLBackButtonClick
			},
			'editFeatureSelectParent treepanel[name="newOTRefObjectTypeCategoriesTree"]': {
				itemclick: this.onNewOTRefObjectTypeCategoriesTreeItemClick,
				itemexpand: this.onNewOTRefObjectTypeCategoriesTreeItemExpand
			},
			'editFeatureSelectParent dataview[name="newOTRefObjectTypesDataView"]': {
				itemclick: this.onNewOTRefObjectTypesDataViewClick,
				itemdblclick: this.onNewOTRefObjectTypesDataViewClick
			},
			'editFeatureSelectParent button[name="newOTAcceptParentBtn"]': {
				click: this.onNewOTAcceptParentBtnClick
			},
			'editFeature button[name="clearOTParentBtn"]': {
				click: this.onClearOTParentBtnClick
			},
			'editFeature button[name="updateFeatureBtn"]': {
				click: this.onUpdateFeatureBtnClick
			}
		});
	},
	onSelectOTParentBtnClick: function() {
		if(this.getEditFeatureSelectParent()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.featureTemplate.EditFeatureSelectParent');
		popup.show();
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadObjectTypeLibraries(MYOCD.SharedData.currentCompanyId, this.getEditFeatureSelectParent());
	},
	onNewOTRefOTLDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefOTL = record.data;
		this.getEditFeatureSelectParent().down('panel[name="newOTRefOTLPanel"]').setVisible(false);
		this.getEditFeatureSelectParent().down('panel[name="newOTRefOTPanel"]').setVisible(true);
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadCategoriesOfObjectTypesLib(record.data.id, record.data.name, this.getEditFeatureSelectParent());
		refOTLStoreController.loadObjectTypesOfObjectTypeLib(record.data.id);
	},
	onNewOTRefOTLBackButtonClick: function() {
		this.getEditFeatureSelectParent().down('panel[name="newOTRefOTLPanel"]').setVisible(true);
		this.getEditFeatureSelectParent().down('panel[name="newOTRefOTPanel"]').setVisible(false);
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
			this.getEditFeatureSelectParent().destroy();
			return;
		}
		this.getEditFeature().down('textfield[name="parentTypeId"]').setValue(MYOCD.SharedData.currentSelectedRefOT.id);
		this.getEditFeature().down('textfield[name="parentObjectType"]').setValue(MYOCD.SharedData.currentSelectedRefOT.name);
		this.getEditFeature().down('button[name="clearOTParentBtn"]').setVisible(true);
		this.getEditFeatureSelectParent().destroy();
	},
	onClearOTParentBtnClick: function(btn) {
		btn.setVisible(false);
		this.getEditFeature().down('textfield[name="parentObjectType"]').setValue('');
		this.getEditFeature().down('textfield[name="parentTypeId"]').setValue('');
	},
	onUpdateFeatureBtnClick: function() {
		var featureId = this.getEditFeature().down('textfield[name="featureId"]').getValue();
		var featureName = this.getEditFeature().down('textfield[name="featureName"]').getValue();
		var featureDesc = this.getEditFeature().down('textfield[name="featureDesc"]').getValue();
		var parentIdString = this.getEditFeature().down('textfield[name="parentTypeId"]').getValue();
		if(featureName.length == 0) {
			return;
		}
		var parentId = parentIdString.length > 0 ? parentIdString : null;
		this.getEditFeature().destroy();
		var featureTemplateStoreController = MYOCD.controller.featureTemplate.FeatureTemplatesStoreController;
		featureTemplateStoreController.editFeature(featureId, parentId, featureName, featureDesc);
	}
});