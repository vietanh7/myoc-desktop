Ext.define('MYOCD.controller.viewTemplate.NewViewTemplateController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'viewLibrariesTab',
			selector: 'viewLibrariesTab'
		},
		{
			ref: 'newViewTemplateSelectObjectType',
			selector: 'newViewTemplateSelectObjectType'
		},
		{
			ref: 'newViewTemplate',
			selector: 'newViewTemplate'
		}
	],
	init: function() {
		this.control({
			'newViewTemplate': {
				show: this.onNewViewTemplateShow
			},
			'newViewTemplate tool[name="selectObjectTypeTool"]': {
				click: this.onSelectObjectTypeToolClick
			},
			'newViewTemplate grid[name="refObjectTypesGrid"]': {
				render: this.onRefObjectTypeGridRender,
				itemcontextmenu: this.onRefObjectTypeGridItemContextMenu			
			},
			'newViewTemplate grid[name="availableFieldsGrid"]': {
				render: this.onAvailableFieldsGridRender
			},
			'newViewTemplate grid[name="attributeFilterGrid"]': {
				render: this.onAttributeFilterGridRender,
				itemcontextmenu: this.onAttributeFilterGridItemContextMenu,
				itemclick: this.onAttributeFilteGridItemClick
			},
			'newViewTemplate button[name="addFilterBtn"]': {
				click: this.onAddFilterBtnTap
			},
			'newViewTemplate button[name="createNewViewTemplateBtn"]': {
				click: this.onCreateNewViewTemplateBtnClick
			},
			'newViewTemplate button[name="updateViewTemplateBtn"]': {
				click: this.onUpdateViewTemplateBtnClick
			},
			'newViewTemplate grid[name="filtersGrid"]': {
				itemcontextmenu: this.onFiltersGridItemContextMenu
			}
		});
	},
	onNewViewTemplateShow: function() {
		if (this.getNewViewTemplate().down('textfield[name="viewTemplateId"]').getValue().length == 0) {
			this.getNewViewTemplate().down('grid[name="refObjectTypesGrid"]').getStore().removeAll();
			this.getNewViewTemplate().down('grid[name="availableFieldsGrid"]').getStore().removeAll();
			this.getNewViewTemplate().down('grid[name="attributeFilterGrid"]').getStore().removeAll();
		} else {

		}
	},
	onSelectObjectTypeToolClick: function() {
		if (this.getNewViewTemplateSelectObjectType()) {
			this.getNewViewTemplateSelectObjectType().destroy();
		}
		var popup = Ext.create('MYOCD.view.viewTemplate.NewViewTemplateSelectObjectType');
		popup.show();
		var refOTLStoreController = MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController;
		refOTLStoreController.loadObjectTypeLibraries(MYOCD.SharedData.currentCompanyId, popup);
	},
	onRefObjectTypeGridRender: function(grid, e, eOpts) {
		var me = this;
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.objectTypeData) {
					return false;
				}
				grid.getStore().add(dragData.objectTypeData);
				var objectTypeIds = [];
				for (var i = 0; i < grid.getStore().data.items.length; i++) {
					objectTypeIds.push(grid.getStore().data.items[i].data.id);
				}
				MYOCD.controller.viewTemplate.ViewLibraryStoreController.loadAvailableAttributesOfObjectTypes(objectTypeIds, me.getNewViewTemplate());
	            return true;
	        }
		});
	},
	onRefObjectTypeGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Remove',
					handler: function() {
						grid.getStore().remove(record);
						var objectTypeIds = [];
						for (var i = 0; i < grid.getStore().data.items.length; i++) {
							objectTypeIds.push(grid.getStore().data.items[i].data.id);
						}
						if (objectTypeIds.length == 0) {
							me.getNewViewTemplate().down('grid[name="availableFieldsGrid"]').getStore().removeAll();
							me.getNewViewTemplate().down('grid[name="attributeFilterGrid"]').getStore().removeAll();
						} else {
							MYOCD.controller.viewTemplate.ViewLibraryStoreController.loadAvailableAttributesOfObjectTypes(objectTypeIds, me.getNewViewTemplate());
						}
					}
				}
			]
		}).showAt(e.xy);
	},
	onAvailableFieldsGridRender: function(grid, e, eOpts) {
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
	                    filterFieldData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onAttributeFilterGridRender: function(grid, e, eOpts) {
		var me = this;
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.filterFieldData) {
					return false;
				}
				grid.getStore().add(dragData.filterFieldData);
	            return true;
	        }
		});
	},
	onAttributeFilterGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Remove',
					handler: function() {
						grid.getStore().remove(record);
					}
				}
			]
		}).showAt(e.xy);
	},
	onAttributeFilteGridItemClick: function(grid, record, item, index, e, eOpts) {
		if (record.data.checkedGroupBy) {
			record.set('checkedGroupBy', false);
		} else {
			record.set('checkedGroupBy', true);
		}
		record.commit();
	},
	onCreateNewViewTemplateBtnClick: function() {
		var viewTemplateName = this.getNewViewTemplate().down('textfield[name="viewTemplateName"]').getValue();
		var viewTemplateDesc = this.getNewViewTemplate().down('textfield[name="viewTemplateDesc"]').getValue();
		if(viewTemplateName.length == 0) {
			Ext.Msg.alert('Error!', 'Please enter view name');
			return;
		}
		var url;
		if(MYOCD.SharedData.currentViewCategory == null || MYOCD.SharedData.currentViewCategory.data.id == 'root') {
			url = VIEW_LIB_BASE_URL + MYOCD.SharedData.currentViewLibId + '/templates.json';
		} else {
			url = VIEW_CATEGORY_BASE_URL +  MYOCD.SharedData.currentViewCategory.data.id + '/templates.json'; 
		}
		var objectTypeIds = [];
		var store = this.getNewViewTemplate().down('grid[name="refObjectTypesGrid"]').getStore();
		for (var i = 0; i < store.data.items.length; i++) {
			objectTypeIds.push(store.data.items[i].data.id.toString());
		}
		var filterFields = [];
		var groupByFields = [];
		var filterStore = this.getNewViewTemplate().down('grid[name="attributeFilterGrid"]').getStore();
		for (var i = 0; i < filterStore.data.items.length; i++) {
			filterFields.push(filterStore.data.items[i].data.name.toString());
			if (filterStore.data.items[i].data.checkedGroupBy) {
				groupByFields.push(filterStore.data.items[i].data.name.toString());
			}
		}
		var filterFormulas = [];
		var filterFormulaStore = this.getNewViewTemplate().down('grid[name="filtersGrid"]').getStore();
		for (var i = 0; i < filterFormulaStore.data.items.length; i++) {
			filterFormulas.push(filterFormulaStore.data.items[i].data.formula.toString());
		}
		var orderSorting = this.getNewViewTemplate().down('checkbox[name="ascCheckBox"]').getValue() ? 'asc' : 'desc';
		this.getNewViewTemplate().destroy();
		var viewStoreController = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
		viewStoreController.addNewViewTemplate(url, viewTemplateName, viewTemplateDesc, objectTypeIds, filterFields, groupByFields, orderSorting, filterFormulas, this.getViewLibrariesTab());
	},
	onUpdateViewTemplateBtnClick: function() {
		var viewTemplateId = this.getNewViewTemplate().down('textfield[name="viewTemplateId"]').getValue();
		var viewTemplateName = this.getNewViewTemplate().down('textfield[name="viewTemplateName"]').getValue();
		var viewTemplateDesc = this.getNewViewTemplate().down('textfield[name="viewTemplateDesc"]').getValue();
		if(viewTemplateName.length == 0) {
			Ext.Msg.alert('Error!', 'Please enter view name');
			return;
		}
		var objectTypeIds = [];
		var store = this.getNewViewTemplate().down('grid[name="refObjectTypesGrid"]').getStore();
		for (var i = 0; i < store.data.items.length; i++) {
			console.log(store.data.items[i].data);
			objectTypeIds.push(store.data.items[i].data.id.toString());
		}
		var filterFields = [];
		var groupByFields = [];
		var filterStore = this.getNewViewTemplate().down('grid[name="attributeFilterGrid"]').getStore();
		for (var i = 0; i < filterStore.data.items.length; i++) {
			filterFields.push(filterStore.data.items[i].data.name.toString());
			if (filterStore.data.items[i].data.checkedGroupBy) {
				groupByFields.push(filterStore.data.items[i].data.name.toString());
			}
		}
		var filterFormulas = [];
		var filterFormulaStore = this.getNewViewTemplate().down('grid[name="filtersGrid"]').getStore();
		for (var i = 0; i < filterFormulaStore.data.items.length; i++) {
			filterFormulas.push(filterFormulaStore.data.items[i].data.formula.toString());
		}
		var orderSorting = this.getNewViewTemplate().down('checkbox[name="ascCheckBox"]').getValue() ? 'asc' : 'desc';
		this.getNewViewTemplate().destroy();
		var viewStoreController = MYOCD.controller.viewTemplate.ViewLibraryStoreController;
		viewStoreController.editViewTemplate(viewTemplateId, viewTemplateName, viewTemplateDesc, objectTypeIds, filterFields, groupByFields, orderSorting, filterFormulas, this.getViewLibrariesTab());
	},
	onAddFilterBtnTap: function() {
		var newViewTemplate = this.getNewViewTemplate();
		var selectedOperator = newViewTemplate.down('combobox[name="operatorsCombobox"]').getValue();
		var selectedOperatorIndex = newViewTemplate.down('combobox[name="operatorsCombobox"]').getStore().find('value', selectedOperator);
		var selecterOperatorRecord = newViewTemplate.down('combobox[name="operatorsCombobox"]').getStore().getAt(selectedOperatorIndex);
		var selectedField = newViewTemplate.down('combobox[name="filterFieldCombobox"]').getValue();
		if (selectedOperatorIndex == -1 || selectedField.length == 0) {
			return;
		}
		var filterValue = newViewTemplate.down('textfield[name="filterValue"]').getValue().trim();
		var filter = new Object();
		filter.displayName = selectedField + ' is ' + selecterOperatorRecord.data.name + ' ' + filterValue;
		filter.formula = '_{' + selectedField + '}' + selecterOperatorRecord.data.value + filterValue;
		Ext.getStore('viewTemplate.Filters').add(filter); 
	},
	onFiltersGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Remove',
					handler: function() {
						grid.getStore().remove(record);
					}
				}
			]
		}).showAt(e.xy);
	}
});