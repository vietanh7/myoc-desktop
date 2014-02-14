Ext.define('MYOCD.controller.classification.ClassificationsLibraryManagerController', {
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'classificationsTab',
			selector: 'classificationsTab'
		},
		{
			ref: 'classificationsLibraryManager',
			selector: 'classificationsLibraryManager'	
		},
		{
			ref: 'classificationsCategoriesTree',
			selector: 'classificationsLibraryManager treepanel[name="classificationsCategoriesTree"]'
		},
		{
			ref: 'newClassification',
			selector: 'newClassification'
		},
		{
			ref: 'editClassificationsCategory',
			selector: 'editClassificationsCategory'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		}
	],
	init: function() {
		this.control({
			'classificationsLibraryManager button[name="classificationsLibsBackButton"]': {
				click: this.onClassificationsLibsBackButtonClick
			},
			'classificationsLibraryManager treepanel[name="classificationsCategoriesTree"]': {
				render: this.onClassificationsCategoriesTreeRender,
				itemclick: this.onClassificationsCategoriesTreeItemClick,
				itemexpand: this.onClassificationsCategoriesTreeItemExpand,
				itemcontextmenu: this.onClassificationsCategoriesTreeItemContextMenu,
				containercontextmenu: this.onClassificationsCategoriesTreeContextMenu,
				edit: this.onClassificationsCategoriesTreeEdit,
				canceledit: this.onClassificationCategoriesTreeEditCancelEdit
			},
			'classificationsLibraryManager tool[name="addNewClassificationCategoryTool"]': {
				click: this.onAddNewClassificationCategoryToolClick
			},
			'classificationsLibraryManager dataview[name="classificationsDataView"]': {
				itemcontextmenu: this.onClassificationsDataViewItemContextMenu,
				containercontextmenu: this.onClassificationsDataViewContextMenu,
				itemdblclick: this.onClassificationsDataViewItemDblClick,
				render: this.onClassificationsDataViewRender,
				itemclick: this.onClassificationDataViewItemClick
			},
			'newClassification button[name="createNewClassificationBtn"]': {
				click: this.onCreateNewClassificationBtnClick
			},
			'classificationsLibraryManager tool[name="addNewClassificationTool"]': {
				click: this.onAddNewClassificationToolClick
			},
			'classificationsLibraryManager tool[name="classificationsLibraryToggleViewTool"]': {
				click: this.onClassificationsLibraryToggleViewToolClick
			},
			'classificationsLibraryManager grid[name="classificationsGrid"]': {
				itemcontextmenu: this.onClassificationsDataViewItemContextMenu,
				containercontextmenu: this.onClassificationsDataViewContextMenu,
				itemdblclick: this.onClassificationsDataViewItemDblClick,
				render: this.onClassificationsGridRender,
				itemclick: this.onClassificationDataViewItemClick
			},
			'editClassificationsCategory button[name="updateClassificationCategoryBtn"]': {
				click: this.onUpdateClassificationCategoryBtnClick
			},
			'newClassification button[name="updateClassificationBtn"]': {
				click: this.onUpdateClassificationBtnClick
			},
			'classificationsLibraryManager treepanel tool[name="classificationCategoryAuthorTool"]': {
				click: this.onClassificationCategoryAuthorToolClick
			},
			'classificationsLibraryManager tool[name="classificationsAuthorTool"]': {
				click: this.onClassificationsAuthorToolClick
			},
			'classificationsLibraryManager panel[name="addNewClassificationPanel"] button[name="createNewClassificationBtn"]': {
				click: this.onCreateNewClassificationBtnPanelClick
			}
		});
	},
	onClassificationsLibsBackButtonClick: function() {
		this.getClassificationsTab().down('grid[name="classificationLibrariesGrid"]').setVisible(true);
		this.getClassificationsTab().down('classificationsLibraryManager').setVisible(false);
		MYOCD.SharedData.currentClassificationsCategory = null;
		Ext.getStore('classification.Classifications').removeAll();
		Ext.getStore('classification.ClassificationsCategoriesTreeStore').setRootNode(null);
		Ext.getStore('classification.ClassificationsCategoriesTreeStore').removeAll();
	},
	onClassificationsCategoriesTreeRender: function(treePanel, eOpts) {
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
	        	MYOCD.SharedData.currentClassificationCategoryTreeDropNode = record;
	        	if(data.classificationData) {
	        		treePanel.getSelectionModel().select(record);
	        		var classificationStoreCtl = MYOCD.controller.classification.ClassificationsStoreController;
	        		classificationStoreCtl.moveClassification(data.classificationData.id, record, me.getClassificationsTab());
	        		return true;
	        	} else {
		        	return false
	        	}
	            return true;
	        }
	    });
    },
    onClassificationsCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
	    MYOCD.SharedData.currentClassificationsCategory = record;
		var classificationStoreCtl = MYOCD.controller.classification.ClassificationsStoreController;
		
		if(record.get('id')!=='root') {
			classificationStoreCtl.loadClassificationsOfClassificationsCategory(record.get('id'));
		} else {
			classificationStoreCtl.loadClassificationsOfClassificationsLib(MYOCD.SharedData.currentClassificationsLibId);
		}
		//MYOCD.SharedData.currentClassification = null;
    },
    onClassificationsCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		MYOCD.SharedData.currentClassificationsCategory = categoryNode;
		var classificationStoreCtl = MYOCD.controller.classification.ClassificationsStoreController;
		if(categoryNode.data.id !== 'root') {
			classificationStoreCtl.loadClassificationsOfClassificationsCategory(categoryNode.data.id);
			classificationStoreCtl.loadCategoriesOfClassificationsCategory(categoryNode.data.id, categoryNode);
		} else {
			classificationStoreCtl.loadClassificationsOfClassificationsLib(MYOCD.SharedData.currentClassificationsLibId);
		}
		//MYOCD.SharedData.currentClassification = null;
	},
	onClassificationsCategoriesTreeItemContextMenu: function( treePanel, record, item, index, e, eOpts ) {
		var me = this;
		MYOCD.SharedData.currentClassificationsCategoryNodeContextMenu = record;
		e.stopEvent();
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
				MYOCD.SharedData.AddingChildOnClassificationNode = record;
				treePanel.ownerCt.getPlugin('cellEditingPlugin').startEdit(newRecord, treePanel.ownerCt.columns[0]);
			});
		}
		var editCateFunc = function() {
			if(me.getEditClassificationsCategory()) {
				return;
			}
			var popup = Ext.create('MYOCD.view.classification.EditClassificationsCategory');
			popup.down('textfield[name="classificationCategoryName"]').setValue(record.get('name'));
			popup.down('textfield[name="classificationCategoryDesc"]').setValue(record.get('description'));
			popup.show();
		}
		var deleteCateFunc = function() {
			Ext.Msg.confirm({
			    title: 'Delete Category',
			    msg: 'Do you really want to delete this category?',
			    width: 200,
			    buttons: Ext.Msg.YESNO,
			    icon: Ext.Msg.QUESTION,
			    fn: function(btn) {
				    if(btn == 'yes') {
					    var classificationStoreCtl = MYOCD.controller.classification.ClassificationsStoreController;
					    classificationStoreCtl.deleteClassificationsCategory();
				    }
			    }
			});
		}
		var copyCateFunc = function() {
			MYOCD.SharedData.classificationCategorySourceNode = record;
			MYOCD.SharedData.classificationCategorySourceNode.isCut = false;
		}
		var cutCateFunc = function() {
			MYOCD.SharedData.classificationCategorySourceNode = record;
			treePanel.ownerCt.getView().addRowCls(record,'opacity-treenode');
			MYOCD.SharedData.currentClassificationCategoryTree = treePanel;
			MYOCD.SharedData.classificationCategorySourceNode.isCut = true;
		}
		var pasteCateFunc = function() {
			var classificationStoreCtl = MYOCD.controller.classification.ClassificationsStoreController;
			if(MYOCD.SharedData.classificationCategorySourceNode.isCut) {
				classificationStoreCtl.moveClassificationCategory(MYOCD.SharedData.classificationCategorySourceNode, record, me.getClassificationsTab());
			} else {
				classificationStoreCtl.copyClassificationCategory(MYOCD.SharedData.classificationCategorySourceNode, record, me.getClassificationsTab());

			}
		}
		var securityFunc = function () {
			if(me.getAuthorizationDialog()) {
				me.getAuthorizationDialog().destroy();
			}		
			var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
			if (record.data.id == 'root') {
				popup.down('textfield[name="baseUrl"]').setValue(CLASSIFICATION_LIB_BASE_URL);
				popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentClassificationsLibId);
			} else {
				popup.down('textfield[name="baseUrl"]').setValue(CLASSIFICATION_CATEGORY_BASE_URL);
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
						disabled: MYOCD.SharedData.classificationCategorySourceNode == null,
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
						disabled: MYOCD.SharedData.classificationCategorySourceNode == null,
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
	onClassificationsCategoriesTreeContextMenu: function(treePanel, e, eOpts) {
		e.stopEvent();
	},
	onClassificationsCategoriesTreeEdit: function(editor, e, eOpts) {
		var data = e.record.data;
	    var url;
	    if(data.parentId !== 'root') {
		    url = CLASSIFICATION_CATEGORY_BASE_URL + data.parentId + '/categories.json'
	    } else {
		    url = CLASSIFICATION_LIB_BASE_URL + MYOCD.SharedData.currentClassificationsLibId  + '/categories.json'
	    }
	    var categoryName = data.name;
	    if(categoryName.trim().length == 0){
		    Ext.Msg.alert('Missing Category Name', 'Please enter category name');
		    e.record.stores[0].remove(e.record);
		    e.record.destroy();
		    return;
	    }
	    
	    var classificationStoreCtl = MYOCD.controller.classification.ClassificationsStoreController;
		classificationStoreCtl.addNewClassificationsCategory(url, categoryName, '', this.getClassificationsTab());
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onClassificationCategoriesTreeEditCancelEdit: function(editor, e, eOpts) {
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onAddNewClassificationCategoryToolClick: function() {
		var me = this;
		if(MYOCD.SharedData.currentClassificationsCategory == null || MYOCD.SharedData.currentClassificationsCategory.data.id == 'root') {
			var root = Ext.getStore('classification.ClassificationsCategoriesTreeStore').getRootNode();
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
				MYOCD.SharedData.AddingChildOnClassificationNode = root;
				me.getClassificationsCategoriesTree().getPlugin('cellEditingPlugin').startEdit(
					newRecord, me.getClassificationsCategoriesTree().columns[0]);
			});
		} else {
			var record = MYOCD.SharedData.currentClassificationsCategory;
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
				MYOCD.SharedData.AddingChildOnClassificationNode = record;
				me.getClassificationsCategoriesTree().getPlugin('cellEditingPlugin').startEdit(
					newRecord, me.getClassificationsCategoriesTree().columns[0]);
			});
		}
	},
	onClassificationsDataViewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: function() {
						if(me.getNewClassification()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.classification.NewClassification');
						popup.setTitle('Edit Classification');
						popup.down('textfield[name="classificationId"]').setValue(record.get('id'));
						popup.down('textfield[name="classificationName"]').setValue(record.get('name'));
						popup.down('textfield[name="classificationDesc"]').setValue(record.get('description'));
						popup.down('button[name="updateClassificationBtn"]').hidden = false;
						popup.down('button[name="createNewClassificationBtn"]').hidden = true;
						popup.show();
					}
				},
				{
					text: 'Delete',
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Delete Classification',
						    msg: 'Do you really want to delete this classification?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
								    var classificationStoreCtl = MYOCD.controller.classification.ClassificationsStoreController;
								    classificationStoreCtl.deleteClassification(record.get('id'), me.getClassificationsTab());
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
						popup.down('textfield[name="baseUrl"]').setValue(CLASSIFICATION_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	},
	onClassificationsDataViewContextMenu: function(dataview, e, eOpts) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Add New Classification',
					handler: function() {
						// if(me.getNewClassification()) {
						// 	return;
						// }
						// var popup = Ext.create('MYOCD.view.classification.NewClassification');
						// popup.show();
						me.getClassificationsLibraryManager().down('panel[name="addNewClassificationPanel"]').expand();
					}
				}
			]
		}).showAt(e.xy);
	},
	onClassificationsDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		if(this.getNewClassification()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.classification.NewClassification');
		popup.setTitle('Edit Classification');
		popup.down('textfield[name="classificationId"]').setValue(record.get('id'));
		popup.down('textfield[name="classificationName"]').setValue(record.get('name'));
		popup.down('textfield[name="classificationDesc"]').setValue(record.get('description'));
		popup.down('button[name="updateClassificationBtn"]').hidden = false;
		popup.down('button[name="createNewClassificationBtn"]').hidden = true;
		popup.show();
		//MYOCD.SharedData.currentClassification = record.data;
	},
	onCreateNewClassificationBtnClick: function() {
		var classificationName = this.getNewClassification().down('textfield[name="classificationName"]').getValue();
		var classificationDesc = this.getNewClassification().down('textfield[name="classificationDesc"]').getValue();
		if(classificationName.length == 0) {
			return;
		}
		var url;
		if(MYOCD.SharedData.currentClassificationsCategory == null || MYOCD.SharedData.currentClassificationsCategory.data.id == 'root') {
			url = CLASSIFICATION_LIB_BASE_URL + MYOCD.SharedData.currentClassificationsLibId + '/classifications.json';
		} else {
			url = CLASSIFICATION_CATEGORY_BASE_URL + MYOCD.SharedData.currentClassificationsCategory.data.id + '/classifications.json';
		}
		this.getNewClassification().destroy();

		var classificationStoreCtl = MYOCD.controller.classification.ClassificationsStoreController;
		classificationStoreCtl.addNewClassification(url, classificationName, classificationDesc, this.getClassificationsTab());
	},
	onAddNewClassificationToolClick: function() {
		// var me = this;
		// if(me.getNewClassification()) {
		// 	return;
		// }
		// var popup = Ext.create('MYOCD.view.classification.NewClassification');
		// popup.show();
		this.getClassificationsLibraryManager().down('panel[name="addNewClassificationPanel"]').expand();
	},
	onClassificationsLibraryToggleViewToolClick: function(tool) {
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
		this.getClassificationsLibraryManager().down('dataview[name="classificationsDataView"]').setVisible(!isDataView);
		this.getClassificationsLibraryManager().down('grid[name="classificationsGrid"]').setVisible(isDataView);
	},
	onUpdateClassificationCategoryBtnClick: function() {
		var categoryName = this.getEditClassificationsCategory().down('textfield[name="classificationCategoryName"]').getValue();
		var categoryDesc = this.getEditClassificationsCategory().down('textfield[name="classificationCategoryDesc"]').getValue();
		if(categoryName.length == 0) {
			return;
		}
		this.getEditClassificationsCategory().destroy();

		var classificationStoreCtl = MYOCD.controller.classification.ClassificationsStoreController;
		classificationStoreCtl.editClassificationsCategory(categoryName, categoryDesc, this.getClassificationsTab());
	},
	onUpdateClassificationBtnClick: function() {
		var classificationId = this.getNewClassification().down('textfield[name="classificationId"]').getValue();
		var classificationName = this.getNewClassification().down('textfield[name="classificationName"]').getValue();
		var classificationDesc = this.getNewClassification().down('textfield[name="classificationDesc"]').getValue();
		if(classificationName.length == 0) {
			return;
		}
	
		this.getNewClassification().destroy();
		
		var classificationStoreCtl = MYOCD.controller.classification.ClassificationsStoreController;
		classificationStoreCtl.editClassification(classificationId, classificationName, classificationDesc, this.getClassificationsTab());
	},
	onClassificationsDataViewRender: function(dataview, eOpts) {
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
	                    classificationData: dataview.getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onClassificationsGridRender: function(grid, eOpts) {
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
	                    classificationData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onClassificationCategoryAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}		
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		if (!MYOCD.SharedData.currentClassificationsCategory || MYOCD.SharedData.currentClassificationsCategory.data.id == 'root') {
			popup.down('textfield[name="baseUrl"]').setValue(CLASSIFICATION_LIB_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentClassificationsLibId);
		} else {
			popup.down('textfield[name="baseUrl"]').setValue(CLASSIFICATION_CATEGORY_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentClassificationsCategory.data.id);
		}
		popup.show();
	},
	onClassificationDataViewItemClick: function( dataview, record, item, index, e, eOpts )  {
		//MYOCD.SharedData.currentClassification = record.data;
	},
	onClassificationsAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}
		if (!MYOCD.SharedData.currentClassification) {
			return;
		}
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		popup.down('textfield[name="baseUrl"]').setValue(CLASSIFICATION_BASE_URL);
		popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentClassification.id);
		popup.show(); 
	},
	onCreateNewClassificationBtnPanelClick: function() {
		var newClassificationPanel = this.getClassificationsLibraryManager().down('panel[name="addNewClassificationPanel"]');
		var classificationName = newClassificationPanel.down('textfield[name="newClassificationName"]').getValue();
		var classificationDesc = newClassificationPanel.down('textfield[name="newClassificationDesc"]').getValue();
		if(classificationName.length == 0) {
			return;
		}
		var url;
		if(MYOCD.SharedData.currentClassificationsCategory == null || MYOCD.SharedData.currentClassificationsCategory.data.id == 'root') {
			url = CLASSIFICATION_LIB_BASE_URL + MYOCD.SharedData.currentClassificationsLibId + '/classifications.json';
		} else {
			url = CLASSIFICATION_CATEGORY_BASE_URL + MYOCD.SharedData.currentClassificationsCategory.data.id + '/classifications.json';
		}
		newClassificationPanel.down('textfield[name="newClassificationName"]').setValue('');
		newClassificationPanel.down('textfield[name="newClassificationDesc"]').setValue('');

		var classificationStoreCtl = MYOCD.controller.classification.ClassificationsStoreController;
		classificationStoreCtl.addNewClassification(url, classificationName, classificationDesc, this.getClassificationsTab());
	}
});