Ext.define('MYOCD.controller.project.EditFeatureController', {
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'workspace',
			selector: 'workspace'	
		},
		{
			ref: 'editProjectFeature',
			selector: 'editProjectFeature'
		},
		{
			ref: 'editProjectFeatureSelectParent',
			selector: 'editProjectFeatureSelectParent'
		}
	],
	init: function() {
		this.control({
			'editProjectFeature button[name="selectOTParentBtn"]': {
				click: this.onSelectOTParentBtnClick
			},
			'editProjectFeatureSelectParent dataview[name="newOTRefOTLDataview"]': {
				itemdblclick: this.onNewOTRefOTLDataviewItemDblClick
			},
			'editProjectFeatureSelectParent button[name="newOTRefOTLBackButton"]': {
				click: this.onNewOTRefOTLBackButtonClick
			},
			'editProjectFeatureSelectParent treepanel[name="newOTRefObjectTypeCategoriesTree"]': {
				itemclick: this.onNewOTRefObjectTypeCategoriesTreeItemClick,
				itemexpand: this.onNewOTRefObjectTypeCategoriesTreeItemExpand
			},
			'editProjectFeatureSelectParent dataview[name="newOTRefObjectTypesDataView"]': {
				itemclick: this.onNewOTRefObjectTypesDataViewClick,
				itemdblclick: this.onNewOTRefObjectTypesDataViewClick
			},
			'editProjectFeatureSelectParent button[name="newOTAcceptParentBtn"]': {
				click: this.onNewOTAcceptParentBtnClick
			},
			'editProjectFeature button[name="clearOTParentBtn"]': {
				click: this.onClearOTParentBtnClick
			},
			'editProjectFeature button[name="updateFeatureBtn"]': {
				click: this.onUpdateFeatureBtnClick
			}
		});
	},
	onSelectOTParentBtnClick: function() {
		if(this.getEditProjectFeatureSelectParent()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.project.EditProjectFeatureSelectParent');
		popup.show();
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadObjectTypeLibraries(MYOCD.SharedData.currentCompanyId, this.getEditProjectFeatureSelectParent());
	},
	onNewOTRefOTLDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefOTL = record.data;
		this.getEditProjectFeatureSelectParent().down('panel[name="newOTRefOTLPanel"]').setVisible(false);
		this.getEditProjectFeatureSelectParent().down('panel[name="newOTRefOTPanel"]').setVisible(true);
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadCategoriesOfObjectTypesLib(record.data.id, record.data.name, this.getEditProjectFeatureSelectParent());
		refOTLStoreController.loadObjectTypesOfObjectTypeLib(record.data.id);
	},
	onNewOTRefOTLBackButtonClick: function() {
		this.getEditProjectFeatureSelectParent().down('panel[name="newOTRefOTLPanel"]').setVisible(true);
		this.getEditProjectFeatureSelectParent().down('panel[name="newOTRefOTPanel"]').setVisible(false);
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
			this.getEditProjectFeatureSelectParent().destroy();
			return;
		}
		this.getEditProjectFeature().down('textfield[name="parentObjectType"]').setValue(
			MYOCD.SharedData.currentSelectedRefOT.id + '-' + MYOCD.SharedData.currentSelectedRefOT.name);
		this.getEditProjectFeature().down('button[name="clearOTParentBtn"]').setVisible(true);
		this.getEditProjectFeatureSelectParent().destroy();
	},
	onClearOTParentBtnClick: function(btn) {
		btn.setVisible(false);
		this.getEditProjectFeature().down('textfield[name="parentObjectType"]').setValue('');
	},
	onUpdateFeatureBtnClick: function() {
		var featureId = this.getEditProjectFeature().down('textfield[name="featureId"]').getValue();
		var featureName = this.getEditProjectFeature().down('textfield[name="featureName"]').getValue();
		var featureDesc = this.getEditProjectFeature().down('textfield[name="featureDesc"]').getValue();
		var parentIdString = this.getEditProjectFeature().down('textfield[name="parentObjectType"]').getValue().split('-');
		if(featureName.length == 0) {
			return;
		}
		var parentId = parentIdString.length == 2 ? parentIdString[0] : null;
		this.getEditProjectFeature().destroy();
		var projectsStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectsStoreController.editFeature(featureId, parentId, featureName, featureDesc);
	}
});