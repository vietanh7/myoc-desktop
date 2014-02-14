Ext.define('MYOCD.controller.wsWindowsController.CreateCompanySelectTemplateController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'workspace',
			selector: 'workspace'	
		},
		{
			ref: 'newCompanyWizard',
			selector: 'newCompanyWizard'
		},
		{
			ref: 'newCompanySelectTemplate',
			selector: 'newCompanySelectTemplate'
		}
	],
	init: function() {
		this.control({
			'newCompanyWizard button[name="selectTemplateIdBtn"]': {
				click: this.onSelectTemplateIdBtnClick
			},
			'newCompanySelectTemplate dataview[name="newCompanyRefComTempLibDataview"]': {
				itemdblclick: this.onNewCompanyRefComTempLibDataviewDblClick
			},
			'newCompanySelectTemplate button[name="newCompanyRefComTempLibBackButton"]': {
				click: this.onNewCompanyRefComTempLibBackButtonClick
			},
			'newCompanySelectTemplate treepanel[name="newCompanyRefComTempCategoriesTree"]': {
				itemclick: this.onNewCompanyRefComTempCategoriesTreeItemClick,
				itemexpand: this.onNewCompanyRefComTempCategoriesTreeItemExpand
			},
			'newCompanySelectTemplate dataview[name="newCompanyRefComTemplatesDataView"]': {
				itemclick: this.onNewCompanyRefComTemplatesDataViewItemClick,
				itemdblclick: this.onNewCompanyRefComTemplatesDataViewItemClick
			},
			'newCompanySelectTemplate button[name="newCompanyAcceptParentBtn"]': {
				click: this.onNewCompanyAcceptParentBtnClick
			}
		});
	},
	onSelectTemplateIdBtnClick: function() {
		if(this.getNewCompanySelectTemplate()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.wsWindows.NewCompanySelectTemplate');
		popup.show();
		var refCompanyTemplateStoreController = MYOCD.controller.companyTemplate.RefCompanyTemplatesStoreController;
		refCompanyTemplateStoreController.loadCompanyTemplatesLibs(MYOCD.SharedData.currentCompanyId, popup);
	},
	onNewCompanyRefComTempLibDataviewDblClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentRefComTempLib = record.data;
		this.getNewCompanySelectTemplate().down('panel[name="newCompanyRefComTempLibPanel"]').setVisible(false);
		this.getNewCompanySelectTemplate().down('panel[name="newCompanyRefCompanyTemplatePanel"]').setVisible(true);
		var refCompanyTemplateStoreController = MYOCD.controller.companyTemplate.RefCompanyTemplatesStoreController;
		refCompanyTemplateStoreController.loadCategoriesOfCompanyTemplatesLib(record.data.id, record.data.name, this.getNewCompanySelectTemplate());
		refCompanyTemplateStoreController.loadTemplatesOfCompanyTemplatesLib(record.data.id);
	},
	onNewCompanyRefComTempLibBackButtonClick: function() {
		this.getNewCompanySelectTemplate().down('panel[name="newCompanyRefComTempLibPanel"]').setVisible(true);
		this.getNewCompanySelectTemplate().down('panel[name="newCompanyRefCompanyTemplatePanel"]').setVisible(false);
		Ext.getStore('companyTemplate.RefCompanyTemplates').removeAll();
		Ext.getStore('companyTemplate.RefCompanyTemplatesCategoriesTreeStore').setRootNode(null);
		Ext.getStore('companyTemplate.RefCompanyTemplatesCategoriesTreeStore').removeAll();
	},
	onNewCompanyRefComTempCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
		var refCompanyTemplateStoreController = MYOCD.controller.companyTemplate.RefCompanyTemplatesStoreController;
		if(record.get('id')!=='root') {
			refCompanyTemplateStoreController.loadTemplatesOfCompanyTemplatesCategory(record.get('id'));
		} else {
			refCompanyTemplateStoreController.loadTemplatesOfCompanyTemplatesLib(MYOCD.SharedData.currentRefComTempLib.id);
		}
    },
    onNewCompanyRefComTempCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		var refCompanyTemplateStoreController = MYOCD.controller.companyTemplate.RefCompanyTemplatesStoreController;
		if(categoryNode.data.id !== 'root') {
			refCompanyTemplateStoreController.loadTemplatesOfCompanyTemplatesCategory(record.get('id'));
			refCompanyTemplateStoreController.loadCategoriesOfCompanyTemplatesCategory(categoryNode.data.id, categoryNode);
		} else {
			refCompanyTemplateStoreController.loadTemplatesOfCompanyTemplatesLib(MYOCD.SharedData.currentRefComTempLib.id);
		}
	},
	onNewCompanyRefComTemplatesDataViewItemClick: function( dataview, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentSelectedRefCompanyTemplate = record.data;
	},
	onNewCompanyAcceptParentBtnClick: function() {
		if(!MYOCD.SharedData.currentSelectedRefCompanyTemplate) {
			this.getNewCompanySelectTemplate().destroy();
			return;
		}
		this.getNewCompanyWizard().down('textfield[name="companyTemplateId"]').setValue(
			MYOCD.SharedData.currentSelectedRefCompanyTemplate.id + '-' + MYOCD.SharedData.currentSelectedRefCompanyTemplate.name);
		this.getNewCompanyWizard().down('button[name="clearTemplateIdBtn"]').setVisible(true);
		this.getNewCompanySelectTemplate().destroy();
	}
});