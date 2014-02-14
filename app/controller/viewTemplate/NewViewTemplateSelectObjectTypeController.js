Ext.define('MYOCD.controller.viewTemplate.NewViewTemplateSelectObjectTypeController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'newViewTemplateSelectObjectType',
			selector: 'newViewTemplateSelectObjectType'
		}
	],
	init: function () {
		this.control({
			'newViewTemplateSelectObjectType dataview[name="newViewRefOTLDataview"]': {
				itemdblclick: this.onNewViewRefOTLDataviewItemDblClick
			},
			'newViewTemplateSelectObjectType button[name="newViewRefOTLBackButton"]': {
				click: this.onNewViewRefOTLBackButtonClick
			},
			'newViewTemplateSelectObjectType treepanel[name="newViewRefObjectTypeCategoriesTree"]': {
				itemclick: this.onNewViewRefObjectTypeCategoriesTreeItemClick,
				itemexpand: this.onNewViewRefObjectTypeCategoriesTreeItemExpand
			},
			'newViewTemplateSelectObjectType dataview[name="newViewRefObjectTypesDataView"]': {
				render: this.onNewViewRefObjectTypesDataViewRender
			}
		});
	},
	onNewViewRefOTLDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefOTL = record.data;
		this.getNewViewTemplateSelectObjectType().down('panel[name="newViewRefOTLPanel"]').setVisible(false);
		this.getNewViewTemplateSelectObjectType().down('panel[name="newViewRefOTPanel"]').setVisible(true);
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadCategoriesOfObjectTypesLib(record.data.id, record.data.name, this.getNewViewTemplateSelectObjectType());
		refOTLStoreController.loadObjectTypesOfObjectTypeLib(record.data.id);
	},
	onNewViewRefOTLBackButtonClick: function() {
		this.getNewViewTemplateSelectObjectType().down('panel[name="newViewRefOTLPanel"]').setVisible(true);
		this.getNewViewTemplateSelectObjectType().down('panel[name="newViewRefOTPanel"]').setVisible(false);
		Ext.getStore('objectTypeLibrary.RefObjectTypes').removeAll();
		Ext.getStore('objectTypeLibrary.RefObjectTypeCategoriesTreeStore').setRootNode(null);
		Ext.getStore('objectTypeLibrary.RefObjectTypeCategoriesTreeStore').removeAll();
	},
	onNewViewRefObjectTypeCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		if(record.get('id')!=='root') {
			refOTLStoreController.loadObjectTypesOfObjectTypeCategory(record.get('id'));
		} else {
			refOTLStoreController.loadObjectTypesOfObjectTypeLib(MYOCD.SharedData.currentRefOTL.id);
		}
    },
    onNewViewRefObjectTypeCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		if(categoryNode.data.id !== 'root') {
			refOTLStoreController.loadObjectTypesOfObjectTypeCategory(categoryNode.data.id);
			refOTLStoreController.loadCategoriesOfObjectTypesCategory(categoryNode.data.id, categoryNode);
		} else {
			refOTLStoreController.loadObjectTypesOfObjectTypeLib(MYOCD.SharedData.currentRefOTL.id);
		}
	},
	onNewViewRefObjectTypesDataViewRender: function(dataview, e, eOpts) {
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
	                    objectTypeData: dataview.getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	}
});