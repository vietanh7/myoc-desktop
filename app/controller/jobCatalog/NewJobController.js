Ext.define('MYOCD.controller.jobCatalog.NewJobController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'jobCatalogsTab',
			selector: 'jobCatalogsTab'
		},
		{
			ref: 'newJob',
			selector: 'newJob'
		},
		{
			ref: 'newJobSelectParent',
			selector: 'newJobSelectParent'
		},
		{
			ref: 'newOTRefObjectTypesDataView',
			selector: 'newJobSelectParent dataview[name="newOTRefObjectTypesDataView"]'
		},
		{
			ref: 'newOTRefOTVersionGrid',
			selector: 'newJobSelectParent grid[name="newOTRefOTVersionGrid"]'
		}
	],
	init: function() {
		this.control({
			'newJob button[name="selectOTParentBtn"]': {
				click: this.onSelectOTParentBtnClick
			},
			'newJobSelectParent dataview[name="newOTRefOTLDataview"]': {
				itemdblclick: this.onNewOTRefOTLDataviewItemDblClick
			},
			'newJobSelectParent button[name="newOTRefOTLBackButton"]': {
				click: this.onNewOTRefOTLBackButtonClick
			},
			'newJobSelectParent treepanel[name="newOTRefObjectTypeCategoriesTree"]': {
				itemclick: this.onNewOTRefObjectTypeCategoriesTreeItemClick,
				itemexpand: this.onNewOTRefObjectTypeCategoriesTreeItemExpand
			},
			'newJobSelectParent dataview[name="newOTRefObjectTypesDataView"]': {
				itemclick: this.onNewOTRefObjectTypesDataViewClick,
				itemdblclick: this.onNewOTRefObjectTypesDataViewClick
			},
			'newJobSelectParent button[name="newOTAcceptParentBtn"]': {
				click: this.onNewOTAcceptParentBtnClick
			},
			'newJob button[name="clearOTParentBtn"]': {
				click: this.onClearOTParentBtnClick
			},
			'newJob button[name="createNewJobBtn"]': {
				click: this.onCreateNewJobBtnClick
			},
			'newJob button[name="updateJobBtn"]': {
				click: this.onUpdateJobBtnClick
			},
			'newJobSelectParent grid[name="newOTRefOTVersionGrid"]': {
				itemclick: this.onNewOTRefOTVersionGridItemClick,
				itemdblclick: this.onNewOTRefOTVersionGridItemClick
			}

		})
	},
	onSelectOTParentBtnClick: function() {
		if(this.getNewJobSelectParent()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.jobCatalog.NewJobSelectParent');
		popup.show();
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadObjectTypeLibraries(MYOCD.SharedData.currentCompanyId, this.getNewJobSelectParent());
	},
	onNewOTRefOTLDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefOTL = record.data;
		this.getNewJobSelectParent().down('panel[name="newOTRefOTLPanel"]').setVisible(false);
		this.getNewJobSelectParent().down('panel[name="newOTRefOTPanel"]').setVisible(true);
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadCategoriesOfObjectTypesLib(record.data.id, record.data.name, this.getNewJobSelectParent());
		refOTLStoreController.loadObjectTypesOfObjectTypeLib(record.data.id);
	},
	onNewOTRefOTLBackButtonClick: function() {
		this.getNewJobSelectParent().down('panel[name="newOTRefOTLPanel"]').setVisible(true);
		this.getNewJobSelectParent().down('panel[name="newOTRefOTPanel"]').setVisible(false);
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
			this.getNewJobSelectParent().destroy();
			return;
		}
		if(MYOCD.SharedData.currentSelectRefOTVersion) {
			this.getNewJob().down('textfield[name="parentObjectType"]').setValue(MYOCD.SharedData.currentSelectedRefOT.name + ' - ' +  MYOCD.SharedData.currentSelectRefOTVersion.data.name);
			this.getNewJob().down('textfield[name="parentObjectTypeVersion"]').setValue(MYOCD.SharedData.currentSelectRefOTVersion.data.id);
		} else {
			this.getNewJob().down('textfield[name="parentObjectType"]').setValue(MYOCD.SharedData.currentSelectedRefOT.name);
		}
		this.getNewJob().down('textfield[name="parentObjectTypeId"]').setValue(MYOCD.SharedData.currentSelectedRefOT.id);
		this.getNewJob().down('button[name="clearOTParentBtn"]').setVisible(true);
		this.getNewJobSelectParent().destroy();
	},
	onClearOTParentBtnClick: function(btn) {
		btn.setVisible(false);
		this.getNewJob().down('textfield[name="parentObjectType"]').setValue('');
		this.getNewJob().down('textfield[name="parentObjectTypeId"]').setValue('');
	}, 
	onCreateNewJobBtnClick: function() {
		var jobName = this.getNewJob().down('textfield[name="jobName"]').getValue();
		var jobDesc = this.getNewJob().down('textfield[name="jobDesc"]').getValue();
		var objectTypeId = this.getNewJob().down('textfield[name="parentObjectTypeId"]').getValue();
		var objectTypeVersion = this.getNewJob().down('textfield[name="parentObjectTypeVersion"]').getValue();
		if(jobName.length == 0) {
			return;
		}
		if(objectTypeId.length ==0) {
			objectTypeId = null;
		}
		objectTypeVersion = objectTypeVersion.length > 0 ? objectTypeVersion : null;
		var url;
		if(MYOCD.SharedData.currentJobCatalogsCategory == null || MYOCD.SharedData.currentJobCatalogsCategory.data.id == 'root') {
			url = JOB_CATALOG_LIB_BASE_URL + MYOCD.SharedData.currentJobCatalogLibId + '/jobs.json';
		} else {
			url = JOB_CATALOG_CATEGORY_BASE_URL + MYOCD.SharedData.currentJobCatalogsCategory.data.id + '/jobs.json';
		}
		this.getNewJob().destroy();

		var jobCatalogStoreCtl = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
		jobCatalogStoreCtl.addNewJob(url, jobName, jobDesc, objectTypeId, objectTypeVersion, this.getJobCatalogsTab());
	},
	onUpdateJobBtnClick: function() {
		var jobId = this.getNewJob().down('textfield[name="jobId"]').getValue();
		var jobName = this.getNewJob().down('textfield[name="jobName"]').getValue();
		var jobDesc = this.getNewJob().down('textfield[name="jobDesc"]').getValue();
		var objectTypeId = this.getNewJob().down('textfield[name="parentObjectTypeId"]').getValue();
		var objectTypeVersion = this.getNewJob().down('textfield[name="parentObjectTypeVersion"]').getValue();
		if(jobName.length == 0) {
			return;
		}
		if(objectTypeId.length ==0) {
			objectTypeId = null;
		}
		
		objectTypeVersion = objectTypeVersion.length > 0 ? objectTypeVersion : null;
		this.getNewJob().destroy();
		
		var jobCatalogStoreCtl = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
		jobCatalogStoreCtl.editJob(jobId, jobName, jobDesc, objectTypeId, objectTypeVersion, this.getJobCatalogsTab());
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
		
	}
});