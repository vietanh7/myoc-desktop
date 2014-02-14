Ext.define('MYOCD.controller.project.ProjectController', {
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'workspace',
			selector: 'workspace'
		},
		{
			ref: 'workspaceProjectContainer',
			selector: 'container[name="workspaceProjectContainer"]'
		},
		{
			ref: 'workspacePersonalNewProject',
			selector: 'workspacepersonalnewproject'	
		},
		{
			ref: 'newProject',
			selector: 'newProject'
		},
		{
			ref: 'projectDetail',
			selector: 'projectDetail'
		}
	],
	init: function() {
		this.control({
			'workspacecompanyhome grid[name="companyProjectsGrid"]': {
				itemcontextmenu: this.onProjectGridItemContextMenu,
				itemdblclick: this.onCompanyProjectsGridItemDblClick
			},
			'workspacepersonalhome grid[name="personalProjectsGrid"]': {
				itemcontextmenu: this.onProjectGridItemContextMenu,
				itemdblclick: this.onPersonalProjectsGridItemDblClick
			},
			'workspacecompanyhome tool[name="companyNewProjectTool"]': {
				click: this.onNewProjectToolClick	
			},
			'workspacepersonalhome tool[name="personalNewProjectTool"]': {
				click: this.onNewProjectToolClick	
			},
			'projectDetail': {
				render: this.onProjectDetailRender
			},
			'projectDetail button[name="projectDetailBackBtn"]': {
				click: this.onProjectDetailBackBtnClick
			},
			'newProject button[name="createNewProjectBtn"]': {
				click: this.onCreateNewProjectBtnClick
			},
			'newProject button[name="updateProjectBtn"]': {
				click: this.onUpdateProjectBtnClick
			}		
		});
	},
	
	onProjectGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
		    items: [
		    	{
			        text: 'Edit',
			        handler: function() {
			        	if(me.getNewProject()) {
				        	return;
			        	}
			        	var popup = Ext.create('MYOCD.view.project.NewProject');
			        	popup.show();
			        	popup.setTitle('Edit Project');
			        	popup.down('textfield[name="projectId"]').setValue(record.get('id'));
			        	popup.down('textfield[name="projectName"]').setValue(record.get('name'));
			        	popup.down('textfield[name="projectDesc"]').setValue(record.get('description'));
			        	popup.down('button[name="updateProjectBtn"]').setVisible(true);
			        	popup.down('button[name="createNewProjectBtn"]').setVisible(false);
			        }
		        }, 
		        {
			        text: 'Delete',
			        handler: function() {
			            Ext.Msg.confirm({
						    title: 'Delete Project',
						    msg: 'Do you really want to delete this project?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
							    	var projectsStoreController = MYOCD.controller.project.ProjectsStoreController;
							    	projectsStoreController.deleteProject(record.get('id'), me.getWorkspace());
							    }
						    }
						});
			        }
			    }
		    ]
		}).showAt(e.xy);
	},
	
	onNewProjectToolClick: function() {
		if(this.getNewProject()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.project.NewProject');
		popup.show();
	},
		
	onCompanyProjectsGridItemDblClick: function ( grid, record, item, index, e, eOpts ) {
		this.getWorkspaceProjectContainer().add({xtype: 'projectDetail'});
		this.getWorkspaceProjectContainer().getLayout().setActiveItem(1);
		MYOCD.SharedData.currentProjectId = record.get('id');
		MYOCD.SharedData.currentProjectName = record.get('name');
		Ext.get('workspacecompanyTitleText').update(record.get('name'));
		var projectsStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectsStoreController.getProductsOfProject(record.get('id'));
		projectsStoreController.getFeaturesOfProject(record.get('id'), record.get('name'));
		projectsStoreController.loadSecurityRolesOfProject(record.get('id'));
		projectsStoreController.loadProjectAuthorizationContext(record.get('id'));
		if (MYOCD.SharedData.showProjectInheritedAuthContext == null) {
			MYOCD.SharedData.showProjectInheritedAuthContext = true;
		}
		
		Ext.getStore('project.security.ProjectRoleUsersAndRoles').removeAll();
	},
	
	onPersonalProjectsGridItemDblClick: function ( grid, record, item, index, e, eOpts ) {
		this.getWorkspaceProjectContainer().add({xtype: 'projectDetail'});
		this.getWorkspaceProjectContainer().getLayout().setActiveItem(1);
		MYOCD.SharedData.currentProjectId = record.get('id');
		MYOCD.SharedData.currentProjectName = record.get('name');
		Ext.get('workspacepersonalTitleText').update(record.get('name'));
		var projectsStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectsStoreController.getProductsOfProject(record.get('id'));
		projectsStoreController.getFeaturesOfProject(record.get('id'), record.get('name'));
		projectsStoreController.loadSecurityRolesOfProject(record.get('id'));
		projectsStoreController.loadProjectAuthorizationContext(record.get('id'));
		if (MYOCD.SharedData.showProjectInheritedAuthContext == null) {
			MYOCD.SharedData.showProjectInheritedAuthContext = true;
		}
		Ext.getStore('project.security.ProjectRoleUsersAndRoles').removeAll();
	},
	
	onProjectDetailRender: function() {
		var me = this;
		for (var i = 0; i < MYOCD.SharedData.usersModules.length; i++) {
			var module = MYOCD.SharedData.usersModules[i];
			var newModule = {
				xtype: 'panel',
				height: 533,
				flex: 1,
				name: module.name + 'Panel',
				title: module.name,
				data: module.content.layout_setting,
				layout: 'border',
				listeners: {
					render: function() {
						console.log(this.data);
						for (var key in this.data) {
							if (key == 'constant') continue;
							var flex = key == 'center' ? 2.5 : 1;
							var panel = {
								region: key,
								flex: flex,
								layout: {
									type: 'vbox',
									align: 'stretch'
								},
								items: []
							}
							for (var j = 0; j < this.data[key].length; j++) {
								panel.items.push({xtype: this.data[key][j].widget, flex: 1, parentType: this.xtype + '[name="' + this.name + '"]'});
							}
							this.add(panel);
						}
					}
				}
			}
			me.getProjectDetail().down('tabpanel[name="projectDetailTabPanel"]').add(newModule);
		}
	},

	onProjectDetailBackBtnClick: function() {
		MYOCD.SharedData.currentProjectFeatureNode = null;

		this.getWorkspaceProjectContainer().getLayout().setActiveItem(0);
		this.getWorkspaceProjectContainer().remove(this.getProjectDetail());
		if(Ext.get('workspacepersonalTitleText')) {
			Ext.get('workspacepersonalTitleText').update(gCurrentWorkspaceName);
		} else {
			Ext.get('workspacecompanyTitleText').update(gCurrentWorkspaceName);
		}
		Ext.getStore('project.ProjectProducts').removeAll();
		Ext.getStore('project.FeatureAttributes').removeAll();
		Ext.getStore('project.FeatureInheritedAttributes').removeAll();
		Ext.getStore('project.FeaturesTreeStore').setRootNode(null);
		Ext.getStore('project.FeaturesTreeStore').removeAll();
	},
	onCreateNewProjectBtnClick: function() {
		var projectName = this.getNewProject().down('textfield[name="projectName"]').getValue();
		var projectDesc = this.getNewProject().down('textfield[name="projectDesc"]').getValue();
		
		if(projectName.length == 0) {
			return;
		}
		
		this.getNewProject().destroy();
		
		var projectsStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectsStoreController.addNewProject(projectName, projectDesc, this.getWorkspace());
	},
	onUpdateProjectBtnClick: function() {
		var projectId = this.getNewProject().down('textfield[name="projectId"]').getValue();
		var projectName = this.getNewProject().down('textfield[name="projectName"]').getValue();
		var projectDesc = this.getNewProject().down('textfield[name="projectDesc"]').getValue();
		
		if(projectName.length == 0) {
			return;
		}
		
		this.getNewProject().destroy();
		
		var projectsStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectsStoreController.editProject(projectId, projectName, projectDesc, this.getWorkspace());
	}
});