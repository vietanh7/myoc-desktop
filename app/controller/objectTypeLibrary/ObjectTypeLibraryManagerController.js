Ext.define('MYOCD.controller.objectTypeLibrary.ObjectTypeLibraryManagerController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'objectTypesTab',
			selector: 'objectTypesTab'	
		},
		{
			ref: 'objectTypeLibraryManager',
			selector: 'objectTypeLibraryManager'
		},
		{
			ref: 'objectTypeCategoriesTree',
			selector: 'objectTypeLibraryManager treepanel[name="objectTypeCategoriesTree"]'
		},
		{
			ref: 'editObjectTypesCategory',
			selector: 'editObjectTypesCategory'
		},
		{
			ref: 'newObjectType',
			selector: 'newObjectType'
		},
		{
			ref: 'objectTypeAttributes',
			selector: 'objectTypeAttributes'
		},
		{
			ref: 'objectTypeOwnedAtts',
			selector: 'objectTypeOwnedAtts'
		},
		{
			ref: 'authorizationDialog',
			selector: 'authorizationDialog'
		},
		{
			ref: 'attributeAction',
			selector: 'attributeAction'
		}
	],
	init: function() {
		this.control({
			'objectTypeLibraryManager button[name="objectTypeLibsBackButton"]': {
				click: this.onObjectTypeLibsBackButtonClick
			},
			'objectTypeLibraryManager treepanel[name="objectTypeCategoriesTree"]': {
				render: this.onObjectTypeCategoriesTreeRender,
				itemclick: this.onObjectTypeCategoriesTreeItemClick,
				itemexpand: this.onObjectTypeCategoriesTreeItemExpand,
				itemcontextmenu: this.onObjectTypeCategoriesTreeItemContextMenu,
				containercontextmenu: this.onObjectTypeCategoriesContextMenu,
				edit: this.onObjectTypeCategoriesTreeEdit,
				canceledit: this.onObjectTypeCategoriesTreeCancelEdit
			},
			'editObjectTypesCategory button[name="updateObjectTypeCategoryBtn"]': {
				click: this.onUpdateObjectTypeCategoryBtnClick
			},
			'objectTypeLibraryManager tool[name="addNewObjectTypeCategoryTool"]': {
				click: this.onAddNewObjectTypeCategoryToolClick
			},
			'objectTypeLibraryManager dataview[name="objectTypesDataView"]': {
				itemcontextmenu: this.onObjectTypesDataViewItemContextMenu,
				containercontextmenu: this.onObjectTypesDataViewContextMenu,
				itemdblclick: this.onObjectTypesDataViewItemDblClick,
				itemclick: this.onObjectTypesDataViewItemClick,
				render: this.onObjectTypesDataViewRender
			},
			'objectTypeLibraryManager tool[name="addNewObjectTypeTool"]': {
				click: this.onAddNewObjectTypeToolClick
			},
			'objectTypeLibraryManager tool[name="objectTypeLibraryToggleViewTool"]': {
				click: this.onObjectTypeLibraryToggleViewToolClick
			},
			'objectTypeLibraryManager grid[name="objectTypesGrid"]': {
				itemcontextmenu: this.onObjectTypesDataViewItemContextMenu,
				containercontextmenu: this.onObjectTypesDataViewContextMenu,
				itemdblclick: this.onObjectTypesDataViewItemDblClick,
				itemclick: this.onObjectTypesDataViewItemClick,
				render: this.onObjectTypesGridRender
			},
			'objectTypeOwnedAtts button[name="createObjectTypeAttBtn"]': {
				click: this.onCreateObjectTypeAttBtnClick
			},
			'objectTypeOwnedAtts grid[name="objectTypeOwnedAttsGrid"]': {
				itemcontextmenu: this.onObjectTypeOwnedAttsGridItemContextMenu,
				edit: this.onObjectTypeOwnedAttsGridEdit,
				beforeedit: this.onObjectTypeOwnedAttsGridBeforeEdit
			},
			'objectTypeOwnedAtts': {
				removeinheritedattribute: this.onObjectTypeOwnedAttsRemoveInheritedAttribute
			},
			'objectTypeLibraryManager treepanel tool[name="objectTypeCategoryAuthorTool"]': {
				click: this.onObjectTypeCategoryAuthorToolClick
			},
			'objectTypeLibraryManager tool[name="objectTypeAuthorTool"]': {
				click: this.onObjectTypeAuthorToolClick
			} 
		});
	},
	onObjectTypeLibsBackButtonClick: function() {
		this.getObjectTypesTab().down('grid[name="objectTypeLibrariesGrid"]').setVisible(true);
		this.getObjectTypesTab().down('objectTypeLibraryManager').setVisible(false);
		MYOCD.SharedData.currentObjectTypeCategory = null;
		Ext.getStore('objectTypeLibrary.ObjectTypes').removeAll();
		Ext.getStore('objectTypeLibrary.ObjectTypeCategoriesTreeStore').setRootNode(null);
		Ext.getStore('objectTypeLibrary.ObjectTypeCategoriesTreeStore').removeAll();
	},
	onObjectTypeCategoriesTreeRender: function(treePanel, eOpts) {
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
	        	MYOCD.SharedData.currentObjecTypeCategoryTreeDropNode = record;
	        	if(data.objectTypeData) {
	        		return true;
	        	} else {
		        	return false
	        	}
	            return true;
	        }
	    });
    },
    onObjectTypeCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
	    MYOCD.SharedData.currentObjectTypeCategory = record;
		var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
		if(record.get('id')!=='root') {
			otlStoreController.loadObjectTypesOfObjectTypeCategory(record.get('id'));
		} else {
			otlStoreController.loadObjectTypesOfObjectTypeLib(MYOCD.SharedData.currentObjectTypeLibId);
		}
		//MYOCD.SharedData.currentObjectType = null;
    },
    onObjectTypeCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		MYOCD.SharedData.currentObjectTypeCategory = categoryNode;
		var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
		if(categoryNode.data.id !== 'root') {
			otlStoreController.loadObjectTypesOfObjectTypeCategory(categoryNode.data.id);
			otlStoreController.loadCategoriesOfObjectTypesCategory(categoryNode.data.id, categoryNode);
		} else {
			otlStoreController.loadObjectTypesOfObjectTypeLib(MYOCD.SharedData.currentObjectTypeLibId);
		}
		//MYOCD.SharedData.currentObjectType = null;
	},
	onObjectTypeCategoriesTreeItemContextMenu: function( treePanel, record, item, index, e, eOpts ) {
		var me = this;
		MYOCD.SharedData.currentObjectTypesCategoryNodeContextMenu = record;
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
				MYOCD.SharedData.AddingChildOnObjectTypeNode = record;
				treePanel.ownerCt.getPlugin('cellEditingPlugin').startEdit(newRecord, treePanel.ownerCt.columns[0]);
			});
		}
		var editCateFunc = function() {
			if(me.getEditObjectTypesCategory()) {
				return;
			}
			var popup = Ext.create('MYOCD.view.objectTypeLibrary.EditObjectTypesCategory');
			popup.down('textfield[name="objectTypeCategoryName"]').setValue(record.get('name'));
			popup.down('textfield[name="objectTypeCategoryDesc"]').setValue(record.get('description'));
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
					    var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
					    otlStoreController.deleteObjectTypesCategory();
				    }
			    }
			});
		}
		var copyCateFunc = function() {
			MYOCD.SharedData.objectTypeCategorySourceNode = record;
			MYOCD.SharedData.objectTypeCategorySourceNode.isCut = false;
		}
		var cutCateFunc = function() {
			MYOCD.SharedData.objectTypeCategorySourceNode = record;
			treePanel.ownerCt.getView().addRowCls(record,'opacity-treenode');
			MYOCD.SharedData.currentObjectTypeCategoryTree = treePanel;
			MYOCD.SharedData.objectTypeCategorySourceNode.isCut = true;
		}
		var pasteCateFunc = function() {
			var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
			if(MYOCD.SharedData.objectTypeCategorySourceNode.isCut) {
				otlStoreController.moveObjectTypeCategory(MYOCD.SharedData.objectTypeCategorySourceNode, record, me.getObjectTypesTab());
			} else {
				otlStoreController.copyObjectTypeCategory(MYOCD.SharedData.objectTypeCategorySourceNode, record, me.getObjectTypesTab());

			}
		}
		var securityFunc = function() {
			if(me.getAuthorizationDialog()) {
				me.getAuthorizationDialog().destroy();
			}		
			var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
			if (record.data.id == 'root') {
				popup.down('textfield[name="baseUrl"]').setValue(OBJECT_TYPE_LIB_BASE_URL);
				popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentObjectTypeLibId);
			} else {
				popup.down('textfield[name="baseUrl"]').setValue(OBJECT_TYPE_CATEGORY_BASE_URL);
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
						text: 'Edit',
						handler: editCateFunc
					},
					{
						text: 'Delete',
						handler: deleteCateFunc
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
						disabled: MYOCD.SharedData.objectTypeCategorySourceNode == null,
						handler: pasteCateFunc	
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
						text: 'Paste',
						disabled: MYOCD.SharedData.objectTypeCategorySourceNode == null,
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
	onObjectTypeCategoriesContextMenu: function(treePanel, e, eOpts) {
		e.stopEvent();
	},
	onObjectTypeCategoriesTreeEdit: function(editor, e, eOpts) {
		var data = e.record.data;
	    var url;
	    if(data.parentId !== 'root') {
		    url = OBJECT_TYPE_CATEGORY_BASE_URL + data.parentId + '/categories.json'
	    } else {
		    url = OBJECT_TYPE_LIB_BASE_URL + MYOCD.SharedData.currentObjectTypeLibId  + '/categories.json'
	    }
	    var categoryName = data.name;
	    if(categoryName.trim().length == 0){
		    Ext.Msg.alert('Missing Category Name', 'Please enter category name');
		    e.record.stores[0].remove(e.record);
		    e.record.destroy();
		    return;
	    }
	    
	    var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
		otlStoreController.addNewObjectTypeCategory(url, categoryName, '', this.getObjectTypesTab());
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onObjectTypeCategoriesTreeCancelEdit: function(editor, e, eOpts) {
		e.record.stores[0].remove(e.record);
		e.record.destroy();	
	},
	onAddNewObjectTypeCategoryToolClick : function() {
		var me = this;
		if(MYOCD.SharedData.currentObjectTypeCategory == null || MYOCD.SharedData.currentObjectTypeCategory.data.id == 'root') {
			var root = Ext.getStore('ObjectTypeLibrary.ObjectTypeCategoriesTreeStore').getRootNode();
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
				MYOCD.SharedData.AddingChildOnObjectTypeNode = root;
				me.getObjectTypeCategoriesTree().getPlugin('cellEditingPlugin').startEdit(newRecord, me.getObjectTypeCategoriesTree().columns[0]);
			});
		} else {
			var record = MYOCD.SharedData.currentObjectTypeCategory;
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
				MYOCD.SharedData.AddingChildOnObjectTypeNode = record;
				me.getObjectTypeCategoriesTree().getPlugin('cellEditingPlugin').startEdit(newRecord, me.getObjectTypeCategoriesTree().columns[0]);
			});
		}
	},
	onUpdateObjectTypeCategoryBtnClick: function() {
		var categoryName = this.getEditObjectTypesCategory().down('textfield[name="objectTypeCategoryName"]').getValue();
		var categoryDesc = this.getEditObjectTypesCategory().down('textfield[name="objectTypeCategoryDesc"]').getValue();
		if(categoryName.length == 0) {
			return;
		}
		this.getEditObjectTypesCategory().destroy();

		var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
		otlStoreController.editObjectTypesCategory(categoryName, categoryDesc, this.getObjectTypesTab());
	},
	onAddNewObjectTypeCategoryToolClick: function() {
		var me = this;
		if(MYOCD.SharedData.currentObjectTypeCategory == null || MYOCD.SharedData.currentObjectTypeCategory.data.id == 'root') {
			var root = Ext.getStore('objectTypeLibrary.ObjectTypeCategoriesTreeStore').getRootNode();
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
				MYOCD.SharedData.AddingChildOnObjectTypeNode = root;
				me.getObjectTypeCategoriesTree().getPlugin('cellEditingPlugin').startEdit(newRecord, me.getObjectTypeCategoriesTree().columns[0]);
			});
		} else {
			var record = MYOCD.SharedData.currentObjectTypeCategory;
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
				MYOCD.SharedData.AddingChildOnObjectTypeNode = record;
				me.getObjectTypeCategoriesTree().getPlugin('cellEditingPlugin').startEdit(newRecord, me.getObjectTypeCategoriesTree().columns[0]);
			});
		}
	},
	onObjectTypesDataViewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: function() {
						if(me.getNewObjectType()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.objectTypeLibrary.NewObjectType');
						popup.setTitle('Edit ObjectType');
						popup.down('textfield[name="objectTypeId"]').setValue(record.get('id'));
						popup.down('textfield[name="objectTypeName"]').setValue(record.get('name'));
						popup.down('textfield[name="objectTypeDesc"]').setValue(record.get('description'));
						popup.down('button[name="updateObjectTypeBtn"]').hidden = false;
						popup.down('button[name="createNewObjectTypeBtn"]').hidden = true;
						popup.show();
						var callBack = function (objectType) {
							var parentStore = popup.down('grid[name="parentObjectTypesGrid"]').getStore();
							parentStore.removeAll();
							if(objectType.base_object_types.length > 0) {
								for (var i = 0; i < objectType.base_object_types.length; i++) {
									var parent = new Object();
									parent.id = objectType.base_object_types[i].id;
									parent.name = objectType.base_object_types[i].name;
									parent.type_group = objectType.base_object_types[i].type_group;
									parentStore.add(parent);
								}
							}
						}
						var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
						otlStoreController.getObjectTypeInfo(record.data.id, popup, callBack);
					}
				},
				{
					text: 'Delete',
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Delete Object Type',
						    msg: 'Do you really want to delete this object type?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
								    var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
								    otlStoreController.deleteObjectType(record.get('id'), me.getObjectTypesTab());
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
						popup.down('textfield[name="baseUrl"]').setValue(OBJECT_TYPE_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.get('id'));
						popup.show(); 
					} 
				}
			]
		}).showAt(e.xy);
	},
	onObjectTypesDataViewContextMenu: function(dataview, e, eOpts) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Add New Object Type',
					handler: function() {
						// if(me.getNewObjectType()) {
						// 	return;
						// }
						// var popup = Ext.create('MYOCD.view.objectTypeLibrary.NewObjectType');
						// var parentStore = popup.down('grid[name="parentObjectTypesGrid"]').getStore();
						// parentStore.removeAll();
						// popup.show();
						me.getObjectTypeLibraryManager().down('panel[name="addNewObjectTypePanel"]').down('grid[name="parentObjectTypesGrid"]').getStore().removeAll();
						me.getObjectTypeLibraryManager().down('panel[name="addNewObjectTypePanel"]').expand();
					}
				}
			]
		}).showAt(e.xy);
	},
	onObjectTypesDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		if(this.getObjectTypeAttributes()) {
			this.getObjectTypeAttributes().destroy();
		}
		var popup = Ext.create('MYOCD.view.objectTypeLibrary.ObjectTypeAttributes');
		popup.show();
		popup.setTitle(record.get('name') + "'s Attributes");
		MYOCD.SharedData.currentObjectType = record.data; 
		var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
		otlStoreController.loadAttributeOfObjectType(record.get('id'), popup);
	},
	onAddNewObjectTypeToolClick: function() {
		// if(this.getNewObjectType()) {
		// 	return;
		// }
		// var popup = Ext.create('MYOCD.view.objectTypeLibrary.NewObjectType');
		// var parentStore = popup.down('grid[name="parentObjectTypesGrid"]').getStore();
		// parentStore.removeAll();
		// popup.show();
		this.getObjectTypeLibraryManager().down('panel[name="addNewObjectTypePanel"]').down('grid[name="parentObjectTypesGrid"]').getStore().removeAll();
		this.getObjectTypeLibraryManager().down('panel[name="addNewObjectTypePanel"]').expand();
	},
	onObjectTypeLibraryToggleViewToolClick: function(tool) {
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
		this.getObjectTypeLibraryManager().down('dataview[name="objectTypesDataView"]').setVisible(!isDataView);
		this.getObjectTypeLibraryManager().down('grid[name="objectTypesGrid"]').setVisible(isDataView);
	},
	onCreateObjectTypeAttBtnClick: function() {
		var attributeName = this.getObjectTypeOwnedAtts().down('textfield[name="objectTypeAttName"]').getValue();
		var attributeDesc = this.getObjectTypeOwnedAtts().down('textfield[name="objectTypeAttDesc"]').getValue(); 
		var attributeValueType = this.getObjectTypeOwnedAtts().down('combobox[name="objectTypeAttValueType"]').getValue();
		var attributeHidden = this.getObjectTypeOwnedAtts().down('checkboxfield[name="objectTypeAttHiddenCheck"]').getValue();
		var attributeConstant = this.getObjectTypeOwnedAtts().down('checkboxfield[name="objectTypeAttConstantCheck"]').getValue();
		var attributeMandatory = this.getObjectTypeOwnedAtts().down('checkboxfield[name="objectTypeAttMandatoryCheck"]').getValue();
		var attributeDeprecated = this.getObjectTypeOwnedAtts().down('checkboxfield[name="objectTypeAttDeprecatedCheck"]').getValue();
		var attributeDefaultValue = this.getObjectTypeOwnedAtts().down('textfield[name="objectTypeAttDefaultValue"]').getValue();
		
		if(attributeName.length == 0) {
			return;
		}
		var setActionPermission = this.getObjectTypeOwnedAtts().down('setActionPermission');
		var callBack = function(newAttribute) {
			setActionPermission.fireEvent('setPermissionForAction', setActionPermission, newAttribute.id);
		}
		var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
		otlStoreController.addNewObjectTypeAttribute(MYOCD.SharedData.currentObjectType.id, attributeName, attributeDesc, attributeValueType, attributeHidden, 
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, this.getObjectTypeAttributes(), callBack);
	},
	onObjectTypeOwnedAttsGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		if(record.get('isInherited')) {
			return;
		}
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
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Delete Attribute',
						    msg: 'Do you really want to delete this attribute?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
								   var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
								   otlStoreController.deleteObjectTypeAttribute( record.data.id, me.getObjectTypeAttributes());
							    }
						    }
						});
					}
				},
				{
					text: 'Actions Permissions',
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
	onObjectTypeOwnedAttsGridEdit: function(editor, e, eOpts) {
		var attribute = e.record.data;
		var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
		otlStoreController.editObjectTypeAttribute(attribute.id, attribute.name, attribute.description, attribute.value_type, attribute.hidden, 
		attribute.constant, attribute.mandatory, attribute.deprecated, attribute.default_value, this.getObjectTypeAttributes());
	},
	onObjectTypeOwnedAttsGridBeforeEdit: function (editor, e, eOpts) {
		return !e.record.data.isInherited;
	},
	onObjectTypeOwnedAttsRemoveInheritedAttribute: function(grid, record) {
		var me = this;
		Ext.Msg.confirm({
		    title: 'Delete Attribute',
		    msg: 'Do you really want to delete this attribute?',
		    width: 200,
		    buttons: Ext.Msg.YESNO,
		    icon: Ext.Msg.QUESTION,
		    fn: function(btn) {
			    if(btn == 'yes') {
				   var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
				   otlStoreController.deleteObjectTypeAttribute( record.data.id, me.getObjectTypeAttributes());
			    }
		    }
		});
	},
	onObjectTypesDataViewRender: function(dataview, eOpts) {
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
	                    objectTypeData: dataview.getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onObjectTypesGridRender: function(grid, eOpts) {
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
	                    objectTypeData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onObjectTypeCategoryAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}		
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		if (!MYOCD.SharedData.currentObjectTypeCategory || MYOCD.SharedData.currentObjectTypeCategory.data.id == 'root') {
			popup.down('textfield[name="baseUrl"]').setValue(OBJECT_TYPE_LIB_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentObjectTypeLibId);
		} else {
			popup.down('textfield[name="baseUrl"]').setValue(OBJECT_TYPE_CATEGORY_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentObjectTypeCategory.data.id);
		}
		popup.show(); 
	},
	onObjectTypesDataViewItemClick: function(dataview, record, item, index, e, eOpts ) {
		//MYOCD.SharedData.currentObjectType = record.data;
	},
	onObjectTypeAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}
		if (!MYOCD.SharedData.currentObjectType) {
			return;
		}
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		popup.down('textfield[name="baseUrl"]').setValue(OBJECT_TYPE_BASE_URL);
		popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentObjectType.id);
		popup.show(); 
	}
});
