Ext.define('MYOCD.controller.project.ProjectEstimatingController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'workspace',
			selector: 'workspace'
		},
		{
			ref: 'projectEstimating',
			selector: 'projectEstimating'	
		},
		{
			ref: 'newProjectFeature',
			selector: 'newProjectFeature'
		},
		{
			ref: 'projectFeaturesTree',
			selector: 'projectEstimating treepanel[name="projectFeaturesTree"]'	
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
			ref: 'projectFeatureAttributes',
			selector: 'projectDetail projectFeatureAttributes'
		},
		{
			ref: 'projectFeatureOwnedAttributes',
			selector: 'projectEstimating projectFeatureAttributes projectFeatureOwnedAttributes'
		},
		{
			ref: 'projectAddProduct',
			selector: 'projectAddProduct'
		},
		{
			ref: 'projectAddProductSelectParent',
			selector: 'projectAddProductSelectParent'
		},
		{
			ref: 'projectProductItemAttributes',
			selector: 'projectProductItemAttributes'
		},
		{
			ref: 'projectProductItemOwnedAtts',
			selector: 'projectProductItemOwnedAtts'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'attributeAction',
			selector: 'attributeAction'
		},
		{
			ref: 'attributeAction',
			selector: 'attributeAction'
		},
		{
			ref: 'saveFeatureTemplate',
			selector: 'saveFeatureTemplate'
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
	init: function() {
		this.control({
			'projectEstimating treepanel[name="projectFeaturesTree"]': {
				render: this.onProjectFeaturesTreeRender,
				itemclick: this.onProjectFeaturesTreeItemClick,
				itemexpand: this.onProjectFeatureTreeItemExpand,
				itemcontextmenu: this.onProjectFeaturesTreeItemContextMenu,
				containercontextmenu: this.onProjectFeaturesTreeContextMenu,
				edit: this.onProjectFeaturesTreeEdit
			},
			'projectEstimating tool[name="projectFeatureTreeAddTool"]': {
				click: this.onProjectFeatureTreeAddToolClick
			},
			'projectEstimating projectFeatureAttributes button[name="featureAttributeSwitchBtn"]': {
				click: this.onFeatureAttributeSwitchBtnClick
			},
			'projectEstimating projectFeatureAttributes projectFeatureOwnedAttributes button[name="createFeatureAttBtn"]': {
				click: this.onCreateFeatureAttBtnClick
			},
			'projectEstimating projectFeatureAttributes projectFeatureOwnedAttributes grid[name="featureOwnedAttributesGrid"]': {
				render: this.onFeatureOwnedAttributesGridRender,
				itemcontextmenu: this.onFeatureOwnedAttributesGridItemContextMenu,
				beforeedit: this.onFeatureOwnedAttributesGridBeforeEdit,
				edit: this.onFeatureOwnedAttributesGridEdit,
			},
			'projectEstimating dataview[name="projectProductDataview"]': {
				render: this.onProjectProductDataViewRender,
				itemcontextmenu: this.onProjectProductDataviewItemContextMenu,
				containercontextmenu: this.onProjectProductDataViewContextMenu,
				itemdblclick: this.onProjectProductDataViewItemDblClick,
				itemclick: this.onProjectProductDataViewItemClick
			},
			'projectEstimating grid[name="projectProductGrid"]': {
				render: this.onProjectProductGridRender,
				itemcontextmenu: this.onProjectProductDataviewItemContextMenu,
				containercontextmenu: this.onProjectProductDataViewContextMenu,
				itemdblclick: this.onProjectProductDataViewItemDblClick,
				itemclick: this.onProjectProductDataViewItemClick
			},
			'projectEstimating tool[name="projectToggleViewTool"]': {
				click: this.onProjectToggleViewToolClick
			},
			'projectProductItemOwnedAtts button[name="createProductAttBtn"]': {
				click: this.onCreateProductAttBtnClick
			},
			'projectProductItemOwnedAtts grid[name="productOwnedAttsGrid"]': {
				render: this.onProductOwnedAttsGridRender,
				itemcontextmenu: this.onProductOwnedAttsGridItemContextMenu,
				edit: this.onProductOwnedAttsGridEdit,
				beforeedit: this.onProductOwnedAttsGridBeforeEdit
			},
			'projectProductItemOwnedAtts': {
				removeinheritedattribute: this.onProductOwnedAttsRemoveInheritedAttribute
			},
			'projectEstimating tool[name="featureAuthorTool"]': {
				click: this.onFeatureAuthorToolClick
			},
			'projectEstimating tool[name="projectProductAuthorTool"]': {
				click: this.onProjectProductAuthorToolClick
			}
		});
	},
	createToolTipForGrid: function(grid) {
		grid.tip = Ext.create('Ext.tip.ToolTip', {
	        // The overall target element.
	        target: grid.el,
	        // Each grid row causes its own seperate show and hide.
	        delegate: grid.getView().itemSelector,
	        // Moving within the row should not hide the tip.
	        trackMouse: true,
	        // Render immediately so that tip.body can be referenced prior to the first show.
	        renderTo: Ext.getBody(),
	        listeners: {
	            // Change content dynamically depending on which element triggered the show.
	            beforeshow: function (tip, eOpts) {
	                var desc = grid.getView().getRecord(tip.triggerElement).get('description');
	                if(desc && desc.length > 0){
	                	tip.update(desc);
	                } else {
	                	tip.update('');
	                    tip.on('show', function(){
	                    	Ext.defer(tip.hide, 1, tip);
	                    }, tip, {single: true});
	                }
	            }
	        }
	    });
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
		        		me.getProjectFeaturesTree().getPlugin('cellEditingPlugin').startEdit(newRecord, me.getProjectFeaturesTree().columns[0]);
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
		        		me.getProjectFeaturesTree().getPlugin('cellEditingPlugin').startEdit(newRecord, me.getProjectFeaturesTree().columns[0]);
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
		            projectStoreController.addNewProduct(url, productData.name, productData.description, productData.id.toString(), me.getProjectEstimating());
		            return true;
	        	}
	            return false;
	        }
	    });
	},
	onProjectFeaturesTreeItemClick: function( treePanel, record, item, index, e, eOpts ) {
		MYOCD.SharedData.currentProjectFeature = record;
		//add function to load product of feature
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		if(record.get('id') == 'root') {
			Ext.getStore('project.FeatureInheritedAttributes').removeAll();
			Ext.getStore('project.FeatureAttributes').removeAll();
			projectStoreController.getProductsOfProject(MYOCD.SharedData.currentProjectId);
			return;
		}
		
	    projectStoreController.loadFeatureAttributes(record.get('id'));
	    projectStoreController.getProductsOfFeature(record.data.id);
	    MYOCD.SharedData.currentProduct = null;
	},
	onProjectFeatureTreeItemExpand: function( featureNode, eOpts ) {
		MYOCD.SharedData.currentProjectFeature = featureNode;
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		if(featureNode.data.id == 'root') {
			Ext.getStore('project.FeatureInheritedAttributes').removeAll();
			Ext.getStore('project.FeatureAttributes').removeAll();
			projectStoreController.getProductsOfProject(MYOCD.SharedData.currentProjectId);
			return;
		}
		
	    projectStoreController.loadFeatureAttributes(featureNode.data.id);
		projectStoreController.getFeaturesOfFeature(featureNode.data.id, featureNode);
		projectStoreController.getProductsOfFeature(featureNode.data.id);
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
				projectStoreController.moveFeature(MYOCD.SharedData.projectFeatureSourceNode, record, me.getProjectEstimating());
			} else {
				projectStoreController.copyFeature(MYOCD.SharedData.projectFeatureSourceNode, record, me.getProjectEstimating());

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
	},
	onFeatureAttributeSwitchBtnClick: function(btn) {
		if(btn.getText() == 'Switch to inherited attributes') {
			btn.setText('Switch to owned attributes');
			this.getProjectFeatureAttributes().down('label').setText('Inheried Attributes');
			this.getProjectFeatureAttributes().down('featureOwnedAttributes').setVisible(false);
			this.getProjectFeatureAttributes().down('featureInheritedAttributes').setVisible(true);
		} else {
			btn.setText('Switch to inherited attributes');
			this.getProjectFeatureAttributes().down('label').setText('Owned Attributes');
			this.getProjectFeatureAttributes().down('featureOwnedAttributes').setVisible(true);
			this.getProjectFeatureAttributes().down('featureInheritedAttributes').setVisible(false);
		}
	},
	onCreateFeatureAttBtnClick: function() {
		var attributeName = this.getProjectFeatureOwnedAttributes().down('textfield[name="featureAttName"]').getValue();
		var attributeDesc = this.getProjectFeatureOwnedAttributes().down('textfield[name="featureAttDesc"]').getValue(); 
		var attributeValueType = this.getProjectFeatureOwnedAttributes().down('combobox[name="featureAttValueType"]').getValue();
		var attributeHidden = this.getProjectFeatureOwnedAttributes().down('checkboxfield[name="featureAttHiddenCheck"]').getValue();
		var attributeConstant = this.getProjectFeatureOwnedAttributes().down('checkboxfield[name="featureAttConstantCheck"]').getValue();
		var attributeMandatory = this.getProjectFeatureOwnedAttributes().down('checkboxfield[name="featureAttMandatoryCheck"]').getValue();
		var attributeDeprecated = this.getProjectFeatureOwnedAttributes().down('checkboxfield[name="featureAttDeprecatedCheck"]').getValue();
		var attributeDefaultValue = this.getProjectFeatureOwnedAttributes().down('textfield[name="featureAttDefaultValue"]').getValue();
		
		if(attributeName.length == 0) {
			return;
		}

		var setActionPermission = this.getProjectFeatureOwnedAttributes().down('setActionPermission');
		var callBack = function(newAttribute) {
			setActionPermission.fireEvent('setPermissionForAction', setActionPermission, newAttribute.id);
		}
		
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectStoreController.addNewFeatureAttribute(MYOCD.SharedData.currentProjectFeature.data.id, attributeName, attributeDesc, attributeValueType, 
		attributeHidden, attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, this.getProjectFeatureAttributes(), callBack);	
	},
	onFeatureOwnedAttributesGridRender: function(grid, e, eOpts) {
		this.createToolTipForGrid(grid);	
	},
	onFeatureOwnedAttributesGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: function() {
						grid.ownerCt.getPlugin('rowEditingPlugin').startEdit(record,0);
					}
				},
				{
					text: 'Delete',
					disabled: record.data.isInherited,
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Delete Attribute',
						    msg: 'Do you really want to delete this attribute?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
								   var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
								   projectStoreController.deleteFeatureAttribute( record.data.id, me.getProjectFeatureAttributes());
							    }
						    }
						});
					}
				},
				'-',
				{
					text: 'Actions Permissions',
					disabled: record.data.isInherited,
					handler: function() {
						if (me.getAttributeAction()) {
							me.getAttributeAction().destroy();
						}
						var popup = Ext.create('MYOCD.view.attributeAction.AttributeAction');
						popup.down('textfield[name="attributeId"]').setValue(record.data.id);
						popup.show();
					}
				}
			]
		}).showAt(e.xy);
	},
	onFeatureOwnedAttributesGridBeforeEdit: function(editor, e, eOpts) {
		return !e.record.data.constant;
	},
	onFeatureOwnedAttributesGridEdit: function(editor, e, eOpts) {
		var attribute = e.record.data;
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectStoreController.editFeatureAttributeValue(MYOCD.SharedData.currentProjectFeature.data.id, attribute.id, attribute.value, this.getProjectFeatureAttributes());
		// projectStoreController.editFeatureAttribute(attribute.id, attribute.name, attribute.description, attribute.value_type, attribute.hidden, 
		// attribute.constant, attribute.mandatory, attribute.deprecated, attribute.default_value, this.getProjectFeatureAttributes());
	},
	onProjectProductDataviewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		var editProductFunc = function () {
			if (me.getProjectAddProduct()) {
				me.getProjectAddProduct().destroy();
			}
			var popup = Ext.create('MYOCD.view.project.ProjectAddProduct');
			popup.down('textfield[name="productId"]').setValue(record.data.id);
			popup.down('textfield[name="productName"]').setValue(record.data.name);
			popup.down('textfield[name="productDesc"]').setValue(record.data.description);
			// popup.down('button[name="addNewProductBtn"]').setVisible(false);
			popup.down('button[name="updateProductBtn"]').setVisible(true);
			popup.show();
			var callback = function(product) {
				if(product.products.length > 0) {
					var parentProduct = product.products[0];
					popup.down('textfield[name="parentProduct"]').setValue(parentProduct.name);
					popup.down('textfield[name="parentProductId"]').setValue(parentProduct.id);
				}
				if (null != product.cost_info) {
					popup.down('textfield[name="productPrice"]').setValue(product.cost_info.price);
					popup.down('textfield[name="productQuantity"]').setValue(product.cost_info.quantity);
				}
				
			}
			projectStoreController.getProductInfo(record.data.id, callback, popup);
		}
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: editProductFunc
				},
				{
					text: 'Delete',
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Delete Product',
						    msg: 'Do you really want to delete this product?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
								   var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
								   projectStoreController.deleteProduct( record.data.id, me.getProjectEstimating());
							    }
						    }
						});
					}
				},
				{
					text: 'Security',
					handler: function() {
						if(me.getAuthorizationDialog()) {
							me.getAuthorizationDialog().destroy();
						}
						var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
						popup.down('textfield[name="baseUrl"]').setValue(PRODUCT_ITEMS_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	}, 
	onProjectProductDataViewContextMenu: function(dataView, e, eOpts) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Add Product',
					handler: function() {
						if(me.getProjectAddProductSelectParent()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.project.ProjectAddProductSelectParent');
						popup.show();
						var refProductCatalogStoreController = MYOCD.controller.productCatalog.RefProductCatalogsStoreController;
						refProductCatalogStoreController.loadProductCatalogsLibs(MYOCD.SharedData.currentCompanyId, popup);
					}
				}
			]
		}).showAt(e.xy);
	},
	onProjectToggleViewToolClick: function(tool) {
		var isDataView = tool.cls == 'listview-icon'?true:false;
		if(isDataView) {
			tool.removeCls('listview-icon');
			tool.addCls('dataview-icon');
			tool.cls = 'dataview-icon';
		} else {
			tool.removeCls('dataview-icon');
			tool.addCls('listview-icon');
			tool.cls = 'listview-icon';
		}
		this.getProjectEstimating().down('dataview[name="projectProductDataview"]').setVisible(!isDataView);
		this.getProjectEstimating().down('grid[name="projectProductGrid"]').setVisible(isDataView);
	},
	onProjectProductDataViewRender: function(dataview, e, eOpts) {
		var me = this;
		dataview.dropZone = new Ext.dd.DropZone(dataview.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.productData) {
					return false;
				}
	            var productData = dragData.productData;
	            var url;
				if (MYOCD.SharedData.currentProjectFeature == null || MYOCD.SharedData.currentProjectFeature.data.id == 'root') {
					url = PROJECT_BASE_URL + MYOCD.SharedData.currentProjectId + '/productitems.json';
				} else {
					url = FEATURE_BASE_URL + MYOCD.SharedData.currentProjectFeature.data.id + '/productitems.json';
				}
	            var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
	            projectStoreController.addNewProduct(url, productData.name, productData.description, productData.id.toString(), me.getProjectEstimating());
	            return true;
	        }

		});
	},
	onProjectProductGridRender: function(grid, e, eOpts) {
		var me = this;
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.productData) {
					return false;
				}
	            var productData = dragData.productData;
	            var url;
				if (MYOCD.SharedData.currentProjectFeature == null || MYOCD.SharedData.currentProjectFeature.data.id == 'root') {
					url = PROJECT_BASE_URL + MYOCD.SharedData.currentProjectId + '/productitems.json';
				} else {
					url = FEATURE_BASE_URL + MYOCD.SharedData.currentProjectFeature.data.id + '/productitems.json';
				}
	            var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
	            projectStoreController.addNewProduct(url, productData.name, productData.description, productData.id.toString(), me.getProjectEstimating());
	            return true;
	        }

		});
	},
	onProjectProductDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		if(this.getProjectProductItemAttributes()) {
			return;
		}
		MYOCD.SharedData.currentProduct = record.data;
		var popup = Ext.create('MYOCD.view.project.ProjectProductItemAttributes');
		popup.show();
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectStoreController.loadAttributeOfProduct(record.get('id'), popup);
	},
	onCreateProductAttBtnClick: function() {
		var attributeName = this.getProjectProductItemOwnedAtts().down('textfield[name="productAttName"]').getValue();
		var attributeDesc = this.getProjectProductItemOwnedAtts().down('textfield[name="productAttDesc"]').getValue(); 
		var attributeValueType = this.getProjectProductItemOwnedAtts().down('combobox[name="productAttValueType"]').getValue();
		var attributeHidden = this.getProjectProductItemOwnedAtts().down('checkboxfield[name="productAttHiddenCheck"]').getValue();
		var attributeConstant = this.getProjectProductItemOwnedAtts().down('checkboxfield[name="productAttConstantCheck"]').getValue();
		var attributeMandatory = this.getProjectProductItemOwnedAtts().down('checkboxfield[name="productAttMandatoryCheck"]').getValue();
		var attributeDeprecated = this.getProjectProductItemOwnedAtts().down('checkboxfield[name="productAttDeprecatedCheck"]').getValue();
		var attributeDefaultValue = this.getProjectProductItemOwnedAtts().down('textfield[name="productAttDefaultValue"]').getValue();
		
		if(attributeName.length == 0) {
			return;
		}

		var setActionPermission = this.getProjectProductItemOwnedAtts().down('setActionPermission');
		var callBack = function(newAttribute) {
			setActionPermission.fireEvent('setPermissionForAction', setActionPermission, newAttribute.id);
		}
		
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectStoreController.addNewProductAttribute(MYOCD.SharedData.currentProduct.id, attributeName, attributeDesc, attributeValueType, attributeHidden, 
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, this.getProjectProductItemAttributes(), callBack);
	},
	onProductOwnedAttsGridRender: function(grid, e, eOpts) {
		this.createToolTipForGrid(grid);	
	},
	onProductOwnedAttsGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: function() {
						grid.ownerCt.getPlugin('rowEditingPlugin').startEdit(record,0);
					}
				},
				{
					text: 'Delete',
					disabled: record.get('isInherited'),
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Delete Attribute',
						    msg: 'Do you really want to delete this attribute?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
								   var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
								   projectStoreController.deleteProductAttribute( record.data.id, me.getProjectProductItemAttributes());
							    }
						    }
						});
					}
				},
				'-',
				{
					text: 'Actions Permissions',
					disabled: record.get('isInherited'),
					handler: function() {
						if (me.getAttributeAction()) {
							me.getAttributeAction().destroy();
						}
						var popup = Ext.create('MYOCD.view.attributeAction.AttributeAction');
						popup.down('textfield[name="attributeId"]').setValue(record.data.id);
						popup.show();
					}
				}
			]
		}).showAt(e.xy);
	},
	onProductOwnedAttsGridEdit: function(editor, e, eOpts) {
		e.record.commit();
		var attribute = e.record.data;
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		// projectStoreController.editProductAttribute(attribute.id, attribute.name, attribute.description, attribute.value_type, attribute.hidden, 
		// attribute.constant, attribute.mandatory, attribute.deprecated, attribute.default_value, this.getProjectProductItemAttributes());
		projectStoreController.editProductAttributeValue(MYOCD.SharedData.currentProduct.id, attribute.id, attribute.value, this.getProjectProductItemAttributes());
	},
	onProductOwnedAttsGridBeforeEdit: function (editor, e, eOpts) {
		// return !e.record.data.isInherited && !e.record.data.constant;
		return !e.record.data.constant;
	},
	onProductOwnedAttsRemoveInheritedAttribute: function(grid, record) {
		var me = this;
		Ext.Msg.confirm({
		    title: 'Delete Attribute',
		    msg: 'Do you really want to delete this attribute?',
		    width: 200,
		    buttons: Ext.Msg.YESNO,
		    icon: Ext.Msg.QUESTION,
		    fn: function(btn) {
			    if(btn == 'yes') {
				   var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
				   projectStoreController.deleteProductAttribute( record.data.id, me.getProjectProductItemAttributes());
			    }
		    }
		});
	},
	onFeatureAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}		
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		if (!MYOCD.SharedData.currentProjectFeature || MYOCD.SharedData.currentProjectFeature.data.id == 'root') {
			popup.down('textfield[name="baseUrl"]').setValue(PROJECT_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentProjectId);
		} else {
			popup.down('textfield[name="baseUrl"]').setValue(FEATURE_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentProjectFeature.data.id);
		}
		popup.show(); 
	},
	onProjectProductDataViewItemClick: function( dataview, record, item, index, e, eOpts ) {
		//MYOCD.SharedData.currentProduct = record.data;
	},
	onProjectProductAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}
		if (!MYOCD.SharedData.currentProduct) {
			return;
		}
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		popup.down('textfield[name="baseUrl"]').setValue(PRODUCT_ITEMS_BASE_URL);
		popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentProduct.id);
		popup.show(); 
	} 
});