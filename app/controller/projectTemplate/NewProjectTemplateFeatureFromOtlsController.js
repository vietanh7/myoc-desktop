Ext.define('MYOCD.controller.projectTemplate.NewProjectTemplateFeatureFromOtlsController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'newProjectTemplateFeatureFromOtls',
			selector: 'newProjectTemplateFeatureFromOtls'
		}
	],
	init: function() {
		this.control({
			'newProjectTemplateFeature newProjectTemplateFeatureFromOtls dataview[name="newFeatureRefOTLDataview"]': {
				itemdblclick: this.onNewFeatureRefOTLDataviewItemDblClick
			},
			'newProjectTemplateFeature newProjectTemplateFeatureFromOtls button[name="newFeatureRefOTLBackButton"]': {
				click: this.onNewFeatureRefOTLBackButtonClick
			},
			'newProjectTemplateFeature newProjectTemplateFeatureFromOtls treepanel[name="newFeatureRefObjectTypeCategoriesTree"]': {
				itemclick: this.onNewFeatureRefObjectTypeCategoriesTreeItemClick,
				itemexpand: this.onNewFeatureRefObjectTypeCategoriesTreeItemExpand
			},
			'newProjectTemplateFeature newProjectTemplateFeatureFromOtls dataview[name="newFeatureRefObjectTypesDataView"]': {
				render: this.onNewFeatureRefObjectTypesDataViewRender
			}
		});
	},
	onNewFeatureRefOTLDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefOTL = record.data;
		this.getNewProjectTemplateFeatureFromOtls().down('panel[name="newFeatureRefOTLPanel"]').setVisible(false);
		this.getNewProjectTemplateFeatureFromOtls().down('panel[name="newFeatureRefOTPanel"]').setVisible(true);
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadCategoriesOfObjectTypesLib(record.data.id, record.data.name, this.getNewProjectTemplateFeatureFromOtls());
		refOTLStoreController.loadObjectTypesOfObjectTypeLib(record.data.id);
	},
	onNewFeatureRefOTLBackButtonClick: function() {
		this.getNewProjectTemplateFeatureFromOtls().down('panel[name="newFeatureRefOTLPanel"]').setVisible(true);
		this.getNewProjectTemplateFeatureFromOtls().down('panel[name="newFeatureRefOTPanel"]').setVisible(false);
		Ext.getStore('objectTypeLibrary.RefObjectTypes').removeAll();
		Ext.getStore('objectTypeLibrary.RefObjectTypeCategoriesTreeStore').setRootNode(null);
		Ext.getStore('objectTypeLibrary.RefObjectTypeCategoriesTreeStore').removeAll();
	},
	onNewFeatureRefObjectTypeCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		if(record.get('id')!=='root') {
			refOTLStoreController.loadObjectTypesOfObjectTypeCategory(record.get('id'));
		} else {
			refOTLStoreController.loadObjectTypesOfObjectTypeLib(MYOCD.SharedData.currentRefOTL.id);
		}
    },
    onNewFeatureRefObjectTypeCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		if(categoryNode.data.id !== 'root') {
			refOTLStoreController.loadObjectTypesOfObjectTypeCategory(categoryNode.data.id);
			refOTLStoreController.loadCategoriesOfObjectTypesCategory(categoryNode.data.id, categoryNode);
		} else {
			refOTLStoreController.loadObjectTypesOfObjectTypeLib(MYOCD.SharedData.currentRefOTL.id);
		}
	},
	onNewFeatureRefObjectTypesDataViewRender: function(dataview, eOpts) {
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