Ext.define('MYOCD.controller.wsWindowsController.CreateCompanyController', {
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'workspace',
			selector: 'workspace'	
		},
		{
	        ref: 'workspaceMenu',
	        selector: 'workspace menu[name="workspaceMenu"]'
        },
		{
			ref: 'newCompanyWizard',
			selector: 'newCompanyWizard'
		},
		{
			ref: 'newCompanyMainPanel',
			selector: 'newCompanyWizard panel[name="newCompanyMainPanel"]'
		}
	],
	init: function() {
		this.control({
			'menuitem[name="createComMenu"]': {
				click: this.onCreateComMenuClick	
			},
			'newCompanyWizard': {
				render: this.onNewCompanyWizardRender
			},
			'newCompanyWizard button[name="newComBackBtn"]': {
				click: this.onNewComBackBtnClick
			},
			'newCompanyWizard button[name="newComNextBtn"]': {
				click: this.onNewComNextBtnClick
			},
			'newCompanyWizard button[name="clearTemplateIdBtn"]': {
				click: this.onClearTemplateIdBtnClick
			}
		});
	},
	
	onCreateComMenuClick: function() {
		if(this.getNewCompanyWizard()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.wsWindows.NewCompanyWizard');
		popup.show();
	},
	onNewCompanyWizardRender: function(window, eOpts) {
		MYOCD.SharedData.currentNewCompanyStep = 1;
		window.down('button[name="newComBackBtn"]').setDisabled(true);
	},
	onNewComBackBtnClick: function(btn) {
		MYOCD.SharedData.currentNewCompanyStep --;
		if(MYOCD.SharedData.currentNewCompanyStep == 1) {
			btn.setDisabled(true);
		}
		for(var i = 1; i <= 3; i++) {
			if(i == MYOCD.SharedData.currentNewCompanyStep) {
				this.getNewCompanyMainPanel().items.items[i-1].setVisible(true);
			} else {
				this.getNewCompanyMainPanel().items.items[i-1].setVisible(false);
			}
		}
		this.getNewCompanyWizard().down('button[name="newComNextBtn"]').setDisabled(false);
		this.getNewCompanyWizard().down('button[name="newComNextBtn"]').setText('Next');
		this.getNewCompanyWizard().down('button[name="newComNextBtn"]').setWidth(100);
	},
	onNewComNextBtnClick: function(btn) {
		var me = this;
		if(btn.getText() == 'Create Company') {
			var companyInfoField = this.getNewCompanyWizard().down('fieldset[name="companyInfoField"]');
			
			var companyName = companyInfoField.down('textfield[name="companyName"]').getValue();
			var companyDesc = companyInfoField.down('textfield[name="companyDesc"]').getValue();
			var companyWeb = companyInfoField.down('textfield[name="companyWeb"]').getValue();
			var companyTax = companyInfoField.down('textfield[name="companyTaxId"]').getValue();
			var templateIdField = this.getNewCompanyWizard().down('textfield[name="companyTemplateId"]').getValue().split('-');
			var templateId = templateIdField.length > 0 ? templateIdField[0] : null;
			if(companyName.length == 0) {
				return;
			}
			
			var employeeInfoField = this.getNewCompanyWizard().down('fieldset[name="employeeInfoField"]');
			var employeeName = employeeInfoField.down('textfield[name="createComEmployeeName"]').getValue();
			var employeeDesc = employeeInfoField.down('textfield[name="createComEmployeeDesc"]').getValue();
			var employeeEmail = employeeInfoField.down('textfield[name="createComEmployeeEmail"]').getValue();
			var employeeSkype = employeeInfoField.down('textfield[name="createComEmployeeSkype"]').getValue();
			var employeeAddress = employeeInfoField.down('textfield[name="createComEmployeeAddress"]').getValue();
			
			var createNewCompanyCallBack = function() {
			
				me.getWorkspaceMenu().removeAll();
				
				var workspaceController = MYOCD.controller.workspace.WorkspaceStoreController;
				workspaceController.loadWorkspaces(
		        	function(wpData) {
			        	for (var i = 0; i < wpData.length; i++) {
		                    if(me.getWorkspaceMenu().items.length < wpData.length) {
		                    	var icon;
		                    	if(wpData[i].type == 'PersonalWorkspace') {
			                    	icon = 'personal-ws-icon';
		                    	} else {
			                    	if(wpData[i].type == 'CompanyWorkspace') {
				                    	icon = 'company-ws-icon';
			                    	} else {
				                    	icon = 'community-ws-icon';
			                    	}
		                    	}
			                    me.getWorkspaceMenu().add(
			                    	{
				                    	xtype: 'menuitem',
				                    	iconCls: icon,
				                    	text: wpData[i].name,
				                    	workspaceId: wpData[i].id,
				                    	handler: function(menu) {
					                    	menu.up('workspace').down('combobox[name=workspaceType]').setValue(menu.workspaceId);
				                    	}
			                    	}
			                    )
		                    }
		                };
		        	}
		        )
	        }
			var companiesStoreController = MYOCD.controller.company.CompaniesStoreController;
			
			companiesStoreController.createNewCompany( templateId, companyName, companyDesc, companyWeb, companyTax, 
				employeeName, employeeDesc, employeeEmail, employeeSkype, employeeAddress, '', me.getWorkspace(), createNewCompanyCallBack);
				
			this.getNewCompanyWizard().destroy();
			
			return;
		}
		MYOCD.SharedData.currentNewCompanyStep ++;
		if(MYOCD.SharedData.currentNewCompanyStep == 3) {
			btn.setText('Create Company');
			btn.setWidth(140);
		}
		for(var i = 1; i <= 3; i++) {
			if(i == MYOCD.SharedData.currentNewCompanyStep) {
				this.getNewCompanyMainPanel().items.items[i-1].setVisible(true);
			} else {
				this.getNewCompanyMainPanel().items.items[i-1].setVisible(false);
			}
		}
		this.getNewCompanyWizard().down('button[name="newComBackBtn"]').setDisabled(false);
	},
	onClearTemplateIdBtnClick: function(btn) {
		btn.setVisible(false);
		this.getNewCompanyWizard().down('textfield[name="companyTemplateId"]').setValue('');
	}
});