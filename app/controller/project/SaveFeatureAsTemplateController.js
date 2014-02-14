Ext.define('MYOCD.controller.project.SaveFeatureAsTemplateController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'saveFeatureTemplate',
			selector: 'saveFeatureTemplate'
		},
		{
			ref: 'projectEstimating',
			selector: 'projectEstimating'
		},
		{
			ref: 'newFeatureTemplatesLibrary',
			selector: 'newFeatureTemplatesLibrary'
		}
	],
	init: function() {
		this.control({
			'saveFeatureTemplate': {
				show: this.onSaveFeatureTemplateShow
			},
			'saveFeatureTemplate dataview[name="saveTemplateFeatureRefTplDataView"]': {
				itemdblclick: this.onRefTplDataViewItemDblClick
			},
			'saveFeatureTemplate button[name="saveTemplateFeatureTplsBackBtn"]': {
				click: this.onSaveFeatureTemplateBackBtnClick
			},
			'saveFeatureTemplate treepanel[name="saveTemplateFeatureRefTemplateCateTree"]': {
				itemclick: this.onSaveFeatureTemplateCategoriesTreeItemClick,
				itemexpand: this.onSaveFeatureTemplateCategoriesTreeItemExpand
			},
			'saveFeatureTemplate button[name="saveFeatureTemplateBtn"]': {
				click: this.onSaveFeatureTemplateBtnClick
			},
			'saveFeatureTemplate tool[name="addNewFeatureTemplateTool"]': {
				click: this.onAddNewFeatureTemplateToolClick
			}
		});
	},
	onSaveFeatureTemplateShow: function() {
		var refTplStoreController = MYOCD.controller.featureTemplate.RefFeatureTemplatesStoreController;
		refTplStoreController.loadFeatureTemplatesLibs(MYOCD.SharedData.currentCompanyId, this.getSaveFeatureTemplate());
	},
	onRefTplDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefTpl = record.data;
		this.getSaveFeatureTemplate().down('panel[name="saveTemplateSelectLibPanel"]').setVisible(false);
		this.getSaveFeatureTemplate().down('container[name="saveTemplateSavePlacePanel"]').setVisible(true);
		var refTplStoreController = MYOCD.controller.featureTemplate.RefFeatureTemplatesStoreController;
		refTplStoreController.loadCategoriesOfFeatureTemplatesLib(record.data.id, record.data.name, this.getSaveFeatureTemplate());
		refTplStoreController.loadTemplatesOfFeatureTemplatesLib(record.data.id);
		MYOCD.SharedData.currentRefCategoryTpl = null;
	},
	onSaveFeatureTemplateBackBtnClick: function() {
		this.getSaveFeatureTemplate().down('panel[name="saveTemplateSelectLibPanel"]').setVisible(true);
		this.getSaveFeatureTemplate().down('container[name="saveTemplateSavePlacePanel"]').setVisible(false);
		Ext.getStore('featureTemplate.RefFeatureTemplates').removeAll();
		Ext.getStore('featureTemplate.RefFeatureTemplatesCategoriesTreeStore').setRootNode(null);
		Ext.getStore('featureTemplate.RefFeatureTemplatesCategoriesTreeStore').removeAll();
		MYOCD.SharedData.currentRefTpl = null;
		MYOCD.SharedData.currentRefCategoryTpl = null;
	},
	onSaveFeatureTemplateCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
		MYOCD.SharedData.currentRefCategoryTpl = record.data;
		var refTplStoreController = MYOCD.controller.featureTemplate.RefFeatureTemplatesStoreController;
		if(record.get('id')!=='root') {
			refTplStoreController.loadTemplatesOfFeatureTemplatesCategory(record.get('id'));
		} else {
			refTplStoreController.loadTemplatesOfFeatureTemplatesLib(MYOCD.SharedData.currentRefTpl.id);
			MYOCD.SharedData.currentRefCategoryTpl = null;
		}
    },
    onSaveFeatureTemplateCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
    	MYOCD.SharedData.currentRefCategoryTpl = categoryNode.data;
		var refTplStoreController = MYOCD.controller.featureTemplate.RefFeatureTemplatesStoreController;
		if(categoryNode.data.id !== 'root') {
			refTplStoreController.loadTemplatesOfFeatureTemplatesCategory(categoryNode.data.id);
			refTplStoreController.loadCategoriesOfFeatureTemplatesCategory(categoryNode.data.id, categoryNode);
		} else {
			refTplStoreController.loadTemplatesOfFeatureTemplatesLib(MYOCD.SharedData.currentRefTpl.id);
			MYOCD.SharedData.currentRefCategoryTpl = null;
		}
	},
	onSaveFeatureTemplateBtnClick: function() {
		var featureId = this.getSaveFeatureTemplate().down('textfield[name="featureId"]').getValue();
		var featureTemplateName = this.getSaveFeatureTemplate().down('textfield[name="saveTemplateName"]').getValue();
		var featureTemplateDesc = this.getSaveFeatureTemplate().down('textfield[name="saveTemplateDesc"]').getValue();
		if (featureTemplateName.trim().length == 0) {
			return;
		}
		var url;
		if (MYOCD.SharedData.currentRefCategoryTpl) {
			url = FEATURE_TEMPLATE_CATEGORY_BASE_URL + MYOCD.SharedData.currentRefCategoryTpl.id + '/templates.json';
		} else {
			url = FEATURE_TEMPLATE_LIB_BASE_URL + MYOCD.SharedData.currentRefTpl.id + '/templates.json';
		}
		this.getSaveFeatureTemplate().destroy();
		MYOCD.controller.project.ProjectsStoreController.saveFeatureAsFeatureTemplate(url, featureId, featureTemplateName, featureTemplateDesc, this.getProjectEstimating()); 
	},
	onAddNewFeatureTemplateToolClick: function() {
		var me = this;
		if(me.getNewFeatureTemplatesLibrary()) {
			Ext.WindowManager.bringToFront(me.getNewFeatureTemplatesLibrary());
			return;
		}
		var popup = Ext.create('MYOCD.view.featureTemplate.NewFeatureTemplatesLibrary');
		popup.down('textfield[name="featureTemplatesLibName"]').setValue(gCurrentWorkspaceName + ' Feature Templates Library');
		popup.show();
	}
});