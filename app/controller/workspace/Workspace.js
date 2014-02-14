Ext.define('MYOCD.controller.workspace.Workspace', {
    extend: 'Ext.app.Controller',
    requires: [
    	'Ext.window.MessageBox',
        'Ext.History',
    	'Ext.Viewport'
    ],

    refs: [
        {
            ref: 'login',
            selector: 'login'
        },
        {
            ref: 'main',
            selector: 'main'
        },
        {
            ref: 'viewport',
            selector: 'viewport'
        },
        {
            ref: 'workspace',
            selector: 'workspace'
        },
        {
            ref: 'workspacepersonalnewproject',
            selector: 'workspacepersonalnewproject'
        },
        {
            ref: 'workspacepersonal',
            selector: 'workspacepersonal'
        },
        {
            ref: 'workspacecompany',
            selector: 'workspacecompany'
        },
        {
            ref: 'workspacecompanyhome',
            selector: 'workspacecompanyhome'
        },
        {
            ref: 'workspacepersonalhome',
            selector: 'workspacepersonalhome'
        },
        {
        	ref: 'organizationBtn',
	        selector: 'button[name="organizationBtn"]'
        },
        {
	     	ref: 'accountMenu',
	     	selector: 'menuitem[name="accountMenu"]' 
        }, 
        {
	        ref: 'userButton',
	        selector: 'splitbutton[name="userButton"]'
        },
        {
	        ref: 'workspaceMenu',
	        selector: 'menu[name="workspaceMenu"]'
        }
    ],

    init: function() {
        this.control({
            'workspace': {
                render: this.onWorkspaceRendered
            },
            'workspacepersonal': {
                render: this.onWorkspacepersonalRendered
            },
            'workspacecompany': {
                render: this.onWorkspacecompanyRendered
            },
            'workspacecompanyhome': {
                hide: this.onWorkspacehomeHide
            },
            'workspacepersonalhome': {
                hide: this.onWorkspacehomeHide
            },
            'combobox[name=workspaceType]': {
                'change': this.onWorkspaceTypeChange
            }
        });
    },
    
    onWorkspaceRendered: function() {
        var me = this;
        
        var associatedTypesStoreController = MYOCD.controller.main.AssociatedTypesStoreController;
        associatedTypesStoreController.loadAssociatedTypes();

        var modulesStoreController = MYOCD.controller.modules.ModulesStoreController;
        modulesStoreController.loadModules();
        
        var companiesStoreController = MYOCD.controller.company.CompaniesStoreController;
        companiesStoreController.loadCompanies();
        
        var workspaceController = MYOCD.controller.workspace.WorkspaceStoreController;
        workspaceController.loadWorkspaces(
        	function(wpData) {
	        	for (var i = 0; i < wpData.length; i++) {
                    if (wpData[i].type == 'PersonalWorkspace') {
                        me.getWorkspace().down('combobox[name=workspaceType]').setValue(wpData[i].id);
                    }
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
    },
    
    
    onWorkspacepersonalRendered: function() {
        var me = this;

        if (!gCurrentWorkspaceId) {
            return;
        };

        Ext.get('workspacepersonalTitleText').update(gCurrentWorkspaceName);
        me.getWorkspace().setLoading('Loading your personal workspace... ');
        console.log("API error, stop requesting");
        me.getWorkspace().setLoading(false);
        return;
        Ext.Ajax.request({
            url: PERSONAL_WORKSPACE_BASE_URL + gCurrentWorkspaceId +'.json',
            method: 'GET',
            withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(response) {
                me.loadProjects(me.getWorkspacepersonalhome().down('panel[cls=workspace-personal-home-projects]'));
                me.getWorkspace().setLoading(false);
            },
            failure: function(response) {

                me.getWorkspace().setLoading(false);

            }
        });
    },
    
    
    onWorkspacecompanyRendered: function() {
        var me = this;

        Ext.get('workspacecompanyTitleText').update(gCurrentWorkspaceName);
        
        me.getWorkspace().setLoading('Loading your company workspace... ');

        Ext.get('workspacecompanyTitleText').update(gCurrentWorkspaceName);



        Ext.Ajax.request({
            url: COMPANY_WORKSPACE_BASE_URL + gCurrentWorkspaceId +'.json',
            method: 'GET',
            withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(response) {
                me.loadProjects(me.getWorkspacecompanyhome().down('panel[cls=workspace-company-home-projects]'));
                me.getWorkspace().setLoading(false);
                MYOCD.controller.company.CompanySettingsController.getCompanyViews();
            },
            failure: function(response) {

                me.getWorkspace().setLoading(false);

            }
        });
    },


    onWorkspaceTypeChange: function(box, newValue, oldValue, eOpts) {
        this.setWorkspaceItem(newValue);
    },


    onWorkspacehomeHide: function() {
        var me = this;
        
    },

    setWorkspaceItem: function(newWorkspace) {
        var me = this;
        
        var workspaceBody = this.getWorkspace().down('panel[cls=workspaceBody]'),
            newItem;
        var workspaceIndex = Ext.getStore('Workspace').find('id', newWorkspace);
        var workspaceType = Ext.getStore('Workspace').getAt(workspaceIndex).data.type;

        gCurrentWorkspaceId = newWorkspace;
        gCurrentWorkspaceName = Ext.getStore('Workspace').getAt(workspaceIndex).data.name;
        gCurrentWorkspaceType = workspaceType;
	
		var loadProfileCallback = function(profileData) {
			if(profileData.length > 0) {
				var fullName = profileData[0].first_name + ' ' + profileData[0].last_name;
				if(fullName.length == 0 || fullName == 'null null') {
					fullName = 'User';
				}
				me.getUserButton().setTooltip(fullName);
			}
		}
		
		Ext.WindowManager.each(function(item){
			if (item.isXType('window'))
				item.destroy();
		});
		MYOCD.SharedData.windowPosition.splice(0, MYOCD.SharedData.windowPosition.length);
		
		var profileStore = MYOCD.controller.user.UserWorkspaceProfileStoreController;
        if (workspaceType == "PersonalWorkspace") {
        	MYOCD.SharedData.currentCompanyId = null;
            newItem = Ext.create('MYOCD.view.workspace.Personal');
            this.getOrganizationBtn().hidden = true;
            this.getOrganizationBtn().setText('');
            this.getAccountMenu().setDisabled(true);
            profileStore.loadPersonalProfile(gCurrentWorkspaceId, null, loadProfileCallback);
            if (MYOCD.SharedData.firstSignUp) {
                MYOCD.SharedData.firstSignUp = false;
                var popup = Ext.create('MYOCD.view.toolbarDialogs.ProfileEditorDialog');
                popup.show();
            }
        } else if (workspaceType == "CompanyWorkspace") {
            newItem = Ext.create('MYOCD.view.workspace.Company');
            this.getOrganizationBtn().hidden = false;
            this.getOrganizationBtn().setText('Company');            
            this.getAccountMenu().setDisabled(false);
            if(!MYOCD.SharedData.newCompany) {
	            profileStore.loadEmployeeProfile(gCurrentWorkspaceId, null, loadProfileCallback);
	            MYOCD.SharedData.currentCompanyId = Ext.getStore('Workspace').getAt(workspaceIndex).data.organization.id;
            } else {
	            MYOCD.SharedData.currentCompanyId = MYOCD.SharedData.newCompany.id;
	            MYOCD.SharedData.newCompany = null;
            }
        } else {
            newItem = Ext.create('MYOCD.view.workspace.Company');
            this.getOrganizationBtn().hidden = false;
            this.getOrganizationBtn().setText('Community');
            this.getAccountMenu().setDisabled(false);
        }
        workspaceBody.removeAll();
        if (newItem) {
            workspaceBody.add(newItem);
        };
    },

    loadProjects: function(panel) {
        var me = this;
        var projectsStoreController = MYOCD.controller.project.ProjectsStoreController;
        projectsStoreController.loadProjects(panel);
    }

});