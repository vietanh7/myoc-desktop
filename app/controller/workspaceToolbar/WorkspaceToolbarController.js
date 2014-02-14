Ext.define('MYOCD.controller.workspaceToolbar.WorkspaceToolbarController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'settingsDialog',
			selector: 'settingsDialog'
		},
		{
			ref: 'contactsDialog',
			selector: 'contactsDialog'
		},
		{
			ref: 'securityDialog',
			selector: 'securityDialog'
		},
		{
			ref: 'profileEditorDialog',
			selector: 'profileEditorDialog'
		},
		{
			ref: 'librariesWindow',
			selector: 'librariesWindow'
		},
		{
			ref: 'catalogsWindow',
			selector: 'catalogsWindow'
		},
		{
			ref: 'templatesWindow',
			selector: 'templatesWindow'
		},
		{
			ref: 'workspaceProfile',
			selector: 'workspaceProfile'
		},
		{
			ref: 'workspaceTypeCombobox',
			selector: 'combobox[name="workspaceType"]'
		}
	],
	init: function() {
		this.control({
			'button[name="catalogsBtn"]': {
				click: this.onCatalogsBtnClick
			},
			'button[name="templatesBtn"]': {
				click: this.onTemplatesBtnClick	
			},
			'button[name="librariesBtn"]': {
				click: this.onLibrariesBtnClick	
			},
			'button[name="settingsBtn"]': {
				click: this.onSettingsBtnClick
			},
			'button[name="contactsBtn"]': {
				click: this.onContactsBtnClick
			},
			'button[name="securityBtn"]': {
				click: this.onSecurityBtnClick
			},
			'splitbutton[name="userButton"]': {
	            click: this.onUserButtonClick
            },
			'menuitem[name="editProfileMenu"]': {
				click: this.onEditProfileMenuClick
			},
			'button[name="organizationBtn"]': {
				click: this.onOrganizationBtnClick
			},
			'splitbutton[name="workspaceChangeButton"]': {
				click: this.onWorkspaceChangeButtonClick
			}
		});
	},
	onSettingsBtnClick: function() {
		if(this.getSettingsDialog()) {
			Ext.WindowManager.bringToFront(this.getSettingsDialog());
			return;
		}
		var popup = Ext.create('MYOCD.view.toolbarDialogs.SettingsDialog');
		popup.show();
	},
	onContactsBtnClick: function() {
		var popup;
		if(this.getContactsDialog()) {
			popup = this.getContactsDialog();
			Ext.WindowManager.bringToFront(this.getContactsDialog());
		} else {
			var popup = Ext.create('MYOCD.view.toolbarDialogs.ContactsDialog');
			popup.show();
		}
		var contactStoreController = MYOCD.controller.main.ContactStoreController;
		contactStoreController.loadContact(popup);
 	},
 	onSecurityBtnClick: function() {
	 	if(this.getSecurityDialog()) {
	 		Ext.WindowManager.bringToFront(this.getSecurityDialog());
		} else {
			var popup = Ext.create('MYOCD.view.toolbarDialogs.SecurityDialog');
			popup.show();
		}
		
		Ext.getStore('company.AuthorizationEntities').removeAll();
		Ext.getStore('company.AssignedOrgs').removeAll();
		Ext.getStore('company.AssignedRoles').removeAll();
		
		var companyStoreController =  MYOCD.controller.company.CompaniesStoreController;
        companyStoreController.getAuthorizationEntities(MYOCD.SharedData.currentCompanyId);
 	},
 	    
    onUserButtonClick: function() {
	    if(this.getProfileEditorDialog()) {
	    	Ext.WindowManager.bringToFront(this.getProfileEditorDialog());
			return;
		}
		var popup = Ext.create('MYOCD.view.toolbarDialogs.ProfileEditorDialog');
		popup.show();
    },
    
    onEditProfileMenuClick: function() {
	    if(this.getProfileEditorDialog()) {
	    	Ext.WindowManager.bringToFront(this.getProfileEditorDialog());
			return;
		}
		var popup = Ext.create('MYOCD.view.toolbarDialogs.ProfileEditorDialog');
		popup.show();
    },
    
    onCatalogsBtnClick: function() {
    	if(this.getCatalogsWindow()){
    		Ext.WindowManager.bringToFront(this.getCatalogsWindow());
    	} else {
	    	var popup = Ext.create('MYOCD.view.catalogs.CatalogsWindow');
			popup.show();
    	}
    	
    	var productCatalogStore = MYOCD.controller.productCatalog.ProductCatalogsStoreController;
        productCatalogStore.loadProductCatalogsLibs(MYOCD.SharedData.currentCompanyId);
    },
    
    onTemplatesBtnClick: function() {
    	if(this.getTemplatesWindow()){
    		Ext.WindowManager.bringToFront(this.getTemplatesWindow());
    	} else {
	    	var popup = Ext.create('MYOCD.view.templates.TemplatesWindow');
			popup.show();
    	}
    	
    	var companyTemplatesStore = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
        companyTemplatesStore.loadCompanyTemplatesLibs( MYOCD.SharedData.currentCompanyId);
    },
    
    onLibrariesBtnClick: function() {
    	if(this.getLibrariesWindow()){
	    	Ext.WindowManager.bringToFront(this.getLibrariesWindow());
    	} else {
	    	var popup = Ext.create('MYOCD.view.libraries.LibrariesWindow');
			popup.show();
    	}

    	var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
        otlStoreController.loadObjectTypeLibraries(MYOCD.SharedData.currentCompanyId);
    },
    
    onOrganizationBtnClick: function() {
	    if(this.getWorkspaceProfile()) {
	    	Ext.WindowManager.bringToFront(this.getWorkspaceProfile());
		    return;
	    } 
	    var popup = Ext.create('MYOCD.view.toolbarDialogs.WorkspaceProfile');
	    popup.show();
    },
    
    onWorkspaceChangeButtonClick: function(button) {
	    var curIndex = Ext.getStore('Workspace').find('id', gCurrentWorkspaceId);
	    if(curIndex < Ext.getStore('Workspace').getCount() - 1){
		    curIndex++;
	    } else {
		    curIndex = 0;
	    }
	    var record = Ext.getStore('Workspace').data.items[curIndex];
	    this.getWorkspaceTypeCombobox().setValue(record.data.id);
    }
});