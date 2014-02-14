Ext.define('MYOCD.controller.objectTypeLibrary.NewObjectTypeController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'	
		},
		{
			ref: 'newObjectType',
			selector: 'newObjectType'
		},
		{
			ref: 'newObjectTypeSelectParent',
			selector: 'newObjectTypeSelectParent'
		},
		{
			ref: 'newOTRefObjectTypesDataView',
			selector: 'newObjectTypeSelectParent dataview[name="newOTRefObjectTypesDataView"]'
		},
		{
			ref: 'newOTRefOTVersionGrid',
			selector: 'newObjectTypeSelectParent grid[name="newOTRefOTVersionGrid"]'
		},
		{
			ref: 'objectTypeLibraryManager',
			selector: 'objectTypeLibraryManager'
		}
	],
	init: function() {
		this.control({
			'newObjectType tool[name="addParentTool"]': {
				click: this.onAddParentToolClick
			},
			'newObjectTypeSelectParent': {
				render: this.onNewObjectTypeSelectParentRender
			},
			'newObjectTypeSelectParent dataview[name="newOTRefOTLDataview"]': {
				itemdblclick: this.onNewOTRefOTLDataviewItemDblClick
			},
			'newObjectTypeSelectParent button[name="newOTRefOTLBackButton"]': {
				click: this.onNewOTRefOTLBackButtonClick
			},
			'newObjectTypeSelectParent treepanel[name="newOTRefObjectTypeCategoriesTree"]': {
				itemclick: this.onNewOTRefObjectTypeCategoriesTreeItemClick,
				itemexpand: this.onNewOTRefObjectTypeCategoriesTreeItemExpand
			},
			'newObjectTypeSelectParent dataview[name="newOTRefObjectTypesDataView"]': {
				itemclick: this.onNewOTRefObjectTypesDataViewClick,
				itemdblclick: this.onNewOTRefObjectTypesDataViewClick
			},
			'newObjectTypeSelectParent button[name="newOTAcceptParentBtn"]': {
				click: this.onNewOTAcceptParentBtnClick
			},
			'newObjectType button[name="createNewObjectTypeBtn"]': {
				click: this.onCreateNewObjectTypeBtnClick
			},
			'newObjectType button[name="updateObjectTypeBtn"]': {
				click: this.onUpdateObjectTypeBtnClick
			},
			'newObjectTypeSelectParent grid[name="newOTRefOTVersionGrid"]': {
				itemclick: this.onNewOTRefOTVersionGridItemClick,
				itemdblclick: this.onNewOTRefOTVersionGridItemClick
			},
			'objectTypeLibraryManager panel[name="addNewObjectTypePanel"] grid[name="parentObjectTypesGrid"] tool[name="addParentTool"]': {
				click: this.onAddParentToolPanelClick
			},
			'objectTypeLibraryManager panel[name="addNewObjectTypePanel"] button[name="createNewObjectTypeBtn"]': {
				click: this.onCreateNewObjectTypeBtnPanelClick
			},
		});
	},
	onNewObjectTypeSelectParentRender: function() {
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadObjectTypeLibraries(MYOCD.SharedData.currentCompanyId, this.getNewObjectTypeSelectParent());
	},
	onAddParentToolClick: function() {
		if(this.getNewObjectTypeSelectParent()) {
			this.getNewObjectTypeSelectParent().down('textfield[name="addOrUpdate"]').setValue('update');
			Ext.WindowManager.bringToFront(this.getNewObjectTypeSelectParent());
			return;
		}
		var popup = Ext.create('MYOCD.view.objectTypeLibrary.NewObjectTypeSelectParent');
		popup.down('textfield[name="addOrUpdate"]').setValue('update');
		popup.show();
		
	},
	onNewOTRefOTLDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefOTL = record.data;
		this.getNewObjectTypeSelectParent().down('panel[name="newOTRefOTLPanel"]').setVisible(false);
		this.getNewObjectTypeSelectParent().down('panel[name="newOTRefOTPanel"]').setVisible(true);
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadCategoriesOfObjectTypesLib(record.data.id, record.data.name, this.getNewObjectTypeSelectParent());
		refOTLStoreController.loadObjectTypesOfObjectTypeLib(record.data.id);
	},
	onNewOTRefOTLBackButtonClick: function() {
		this.getNewObjectTypeSelectParent().down('panel[name="newOTRefOTLPanel"]').setVisible(true);
		this.getNewObjectTypeSelectParent().down('panel[name="newOTRefOTPanel"]').setVisible(false);
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
		this.getNewOTRefOTVersionGrid().expand();
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadObjectTypeVersions(record.data.id, this.getNewOTRefOTVersionGrid());
	},
	onNewOTAcceptParentBtnClick: function() {
		if(!MYOCD.SharedData.currentSelectedRefOT) {
			this.getNewObjectTypeSelectParent().destroy();
			return;
		}
		var parent = new Object();
		parent.name = MYOCD.SharedData.currentSelectedRefOT.name;
		parent.id = MYOCD.SharedData.currentSelectedRefOT.id;
		if(MYOCD.SharedData.currentSelectRefOTVersion) {
			parent.version = MYOCD.SharedData.currentSelectRefOTVersion.data.name;
			parent.versionId = MYOCD.SharedData.currentSelectRefOTVersion.data.id
		}
		var addOrUpdate = this.getNewObjectTypeSelectParent().down('textfield[name="addOrUpdate"]').getValue();
		var parentOrAssociated = this.getNewObjectTypeSelectParent().down('textfield[name="parentOrAssociated"]').getValue();
		if (addOrUpdate == 'update') {
			if (parentOrAssociated.length > 0) {
				var store = MYOCD.SharedData.currentAssociatedStore;
				var record = store.findRecord('associatedType', parentOrAssociated);
				record.set('objectTypeId', parent.id);
				record.set('objectTypeName', parent.name);
				record.set('changed', true);
				record.commit();
			} else {
				this.getNewObjectType().down('grid[name="parentObjectTypesGrid"]').getStore().add(parent);
			}
		} else {
			if (parentOrAssociated.length > 0) {
				var store = MYOCD.SharedData.currentAssociatedStore;
				var record = store.findRecord('associatedType', parentOrAssociated);
				record.set('objectTypeId', parent.id);
				record.set('objectTypeName', parent.name);
				record.set('changed', true);
				record.commit();
			} else {
				this.getObjectTypeLibraryManager().down('grid[name="parentObjectTypesGrid"]').getStore().add(parent);
			}
		}
		
		MYOCD.SharedData.currentSelectRefOTVersion = null;
		MYOCD.SharedData.currentSelectedRefOT = null;
		this.getNewObjectTypeSelectParent().destroy();
	},
	onCreateNewObjectTypeBtnClick: function() {
		var objectTypeName = this.getNewObjectType().down('textfield[name="objectTypeName"]').getValue();
		var objectTypeDesc = this.getNewObjectType().down('textfield[name="objectTypeDesc"]').getValue();
		var objectTypeIds = [];
		if(objectTypeName.length == 0) {
			return;
		}
		var parentStoreItems = this.getNewObjectType().down('grid[name="parentObjectTypesGrid"]').getStore().data.items;
		for (var i = 0; i < parentStoreItems.length; i++) {
			objectTypeIds.push(parentStoreItems[i].data.id.toString());
		}
		var associatedTypeStore = this.getNewObjectType().down('grid[name="associatedGrid"]').getStore();
		var associatedItems = associatedTypeStore.data.items;
		var associatedParam =  new Object();
		for (var i = 0; i < associatedItems.length; i++) {
			if (associatedItems[i].data.enabled && associatedItems[i].data.objectTypeId.toString().length > 0) {
				associatedParam[associatedItems[i].data.associatedType] = [associatedItems[i].data.objectTypeId.toString()];
			}
		}
		var parentVersion = null;
		var url;
		if(MYOCD.SharedData.currentObjectTypeCategory == null || MYOCD.SharedData.currentObjectTypeCategory.data.id == 'root') {
			url = OBJECT_TYPE_LIB_BASE_URL + MYOCD.SharedData.currentObjectTypeLibId + '/objecttypes.json';
		} else {
			url = OBJECT_TYPE_CATEGORY_BASE_URL + MYOCD.SharedData.currentObjectTypeCategory.data.id + '/objecttypes.json';
		}
		this.getNewObjectType().destroy();
		var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
		otlStoreController.addNewObjectType(url, objectTypeName, objectTypeDesc, objectTypeIds, parentVersion, associatedParam, this.getObjectTypeLibraryManager());
	},
	onUpdateObjectTypeBtnClick: function() {
		var objectTypeId = this.getNewObjectType().down('textfield[name="objectTypeId"]').getValue();
		var objectTypeName = this.getNewObjectType().down('textfield[name="objectTypeName"]').getValue();
		var objectTypeDesc = this.getNewObjectType().down('textfield[name="objectTypeDesc"]').getValue();
		var objectTypeIds = [];
		if(objectTypeName.length == 0) {
			return;
		}
		var parentStoreItems = this.getNewObjectType().down('grid[name="parentObjectTypesGrid"]').getStore().data.items;
		for (var i = 0; i < parentStoreItems.length; i++) {
			objectTypeIds.push(parentStoreItems[i].data.id.toString());
		}
		var associatedTypeStore = this.getNewObjectType().down('grid[name="associatedGrid"]').getStore();
		var associatedItems = associatedTypeStore.data.items;
		var associatedParam =  new Object();
		for (var i = 0; i < associatedItems.length; i++) {
			if (associatedItems[i].data.enabled && associatedItems[i].data.objectTypeId.toString().length > 0) {
				associatedParam[associatedItems[i].data.associatedType] = [associatedItems[i].data.objectTypeId.toString()];
			}
		}
		var parentVersion = null;
		this.getNewObjectType().destroy();
		var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
		otlStoreController.editObjectType(objectTypeId, objectTypeName, objectTypeDesc, objectTypeIds, parentVersion, associatedParam,this.getObjectTypeLibraryManager());
	},
	onNewOTRefOTVersionGridItemClick: function( grid, record, item, index, e, eOpts ) {
		if(MYOCD.SharedData.currentSelectRefOTVersion) {
			MYOCD.SharedData.currentSelectRefOTVersion.set('selected', false);
			MYOCD.SharedData.currentSelectRefOTVersion.commit();
		}
		if(MYOCD.SharedData.currentSelectRefOTVersion != record) {
			record.set('selected', true);
			record.commit();
			MYOCD.SharedData.currentSelectRefOTVersion = record;
		} else {
			MYOCD.SharedData.currentSelectRefOTVersion = null;
		}
	},
	onAddParentToolPanelClick: function() {
		if(this.getNewObjectTypeSelectParent()) {
			this.getNewObjectTypeSelectParent().down('textfield[name="addOrUpdate"]').setValue('add');
			Ext.WindowManager.bringToFront(this.getNewObjectTypeSelectParent());
			return;
		}
		var popup = Ext.create('MYOCD.view.objectTypeLibrary.NewObjectTypeSelectParent');
		popup.down('textfield[name="addOrUpdate"]').setValue('add');
		popup.show();
	},
	onCreateNewObjectTypeBtnPanelClick: function() {
		var addNewObject = this.getObjectTypeLibraryManager().down('panel[name="addNewObjectTypePanel"]');
		var objectTypeName = addNewObject.down('textfield[name="newObjectTypeName"]').getValue();
		var objectTypeDesc = addNewObject.down('textfield[name="newObjectTypeDesc"]').getValue();
		var objectTypeIds = [];
		if(objectTypeName.length == 0) {
			return;
		}
		var parentStoreItems = addNewObject.down('grid[name="parentObjectTypesGrid"]').getStore().data.items;
		for (var i = 0; i < parentStoreItems.length; i++) {
			objectTypeIds.push(parentStoreItems[i].data.id.toString());
		}
		var associatedTypeStore = addNewObject.down('grid[name="associatedGrid"]').getStore();
		var associatedItems = associatedTypeStore.data.items;
		var associatedParam =  new Object();
		for (var i = 0; i < associatedItems.length; i++) {
			if (associatedItems[i].data.enabled && associatedItems[i].data.objectTypeId.toString().length > 0) {
				associatedParam[associatedItems[i].data.associatedType] = [associatedItems[i].data.objectTypeId.toString()];
			}
		}
		var parentVersion = null;
		var url;
		if(MYOCD.SharedData.currentObjectTypeCategory == null || MYOCD.SharedData.currentObjectTypeCategory.data.id == 'root') {
			url = OBJECT_TYPE_LIB_BASE_URL + MYOCD.SharedData.currentObjectTypeLibId + '/objecttypes.json';
		} else {
			url = OBJECT_TYPE_CATEGORY_BASE_URL + MYOCD.SharedData.currentObjectTypeCategory.data.id + '/objecttypes.json';
		}
		// addNewObject.down('textfield[name="newObjectTypeName"]').setValue('');
		// addNewObject.down('textfield[name="newObjectTypeDesc"]').setValue('');
		// addNewObject.down('grid[name="parentObjectTypesGrid"]').getStore().removeAll();
		var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
		otlStoreController.addNewObjectType(url, objectTypeName, objectTypeDesc, objectTypeIds, parentVersion, associatedParam, this.getObjectTypeLibraryManager());
	}
});