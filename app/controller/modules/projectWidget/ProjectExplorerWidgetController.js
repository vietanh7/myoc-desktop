Ext.define('MYOCD.controller.modules.projectWidget.ProjectExplorerWidgetController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'workspace',
			selector: 'workspace'
		},
		{
			ref: 'newProjectFeature',
			selector: 'newProjectFeature'
		},
		{
			ref: 'newProjectFeatureFromOtls',
			selector: 'newProjectFeatureFromOtls'
		},
		{
			ref: 'editProjectFeature',
			selector: 'editProjectFeature'
		},
		{
			ref: 'saveFeatureTemplate',
			selector: 'saveFeatureTemplate'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'settingsDialog',
			selector: 'settingsDialog'
		},
		{
			ref: 'newViewTemplateWithTabs',
			selector: 'newViewTemplateWithTabs'
		}
	],
	mainXtype: '',
	projectFeaturesTree: 'projectExplorerWidget treepanel[name="projectFeaturesTree"]',
	init: function () {
		console.log ('projectFeaturesTree controller init');
		var projectExplorerWidgetControl = new Object();
		projectExplorerWidgetControl[this.mainXtype + ' projectExplorerWidget treepanel[name="projectFeaturesTree"]'] = {
			render: this.onProjectFeaturesTreeRender,
			itemclick: this.onProjectFeaturesTreeItemClick,
			itemexpand: this.onProjectFeatureTreeItemExpand,
			itemcontextmenu: this.onProjectFeaturesTreeItemContextMenu,
			containercontextmenu: this.onProjectFeaturesTreeContextMenu,
			edit: this.onProjectFeaturesTreeEdit
		}
		projectExplorerWidgetControl[this.mainXtype + ' projectExplorerWidget tool[name="projectFeatureTreeAddTool"]'] = {
			click: this.onProjectFeatureTreeAddToolClick
		}
		this.application = MYOCD.SharedData.application;
		this.control(projectExplorerWidgetControl);
	},
	getMainXtype: function() {
		var me = this;
		return Ext.ComponentQuery.query(me.mainXtype)[0];
	},
	getComponent: function(component) {
		var me = this;
		return Ext.ComponentQuery.query(me.mainXtype + ' ' + component)[0];
	},
	checkNameOnFeatureTreeNode: function(childItems, newItemName) {
		var exist = false;
		var count = 0;
		var name = newItemName;
		do {
			exist = false;
			for(var i = 0; i < childItems.length; i++) {
				if(childItems[i].data.name.trim().indexOf(name.trim()) == 0 
					&& childItems[i].data.name.trim().length == name.trim().length) {
					count ++ ;
					exist = true;
					name = newItemName + ' ' + count.toString();
					//childItems.splice(i, 1); //use this line only when having a perfectly cloned array
					break;
				}
			}
		} while (exist);
		return name;	
	},
	onProjectFeaturesTreeRender: function(treePanel, eOpts) {
		var me = this;
		var rowEditingPlugin = treePanel.getPlugin('cellEditingPlugin');
    	rowEditingPlugin.removeManagedListener(rowEditingPlugin.view, 'celldblclick');
    	
    	treePanel.dropZone = new Ext.dd.DropZone(treePanel.el, {

	    	getTargetFromEvent: function(e) {
	            return e.getTarget(treePanel.getView().rowSelector);
	        },
	
	        onNodeEnter : function(target, dd, e, data){
		        var record =  treePanel.getView().getRecord(target);
		        record.expand();
	            Ext.fly(target).addCls('my-row-highlight-class');
	        },
	
	        onNodeOut : function(target, dd, e, data){
	            Ext.fly(target).removeCls('my-row-highlight-class');
	        },

	        onNodeOver : function(target, dd, e, data){
	            return Ext.dd.DropZone.prototype.dropAllowed;
	        },
	        
	        onNodeDrop : function(target, dd, e, data){
	        	var record =  treePanel.getView().getRecord(target);
	        	MYOCD.SharedData.currentFeatureTreeDropNode = record;
	        	console.log(record);
	        	if(data.featureData) {
	        		var featureData = data.featureData;
	        		console.log(featureData);
	        		var childItems = record.childNodes;
	        		if(featureData.type == 'objectType') {
		        		var name = me.checkNameOnFeatureTreeNode(childItems, featureData.infoData.name);
		        		record.appendChild(
		        			{
			        			name: name,
			        			objectTypeId: featureData.infoData.id,
		        			}
		        		);
		        		var newRecord = record.findChildBy(
		        			function(child) {
			        			return child.raw.objectTypeId == featureData.infoData.id;
		        			}
		        		);
		        		console.log(newRecord);
		        		me.getComponent(me.projectFeaturesTree).getPlugin('cellEditingPlugin').startEdit(newRecord, me.getComponent(me.projectFeaturesTree).columns[0]);
	        		} else {
	        			var name = me.checkNameOnFeatureTreeNode(childItems, featureData.infoData.name);
		        		record.appendChild(
		        			{
			        			name: name,
			        			ProjectId: featureData.infoData.id,
		        			}
		        		);
		        		var newRecord = record.findChildBy(
		        			function(child) {
			        			return child.raw.ProjectId == featureData.infoData.id;
		        			}
		        		);
		        		console.log(newRecord);
		        		me.getComponent(me.projectFeaturesTree).getPlugin('cellEditingPlugin').startEdit(newRecord, me.getComponent(me.projectFeaturesTree).columns[0]);
	        		}
	        		
		        	return true;
	        	} else if (data.productData) {
	        		var productData = data.productData;
		            var url;
					if (MYOCD.SharedData.currentFeatureTreeDropNode == null || MYOCD.SharedData.currentFeatureTreeDropNode.data.id == 'root') {
						url = PROJECT_BASE_URL + MYOCD.SharedData.currentProjectId + '/productitems.json';
					} else {
						url = FEATURE_BASE_URL + MYOCD.SharedData.currentFeatureTreeDropNode.data.id + '/productitems.json';
					}
		            var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		            projectStoreController.addNewProduct(url, productData.name, productData.description, productData.id.toString(), me.getMainXtype());
		            return true;
	        	}
	            return false;
	        }
	    });
	},
	onProjectFeaturesTreeItemClick: function( treePanel, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentProjectFeature = record;
		//add function to load product of feature
		MYOCD.NotifCenter.postEventNotif(this, 'ClickOnTreePanel', {
			treepanel: treePanel,
			featureRecord: record
		});
		return;
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;


		var featureAttributesWidget = this.getMainXtype().down('featureAttributesWidget');
		var featureItemDetailPaneWidget = this.getMainXtype().down('featureItemDetailPaneWidget');
		var featureAttributesStore;
		var productStores;
		if (!featureAttributesWidget) {
			featureAttributesStore = null;
		} else {
			featureAttributesStore = featureAttributesWidget.down('grid[name="featureOwnedAttributesGrid"]').getStore();
			featureAttributesWidget.down('textfield[name=featureId]').setValue(record.data.id);
		}
		if (!featureItemDetailPaneWidget) {
			productStores = null;
		} else {
			productStores = featureItemDetailPaneWidget.down('dataview[name="projectProductDataview"]').store;
		}

		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		if(record.data.id == 'root') {
			if (featureAttributesStore) {
				featureAttributesStore.removeAll();
			}
			projectStoreController.getProductsOfProjectWithStore(MYOCD.SharedData.currentProjectId, productStores);
			return;
		}
		
	    projectStoreController.loadFeatureAttributesWithStore(record.get('id'), featureAttributesStore);
	    projectStoreController.getProductsOfFeatureWithStore(record.data.id, productStores);
	    MYOCD.SharedData.currentProduct = null;
	},
	onProjectFeatureTreeItemExpand: function( featureNode, eOpts ) {
		MYOCD.SharedData.currentProjectFeature = featureNode;
		var featureAttributesWidget = this.getMainXtype().down('featureAttributesWidget');
		var featureItemDetailPaneWidget = this.getMainXtype().down('featureItemDetailPaneWidget');
		var featureAttributesStore;
		var productStores;
		if (!featureAttributesWidget) {
			featureAttributesStore = null;
		} else {
			featureAttributesStore = featureAttributesWidget.down('grid[name="featureOwnedAttributesGrid"]').getStore();
			featureAttributesWidget.down('textfield[name=featureId]').setValue(featureNode.data.id);
		}
		if (!featureItemDetailPaneWidget) {
			productStores = null;
		} else {
			productStores = featureItemDetailPaneWidget.down('dataview[name="projectProductDataview"]').store;
		}
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		if(featureNode.data.id == 'root') {
			if (featureAttributesStore) {
				featureAttributesStore.removeAll();
			}
			projectStoreController.getProductsOfProjectWithStore(MYOCD.SharedData.currentProjectId, productStores);
			return;
		}
	    projectStoreController.loadFeatureAttributesWithStore(featureNode.data.id, featureAttributesStore);
		projectStoreController.getFeaturesOfFeature(featureNode.data.id, featureNode);
		projectStoreController.getProductsOfFeatureWithStore(featureNode.data.id, productStores);
		MYOCD.SharedData.currentProduct = null;
	},
	onProjectFeaturesTreeItemContextMenu: function ( treePanel, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		MYOCD.SharedData.currentContextMenuFeatureNode = record;
		var saveFeatureTemplateFunc = function() {
			if (me.getSaveFeatureTemplate()) {
				me.getSaveFeatureTemplate().destroy();
			}
			var popup = Ext.create('MYOCD.view.project.SaveFeatureTemplate');
			popup.down('textfield[name="featureId"]').setValue(record.get('id'));
			popup.show();
		}
		var editFeatureFunc = function() {
			if(me.getEditProjectFeature()) {
				return;
			}
			var popup = Ext.create('MYOCD.view.project.EditProjectFeature');
			popup.show();
			popup.down('textfield[name="featureId"]').setValue(record.get('id'));
			popup.down('textfield[name="featureName"]').setValue(record.get('name'));
			popup.down('textfield[name="featureDesc"]').setValue(record.get('description'));
			var setInfo = function(featureInfo) {
				if (featureInfo.object_types.length > 0) {
					popup.down('textfield[name="parentObjectType"]').setValue(featureInfo.object_types[0].id+'-'+featureInfo.object_types[0].name);
				}
			}
			var projectsStoreController = MYOCD.controller.project.ProjectsStoreController;
			projectsStoreController.getFeatureInfo(record.get('id'), setInfo, popup);
		}
		var deleteFeatureFunc = function() {
			Ext.Msg.confirm({
			    title: 'Delete Feature',
			    msg: 'Do you really want to delete this feature?',
			    width: 200,
			    buttons: Ext.Msg.YESNO,
			    icon: Ext.Msg.QUESTION,
			    fn: function(btn) {
				    if(btn == 'yes') {
					    var projectsStoreController = MYOCD.controller.project.ProjectsStoreController;
					    projectsStoreController.deleteFeature();
				    }
			    }
			});
		}
		var copyFeatureFunc = function() {
			MYOCD.SharedData.projectFeatureSourceNode = record;
			MYOCD.SharedData.projectFeatureSourceNode.isCut = false;
		}
		var cutFeatureFunc = function() {
			MYOCD.SharedData.projectFeatureSourceNode = record;
			treePanel.ownerCt.getView().addRowCls(record,'opacity-treenode');
			MYOCD.SharedData.currentProjectFeatureTree = treePanel;
			MYOCD.SharedData.projectFeatureSourceNode.isCut = true;
		}
		var pasteFeatureFunc = function() {
			//MYOCD.SharedData.featureTemplateDestNode = record;
			var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
			if(MYOCD.SharedData.projectFeatureSourceNode.isCut) {
				projectStoreController.moveFeature(MYOCD.SharedData.projectFeatureSourceNode, record, me.getMainXtype());
			} else {
				projectStoreController.copyFeature(MYOCD.SharedData.projectFeatureSourceNode, record, me.getMainXtype());

			}
		}
		var securityFunc = function() {
			if(me.getAuthorizationDialog()) {
				me.getAuthorizationDialog().destroy();
			}		
			var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
			if (record.data.id == 'root') {
				popup.down('textfield[name="baseUrl"]').setValue(PROJECT_BASE_URL);
				popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentProjectId);
			} else {
				popup.down('textfield[name="baseUrl"]').setValue(FEATURE_BASE_URL);
				popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
			}
			popup.show(); 
		}
		if(record.get('id') !== 'root') {
			var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Save As Feature Template',
						handler: saveFeatureTemplateFunc
							
					},
					{
						xtype: 'menuseparator'	
					},
					{
						text: 'Copy',
						handler: copyFeatureFunc
					},
					{
						text: 'Cut',
						handler: cutFeatureFunc	
					},
					{
						text: 'Paste',
						disabled: MYOCD.SharedData.projectFeatureSourceNode == null,
						handler: pasteFeatureFunc	
					},
					{
						xtype: 'menuseparator'	
					},
					{
						text: 'Edit',
						handler: editFeatureFunc
					},
					{
						text: 'Delete',
						handler: deleteFeatureFunc
					},
					'-',
					{
						text: 'Security',
						handler: securityFunc
					},
					'-',
					{
						text: 'View',
						menu: {
							xtype: 'menu',
							name: 'viewMenu',
							items: [
								{
									text: 'Create new view',
									handler: function() {
										if(me.getNewViewTemplateWithTabs()) {
											me.getNewViewTemplateWithTabs().destroy();
										}
										var popup = Ext.create('MYOCD.view.viewTemplate.NewViewTemplateWithTabs');
										popup.down('textfield[name="viewLocation"]').setValue('workspace');
										popup.show();
									}
								},	
								'-',
								{
									text: 'Import views to workspace',
									handler: function() {
										if(me.getSettingsDialog()) {
											Ext.WindowManager.bringToFront(me.getSettingsDialog()); 
											me.getSettingsDialog().down('tabpanel[name="settingsTab"]').setActiveItem(0);
											return;
										}
										var popup = Ext.create('MYOCD.view.toolbarDialogs.SettingsDialog');
										popup.show();
									}
								},
								{
									text: 'Export views from workspace',
									handler: function() {
										if(me.getSettingsDialog()) {
											Ext.WindowManager.bringToFront(me.getSettingsDialog()); 
											me.getSettingsDialog().down('tabpanel[name="settingsTab"]').setActiveItem(0);
											return;
										}
										var popup = Ext.create('MYOCD.view.toolbarDialogs.SettingsDialog');
										popup.show();
									}
								},
								'-',
								// {
								// 	text: 'Get Items by View',
								// 	menu: {
								// 		xtype: 'menu',
								// 		name: 'showFeaturesByViewMenu',
								// 		listeners: {
								// 			render: function(menu, eOpts) {
								// 				for (var i = 0; i < Ext.getStore('company.WorkspaceViews').data.items.length; i++) {
								// 					menu.add({
								// 	                	xtype: 'menuitem',
								// 	                	text: Ext.getStore('company.WorkspaceViews').data.items[i].data.name,
								// 	                	viewId: Ext.getStore('company.WorkspaceViews').data.items[i].data.id,
								// 	                	handler: function(menu) {
								// 	                    	var popup = Ext.create('MYOCD.view.project.GetItemsByView');
								// 	                    	popup.down('textfield[name="viewId"]').setValue(this.viewId);
								// 	                    	if(record.get('id') == 'root') {
								// 								popup.down('textfield[name="projectId"]').setValue(MYOCD.SharedData.currentProjectId);
								// 							} else {
								// 								popup.down('textfield[name="featureId"]').setValue(record.data.id);
								// 							}
								// 	                    	popup.show();
								// 	                    	popup.setTitle(this.text);
								// 	                	}
								// 	            	});
								// 				}
								// 			}
								// 		}
								// 	}
								// }
							]
						}	
					}
				]
			});
			for (var i = 0; i < Ext.getStore('company.WorkspaceViews').data.items.length; i++) {
				menu.down('menu[name="viewMenu"]').add({
	            	text: Ext.getStore('company.WorkspaceViews').data.items[i].data.name,
	            	viewId: Ext.getStore('company.WorkspaceViews').data.items[i].data.id,
	            	handler: function(menu) {
	                	var popup = Ext.create('MYOCD.view.project.GetItemsByView');
	                	popup.down('textfield[name="viewId"]').setValue(this.viewId);
	                	if(record.get('id') == 'root') {
							popup.down('textfield[name="projectId"]').setValue(MYOCD.SharedData.currentProjectId);
						} else {
							popup.down('textfield[name="featureId"]').setValue(record.data.id);
						}
	                	popup.show();
	                	popup.setTitle(this.text);
	            	}
	        	});
			}
			menu.showAt(e.xy);
		} else {
			var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Paste',
						disabled: MYOCD.SharedData.projectFeatureSourceNode == null,
						handler: pasteFeatureFunc	
					},
					'-',
					{
						text: 'Security',
						handler: securityFunc
					},
					'-',
					{
						text: 'View',
						menu: {
							xtype: 'menu',
							name: 'viewMenu',
							items: [
								{
									text: 'Create new view',
									handler: function() {
										if(me.getNewViewTemplateWithTabs()) {
											me.getNewViewTemplateWithTabs().destroy();
										}
										var popup = Ext.create('MYOCD.view.viewTemplate.NewViewTemplateWithTabs');
										popup.down('textfield[name="viewLocation"]').setValue('workspace');
										popup.show();
									}
								},
								'-',
								{
									text: 'Import views to workspace',
									handler: function() {
										if(me.getSettingsDialog()) {
											Ext.WindowManager.bringToFront(me.getSettingsDialog()); 
											me.getSettingsDialog().down('tabpanel[name="settingsTab"]').setActiveItem(0);
											return;
										}
										var popup = Ext.create('MYOCD.view.toolbarDialogs.SettingsDialog');
										popup.show();
									}
								},
								{
									text: 'Export views from workspace',
									handler: function() {
										if(me.getSettingsDialog()) {
											Ext.WindowManager.bringToFront(me.getSettingsDialog()); 
											me.getSettingsDialog().down('tabpanel[name="settingsTab"]').setActiveItem(0);
											return;
										}
										var popup = Ext.create('MYOCD.view.toolbarDialogs.SettingsDialog');
										popup.show();
									}
								},
								'-',
								// {
								// 	text: 'Get Items by View',
								// 	menu: {
								// 		xtype: 'menu',
								// 		name: 'showFeaturesByViewMenu',
								// 		listeners: {
								// 			render: function(menu, eOpts) {
								// 				for (var i = 0; i < Ext.getStore('company.WorkspaceViews').data.items.length; i++) {
								// 					menu.add({
								// 	                	xtype: 'menuitem',
								// 	                	text: Ext.getStore('company.WorkspaceViews').data.items[i].data.name,
								// 	                	viewId: Ext.getStore('company.WorkspaceViews').data.items[i].data.id,
								// 	                	handler: function(menu) {
								// 	                    	var popup = Ext.create('MYOCD.view.project.GetItemsByView');
								// 	                    	popup.down('textfield[name="viewId"]').setValue(this.viewId);
								// 	                    	if(record.get('id') == 'root') {
								// 								popup.down('textfield[name="projectId"]').setValue(MYOCD.SharedData.currentProjectId);
								// 							} else {
								// 								popup.down('textfield[name="featureId"]').setValue(record.data.id);
								// 							}
								// 	                    	popup.show();
								// 	                    	popup.setTitle(this.text);
								// 	                	}
								// 	            	});
								// 				}
								// 			}
								// 		}
								// 	}
								// }
							]
						}	
					}
				]
			});
			for (var i = 0; i < Ext.getStore('company.WorkspaceViews').data.items.length; i++) {
				menu.down('menu[name="viewMenu"]').add({
	            	text: Ext.getStore('company.WorkspaceViews').data.items[i].data.name,
	            	viewId: Ext.getStore('company.WorkspaceViews').data.items[i].data.id,
	            	handler: function(menu) {
	                	var popup = Ext.create('MYOCD.view.project.GetItemsByView');
	                	popup.down('textfield[name="viewId"]').setValue(this.viewId);
	                	if(record.get('id') == 'root') {
							popup.down('textfield[name="projectId"]').setValue(MYOCD.SharedData.currentProjectId);
						} else {
							popup.down('textfield[name="featureId"]').setValue(record.data.id);
						}
	                	popup.show();
	                	popup.setTitle(this.text);
	            	}
	        	});
			}
			menu.showAt(e.xy);
		}
	},
	onProjectFeaturesTreeContextMenu: function( treePanel, e, eOpts ) {
		e.stopEvent();
	},
	onProjectFeatureTreeAddToolClick: function() {
		if(this.getNewProjectFeature()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.project.NewProjectFeature');
		popup.show();
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadObjectTypeLibraries(MYOCD.SharedData.currentCompanyId, this.getNewProjectFeatureFromOtls());
		var refTplStoreController = MYOCD.controller.featureTemplate.RefFeatureTemplatesStoreController;
		refTplStoreController.loadFeatureTemplatesLibs(MYOCD.SharedData.currentCompanyId);
	},
	onProjectFeaturesTreeEdit: function(editor, e, eOpts) {
		var featureName = e.record.data.name;
		var featureDesc = '';
		var parentType;
		var url;
		var param;
		if(featureName.trim().length == 0) {
			Ext.Msg.alert('Error!', 'Please enter feature name');
			e.record.stores[0].remove(e.record);
			e.record.destroy();
			return;
		}
		//createForm.destroy();
		if(MYOCD.SharedData.currentFeatureTreeDropNode.data.id == 'root') {
			url = PROJECT_BASE_URL + MYOCD.SharedData.currentProjectId +'/features.json';
		} else {
			url = FEATURE_BASE_URL + MYOCD.SharedData.currentFeatureTreeDropNode.data.id + '/features.json';
		}
		if(e.record.raw.objectTypeId){
			param = {
			    feature: {
				    name: featureName,
				    description: featureDesc,
			    },
			    object_type_ids: [e.record.raw.objectTypeId.toString()]
		    }

		} else {
			param = {
			    feature: {
				    name: featureName,
				    description: featureDesc,
			    },
			    template_id: e.record.raw.ProjectId.toString()
		    }
			
		}
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectStoreController.addNewFeature(url, param, this.getWorkspace());
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	}
});