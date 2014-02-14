Ext.define('MYOCD.controller.communityTemplate.CommunityTemplatesLibManagerController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'communityTemplatesTab',
			selector: 'communityTemplatesTab'
		},
		{
			ref: 'communityTemplatesLibraryManager',
			selector: 'communityTemplatesLibraryManager'	
		},
		{
			ref: 'communityTemplatesCategoriesTree',
			selector: 'communityTemplatesLibraryManager treepanel[name="communityTemplatesCategoriesTree"]'
		},
		{
			ref: 'newCommunityTemplate',
			selector: 'newCommunityTemplate'
		},
		{
			ref: 'editCommunityTemplateCategory',
			selector: 'editCommunityTemplateCategory'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		}
	],
	init: function() {
		this.control({
			'communityTemplatesLibraryManager button[name="communityTemplatesLibsBackButton"]': {
				click: this.onCommunityTemplatesLibsBackButtonClick
			},
			'communityTemplatesLibraryManager treepanel[name="communityTemplatesCategoriesTree"]': {
				render: this.onCommunityTemplatesCategoriesTreeRender,
				itemclick: this.onCommunityTemplatesCategoriesTreeItemClick,
				itemexpand: this.onCommunityTemplatesCategoriesTreeItemExpand,
				itemcontextmenu: this.onCommunityTemplatesCategoriesTreeItemContextMenu,
				containercontextmenu: this.onCommunityTemplatesCategoriesContextMenu,
				edit: this.onCommunityTemplatesCategoriesTreeEdit,
				canceledit: this.onCommunityTemplatesCategoriesTreeCancelEdit
			},
			'communityTemplatesLibraryManager tool[name="addNewCommunityTemplateCategoryTool"]': {
				click: this.onAddNewCommunityTemplateCategoryToolClick
			},
			'communityTemplatesLibraryManager dataview[name="communityTemplatesDataView"]': {
				itemcontextmenu: this.onCommunityTemplatesDataViewItemContextMenu,
				containercontextmenu: this.onCommunityTemplatesDataViewContextMenu,
				itemdblclick: this.onCommunityTemplatesDataViewItemDblClick,
				render: this.onCommunityTemplatesDataViewRender,
				itemclick: this.onCommunityTemplatesDataViewItemClick
			},
			'newCommunityTemplate button[name="createNewCommunityTemplateBtn"]': {
				click: this.onCreateNewCommunityTemplateBtnClick
			},
			'communityTemplatesLibraryManager tool[name="addNewCommunityTemplateTool"]': {
				click: this.onAddNewCommunityTemplateToolClick
			},
			'communityTemplatesLibraryManager tool[name="communityTemplatesLibraryToggleViewTool"]': {
				click: this.onCommunityTemplatesLibraryToggleViewToolClick
			},
			'communityTemplatesLibraryManager grid[name="communityTemplatesGrid"]': {
				itemcontextmenu: this.onCommunityTemplatesDataViewItemContextMenu,
				containercontextmenu: this.onCommunityTemplatesDataViewContextMenu,
				itemdblclick: this.onCommunityTemplatesDataViewItemDblClick,
				render: this.onCommunityTemplatesGridRender,
				itemclick: this.onCommunityTemplatesDataViewItemClick
			},
			'editCommunityTemplateCategory button[name="updateCommunityTemplateCategoryBtn"]': {
				click: this.onUpdateCommunityTemplateCategoryBtnClick
			},
			'newCommunityTemplate button[name="updateCommunityTemplateBtn"]': {
				click: this.onUpdateCommunityTemplateBtnClick
			},
			'communityTemplatesLibraryManager treepanel tool[name="communityTemplateCategoryAuthorTool"]': {
				click: this.onCommunityTemplateCategoryAuthorToolClick
			},
			'communityTemplatesLibraryManager tool[name="communityTemplateAuthorTool"]': {
				click: this.onCommunityTemplateAuthorToolClick
			}
		});
	},
	onCommunityTemplatesLibsBackButtonClick: function() {
		this.getCommunityTemplatesTab().down('grid[name="communityTemplateLibsGrid"]').setVisible(true);
		this.getCommunityTemplatesTab().down('communityTemplatesLibraryManager').setVisible(false);
		MYOCD.SharedData.currentCommunityTemplatesCategory = null;
		Ext.getStore('communityTemplate.CommunityTemplates').removeAll();
		Ext.getStore('communityTemplate.CommunityTemplatesCategoriesTreeStore').setRootNode(null);
		Ext.getStore('communityTemplate.CommunityTemplatesCategoriesTreeStore').removeAll();
	},
	onCommunityTemplatesCategoriesTreeRender: function(treePanel, eOpts) {
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
	        	MYOCD.SharedData.currentCommunityCategoryTreeDropNode = record;
	        	if(data.communityData) {
	        		treePanel.getSelectionModel().select(record);
	        		var communityTemplateStoreController = MYOCD.controller.communityTemplate.CommunityTemplatesStoreController;
	        		communityTemplateStoreController.moveCommunityTemplate(data.communityData.id, record, me.getCommunityTemplatesTab());
	        		return true;
	        	} else {
		        	return false
	        	}
	            return true;
	        }
	    });
    },
    onCommunityTemplatesCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
	    MYOCD.SharedData.currentCommunityTemplatesCategory = record;
		var communityTemplateStoreController = MYOCD.controller.communityTemplate.CommunityTemplatesStoreController;
		
		if(record.get('id')!=='root') {
			communityTemplateStoreController.loadTemplatesOfCommunityTemplatesCategory(record.get('id'));
		} else {
			communityTemplateStoreController.loadTemplatesOfCommunityTemplatesLib(MYOCD.SharedData.currentCommunityTemplatesLibId);
		}
		//MYOCD.SharedData.currentCommunityTemplate = null;
    },
    onCommunityTemplatesCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		MYOCD.SharedData.currentCommunityTemplatesCategory = categoryNode;
		var communityTemplateStoreController = MYOCD.controller.communityTemplate.CommunityTemplatesStoreController;
		if(categoryNode.data.id !== 'root') {
			communityTemplateStoreController.loadTemplatesOfCommunityTemplatesCategory(categoryNode.data.id);
			communityTemplateStoreController.loadCategoriesOfCommunityTemplatesCategory(categoryNode.data.id, categoryNode);
		} else {
			communityTemplateStoreController.loadTemplatesOfCommunityTemplatesLib(MYOCD.SharedData.currentCommunityTemplatesLibId);
		}
		//MYOCD.SharedData.currentCommunityTemplate = null;
	},
	onCommunityTemplatesCategoriesTreeItemContextMenu: function( treePanel, record, item, index, e, eOpts ) {
		var me = this;
		MYOCD.SharedData.currentCommunityTemplatesCategoryNodeContextMenu = record;
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
				MYOCD.SharedData.AddingChildOnCommunityTemplateNode = record;
				treePanel.ownerCt.getPlugin('cellEditingPlugin').startEdit(newRecord, treePanel.ownerCt.columns[0]);
			});
		}
		var editCateFunc = function() {
			if(me.getEditCommunityTemplateCategory()) {
				return;
			}
			var popup = Ext.create('MYOCD.view.communityTemplate.EditCommunityTemplateCategory');
			popup.down('textfield[name="communityTemplateCategoryName"]').setValue(record.get('name'));
			popup.down('textfield[name="communityTemplateCategoryDesc"]').setValue(record.get('description'));
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
				    	var communityTemplateStoreController = MYOCD.controller.communityTemplate.CommunityTemplatesStoreController;
				    	communityTemplateStoreController.deleteCommunityTemplateCategory();
				    }
			    }
			});
		}
		var copyCateFunc = function() {
			MYOCD.SharedData.communityCategorySourceNode = record;
			MYOCD.SharedData.communityCategorySourceNode.isCut = false;
		}
		var cutCateFunc = function() {
			MYOCD.SharedData.communityCategorySourceNode = record;
			treePanel.ownerCt.getView().addRowCls(record,'opacity-treenode');
			MYOCD.SharedData.currentCommunityCategoryTree = treePanel;
			MYOCD.SharedData.communityCategorySourceNode.isCut = true;
		}
		var pasteCateFunc = function() {
			var communityTemplateStoreController = MYOCD.controller.communityTemplate.CommunityTemplatesStoreController;
			if(MYOCD.SharedData.communityCategorySourceNode.isCut) {
				communityTemplateStoreController.moveCommunityCategory(MYOCD.SharedData.communityCategorySourceNode, record, me.getCommunityTemplatesTab());
			} else {
				communityTemplateStoreController.copyCommunityCategory(MYOCD.SharedData.communityCategorySourceNode, record, me.getCommunityTemplatesTab());

			}
		}
		var securityFunc = function() {
			if(me.getAuthorizationDialog()) {
				me.getAuthorizationDialog().destroy();
			}		
			var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
			if (record.data.id == 'root') {
				popup.down('textfield[name="baseUrl"]').setValue(COMMUNITY_TEMPLATE_LIB_BASE_URL);
				popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentCommunityTemplatesLibId);
			} else {
				popup.down('textfield[name="baseUrl"]').setValue(COMMUNITY_TEMPLATE_CATEGORY_BASE_URL);
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
						disabled: MYOCD.SharedData.communityCategorySourceNode == null,
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
						disabled: MYOCD.SharedData.communityCategorySourceNode == null,
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
	onCommunityTemplatesCategoriesContextMenu: function(treePanel, e, eOpts) {
		e.stopEvent();
	},
	onCommunityTemplatesCategoriesTreeEdit: function(editor, e, eOpts) {
		var data = e.record.data;
	    var url;
	    if(data.parentId !== 'root') {
		    url = COMMUNITY_TEMPLATE_CATEGORY_BASE_URL + data.parentId + '/categories.json'
	    } else {
		    url = COMMUNITY_TEMPLATE_LIB_BASE_URL + MYOCD.SharedData.currentCommunityTemplatesLibId  + '/categories.json'
	    }
	    var categoryName = data.name;
	    if(categoryName.trim().length == 0){
		    Ext.Msg.alert('Missing Category Name', 'Please enter category name');
		    e.record.stores[0].remove(e.record);
		    e.record.destroy();
		    return;
	    }
	    
	    var communityTemplateStoreController = MYOCD.controller.communityTemplate.CommunityTemplatesStoreController;
		communityTemplateStoreController.addNewCommunityTemplatesCategory(url, categoryName, '', this.getCommunityTemplatesTab());
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onCommunityTemplatesCategoriesTreeCancelEdit: function(editor, e, eOpts) {
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onAddNewCommunityTemplateCategoryToolClick : function() {
		var me = this;
		if(MYOCD.SharedData.currentCommunityTemplatesCategory == null || MYOCD.SharedData.currentCommunityTemplatesCategory.data.id == 'root') {
			var root = Ext.getStore('communityTemplate.CommunityTemplatesCategoriesTreeStore').getRootNode();
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
				MYOCD.SharedData.AddingChildOnCommunityTemplateNode = root;
				me.getCommunityTemplatesCategoriesTree().getPlugin('cellEditingPlugin').startEdit(
					newRecord, me.getCommunityTemplatesCategoriesTree().columns[0]);
			});
		} else {
			var record = MYOCD.SharedData.currentCommunityTemplatesCategory;
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
				MYOCD.SharedData.AddingChildOnCommunityTemplateNode = record;
				me.getCommunityTemplatesCategoriesTree().getPlugin('cellEditingPlugin').startEdit(
					newRecord, me.getCommunityTemplatesCategoriesTree().columns[0]);
			});
		}
	},
	onCommunityTemplatesDataViewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: function() {
						if(me.getNewCommunityTemplate()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.communityTemplate.NewCommunityTemplate');
						popup.setTitle('Edit community Template');
						popup.down('textfield[name="communityTemplateId"]').setValue(record.get('id'));
						popup.down('textfield[name="communityTemplateName"]').setValue(record.get('name'));
						popup.down('textfield[name="communityTemplateDesc"]').setValue(record.get('description'));
						popup.down('textfield[name="communityTemplateType"]').setValue(record.get('community_group_type'));
						popup.down('button[name="createNewCommunityTemplateBtn"]').hidden = true;
						popup.down('button[name="updateCommunityTemplateBtn"]').hidden = false;
						popup.show();
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
							    	var communityTemplateStoreController = MYOCD.controller.communityTemplate.CommunityTemplatesStoreController;
							    	communityTemplateStoreController.deleteCommunityTemplate(record.get('id'));
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
						popup.down('textfield[name="baseUrl"]').setValue(COMMUNITY_TEMPLATE_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	},
	onCommunityTemplatesDataViewContextMenu: function(dataview, e, eOpts) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Add New Template',
					handler: function() {
						if(me.getNewCommunityTemplate()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.communityTemplate.NewCommunityTemplate');
						popup.show();
					}
				}
			]
		}).showAt(e.xy);
	},
	onCommunityTemplatesDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		if(this.getNewCommunityTemplate()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.communityTemplate.NewCommunityTemplate');
		popup.setTitle('Edit community Template');
		popup.down('textfield[name="communityTemplateId"]').setValue(record.get('id'));
		popup.down('textfield[name="communityTemplateName"]').setValue(record.get('name'));
		popup.down('textfield[name="communityTemplateDesc"]').setValue(record.get('description'));
		popup.down('textfield[name="communityTemplateType"]').setValue(record.get('community_group_type'));
		popup.down('button[name="createNewCommunityTemplateBtn"]').hidden = true;
		popup.down('button[name="updateCommunityTemplateBtn"]').hidden = false;
		popup.show();	
		//MYOCD.SharedData.currentCommunityTemplate = record.data;
	},
	onCreateNewCommunityTemplateBtnClick: function() {
		var templateName = this.getNewCommunityTemplate().down('textfield[name="communityTemplateName"]').getValue();
		var templateDesc = this.getNewCommunityTemplate().down('textfield[name="communityTemplateDesc"]').getValue();
		var templateType = this.getNewCommunityTemplate().down('textfield[name="communityTemplateType"]').getValue();
		if(templateName.length == 0) {
			return;
		}
		var url;
		if(MYOCD.SharedData.currentCommunityTemplatesCategory == null || MYOCD.SharedData.currentCommunityTemplatesCategory.data.id == 'root') {
			url = COMMUNITY_TEMPLATE_LIB_BASE_URL + MYOCD.SharedData.currentCommunityTemplatesLibId + '/templates.json';
		} else {
			url = COMMUNITY_TEMPLATE_CATEGORY_BASE_URL + MYOCD.SharedData.currentCommunityTemplatesCategory.data.id + '/templates.json';
		}
		this.getNewCommunityTemplate().destroy();

		var communityTemplateStoreController = MYOCD.controller.communityTemplate.CommunityTemplatesStoreController;
		communityTemplateStoreController.addNewCommunityTemplate(url, templateName, templateDesc, templateType, this.getCommunityTemplatesTab());
	},
	onAddNewCommunityTemplateToolClick: function() {
		if(this.getNewCommunityTemplate()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.communityTemplate.NewCommunityTemplate');
		popup.show();
	},
	onCommunityTemplatesLibraryToggleViewToolClick: function(tool) {
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
		this.getCommunityTemplatesLibraryManager().down('dataview[name="communityTemplatesDataView"]').setVisible(!isDataView);
		this.getCommunityTemplatesLibraryManager().down('grid[name="communityTemplatesGrid"]').setVisible(isDataView);
	},
	onUpdateCommunityTemplateCategoryBtnClick: function() {
		var categoryName = this.getEditCommunityTemplateCategory().down('textfield[name="communityTemplateCategoryName"]').getValue();
		var categoryDesc = this.getEditCommunityTemplateCategory().down('textfield[name="communityTemplateCategoryDesc"]').getValue();
		if(categoryName.length == 0) {
			return;
		}
		this.getEditCommunityTemplateCategory().destroy();
		var communityTemplateStoreController = MYOCD.controller.communityTemplate.CommunityTemplatesStoreController;
		communityTemplateStoreController.editCommunityTemplateCategory(categoryName, categoryDesc);
	},
	onUpdateCommunityTemplateBtnClick: function() {
		var templateId = this.getNewCommunityTemplate().down('textfield[name="communityTemplateId"]').getValue();
		var templateName = this.getNewCommunityTemplate().down('textfield[name="communityTemplateName"]').getValue();
		var templateDesc = this.getNewCommunityTemplate().down('textfield[name="communityTemplateDesc"]').getValue();
		var templateType = this.getNewCommunityTemplate().down('textfield[name="communityTemplateType"]').getValue();
		if(templateName.length == 0) {
			return;
		}

		this.getNewCommunityTemplate().destroy();

		var communityTemplateStoreController = MYOCD.controller.communityTemplate.CommunityTemplatesStoreController;
		communityTemplateStoreController.editCommunityTemplate(templateId, templateName, templateDesc, templateType, this.getCommunityTemplatesTab());
	},
	onCommunityTemplatesDataViewRender: function(dataview, eOpts) {
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
	                    communityData: dataview.getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onCommunityTemplatesGridRender: function(grid, eOpts) {
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
	                    communityData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onCommunityTemplateCategoryAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}		
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		if (!MYOCD.SharedData.currentCommunityTemplatesCategory || MYOCD.SharedData.currentCommunityTemplatesCategory.data.id == 'root') {
			popup.down('textfield[name="baseUrl"]').setValue(COMMUNITY_TEMPLATE_LIB_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentCommunityTemplatesLibId);
		} else {
			popup.down('textfield[name="baseUrl"]').setValue(COMMUNITY_TEMPLATE_CATEGORY_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentCommunityTemplatesCategory.data.id);
		}
		popup.show(); 
	},
	onCommunityTemplatesDataViewItemClick: function( dataview, record, item, index, e, eOpts ) {
		//MYOCD.SharedData.currentCommunityTemplate = record.data;
	},
	onCommunityTemplateAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}
		if (!MYOCD.SharedData.currentCommunityTemplate) {
			return;
		}
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		popup.down('textfield[name="baseUrl"]').setValue(COMMUNITY_TEMPLATE_BASE_URL);
		popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentCommunityTemplate.id);
		popup.show(); 
	}
});