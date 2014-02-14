Ext.define('MYOCD.controller.featureTemplate.NewFeatureFromTplsController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'newFeatureTemplateFeatureFromTpls',
			selector: 'newFeatureTemplateFeatureFromTpls'
		}
	],
	init: function() {
		this.control({
			'newFeature newFeatureTemplateFeatureFromTpls dataview[name="newFeatureRefTplDataview"]': {
				itemdblclick: this.onNewFeatureRefTplDataviewItemDblClick
			},
			'newFeature newFeatureTemplateFeatureFromTpls button[name="newFeatureRefTPLBackButton"]': {
				click: this.onNewFeatureRefTPLBackButtonClick
			},
			'newFeature newFeatureTemplateFeatureFromTpls treepanel[name="newFeatureRefFeatureTemplateCategoriesTree"]': {
				itemclick: this.onNewFeatureRefFeatureTemplateCategoriesTreeItemClick,
				itemexpand: this.onNewFeatureRefFeatureTemplateCategoriesTreeItemExpand
			},
			'newFeature newFeatureTemplateFeatureFromTpls dataview[name="newFeatureRefFeatureTemplatesDataView"]': {
				render: this.onNewFeatureRefFeatureTemplatesDataViewRender
			}
		});
	},
	onNewFeatureRefTplDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefTpl = record.data;
		this.getNewFeatureTemplateFeatureFromTpls().down('panel[name="newFeatureRefTplPanel"]').setVisible(false);
		this.getNewFeatureTemplateFeatureFromTpls().down('panel[name="newFeatureRefFeatureTemplatePanel"]').setVisible(true);
		var refTplStoreController = MYOCD.controller.featureTemplate.RefFeatureTemplatesStoreController;
		refTplStoreController.loadCategoriesOfFeatureTemplatesLib(record.data.id, record.data.name, this.getNewFeatureTemplateFeatureFromTpls());
		refTplStoreController.loadTemplatesOfFeatureTemplatesLib(record.data.id);
	},
	onNewFeatureRefTPLBackButtonClick: function() {
		this.getNewFeatureTemplateFeatureFromTpls().down('panel[name="newFeatureRefTplPanel"]').setVisible(true);
		this.getNewFeatureTemplateFeatureFromTpls().down('panel[name="newFeatureRefFeatureTemplatePanel"]').setVisible(false);
		Ext.getStore('featureTemplate.RefFeatureTemplates').removeAll();
		Ext.getStore('featureTemplate.RefFeatureTemplatesCategoriesTreeStore').setRootNode(null);
		Ext.getStore('featureTemplate.RefFeatureTemplatesCategoriesTreeStore').removeAll();
	},
	onNewFeatureRefFeatureTemplateCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
		var refTplStoreController = MYOCD.controller.featureTemplate.RefFeatureTemplatesStoreController;
		if(record.get('id')!=='root') {
			refTplStoreController.loadTemplatesOfFeatureTemplatesCategory(record.get('id'));
		} else {
			refTplStoreController.loadTemplatesOfFeatureTemplatesLib(MYOCD.SharedData.currentRefTpl.id);
		}
    },
    onNewFeatureRefFeatureTemplateCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		var refTplStoreController = MYOCD.controller.featureTemplate.RefFeatureTemplatesStoreController;
		if(categoryNode.data.id !== 'root') {
			refTplStoreController.loadTemplatesOfFeatureTemplatesCategory(categoryNode.data.id);
			refTplStoreController.loadCategoriesOfFeatureTemplatesCategory(categoryNode.data.id, categoryNode);
		} else {
			refTplStoreController.loadTemplatesOfFeatureTemplatesLib(MYOCD.SharedData.currentRefTpl.id);
		}
	},
	onNewFeatureRefFeatureTemplatesDataViewRender: function(dataview, eOpts) {
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
	                    	type: 'featureTemplate'
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