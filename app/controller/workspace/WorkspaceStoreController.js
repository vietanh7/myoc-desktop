Ext.define('MYOCD.controller.workspace.WorkspaceStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	refs: [
		{
			ref: 'workspace',
			selector: 'workspace'
		},
		{
	        ref: 'workspaceMenu',
	        selector: 'menu[name="workspaceMenu"]'
        }
	],
	
	loadWorkspaces_old: function(callBack) {
		var me = this;
		me.getWorkspace().setLoading('Loading your workspace... ');
        Ext.Ajax.request({
            url: API_BASE_URL + '/workspaces.json',
            method: 'GET',
            withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(response){
                me.getWorkspace().setLoading(false);
                Ext.getStore('Workspace').removeAll();
                var wpData = Ext.decode(response.responseText);
                Ext.getStore('Workspace').loadRawData(wpData);
                if(callBack !== null) {
	                callBack(wpData);
                }
            },
            failure: function(response) {
                me.getWorkspace().setLoading(false);
                Ext.getStore('Workspace').removeAll();
            }
        });
	},
	
	loadWorkspaces: function(callBack) {
		var me = this;
		me.getWorkspace().setLoading('Loading your workspace... ');
        Ext.Ajax.request({
            url: WORKSPACE_API_URL,
            method: 'GET',
            withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(response){
                me.getWorkspace().setLoading(false);
                Ext.getStore('Workspace').removeAll();
                var wpData = Ext.decode(response.responseText);
                Ext.getStore('Workspace').loadRawData(wpData);
                if(callBack !== null) {
	                callBack(wpData);
                }
            },
            failure: function(response) {
                me.getWorkspace().setLoading(false);
                Ext.getStore('Workspace').removeAll();
            }
        });
	},
	
	joinCompany: function(companyId, companyName, companyDesc, companyAddr, companyEmail, companyPhone) {
		var me = this;
		me.getWorkspace().setLoading('Joining and creating new workspace... ');
    	Ext.Ajax.request({
		    url: API_WORKSPACES_URL,
		    method: 'POST',
	        withCredentials : true,
	        useDefaultXhrHeader : false,
		    jsonData: {
			    workspace: {
				    name: companyName,
				    description: companyDesc,
				    workspace_type: 'Company',
				    company: companyId
			    },
			    workspace_profile: {
			    	name: companyName,
			    	address: companyAddr,
			    	phone: companyPhone,
			    	email: companyEmail
			    }
		    },
		    success: function(response) {
		    	me.getWorkspace().setLoading(false);
		    	var wsData = Ext.decode(response.responseText);
		    	me.loadWorkspaces(
		    		function(wpData) {
		    			me.getWorkspaceMenu().removeAll();
		    			for (var i = 0; i < wpData.length; i++) {
		                    if (wpData[i].workspace.id == wsData.workspace.id) {
		                        me.getWorkspace().down('combobox[name=workspaceType]').setValue(wpData[i].workspace.id);
		                    }
		                    if(me.getWorkspaceMenu().items.length < wpData.length) {
		                    	var icon;
		                    	if(wpData[i].workspace.workspace_type.toLowerCase() == 'private') {
			                    	icon = 'personal-ws-icon';
		                    	} else {
			                    	if(wpData[i].workspace.workspace_type.toLowerCase() == 'company') {
				                    	icon = 'company-ws-icon';
			                    	} else {
				                    	icon = 'community-ws-icon';
			                    	}
		                    	}
			                    me.getWorkspaceMenu().add(
			                    	{
				                    	xtype: 'menuitem',
				                    	iconCls: icon,
				                    	text: wpData[i].workspace.name,
				                    	workspaceId: wpData[i].workspace.id,
				                    	handler: function(menu) {
					                    	menu.up('workspace').down('combobox[name=workspaceType]').setValue(menu.workspaceId);
				                    	}
			                    	}
			                    )
		                    }
		                };
		    		}
		    	);
		    },
		    failure: function(response) {
		    	me.getWorkspace().setLoading(false);
		    	Ext.Msg.alert('Creating workspace for company failure', 'Joined company with no new created workspace'); 
		    }
	    });  
	},
	
	createCompany: function(companyName, companyDesc, companyAddr, companyEmail, companyPhone) {
		var me = this;
		
		me.getWorkspace().setLoading('Creating company ...');
		Ext.Ajax.request({
		    url: API_COMPANIES_URL,
		    method: 'POST',
            withCredentials : true,
            useDefaultXhrHeader : false,
		    jsonData: {
			    company: {
				    name: companyName,
				    company_type: companyDesc,
			    },
			    company_profile: {
			    	address: companyAddr,
			    	phone: companyPhone,
			    	email: companyEmail
			    }
		    },
		    success: function(response) {
			    me.getWorkspace().setLoading(false);
			    var company = Ext.decode(response.responseText);
			    me.joinCompany(
			    	company.company.id, companyName, companyDesc,
			    	companyAddr, companyEmail, companyPhone
			    );
		    },
		    failure: function(response) {
			    me.getWorkspace().setLoading(false);
		    	Ext.Msg.alert('Creating company failure', 'Please try again later');
		    }
		});
	},
	
	joinCommunity: function(communityId, communityName, communityDesc, communityAddress, communityEmail, communityPhone) {
		var me = this;
		this.getWorkspace().setLoading('Joining community and creating new workspace...');  
		Ext.Ajax.request({
		    url: API_WORKSPACES_URL,
		    method: 'POST',
	        withCredentials : true,
	        useDefaultXhrHeader : false,
		    jsonData: {
			    workspace: {
				    name: communityName,
				    description: communityDesc,
				    workspace_type: 'Community Group',
				    community_group: communityId
			    },
			    workspace_profile: {
			    	name: communityName,
			    	address: communityAddress,
			    	phone: communityPhone,
			    	email: communityEmail
			    }
		    },
		    success: function(response) {
		    	me.getWorkspace().setLoading(false);
		    	var wsData = Ext.decode(response.responseText);
		    	me.loadWorkspaces(
		    		function(wpData) {
		    			me.getWorkspaceMenu().removeAll();
		    			for (var i = 0; i < wpData.length; i++) {
		                    if (wpData[i].workspace.id == wsData.workspace.id) {
		                        me.getWorkspace().down('combobox[name=workspaceType]').setValue(wpData[i].workspace.id);
		                    }
		                    if(me.getWorkspaceMenu().items.length < wpData.length) {
		                    	var icon;
		                    	if(wpData[i].workspace.workspace_type.toLowerCase() == 'private') {
			                    	icon = 'personal-ws-icon';
		                    	} else {
			                    	if(wpData[i].workspace.workspace_type.toLowerCase() == 'company') {
				                    	icon = 'company-ws-icon';
			                    	} else {
				                    	icon = 'community-ws-icon';
			                    	}
		                    	}
			                    me.getWorkspaceMenu().add(
			                    	{
				                    	xtype: 'menuitem',
				                    	iconCls: icon,
				                    	text: wpData[i].workspace.name,
				                    	workspaceId: wpData[i].workspace.id,
				                    	handler: function(menu) {
					                    	menu.up('workspace').down('combobox[name=workspaceType]').setValue(menu.workspaceId);
				                    	}
			                    	}
			                    )
		                    }
		                };
		    		}
		    	);
			},
		    failure: function(response) {
		    	me.getWorkspace().setLoading(false);
		    	Ext.Msg.alert('Creating workspace for community failure', 'Joined community with no new created workspace'); 
		    }
	    });    
	},
	
	createCommunity: function(communityName, communityDesc, communityAddress, communityEmail, communityPhone) {
		var me = this;
		this.getWorkspace().setLoading('Creating new community...');
		Ext.Ajax.request({
		    url: API_COMMUNITIES_URL,
		    method: 'POST',
            withCredentials : true,
            useDefaultXhrHeader : false,
		    jsonData: {
			    community_group: {
				    name: communityName,
				    objective: communityDesc,
			    },
			    community_group_profile: {
			    	name: communityName,
			    	address: communityAddress,
			    	phone: communityPhone,
			    	email: communityEmail
			    }
		    },
		    success: function(response) {
		    	console.log(response);
		    	me.getWorkspace().setLoading(false);
		    	var communityGroup = Ext.decode(response.responseText);
		    	me.joinCommunity(communityGroup.community_group.id, communityName, communityDesc, communityAddress, communityEmail, communityPhone);
		    },
		    failure: function(response) {
		    	me.getWorkspace().setLoading(false);
		    	Ext.Msg.alert('Create new community group failure', 'Something went wrong, please try later'); 
		    }
	    });
	},
	joinOrganization: function(organizationId, employeeFirstName, employeeLastName, employeeEmail, employeeDesc, employeeSkype, onView, callBack) {
		var me = this;
		if (onView) {
			onView.setLoading('Joining into organization ...');
		}
		Ext.Ajax.request({
		    url: HOME_URL  + 'joinorganization/' + organizationId + '.json',
		    method: 'POST',
            withCredentials : true,
            useDefaultXhrHeader : false,
            jsonData: {
            	profile: {
            		first_name: employeeFirstName,
            		last_name: employeeLastName,
            		description: employeeDesc,
            		email: employeeEmail,
            		skype_id: employeeSkype
            	}
            },
		    success: function(response) {
		    	if (onView) {
					onView.setLoading(false);
				}
				if (callBack) {
					me.loadWorkspaces(callBack);
				} else {
					me.loadWorkspaces();
				}
				
		    },
		    failure: function(response) {
		    	if (onView) {
					onView.setLoading(false);
				}
		    	Ext.Msg.alert('Join into organization  failure', 'Something went wrong, please try later'); 
		    }
	    });
	} 
});