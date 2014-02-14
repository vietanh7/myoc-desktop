Ext.define('MYOCD.controller.project.NewProjectFeatureFromOtlsController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'workspace',
			selector: 'workspace'
		},
		{
			ref: 'newProjectFeatureFromOtls',
			selector: 'newProjectFeatureFromOtls'
		}
	],
	init: function() {
		this.control({
			'newProjectFeature newProjectFeatureFromOtls dataview[name="newOTRefOTLDataview"]': {
				itemdblclick: this.onNewOTRefOTLDataviewItemDblClick
			},
			'newProjectFeature newProjectFeatureFromOtls button[name="newOTRefOTLBackButton"]': {
				click: this.onNewOTRefOTLBackButtonClick
			},
			'newProjectFeature newProjectFeatureFromOtls treepanel[name="newOTRefObjectTypeCategoriesTree"]': {
				itemclick: this.onNewOTRefObjectTypeCategoriesTreeItemClick,
				itemexpand: this.onNewOTRefObjectTypeCategoriesTreeItemExpand
			},
			'newProjectFeature newProjectFeatureFromOtls dataview[name="newOTRefObjectTypesDataView"]': {
				render: this.onNewOTRefObjectTypesDataViewRender
			}
		});
	},
	onNewOTRefOTLDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefOTL = record.data;
		this.getNewProjectFeatureFromOtls().down('panel[name="newOTRefOTLPanel"]').setVisible(false);
		this.getNewProjectFeatureFromOtls().down('panel[name="newOTRefOTPanel"]').setVisible(true);
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadCategoriesOfObjectTypesLib(record.data.id, record.data.name, this.getNewProjectFeatureFromOtls());
		refOTLStoreController.loadObjectTypesOfObjectTypeLib(record.data.id);
	},
	onNewOTRefOTLBackButtonClick: function() {
		this.getNewProjectFeatureFromOtls().down('panel[name="newOTRefOTLPanel"]').setVisible(true);
		this.getNewProjectFeatureFromOtls().down('panel[name="newOTRefOTPanel"]').setVisible(false);
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
	onNewOTRefObjectTypesDataViewRender: function(dataview, eOpts) {
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
	                    featureData: {
	                    	infoData: dataview.getRecord(sourceEl).data,
	                    	type: 'objectType'
	                    }
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY; 	        
	        }
	    });
	}
});