Ext.define('MYOCD.controller.projectTemplate.NewProjectTemplateFeatureFromTplsController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'newProjectTemplateFeatureFromTpls',
			selector: 'newProjectTemplateFeatureFromTpls'
		}
	],
	init: function() {
		this.control({
			'newProjectTemplateFeature newProjectTemplateFeatureFromTpls dataview[name="newFeatureRefTplDataview"]': {
				itemdblclick: this.onNewFeatureRefTplDataviewItemDblClick
			},
			'newProjectTemplateFeature newProjectTemplateFeatureFromTpls button[name="newFeatureRefTPLBackButton"]': {
				click: this.onNewFeatureRefTPLBackButtonClick
			},
			'newProjectTemplateFeature newProjectTemplateFeatureFromTpls treepanel[name="newFeatureRefFeatureTemplateCategoriesTree"]': {
				itemclick: this.onNewFeatureRefFeatureTemplateCategoriesTreeItemClick,
				itemexpand: this.onNewFeatureRefFeatureTemplateCategoriesTreeItemExpand
			},
			'newProjectTemplateFeature newProjectTemplateFeatureFromTpls dataview[name="newFeatureRefFeatureTemplatesDataView"]': {
				render: this.onNewFeatureRefFeatureTemplatesDataViewRender
			}
		});
	},
	onNewFeatureRefTplDataviewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefTpl = record.data;
		this.getNewProjectTemplateFeatureFromTpls().down('panel[name="newFeatureRefTplPanel"]').setVisible(false);
		this.getNewProjectTemplateFeatureFromTpls().down('panel[name="newFeatureRefFeatureTemplatePanel"]').setVisible(true);
		var refTplStoreController = MYOCD.controller.featureTemplate.RefFeatureTemplatesStoreController;
		refTplStoreController.loadCategoriesOfFeatureTemplatesLib(record.data.id, record.data.name, this.getNewProjectTemplateFeatureFromTpls());
		refTplStoreController.loadTemplatesOfFeatureTemplatesLib(record.data.id);
	},
	onNewFeatureRefTPLBackButtonClick: function() {
		this.getNewProjectTemplateFeatureFromTpls().down('panel[name="newFeatureRefTplPanel"]').setVisible(true);
		this.getNewProjectTemplateFeatureFromTpls().down('panel[name="newFeatureRefFeatureTemplatePanel"]').setVisible(false);
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