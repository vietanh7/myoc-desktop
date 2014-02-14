Ext.define('MYOCD.controller.projectTemplate.ProjectTemplatesLibManagerController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'projectTemplatesTab',
			selector: 'projectTemplatesTab'
		},
		{
			ref: 'projectTemplatesLibraryManager',
			selector: 'projectTemplatesLibraryManager'	
		},
		{
			ref: 'projectTemplateManager',
			selector: 'projectTemplateManager'	
		},
		{
			ref: 'projectTemplatesCategoriesTree',
			selector: 'projectTemplatesLibraryManager treepanel[name="projectTemplatesCategoriesTree"]'
		},
		{
			ref: 'newProjectTemplate',
			selector: 'newProjectTemplate'
		},
		{
			ref: 'editProjectTemplateCategory',
			selector: 'editProjectTemplateCategory'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		}
	],
	init: function() {
		this.control({
			'projectTemplatesLibraryManager button[name="projectTemplatesLibsBackButton"]': {
				click: this.onProjectTemplatesLibsBackButtonClick
			},
			'projectTemplatesLibraryManager treepanel[name="projectTemplatesCategoriesTree"]': {
				render: this.onProjectTemplatesCategoriesTreeRender,
				itemclick: this.onProjectTemplatesCategoriesTreeItemClick,
				itemexpand: this.onProjectTemplatesCategoriesTreeItemExpand,
				itemcontextmenu: this.onProjectTemplatesCategoriesTreeItemContextMenu,
				containercontextmenu: this.onProjectTemplatesCategoriesContextMenu,
				edit: this.onProjectTemplatesCategoriesTreeEdit,
				canceledit: this.onProjectTemplatesCategoriesTreeCancelEdit
			},
			'projectTemplatesLibraryManager tool[name="addNewProjectTemplateCategoryTool"]': {
				click: this.onAddNewProjectTemplateCategoryToolClick
			},
			'projectTemplatesLibraryManager dataview[name="projectTemplatesDataView"]': {
				itemcontextmenu: this.onProjectTemplatesDataViewItemContextMenu,
				containercontextmenu: this.onProjectTemplatesDataViewContextMenu,
				itemdblclick: this.onProjectTemplatesDataViewItemDblClick,
				render: this.onProjectTemplatesDataViewRender,
				itemclick: this.onProjectTemplatesDataViewItemClick
			},
			'projectTemplatesLibraryManager tool[name="addNewProjectTemplateTool"]': {
				click: this.onAddNewProjectTemplateToolClick
			},
			'projectTemplatesLibraryManager tool[name="projectTemplatesLibraryToggleViewTool"]': {
				click: this.onProjectTemplatesLibraryToggleViewToolClick
			},
			'projectTemplatesLibraryManager grid[name="projectTemplatesGrid"]': {
				itemcontextmenu: this.onProjectTemplatesDataViewItemContextMenu,
				containercontextmenu: this.onProjectTemplatesDataViewContextMenu,
				itemdblclick: this.onProjectTemplatesDataViewItemDblClick,
				render: this.onProjectTemplatesGridRender,
				itemclick: this.onProjectTemplatesDataViewItemClick
			},
			'editProjectTemplateCategory button[name="updateProjectTemplateCategoryBtn"]': {
				click: this.onUpdateProjectTemplateCategoryBtnClick
			},
			'projectTemplatesLibraryManager treepanel tool[name="projectTemplateCategoryAuthorTool"]': {
				click: this.onProjectTemplateCategoryAuthorToolClick
			},
			'projectTemplatesLibraryManager tool[name="projectTemplateAuthorTool"]': {
				click: this.onProjectTemplateAuthorToolClick
			}
		});
	},
	onProjectTemplatesLibsBackButtonClick: function() {
		this.getProjectTemplatesTab().down('grid[name="projectTemplatesLibrariesGrid"]').setVisible(true);
		this.getProjectTemplatesTab().down('projectTemplatesLibraryManager').setVisible(false);
		MYOCD.SharedData.currentProjectTemplatesCategory = null;
		Ext.getStore('projectTemplate.ProjectTemplates').removeAll();
		Ext.getStore('projectTemplate.ProjectTemplatesCategoriesTreeStore').setRootNode(null);
		Ext.getStore('projectTemplate.ProjectTemplatesCategoriesTreeStore').removeAll();
	},
	onProjectTemplatesCategoriesTreeRender: function(treePanel, eOpts) {
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
	        	MYOCD.SharedData.currentProjectTemplateCategoryTreeDropNode = record;
	        	if(data.ProjectTemplateData) {
	        		return true;
	        	} else {
		        	return false
	        	}
	            return true;
	        }
	    });
    },
    onProjectTemplatesCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
	    MYOCD.SharedData.currentProjectTemplatesCategory = record;
		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		
		if(record.get('id')!=='root') {
			projectTemplateStoreController.loadTemplatesOfProjectTemplatesCategory(record.get('id'));
		} else {
			projectTemplateStoreController.loadTemplatesOfProjectTemplatesLib(MYOCD.SharedData.currentProjectTemplatesLibId);
		}
		//MYOCD.SharedData.currentProjectTemplate = null;
    },
    onProjectTemplatesCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		MYOCD.SharedData.currentProjectTemplatesCategory = categoryNode;
		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		if(categoryNode.data.id !== 'root') {
			projectTemplateStoreController.loadTemplatesOfProjectTemplatesCategory(categoryNode.data.id);
			projectTemplateStoreController.loadCategoriesOfProjectTemplatesCategory(categoryNode.data.id, categoryNode);
		} else {
			projectTemplateStoreController.loadTemplatesOfProjectTemplatesLib(MYOCD.SharedData.currentProjectTemplatesLibId);
		}
		//MYOCD.SharedData.currentProjectTemplate = null;
	},
	onProjectTemplatesCategoriesTreeItemContextMenu: function( treePanel, record, item, index, e, eOpts ) {
		var me = this;
		MYOCD.SharedData.currentProjectTemplatesCategoryNodeContextMenu = record;
		e.stopEvent()
		var newCateFunc = function () {
			record.expand(false, function () {
				record.appendChild(
					{
						id: -1,
						name: ''
					}
				);
				var newRecord = record.findChildBy(
					function(child) {
		    			return child.raw.id == -1;
					}
				);
				MYOCD.SharedData.AddingChildOnProjectTemplateNode = record;
				treePanel.ownerCt.getPlugin('cellEditingPlugin').startEdit(newRecord, treePanel.ownerCt.columns[0]);
			});
		}
		var editCateFunc = function() {
			if(me.getEditProjectTemplateCategory()) {
				return;
			}
			var popup = Ext.create('MYOCD.view.projectTemplate.EditProjectTemplateCategory');
			popup.down('textfield[name="projectTemplateCategoryName"]').setValue(record.get('name'));
			popup.down('textfield[name="projectTemplateCategoryDesc"]').setValue(record.get('description'));
			popup.show();
		}
		var deleteCateFunc = function() {
			Ext.Msg.confirm({
			    title: 'Delete Category',
			    msg: 'Do you really want delete this Category?',
			    width: 200,
			    buttons: Ext.Msg.YESNO,
			    icon: Ext.Msg.QUESTION,
			    fn: function(btn) {
				    if(btn == 'yes') {
				    	var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
				    	projectTemplateStoreController.deleteProjectTemplateCategory();
				    }
			    }
			});
		}
		var copyCateFunc = function() {
			MYOCD.SharedData.projectCategorySourceNode = record;
			MYOCD.SharedData.projectCategorySourceNode.isCut = false;
		}
		var cutCateFunc = function() {
			MYOCD.SharedData.projectCategorySourceNode = record;
			treePanel.ownerCt.getView().addRowCls(record,'opacity-treenode');
			MYOCD.SharedData.currentProjectCategoryTree = treePanel;
			MYOCD.SharedData.projectCategorySourceNode.isCut = true;
		}
		var pasteCateFunc = function() {
			var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
			if(MYOCD.SharedData.projectCategorySourceNode.isCut) {
				projectTemplateStoreController.moveProjectCategory(MYOCD.SharedData.projectCategorySourceNode, record, me.getProjectTemplatesTab());
			} else {
				projectTemplateStoreController.copyProjectCategory(MYOCD.SharedData.projectCategorySourceNode, record, me.getProjectTemplatesTab());

			}
		}
		var securityFunc = function () {
			if(me.getAuthorizationDialog()) {
				me.getAuthorizationDialog().destroy();
			}		
			var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
			if (record.data.id == 'root') {
				popup.down('textfield[name="baseUrl"]').setValue(PROJECT_TEMPLATE_LIB_BASE_URL);
				popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentProjectTemplatesLibId);
			} else {
				popup.down('textfield[name="baseUrl"]').setValue(PROJECT_TEMPLATE_CATEGORY_BASE_URL);
				popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
			}
			popup.show();
		}
		if(record.get('id') !== 'root') {
			var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Category',
						handler: newCateFunc
							
					},
					{
						xtype: 'menuseparator'	
					},
					{
						text: 'Copy',
						handler: copyCateFunc
					},
					{
						text: 'Cut',
						handler: cutCateFunc	
					},
					{
						text: 'Paste',
						disabled: MYOCD.SharedData.projectCategorySourceNode == null,
						handler: pasteCateFunc	
					},
					{
						xtype: 'menuseparator'	
					},
					{
						text: 'Edit',
						handler: editCateFunc
					},
					{
						text: 'Delete',
						handler: deleteCateFunc
					},
					'-',
					{
						text: 'Security',
						handler: securityFunc
					}
				]
			}).showAt(e.xy);
		} else {
			var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Add New Category',
						handler: newCateFunc
					},
					{
						xtype: 'menuseparator'	
					},
					{
						text: 'Paste',
						disabled: MYOCD.SharedData.projectCategorySourceNode == null,
						handler: pasteCateFunc	
					},
					'-',
					{
						text: 'Security',
						handler: securityFunc
					}
				]
			}).showAt(e.xy);
		}
	},
	onProjectTemplatesCategoriesContextMenu: function(treePanel, e, eOpts) {
		e.stopEvent();
	},
	onProjectTemplatesCategoriesTreeEdit: function(editor, e, eOpts) {
		var data = e.record.data;
	    var url;
	    if(data.parentId !== 'root') {
		    url = PROJECT_TEMPLATE_CATEGORY_BASE_URL + data.parentId + '/categories.json'
	    } else {
		    url = PROJECT_TEMPLATE_LIB_BASE_URL + MYOCD.SharedData.currentProjectTemplatesLibId  + '/categories.json'
	    }
	    var categoryName = data.name;
	    if(categoryName.trim().length == 0){
		    Ext.Msg.alert('Missing Category Name', 'please enter category name');
		    e.record.stores[0].remove(e.record);
		    e.record.destroy();
		    return;
	    }
	    
	    var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		projectTemplateStoreController.addNewProjectTemplatesCategory(url, categoryName, '', this.getProjectTemplatesTab());
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onProjectTemplatesCategoriesTreeCancelEdit: function(editor, e, eOpts) {
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onAddNewProjectTemplateCategoryToolClick : function() {
		var me = this;
		if(MYOCD.SharedData.currentProjectTemplatesCategory == null || MYOCD.SharedData.currentProjectTemplatesCategory.data.id == 'root') {
			var root = Ext.getStore('projectTemplate.ProjectTemplatesCategoriesTreeStore').getRootNode();
			root.expand(false, function () {
				root.appendChild(
					{
						id: -1,
						name: ''
					}
				);
				var newRecord = root.findChildBy(
					function(child) {
		    			return child.raw.id == -1;
					}
				);
				MYOCD.SharedData.AddingChildOnProjectTemplateNode = root;
				me.getProjectTemplatesCategoriesTree().getPlugin('cellEditingPlugin').startEdit(
					newRecord, me.getProjectTemplatesCategoriesTree().columns[0]);
			});
		} else {
			var record = MYOCD.SharedData.currentProjectTemplatesCategory;
			record.expand(false, function () {
				record.appendChild(
					{
						id: -1,
						name: ''
					}
				);
				var newRecord = record.findChildBy(
					function(child) {
		    			return child.raw.id == -1;
					}
				);
				MYOCD.SharedData.AddingChildOnProjectTemplateNode = record;
				me.getProjectTemplatesCategoriesTree().getPlugin('cellEditingPlugin').startEdit(
					newRecord, me.getProjectTemplatesCategoriesTree().columns[0]);
			});
		}
	},
	onProjectTemplatesDataViewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: function() {
						if(me.getNewProjectTemplate()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.projectTemplate.NewProjectTemplate');
						popup.setTitle('Edit Project Template');
						popup.down('textfield[name="projectTemplateId"]').setValue(record.get('id'));
						popup.down('textfield[name="projectTemplateName"]').setValue(record.get('name'));
						popup.down('textfield[name="projectTemplateDesc"]').setValue(record.get('description'));
						popup.down('button[name="createNewProjectTemplateBtn"]').hidden = true;
						popup.down('button[name="updateProjectTemplateBtn"]').hidden = false;
						var callback = function(product) {
							var parentType;
							if(product.object_types.length > 0) {
								parentType = product.object_types[0];
								popup.down('textfield[name="parentObjectTypeId"]').setValue(parentType.id);
								popup.down('textfield[name="parentObjectType"]').setValue(parentType.name);
							}
						}
						popup.show();
						var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
						projectTemplateStoreController.getProjectTemplateInfo(record.data.id, callback, popup);
					}
				},
				{
					text: 'Delete',
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Delete Template',
						    msg: 'Do you really want delete this template?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
							    	var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
							    	projectTemplateStoreController.deleteProjectTemplate(record.get('id'));
							    }
						    }
						});
					}
				},
				'-',
				{
					text: 'Security',
					handler: function() {
						if(me.getAuthorizationDialog()) {
							me.getAuthorizationDialog().destroy();
						}
						var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
						popup.down('textfield[name="baseUrl"]').setValue(PROJECT_TEMPLATE_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	},
	onProjectTemplatesDataViewContextMenu: function(dataview, e, eOpts) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Add New Template',
					handler: function() {
						if(me.getNewProjectTemplate()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.projectTemplate.NewProjectTemplate');
						popup.show();
					}
				}
			]
		}).showAt(e.xy);
	},
	onProjectTemplatesDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		me.getProjectTemplatesLibraryManager().setVisible(false);
		me.getProjectTemplateManager().setVisible(true);
		//MYOCD.SharedData.currentProjectTemplate = record.data;
		MYOCD.SharedData.currentProjectTemplateId = record.data.id;
		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		projectTemplateStoreController.getFeaturesOfProjectTemplate(record.data.id, record.data.name, me.getProjectTemplatesTab());
	},
	onAddNewProjectTemplateToolClick: function() {
		if(this.getNewProjectTemplate()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.projectTemplate.NewProjectTemplate');
		popup.show();
	},
	onProjectTemplatesLibraryToggleViewToolClick: function(tool) {
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
		this.getProjectTemplatesLibraryManager().down('dataview[name="projectTemplatesDataView"]').setVisible(!isDataView);
		this.getProjectTemplatesLibraryManager().down('grid[name="projectTemplatesGrid"]').setVisible(isDataView);
	},
	onUpdateProjectTemplateCategoryBtnClick: function() {
		var categoryName = this.getEditProjectTemplateCategory().down('textfield[name="projectTemplateCategoryName"]').getValue();
		var categoryDesc = this.getEditProjectTemplateCategory().down('textfield[name="projectTemplateCategoryDesc"]').getValue();
		if(categoryName.length == 0) {
			return;
		}
		this.getEditProjectTemplateCategory().destroy();
		var projectTemplateStoreController = MYOCD.controller.projectTemplate.ProjectTemplatesStoreController;
		projectTemplateStoreController.editProjectTemplateCategory(categoryName, categoryDesc);
	},
	onProjectTemplatesDataViewRender: function(dataview, eOpts) {
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
	                    ProjectTemplateData: dataview.getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onProjectTemplatesGridRender: function(grid, eOpts) {
		grid.dragZone = new Ext.dd.DragZone(grid.getEl(), {
	        getDragData: function(e) {
	            var sourceEl = e.getTarget(grid.getView().rowSelector, 10);
	            if (sourceEl) {
	                d = sourceEl.cloneNode(true);
	                d.id = Ext.id();
	                return grid.dragData = {
	                    sourceEl: sourceEl,
	                    repairXY: Ext.fly(sourceEl).getXY(),
	                    ddel: d,
	                    ProjectTemplateData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onProjectTemplateCategoryAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			this.getAuthorizationDialog().destroy();
		}		
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		if (!MYOCD.SharedData.currentProjectTemplatesCategory || MYOCD.SharedData.currentProjectTemplatesCategory.data.id == 'root') {
			popup.down('textfield[name="baseUrl"]').setValue(PROJECT_TEMPLATE_LIB_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentProjectTemplatesLibId);
		} else {
			popup.down('textfield[name="baseUrl"]').setValue(PROJECT_TEMPLATE_CATEGORY_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentProjectTemplatesCategory.data.id);
		}
		popup.show();
	},
	onProjectTemplatesDataViewItemClick: function( dataview, record, item, index, e, eOpts ) {
		//MYOCD.SharedData.currentProjectTemplate = record.data;
	},
	onProjectTemplateAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			this.getAuthorizationDialog().destroy();
		}
		if (!MYOCD.SharedData.currentProjectTemplate) {
			return;
		}
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		popup.down('textfield[name="baseUrl"]').setValue(PROJECT_TEMPLATE_BASE_URL);
		popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentProjectTemplate.id);
		popup.show(); 
	}
});