Ext.define('MYOCD.controller.companyTemplate.CompanyTemplatesLibManagerController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'companyTemplatesTab',
			selector: 'companyTemplatesTab'
		},
		{
			ref: 'companyTemplatesLibraryManager',
			selector: 'companyTemplatesLibraryManager'	
		},
		{
			ref: 'companyTemplatesCategoriesTree',
			selector: 'companyTemplatesLibraryManager treepanel[name="companyTemplatesCategoriesTree"]'
		},
		{
			ref: 'newCompanyTemplate',
			selector: 'newCompanyTemplate'
		},
		{
			ref: 'editCompanyTemplateCategory',
			selector: 'editCompanyTemplateCategory'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		}
	],
	init: function() {
		this.control({
			'companyTemplatesLibraryManager button[name="companyTemplatesLibsBackButton"]': {
				click: this.onCompanyTemplatesLibsBackButtonClick
			},
			'companyTemplatesLibraryManager treepanel[name="companyTemplatesCategoriesTree"]': {
				render: this.onCompanyTemplatesCategoriesTreeRender,
				itemclick: this.onCompanyTemplatesCategoriesTreeItemClick,
				itemexpand: this.onCompanyTemplatesCategoriesTreeItemExpand,
				itemcontextmenu: this.onCompanyTemplatesCategoriesTreeItemContextMenu,
				containercontextmenu: this.onCompanyTemplatesCategoriesContextMenu,
				edit: this.onCompanyTemplatesCategoriesTreeEdit,
				canceledit: this.onCompanyTemplatesCategoriesTreeCancelEdit
			},
			'companyTemplatesLibraryManager tool[name="addNewCompanyTemplateCategoryTool"]': {
				click: this.onAddNewCompanyTemplateCategoryToolClick
			},
			'companyTemplatesLibraryManager dataview[name="companyTemplatesDataView"]': {
				itemcontextmenu: this.onCompanyTemplatesDataViewItemContextMenu,
				containercontextmenu: this.onCompanyTemplatesDataViewContextMenu,
				itemdblclick: this.onCompanyTemplatesDataViewItemDblClick,
				render: this.onCompanyTemplatesDataViewRender,
				itemclick: this.onCompanyTemplatesDataViewItemClick
			},
			'newCompanyTemplate button[name="createNewCompanyTemplateBtn"]': {
				click: this.onCreateNewCompanyTemplateBtnClick
			},
			'companyTemplatesLibraryManager tool[name="addNewCompanyTemplateTool"]': {
				click: this.onAddNewCompanyTemplateToolClick
			},
			'companyTemplatesLibraryManager tool[name="companyTemplatesLibraryToggleViewTool"]': {
				click: this.onCompanyTemplatesLibraryToggleViewToolClick
			},
			'companyTemplatesLibraryManager grid[name="companyTemplatesGrid"]': {
				itemcontextmenu: this.onCompanyTemplatesDataViewItemContextMenu,
				containercontextmenu: this.onCompanyTemplatesDataViewContextMenu,
				itemdblclick: this.onCompanyTemplatesDataViewItemDblClick,
				render: this.onCompanyTemplatesGridRender,
				itemclick: this.onCompanyTemplatesDataViewItemClick
			},
			'editCompanyTemplateCategory button[name="updateCompanyTemplateCategoryBtn"]': {
				click: this.onUpdateCompanyTemplateCategoryBtnClick
			},
			'newCompanyTemplate button[name="updateCompanyTemplateBtn"]': {
				click: this.onUpdateCompanyTemplateBtnClick
			},
			'companyTemplatesLibraryManager treepanel tool[name="companyTemplateCategoryAuthorTool"]': {
				click: this.onCompanyTemplateCategoryAuthorToolClick
			},
			'companyTemplatesLibraryManager tool[name="companyTemplateAuthorTool"]': {
				click: this.onCompanyTemplateAuthorToolClick
			}
			
		});
	},
	onCompanyTemplatesLibsBackButtonClick: function() {
		this.getCompanyTemplatesTab().down('grid[name="companyTemplatesLibrariesGrid"]').setVisible(true);
		this.getCompanyTemplatesTab().down('companyTemplatesLibraryManager').setVisible(false);
		MYOCD.SharedData.currentCompanyTemplatesCategory = null;
		Ext.getStore('companyTemplate.CompanyTemplates').removeAll();
		Ext.getStore('companyTemplate.CompanyTemplatesCategoriesTreeStore').setRootNode(null);
		Ext.getStore('companyTemplate.CompanyTemplatesCategoriesTreeStore').removeAll();
	},
	onCompanyTemplatesCategoriesTreeRender: function(treePanel, eOpts) {
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
	        	MYOCD.SharedData.currentCompanyCategoryTreeDropNode = record;
	        	if(data.companyData) {
	        		treePanel.getSelectionModel().select(record);
	        		var companyTemplateStoreController = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
	        		companyTemplateStoreController.moveCompanyTemplate(data.companyData.id, record, me.getCompanyTemplatesTab());
	        		return true;
	        	} else {
		        	return false
	        	}
	            return true;
	        }
	    });
    },
    onCompanyTemplatesCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
	    MYOCD.SharedData.currentCompanyTemplatesCategory = record;
		var companyTemplateStoreController = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
		
		if(record.get('id')!=='root') {
			companyTemplateStoreController.loadTemplatesOfCompanyTemplatesCategory(record.get('id'));
		} else {
			companyTemplateStoreController.loadTemplatesOfCompanyTemplatesLib(MYOCD.SharedData.currentCompanyTemplatesLibId);
		}
		//MYOCD.SharedData.currentCompanyTemplate = null;
    },
    onCompanyTemplatesCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		MYOCD.SharedData.currentCompanyTemplatesCategory = categoryNode;
		var companyTemplateStoreController = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
		if(categoryNode.data.id !== 'root') {
			companyTemplateStoreController.loadTemplatesOfCompanyTemplatesCategory(categoryNode.data.id);
			companyTemplateStoreController.loadCategoriesOfCompanyTemplatesCategory(categoryNode.data.id, categoryNode);
		} else {
			companyTemplateStoreController.loadTemplatesOfCompanyTemplatesLib(MYOCD.SharedData.currentCompanyTemplatesLibId);
		}
		//MYOCD.SharedData.currentCompanyTemplate = null;
	},
	onCompanyTemplatesCategoriesTreeItemContextMenu: function( treePanel, record, item, index, e, eOpts ) {
		var me = this;
		MYOCD.SharedData.currentCompanyTemplatesCategoryNodeContextMenu = record;
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
				MYOCD.SharedData.AddingChildOnCompanyTemplateNode = record;
				treePanel.ownerCt.getPlugin('cellEditingPlugin').startEdit(newRecord, treePanel.ownerCt.columns[0]);
			});
		}
		var editCateFunc = function() {
			if(me.getEditCompanyTemplateCategory()) {
				return;
			}
			var popup = Ext.create('MYOCD.view.companyTemplate.EditCompanyTemplateCategory');
			popup.down('textfield[name="companyTemplateCategoryName"]').setValue(record.get('name'));
			popup.down('textfield[name="companyTemplateCategoryDesc"]').setValue(record.get('description'));
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
				    	var companyTemplateStoreController = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
				    	companyTemplateStoreController.deleteCompanyTemplateCategory();
				    }
			    }
			});
		}
		var copyCateFunc = function() {
			MYOCD.SharedData.companyCategorySourceNode = record;
			MYOCD.SharedData.companyCategorySourceNode.isCut = false;
		}
		var cutCateFunc = function() {
			MYOCD.SharedData.companyCategorySourceNode = record;
			treePanel.ownerCt.getView().addRowCls(record,'opacity-treenode');
			MYOCD.SharedData.currentCompanyCategoryTree = treePanel;
			MYOCD.SharedData.companyCategorySourceNode.isCut = true;
		}
		var pasteCateFunc = function() {
			var companyTemplateStoreController = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
			if(MYOCD.SharedData.companyCategorySourceNode.isCut) {
				companyTemplateStoreController.moveCompanyCategory(MYOCD.SharedData.companyCategorySourceNode, record, me.getCompanyTemplatesTab());
			} else {
				companyTemplateStoreController.copyCompanyCategory(MYOCD.SharedData.companyCategorySourceNode, record, me.getCompanyTemplatesTab());

			}
		}
		var securityFunc = function() {
			if(me.getAuthorizationDialog()) {
				me.getAuthorizationDialog().destroy();
			}		
			var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
			if (record.data.id == 'root') {
				popup.down('textfield[name="baseUrl"]').setValue(COMPANY_TEMPLATE_LIB_BASE_URL);
				popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentCompanyTemplatesLibId);
			} else {
				popup.down('textfield[name="baseUrl"]').setValue(COMPANY_TEMPLATE_CATEGORY_BASE_URL);
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
						disabled: MYOCD.SharedData.companyCategorySourceNode == null,
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
						disabled: MYOCD.SharedData.companyCategorySourceNode == null,
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
	onCompanyTemplatesCategoriesContextMenu: function(treePanel, e, eOpts) {
		e.stopEvent();
	},
	onCompanyTemplatesCategoriesTreeEdit: function(editor, e, eOpts) {
		var data = e.record.data;
	    var url;
	    if(data.parentId !== 'root') {
		    url = COMPANY_TEMPLATE_CATEGORY_BASE_URL + data.parentId + '/categories.json'
	    } else {
		    url = COMPANY_TEMPLATE_LIB_BASE_URL + MYOCD.SharedData.currentCompanyTemplatesLibId  + '/categories.json'
	    }
	    var categoryName = data.name;
	    if(categoryName.trim().length == 0){
		    Ext.Msg.alert('Missing Category Name', 'Please enter category name');
		    e.record.stores[0].remove(e.record);
		    e.record.destroy();
		    return;
	    }
	    
	    var companyTemplateStoreController = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
		companyTemplateStoreController.addNewCompanyTemplatesCategory(url, categoryName, '', this.getCompanyTemplatesTab());
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onCompanyTemplatesCategoriesTreeCancelEdit: function(editor, e, eOpts) {
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onAddNewCompanyTemplateCategoryToolClick : function() {
		var me = this;
		if(MYOCD.SharedData.currentCompanyTemplatesCategory == null || MYOCD.SharedData.currentCompanyTemplatesCategory.data.id == 'root') {
			var root = Ext.getStore('companyTemplate.CompanyTemplatesCategoriesTreeStore').getRootNode();
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
				MYOCD.SharedData.AddingChildOnCompanyTemplateNode = root;
				me.getCompanyTemplatesCategoriesTree().getPlugin('cellEditingPlugin').startEdit(
					newRecord, me.getCompanyTemplatesCategoriesTree().columns[0]);
			});
		} else {
			var record = MYOCD.SharedData.currentCompanyTemplatesCategory;
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
				MYOCD.SharedData.AddingChildOnCompanyTemplateNode = record;
				me.getCompanyTemplatesCategoriesTree().getPlugin('cellEditingPlugin').startEdit(
					newRecord, me.getCompanyTemplatesCategoriesTree().columns[0]);
			});
		}
	},
	onCompanyTemplatesDataViewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: function() {
						if(me.getNewCompanyTemplate()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.companyTemplate.NewCompanyTemplate');
						popup.setTitle('Edit Company Template');
						popup.down('textfield[name="companyTemplateId"]').setValue(record.get('id'));
						popup.down('textfield[name="companyTemplateName"]').setValue(record.get('name'));
						popup.down('textfield[name="companyTemplateDesc"]').setValue(record.get('description'));
						popup.down('textfield[name="companyTemplateType"]').setValue(record.get('company_type'));
						popup.down('button[name="createNewCompanyTemplateBtn"]').hidden = true;
						popup.down('button[name="updateCompanyTemplateBtn"]').hidden = false;
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
							    	var companyTemplateStoreController = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
							    	companyTemplateStoreController.deleteCompanyTemplate(record.get('id'));
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
							me.getAuthorizationDialog().destroy()
						}
						var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
						popup.down('textfield[name="baseUrl"]').setValue(COMPANY_TEMPLATE_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	},
	onCompanyTemplatesDataViewContextMenu: function(dataview, e, eOpts) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Add New Template',
					handler: function() {
						if(me.getNewCompanyTemplate()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.companyTemplate.NewCompanyTemplate');
						popup.show();
					}
				}
			]
		}).showAt(e.xy);
	},
	onCompanyTemplatesDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		if(this.getNewCompanyTemplate()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.companyTemplate.NewCompanyTemplate');
		popup.setTitle('Edit Company Template');
		popup.down('textfield[name="companyTemplateId"]').setValue(record.get('id'));
		popup.down('textfield[name="companyTemplateName"]').setValue(record.get('name'));
		popup.down('textfield[name="companyTemplateDesc"]').setValue(record.get('description'));
		popup.down('textfield[name="companyTemplateType"]').setValue(record.get('company_type'));
		popup.down('button[name="createNewCompanyTemplateBtn"]').hidden = true;
		popup.down('button[name="updateCompanyTemplateBtn"]').hidden = false;
		popup.show();
		//MYOCD.SharedData.currentCompanyTemplate = record.data;
	},
	onCreateNewCompanyTemplateBtnClick: function() {
		var templateName = this.getNewCompanyTemplate().down('textfield[name="companyTemplateName"]').getValue();
		var templateDesc = this.getNewCompanyTemplate().down('textfield[name="companyTemplateDesc"]').getValue();
		var templateType = this.getNewCompanyTemplate().down('textfield[name="companyTemplateType"]').getValue();
		if(templateName.length == 0) {
			return;
		}
		var url;
		if(MYOCD.SharedData.currentCompanyTemplatesCategory == null || MYOCD.SharedData.currentCompanyTemplatesCategory.data.id == 'root') {
			url = COMPANY_TEMPLATE_LIB_BASE_URL + MYOCD.SharedData.currentCompanyTemplatesLibId + '/templates.json';
		} else {
			url = COMPANY_TEMPLATE_CATEGORY_BASE_URL + MYOCD.SharedData.currentCompanyTemplatesCategory.data.id + '/templates.json';
		}
		this.getNewCompanyTemplate().destroy();

		var companyTemplateStoreController = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
		companyTemplateStoreController.addNewCompanyTemplate(url, templateName, templateDesc, templateType, this.getCompanyTemplatesTab());
	},
	onAddNewCompanyTemplateToolClick: function() {
		if(this.getNewCompanyTemplate()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.companyTemplate.NewCompanyTemplate');
		popup.show();
	},
	onCompanyTemplatesLibraryToggleViewToolClick: function(tool) {
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
		this.getCompanyTemplatesLibraryManager().down('dataview[name="companyTemplatesDataView"]').setVisible(!isDataView);
		this.getCompanyTemplatesLibraryManager().down('grid[name="companyTemplatesGrid"]').setVisible(isDataView);
	},
	onUpdateCompanyTemplateCategoryBtnClick: function() {
		var categoryName = this.getEditCompanyTemplateCategory().down('textfield[name="companyTemplateCategoryName"]').getValue();
		var categoryDesc = this.getEditCompanyTemplateCategory().down('textfield[name="companyTemplateCategoryDesc"]').getValue();
		if(categoryName.length == 0) {
			return;
		}
		this.getEditCompanyTemplateCategory().destroy();
		var companyTemplateStoreController = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
		companyTemplateStoreController.editCompanyTemplateCategory(categoryName, categoryDesc);
	},
	onUpdateCompanyTemplateBtnClick: function() {
		var templateId = this.getNewCompanyTemplate().down('textfield[name="companyTemplateId"]').getValue();
		var templateName = this.getNewCompanyTemplate().down('textfield[name="companyTemplateName"]').getValue();
		var templateDesc = this.getNewCompanyTemplate().down('textfield[name="companyTemplateDesc"]').getValue();
		var templateType = this.getNewCompanyTemplate().down('textfield[name="companyTemplateType"]').getValue();
		if(templateName.length == 0) {
			return;
		}

		this.getNewCompanyTemplate().destroy();

		var companyTemplateStoreController = MYOCD.controller.companyTemplate.CompanyTemplatesStoreController;
		companyTemplateStoreController.editCompanyTemplate(templateId, templateName, templateDesc, templateType, this.getCompanyTemplatesTab());
	},
	onCompanyTemplatesDataViewRender: function(dataview, eOpts) {
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
	                    companyData: dataview.getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onCompanyTemplatesGridRender: function(grid, eOpts) {
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
	                    companyData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onCompanyTemplateCategoryAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}		
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		if (!MYOCD.SharedData.currentCompanyTemplatesCategory || MYOCD.SharedData.currentCompanyTemplatesCategory.data.id == 'root') {
			popup.down('textfield[name="baseUrl"]').setValue(COMPANY_TEMPLATE_LIB_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentCompanyTemplatesLibId);
		} else {
			popup.down('textfield[name="baseUrl"]').setValue(COMPANY_TEMPLATE_CATEGORY_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentCompanyTemplatesCategory.data.id);
		}
		popup.show(); 
	},
	onCompanyTemplatesDataViewItemClick: function( dataview, record, item, index, e, eOpts ) {
		//MYOCD.SharedData.currentCompanyTemplate = record.data;
	},
	onCompanyTemplateAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}
		if (!MYOCD.SharedData.currentCompanyTemplate) {
			return;
		}
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		popup.down('textfield[name="baseUrl"]').setValue(COMPANY_TEMPLATE_BASE_URL);
		popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentCompanyTemplate.id);
		popup.show(); 
	}
});