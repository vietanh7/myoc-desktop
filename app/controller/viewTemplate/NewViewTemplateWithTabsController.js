Ext.define('MYOCD.controller.viewTemplate.NewViewTemplateWithTabsController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'viewLibraryManager',
			selector: 'viewLibraryManager'
		},
		{
			ref: 'newViewTemplateWithTabs',
			selector: 'newViewTemplateWithTabs'
		},
		{
			ref: 'newViewTemplateSelectObjectType',
			selector: 'newViewTemplateSelectObjectType'
		},
		{
			ref: 'newViewTemplateWithTabsColumns',
			selector: 'newViewTemplateWithTabsColumns'
		},
		{
			ref: 'newViewTemplateWithTabsSorting',
			selector: 'newViewTemplateWithTabsSorting'
		},
		{
			ref: 'newViewTemplateWithTabsFilters',
			selector: 'newViewTemplateWithTabsFilters'
		},
		{
			ref: 'newViewTemplateWithTabsGroupBy',
			selector: 'newViewTemplateWithTabsGroupBy'
		},
		{
			ref: 'newViewTemplateWithTabsAggregations',
			selector: 'newViewTemplateWithTabsAggregations'
		},
		{
			ref: 'newViewTemplateWithTabsAggregationsEditor',
			selector: 'newViewTemplateWithTabsAggregationsEditor'
		},
		{
			ref: 'newViewTemplateWithTabsFiltersEditor',
			selector: 'newViewTemplateWithTabsFiltersEditor'
		},
		//
		{
			ref: 'objectTypeAttributes',
			selector: 'objectTypeAttributes'
		}
	],
	init: function() {
		this.control({
			'newViewTemplateWithTabs': {
				show: this.onNewViewTemplateWithTabsShow
			},
			'newViewTemplateWithTabs tool[name="selectObjectTypeTool"]': {
				click: this.onSelectObjectTypeToolClick
			},
			'newViewTemplateWithTabsColumns grid[name="primaryObjectTypesGrid"]': {
				render: this.onPrimaryObjectTypesGridRender,
				itemclick: this.onPrimaryObjectTypesGridItemClick,
				itemcontextmenu: this.onPrimaryObjectTypesGridItemContextMenu
			},
			'newViewTemplateWithTabsColumns tabpanel[name="mainColumnsTab"]': {
				tabchange: this.onMainColumnsTabChange
			},
			'newViewTemplateWithTabsColumns grid[name="primaryObjectTypesAvailbleFieldsGrid"]': {
				render: this.onPrimaryObjectTypesAvailableFieldsGridRender
			},
			'newViewTemplateWithTabsColumns grid[name="primaryObjectTypesColumnsGrid"]': {
				render: this.onPrimaryObjectTypesColumnsGridRender,
				itemcontextmenu: this.onPrimaryObjectTypesColumnsGridItemContextMenu,
				drop: this.onPrimaryObjectTypesColumnsGridDrop,
				itemclick: this.onPrimaryObjectTypesColumnItemClick
			},
			'newViewTemplateWithTabs tabpanel[name="newViewTemplateWithTabMainPanel"]': {
				tabchange: this.onNewViewTemplateWithTabMainPanelChange
			},
			'newViewTemplateWithTabsSorting grid[name="groupByFieldsGrid"]': {
				render: this.onSortingGroupByFieldsGridRender,
			},
			'newViewTemplateWithTabsSorting grid[name="availableFieldsSortingGrid"]': {
				render: this.onAvailableFieldsSortingGridRender
			},
			'newViewTemplateWithTabsSorting grid[name="sortingFieldsGrid"]': {
				render: this.onSortingFieldsGridRender,
				// edit: this.onSortingFieldsGridEdit,
				itemcontextmenu: this.onSortingFieldsGridItemContextMenu,
				drop: this.onSortingFieldsGridDrop
			},
			'newViewTemplateWithTabsFilters combobox[name="filterObjectTypesCombobox"]': {
				change: this.onFilterObjectTypesComboboxChange
			},
			'newViewTemplateWithTabsFilters button[name="addFilterBtn"]': {
				click: this.onAddFilterBtnClick
			},
			'newViewTemplateWithTabsFilters tool[name="addFilterTool"]': {
				click: this.onAddFilterToolClick
			},
			'newViewTemplateWithTabsFilters grid[name="filtersGrid"]': {
				itemcontextmenu: this.onFiltersGridItemContextMenu
			},
			'newViewTemplateWithTabsGroupBy tabpanel[name="groupByTabPanel"]': {
				tabchange: this.onGroupByTabChange
			},
			'newViewTemplateWithTabsGroupBy grid[name="secondaryGroupByObjectTypesGrid"]': {
				render: this.onSecondaryGroupByObjectTypesGridRender,
				itemclick: this.onSecondaryGroupByObjectTypesGridItemClick
			},
			'newViewTemplateWithTabsGroupBy grid[name="groupByAvailbleFieldsGrid"]': {
				render: this.onGroupByAvaileFieldsGridRender
			},
			'newViewTemplateWithTabsGroupBy grid[name="groupByFieldsGrid"]': {
				render: this.onGroupByFieldsGridRender,
				itemcontextmenu: this.onGroupByFieldsGridItemContextMenu,
				drop: this.onGroupByFieldsGridDrop
			},
			'newViewTemplateWithTabsAggregations tool[name="addNewAggregationTool"]': {
				click: this.onAddNewAggregationToolClick
			},
			'newViewTemplateWithTabsAggregations grid[name="aggregationsGrid"]': {
				itemcontextmenu: this.onAggregationsGridItemContextMenu,
				edit: this.onAggregationsGridEdit
			},
			'newViewTemplateWithTabs button[name="createNewViewTemplateBtn"]': {
				click: this.onCreateNewViewTemplateBtnClick
			},
			'newViewTemplateWithTabs button[name="updateViewTemplateBtn"]': {
				click: this.onUpdateViewTemplateBtnClick
			}

		});
	},
	onNewViewTemplateWithTabsShow: function() {
		var me = this;

		MYOCD.SharedData.primaryObjectTypes = [];
		MYOCD.SharedData.secondaryObjectTypes = [];
		MYOCD.SharedData.sortingFields = [];
		MYOCD.SharedData.groupByFields = [];
		MYOCD.SharedData.filterFields = [];
		MYOCD.SharedData.aggregations = [];
		Ext.getStore('viewTemplate.AvailableFields').removeAll();
		Ext.getStore('viewTemplate.Filters').removeAll();
		Ext.getStore('viewTemplate.SortingFields').removeAll();
		Ext.getStore('viewTemplate.ObjectTypesColumns').removeAll();
		Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').removeAll();
		Ext.getStore('viewTemplate.GroupByFields').removeAll();
		Ext.getStore('viewTemplate.Aggregations').removeAll();
		
		var viewTemplateId = this.getNewViewTemplateWithTabs().down('textfield[name="viewTemplateId"]').getValue();
		if (viewTemplateId.length > 0) {
			var callBack = function(viewTemplate) {
				me.getPrimaryObjectTypes(viewTemplate.object_type_ids);
				me.getSecondaryObjectTypes(viewTemplate.container_object_type_ids);
				MYOCD.SharedData.filterFields = me.getFilterItems(viewTemplate.filters);
				me.getSortingFields(viewTemplate.order_by, viewTemplate.order_direction);
				me.getGroupByFields(viewTemplate.group_by);
				me.getAggregations(viewTemplate.aggregations);
			}
			MYOCD.controller.viewTemplate.ViewLibraryStoreController.getViewTemplateInfo(viewTemplateId, callBack, me.getNewViewTemplateWithTabs());
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
	onPrimaryObjectTypesGridRender: function(grid, e, eOpts) {
		var me = this;
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.objectTypeData) {
					return false;
				}
				var objectType = dragData.objectTypeData;

				objectType.columns = [];
				var currentTab = me.getNewViewTemplateWithTabsColumns().down('tabpanel[name="mainColumnsTab"]').getActiveTab();
				if (currentTab.title == "Primary Object Types") {
					objectType.primary = true;
					MYOCD.SharedData.primaryObjectTypes.push(objectType);
				} else {
					objectType.primary = false;
					MYOCD.SharedData.secondaryObjectTypes.push(objectType);
				}
				grid.getStore().add(dragData.objectTypeData);
	            return true;
	        }
		});
	},
	onMainColumnsTabChange: function(tabPanel, newCard, oldCard, eOpts) {
		Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').removeAll();
		if (newCard.title == "Primary Object Types") {
			Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').loadData(MYOCD.SharedData.primaryObjectTypes);
		} else {
			Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').loadData(MYOCD.SharedData.secondaryObjectTypes);
		}
		// Ext.getStore('viewTemplate.ObjectTypesColumns').removeAll();
		Ext.getStore('viewTemplate.AvailableFields').removeAll();
	},
	onPrimaryObjectTypesGridItemClick: function(grid, record, item, index, e, eOpts) {
		var objectTypeParams = [];
		objectTypeParams.push(record.data.id);
		MYOCD.controller.viewTemplate.ViewLibraryStoreController.loadAvailableAttributesOfObjectTypes(objectTypeParams, this.getNewViewTemplateWithTabsColumns());
	},
	onPrimaryObjectTypesGridItemContextMenu: function(grid, record, item, index, e, eOpts) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Attributes',
					handler: function() {
						if(me.getObjectTypeAttributes()) {
							me.getObjectTypeAttributes().destroy();
						}
						var popup = Ext.create('MYOCD.view.objectTypeLibrary.ObjectTypeAttributes');
						popup.show();
						popup.setTitle(record.get('name') + "'s Attributes");
						MYOCD.SharedData.currentObjectType = record.data; 
						var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
						otlStoreController.loadAttributeOfObjectType(record.get('id'), popup);
					}
				},
				{
					text: 'Remove',
					handler: function() {
						var removingRecords = [];
						var currentTab = me.getNewViewTemplateWithTabsColumns().down('tabpanel[name="mainColumnsTab"]').getActiveTab();
						if (currentTab.title == "Primary Object Types") {
							for (var i = 0; i < MYOCD.SharedData.primaryObjectTypes.length; i++) {
								if (record.data.id == MYOCD.SharedData.primaryObjectTypes[i].id) {
									MYOCD.SharedData.primaryObjectTypes.splice(i, 1);
									Ext.getStore('viewTemplate.ObjectTypesColumns').each(function(column, p1, p2){
										if (column.data.primary && (column.data.objectTypeId == record.data.id)) {
											removingRecords.push(column);
										}
									});
									break;
								}
							}
						} else {
							for (var i = 0; i < MYOCD.SharedData.secondaryObjectTypes.length; i++) {
								if (record.data.id == MYOCD.SharedData.secondaryObjectTypes[i].id) {
									MYOCD.SharedData.secondaryObjectTypes.splice(i, 1);
									Ext.getStore('viewTemplate.ObjectTypesColumns').each(function(column, p1, p2){
										if (!column.data.primary && (column.data.objectTypeId == record.data.id)) {
											removingRecords.push(column);
										}
									});
									break;
								}
							}
						}
						Ext.getStore('viewTemplate.ObjectTypesColumns').remove(removingRecords);
						grid.getStore().remove(record);
					}
				}
			]
		}).showAt(e.xy);
	},
	onPrimaryObjectTypesAvailableFieldsGridRender: function(grid, e, eOpts) {
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
	                    columnsData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onPrimaryObjectTypesColumnsGridRender: function(grid, e, eOpts) {
		var me = this;
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.columnsData) {
					return false;
				}
				// console.log("Primary:", MYOCD.SharedData.primaryObjectTypes);
				// console.log("Secondary:", MYOCD.SharedData.secondaryObjectTypes);
				var objectType = me.getNewViewTemplateWithTabsColumns().down('grid[name="primaryObjectTypesGrid"]').getSelectionModel().lastSelected;
				var currentTab = me.getNewViewTemplateWithTabsColumns().down('tabpanel[name="mainColumnsTab"]').getActiveTab();
				var newColumn = new Object();
				newColumn.fieldName = dragData.columnsData.name;
				var selectedFieldRecord = Ext.getStore('viewTemplate.AvailableFields').findRecord('name', newColumn.fieldName);
				selectedFieldRecord.set('columnSelected', true);
				selectedFieldRecord.commit();
				// if (FEATURE_PRODUCT_FIELDS.indexOf(newColumn.fieldName) != -1) {
				// 	newColumn.objectTypeName = 'item';
				// } else {
					newColumn.objectTypeName = objectType.data.name;
				// }
				newColumn.objectTypeId = objectType.data.id;				
				if (currentTab.title == "Primary Object Types") {
					for (var i = 0; i < MYOCD.SharedData.primaryObjectTypes.length; i++) {
						if (newColumn.objectTypeId == MYOCD.SharedData.primaryObjectTypes[i].id) {
							console.log('column:', newColumn);
							console.log('Object:', MYOCD.SharedData.primaryObjectTypes[i]);
							newColumn.primary = true;
							MYOCD.SharedData.primaryObjectTypes[i].columns.push(newColumn);
							break;
						}
					}
				} else {
					for (var i = 0; i < MYOCD.SharedData.secondaryObjectTypes.length; i++) {
						if (newColumn.objectTypeId == MYOCD.SharedData.secondaryObjectTypes[i].id) {
							newColumn.primary = false;
							MYOCD.SharedData.secondaryObjectTypes[i].columns.push(newColumn);
							break;
						}
					}
				}
				console.log("Primary:", MYOCD.SharedData.primaryObjectTypes);
				console.log("Secondary:", MYOCD.SharedData.secondaryObjectTypes);
				grid.getStore().add(newColumn);
	            return true;
	        }
		});
	},
	onPrimaryObjectTypesColumnItemClick: function(grid, record, item, index, e, eOpts) {
		var me = this;
		if (record.data.fieldName == 'Name') {
			if(me.getObjectTypeAttributes()) {
				me.getObjectTypeAttributes().destroy();
			}
			var popup = Ext.create('MYOCD.view.objectTypeLibrary.ObjectTypeAttributes');
			popup.show();
			popup.setTitle(record.get('objectTypeName') + "'s Attributes");
			MYOCD.SharedData.currentObjectType = {
				name: record.data.objectTypeName,
				id: record.data.objectTypeId
			}; 
			var otlStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
			otlStoreController.loadAttributeOfObjectType(record.data.objectTypeId, popup);
		}
	},
	onPrimaryObjectTypesColumnsGridItemContextMenu: function(grid, record, item, index, e, eOpts) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Remove',
					handler: function() {
						if (record.data.primary) {
							for (var i = 0; i < MYOCD.SharedData.primaryObjectTypes.length; i++) {
								if (record.data.objectTypeId == MYOCD.SharedData.primaryObjectTypes[i].id) {
									for (var j = 0; j < MYOCD.SharedData.primaryObjectTypes[i].columns.length; j++) {
										if (record.data.fieldName == MYOCD.SharedData.primaryObjectTypes[i].columns[j].fieldName) {
											MYOCD.SharedData.primaryObjectTypes[i].columns.splice(j, 1);
											break;
										}
									}
									break;
								}
							}
						} else {
							for (var i = 0; i < MYOCD.SharedData.secondaryObjectTypes.length; i++) {
								if (record.data.objectTypeId == MYOCD.SharedData.secondaryObjectTypes[i].id) {
									for (var j = 0; j < MYOCD.SharedData.secondaryObjectTypes[i].columns.length; j++) {
										if (record.data.fieldName == MYOCD.SharedData.secondaryObjectTypes[i].columns[j].fieldName) {
											MYOCD.SharedData.secondaryObjectTypes[i].columns.splice(j, 1);
											break;
										}
									}
									break;
								}
							}
						}
						grid.getStore().remove(record);
					}
				}
			]
		}).showAt(e.xy);
	},
	onPrimaryObjectTypesColumnsGridDrop: function( node, data, overModel, dropPosition, eOpts ) {
		var columnsItems = Ext.getStore('viewTemplate.ObjectTypesColumns').data.items;
		for (var i = 0; i < MYOCD.SharedData.primaryObjectTypes.length; i++) {
			MYOCD.SharedData.primaryObjectTypes[i].columns = [];
		}
		for (var i = 0; i < MYOCD.SharedData.secondaryObjectTypes.length; i++) {
			MYOCD.SharedData.secondaryObjectTypes[i].columns = [];
		}
		for (var i = 0; i < columnsItems.length; i++) {
			if (columnsItems[i].data.primary) {
				for (var j = 0; j < MYOCD.SharedData.primaryObjectTypes.length; j++) {
					if (MYOCD.SharedData.primaryObjectTypes[j].id == columnsItems[i].data.objectTypeId) {
						MYOCD.SharedData.primaryObjectTypes[j].columns.push(columnsItems[i].data);
						break;
					}
				}
			} else {
				for (var j = 0; j < MYOCD.SharedData.secondaryObjectTypes.length; j++) {
					if (MYOCD.SharedData.secondaryObjectTypes[j].id == columnsItems[i].data.objectTypeId) {
						MYOCD.SharedData.secondaryObjectTypes[j].columns.push(columnsItems[i].data);
						break;
					}
				}
			}
		}
		console.log('after sorting', MYOCD.SharedData.primaryObjectTypes, MYOCD.SharedData.secondaryObjectTypes);
	},
	onNewViewTemplateWithTabMainPanelChange: function(tabPanel, newCard, oldCard, eOpts) {
		Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').removeAll();
		if (newCard.title == "Sorting") {
			var objectTypeTemps = MYOCD.SharedData.primaryObjectTypes.concat(MYOCD.SharedData.secondaryObjectTypes);
			for (var i = 0; i < MYOCD.SharedData.sortingFields.length; i++) {
				if (!MYOCD.SharedData.sortingFields[i].objectTypeName || MYOCD.SharedData.sortingFields[i].objectTypeName.length == 0) {
					for (var j = 0; j < objectTypeTemps.length; j++) {
						if (MYOCD.SharedData.sortingFields[i].objectTypeId == objectTypeTemps[j].id) {
							MYOCD.SharedData.sortingFields[i].objectTypeName = objectTypeTemps[j].name;
							break;
						} else if (MYOCD.SharedData.sortingFields[i].objectTypeId == '') {
							MYOCD.SharedData.sortingFields[i].objectTypeName = 'item';
							break
						}
					}
				}
			}
			Ext.getStore('viewTemplate.SortingFields').removeAll();
			Ext.getStore('viewTemplate.SortingFields').loadData(MYOCD.SharedData.sortingFields);

			for (var i = 0; i < MYOCD.SharedData.groupByFields.length; i++) {
				if (!MYOCD.SharedData.groupByFields[i].objectTypeName || MYOCD.SharedData.groupByFields[i].objectTypeName.length == 0) {
					for (var j = 0; j < objectTypeTemps.length; j++) {
						if (MYOCD.SharedData.groupByFields[i].objectTypeId == objectTypeTemps[j].id) {
							MYOCD.SharedData.groupByFields[i].objectTypeName = objectTypeTemps[j].name;
							break;
						}
					}
				}
			}
			Ext.getStore('viewTemplate.GroupByFields').removeAll();
			Ext.getStore('viewTemplate.GroupByFields').loadData(MYOCD.SharedData.groupByFields); 
		}
		if (newCard.title == "Columns") {
			Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').removeAll();
			var currentTab = this.getNewViewTemplateWithTabsColumns().down('tabpanel[name="mainColumnsTab"]').getActiveTab();
			if (currentTab.title == "Primary Object Types") {
				Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').loadData(MYOCD.SharedData.primaryObjectTypes);
			} else {
				Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').loadData(MYOCD.SharedData.secondaryObjectTypes);
			}
			Ext.getStore('viewTemplate.AvailableFields').removeAll();
		}
		if (newCard.title == "Filters") {
			Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').removeAll();
			Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').loadData(MYOCD.SharedData.primaryObjectTypes);
			Ext.getStore('viewTemplate.Filters').removeAll();
			Ext.getStore('viewTemplate.Filters').loadData(MYOCD.SharedData.filterFields);
			Ext.getStore('viewTemplate.AvailableFields').removeAll();
		}
		if (newCard.title == "Group by") {
			Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').removeAll();
			var currentTab = this.getNewViewTemplateWithTabsGroupBy().down('tabpanel[name="groupByTabPanel"]').getActiveTab();
			if (currentTab.title == "Primary Object Types") {
				Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').loadData(MYOCD.SharedData.primaryObjectTypes);
			} else {
				Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').loadData(MYOCD.SharedData.secondaryObjectTypes);
			}			var objectTypeTemps = MYOCD.SharedData.primaryObjectTypes.concat(MYOCD.SharedData.secondaryObjectTypes);
			for (var i = 0; i < MYOCD.SharedData.groupByFields.length; i++) {
				if (!MYOCD.SharedData.groupByFields[i].objectTypeName || MYOCD.SharedData.groupByFields[i].objectTypeName.length == 0) {
					for (var j = 0; j < objectTypeTemps.length; j++) {
						if (MYOCD.SharedData.groupByFields[i].objectTypeId == objectTypeTemps[j].id) {
							MYOCD.SharedData.groupByFields[i].objectTypeName = objectTypeTemps[j].name;
							break;
						}
					}
				}
			}
			Ext.getStore('viewTemplate.AvailableFields').removeAll();
			Ext.getStore('viewTemplate.GroupByFields').removeAll();
			Ext.getStore('viewTemplate.GroupByFields').loadData(MYOCD.SharedData.groupByFields); 
		}
		if (newCard.title == "Aggregations") {

			// var objectTypeTemps = MYOCD.SharedData.primaryObjectTypes.concat(MYOCD.SharedData.secondaryObjectTypes);
			// for (var i = 0; i < MYOCD.SharedData.aggregations.length; i++) {
			// 	if (!MYOCD.SharedData.aggregations[i].objectTypeName || MYOCD.SharedData.aggregations[i].objectTypeName.length == 0) {
			// 		for (var j = 0; j < objectTypeTemps.length; j++) {
			// 			if (MYOCD.SharedData.aggregations[i].objectTypeId == objectTypeTemps[j].id) {
			// 				MYOCD.SharedData.aggregations[i].objectTypeName = objectTypeTemps[j].name;
			// 				break;
			// 			} else if (MYOCD.SharedData.aggregations[i].objectTypeId == '') {
			// 				MYOCD.SharedData.aggregations[i].objectTypeName = 'item';
			// 				break
			// 			}
			// 		}
			// 	}
			// }
			Ext.getStore('viewTemplate.Aggregations').removeAll();
			var columns = Ext.getStore('viewTemplate.ObjectTypesColumns').data.items;
			for (var i = 0; i < columns.length; i++) {
				var aggregation = new Object();
				aggregation.name = '';
				if (FEATURE_PRODUCT_FIELDS.indexOf(columns[i].data.fieldName) != -1) {
					aggregation.formula = '_{0::' +  columns[i].data.fieldName + '}';
					aggregation.display_column = '0::' +  columns[i].data.fieldName;
				} else {
					if (columns[i].data.primary) {
						aggregation.formula = '_{' +  columns[i].data.fieldName + '}';
						aggregation.display_column = columns[i].data.fieldName;
					} else {
						aggregation.formula = '_{' + columns[i].data.objectTypeId + '::' + columns[i].data.fieldName + '}';
						aggregation.display_column = columns[i].data.objectTypeId + '::' + columns[i].data.fieldName;
					}
				}
				aggregation.column = columns[i].data.fieldName;
				aggregation.operator = '';
				aggregation.objectTypeId = columns[i].data.objectTypeId;
				aggregation.objectTypeName = columns[i].data.objectTypeName;
				for (var j = 0; j < MYOCD.SharedData.aggregations.length; j++) {
					if (columns[i].data.fieldName == MYOCD.SharedData.aggregations[j].column) {
						aggregation.operator = MYOCD.SharedData.aggregations[j].operator;
						aggregation.name = MYOCD.SharedData.aggregations[j].name;
					}
				}
				Ext.getStore('viewTemplate.Aggregations').add(aggregation);
			}
			// Ext.getStore('viewTemplate.Aggregations').loadData(MYOCD.SharedData.aggregations);
		}
	},
	onSortingGroupByFieldsGridRender: function(grid, e, eOpts) {
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
	                    columnsData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onGroupByFieldsGridDrop: function( node, data, overModel, dropPosition, eOpts ) {
		console.log('Group by fields drop');
		var groupByItems = Ext.getStore('viewTemplate.GroupByFields').data.items;
		MYOCD.SharedData.groupByFields = [];
		for (var i = 0; i < groupByItems.length; i++) {
			MYOCD.SharedData.groupByFields.push(groupByItems[i].data);
		}
	},
	onAvailableFieldsSortingGridRender: function(grid, e, eOpts) {
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
	                    columnsData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onSortingFieldsGridRender: function(grid, e, eOpts) {
		var me = this;
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.columnsData) {
					return false;
				}
				var newSortingField = new Object();
				if (dragData.columnsData.primary) {
					newSortingField.objectTypeId = '';
				} else {
					newSortingField.objectTypeId = dragData.columnsData.objectTypeId;
				}
				
				newSortingField.objectTypeName = dragData.columnsData.objectTypeName;
				newSortingField.fieldName = dragData.columnsData.fieldName;
				newSortingField.sorting = 'asc';
				console.log(newSortingField);
				MYOCD.SharedData.sortingFields.push(newSortingField);
				grid.getStore().add(newSortingField);
	            return true;
	        }
		});
	},
	onSortingFieldsGridEdit: function(editor, e, eOpts) {
		e.record.commit();
		for (var i = 0; i < MYOCD.SharedData.sortingFields.length; i++) {
			if (e.record.data.objectTypeId == MYOCD.SharedData.sortingFields[i].objectTypeId) {
				MYOCD.SharedData.sortingFields[i].sorting = e.record.data.sorting;
				break;
			}
		}
	},
	onSortingFieldsGridItemContextMenu: function(grid, record, item, index, e, eOpts) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Remove',
					handler: function() {
						for (var i = 0; i < MYOCD.SharedData.sortingFields.length; i++) {
							if (record.data.objectTypeId == MYOCD.SharedData.sortingFields[i].objectTypeId) {
								MYOCD.SharedData.sortingFields.splice(i, 1);
								break;
							}
						}
						grid.getStore().remove(record);
					}
				}
			]
		}).showAt(e.xy);
	},
	onSortingFieldsGridDrop: function(node, data, overModel, dropPosition, eOpts) {
		console.log('Sorting fields drop');
		var sortingsItems = Ext.getStore('viewTemplate.SortingFields').data.items;
		MYOCD.SharedData.sortingFields = [];
		for (var i = 0; i < sortingsItems.length; i++) {
			MYOCD.SharedData.sortingFields.push(sortingsItems[i].data);
		}
	},
	onFilterObjectTypesComboboxChange: function(combobox, newValue, oldValue, eOpts) {
		var objectTypeParams = [];
		objectTypeParams.push(newValue);
		MYOCD.controller.viewTemplate.ViewLibraryStoreController.loadAvailableAttributesOfObjectTypes(objectTypeParams, this.getNewViewTemplateWithTabsFilters());
	},
	onAddFilterToolClick: function() {
		if (this.getNewViewTemplateWithTabsFiltersEditor()) {
			this.getNewViewTemplateWithTabsFiltersEditor().destroy();
		}
		var popup = Ext.create('MYOCD.view.viewTemplate.NewViewTemplateWithTabsFiltersEditor');
		popup.show();
	},
	onAddFilterBtnClick: function() {
		var newViewTemplateWithTabsFilters = this.getNewViewTemplateWithTabsFilters();
		var objectTypeId = newViewTemplateWithTabsFilters.down('combobox[name="filterObjectTypesCombobox"]').getValue();
		var selectedOperator = newViewTemplateWithTabsFilters.down('combobox[name="operatorsCombobox"]').getValue();
		var selectedOperatorIndex = newViewTemplateWithTabsFilters.down('combobox[name="operatorsCombobox"]').getStore().find('value', selectedOperator);
		var selecterOperatorRecord = newViewTemplateWithTabsFilters.down('combobox[name="operatorsCombobox"]').getStore().getAt(selectedOperatorIndex);
		var selectedField = newViewTemplateWithTabsFilters.down('combobox[name="filterFieldCombobox"]').getValue();
		if (selectedOperatorIndex == -1 || selectedField.length == 0) {
			return;
		}
		var filterValue = newViewTemplateWithTabsFilters.down('textfield[name="filterValue"]').getValue().trim();
		var filter = new Object();
		filter.displayName = selectedField + ' is ' + selecterOperatorRecord.data.name + ' ' + filterValue;
		if (FEATURE_PRODUCT_FIELDS.indexOf(selectedField) != -1) {
			filter.formula = '_{0::' + selectedField + '}' + selecterOperatorRecord.data.value + filterValue;
		} else {
			filter.formula = '_{' + objectTypeId + '::' + selectedField + '}' + selecterOperatorRecord.data.value + filterValue;
		}
		Ext.getStore('viewTemplate.Filters').add(filter);
		MYOCD.SharedData.filterFields.push(filter);
	},
	onFiltersGridItemContextMenu: function(grid, record, item, index, e, eOpts) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Remove',
					handler: function() {
						grid.getStore().remove(record);
						for (var i = 0; i < MYOCD.SharedData.filterFields.length; i++) {
							if (record.data.formula == MYOCD.SharedData.filterFields[i].formula) {
								MYOCD.SharedData.filterFields.splice(i, 1);
								break;
							}
						}
					}
				}
			]
		}).showAt(e.xy);
	},
	onGroupByTabChange: function(tabPanel, newCard, oldCard, eOpts) {
		if (newCard.title == "Primary Object Types") {
			Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').loadData(MYOCD.SharedData.primaryObjectTypes);
		} else {
			Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').loadData(MYOCD.SharedData.secondaryObjectTypes);
		}
		Ext.getStore('viewTemplate.AvailableFields').removeAll();
	},
	onSecondaryGroupByObjectTypesGridRender: function(grid, e, eOpts) {
		var me = this;
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.objectTypeData) {
					return false;
				}
				var objectType = dragData.objectTypeData;

				objectType.columns = [];
				var currentTab = me.getNewViewTemplateWithTabsGroupBy().down('tabpanel[name="groupByTabPanel"]').getActiveTab();
				if (currentTab.title == "Primary Object Types") {
					objectType.primary = true;
					MYOCD.SharedData.primaryObjectTypes.push(objectType);
				} else {
					objectType.primary = false;
					MYOCD.SharedData.secondaryObjectTypes.push(objectType);
				}
				grid.getStore().add(dragData.objectTypeData);
	            return true;
	        }
		});
	},
	onSecondaryGroupByObjectTypesGridItemClick: function(grid, record, item, index, e, eOpts) {
		var objectTypeParams = [];
		objectTypeParams.push(record.data.id);
		MYOCD.controller.viewTemplate.ViewLibraryStoreController.loadAvailableAttributesOfObjectTypes(objectTypeParams, this.getNewViewTemplateWithTabsGroupBy());
	},
	onGroupByAvaileFieldsGridRender:function(grid, e, eOpts) {
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
	                    columnsData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onGroupByFieldsGridRender: function(grid, e, eOpts) {
		var me = this;
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			onContainerOver: function() {
				return this.dropAllowed;
			},
			onContainerDrop : function(dropZone, evtObj, dragData) {
				if (!dragData.columnsData) {
					return false;
				}
				var currentTab = me.getNewViewTemplateWithTabsGroupBy().down('tabpanel[name="groupByTabPanel"]').getActiveTab();
				var objectType = me.getNewViewTemplateWithTabsGroupBy().down('grid[name="secondaryGroupByObjectTypesGrid"]').getSelectionModel().lastSelected;
				var newGroupByField = new Object();
				if (currentTab.title == "Primary Object Types") {
					newGroupByField.primary = true;
				} else {
					newGroupByField.primary = false;
				}
				newGroupByField.objectTypeId = objectType.data.id;
				newGroupByField.objectTypeName = objectType.data.name;
				newGroupByField.fieldName = dragData.columnsData.name;
				MYOCD.SharedData.groupByFields.push(newGroupByField);
				grid.getStore().add(newGroupByField);
	            return true;
	        }
		});
	},
	onGroupByFieldsGridItemContextMenu: function(grid, record, item, index, e, eOpts) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Remove',
					handler: function() {
						grid.getStore().remove(record);
						for (var i = 0; i < MYOCD.SharedData.groupByFields.length; i++) {
							if (record.data.objectTypeId == MYOCD.SharedData.groupByFields[i].objectTypeId) {
								MYOCD.SharedData.groupByFields.splice(i, 1);
								break;
							}
						}
					}
				}
			]
		}).showAt(e.xy);
	},
	onAddNewAggregationToolClick: function() {
		if (this.getNewViewTemplateWithTabsAggregationsEditor()) {
			this.getNewViewTemplateWithTabsAggregationsEditor().destroy();
		}
		var editor = Ext.create('MYOCD.view.viewTemplate.NewViewTemplateWithTabsAggregationsEditor');
		editor.show();
	},
	onAggregationsGridItemContextMenu: function(grid, record, item, index, e, eOpts) {
		var me = this;
		e.stopEvent();
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Remove',
					handler: function() {
						grid.getStore().remove(record);
						for (var i = 0; i < MYOCD.SharedData.aggregations.length; i++) {
							if (record.data.formula == MYOCD.SharedData.aggregations[i].formula) {
								MYOCD.SharedData.aggregations.splice(i, 1);
								break;
							}
						}
					}
				}
			]
		}).showAt(e.xy);
	},
	onAggregationsGridEdit: function( editor, e, eOpts ) {
		var stringId = e.record.data.name + e.record.data.formula + e.record.data.display_column;
		e.record.data.name = e.record.data.operator;
		e.record.commit();
		MYOCD.SharedData.aggregations = [];
		for (var i = 0; i < Ext.getStore('viewTemplate.Aggregations').data.items.length; i++) {
			if (Ext.getStore('viewTemplate.Aggregations').data.items[i].data.name && Ext.getStore('viewTemplate.Aggregations').data.items[i].data.name.length > 0) {
				MYOCD.SharedData.aggregations.push(Ext.getStore('viewTemplate.Aggregations').data.items[i].data);
			}
		}
	},
	onCreateNewViewTemplateBtnClick: function() {
		var url;
		var viewLocation = this.getNewViewTemplateWithTabs().down('textfield[name="viewLocation"]').getValue();
		if (viewLocation == 'workspace') {
			url = VIEW_API_URL;
		} else {
			if(MYOCD.SharedData.currentViewCategory == null || MYOCD.SharedData.currentViewCategory.data.id == 'root') {
				url = VIEW_LIB_BASE_URL + MYOCD.SharedData.currentViewLibId + '/templates.json';
			} else {
				url = VIEW_CATEGORY_BASE_URL +  MYOCD.SharedData.currentViewCategory.data.id + '/templates.json'; 
			}
		}

		var viewTemplateName = this.getNewViewTemplateWithTabs().down('textfield[name="viewTemplateName"]').getValue().trim();
		if (viewTemplateName.length == 0) {
			Ext.Msg.alert('Error!', 'Please enter view template name');
			return;
		}
		var viewTemplateDesc = this.getNewViewTemplateWithTabs().down('textfield[name="viewTemplateDesc"]').getValue().trim();

		var secondaryObjectTypes = new Object();
		secondaryObjectTypes['0'] = [];
		for (var i = 0; i < MYOCD.SharedData.secondaryObjectTypes.length; i++) {
			secondaryObjectTypes[MYOCD.SharedData.secondaryObjectTypes[i].id] = [];
			for (var j = 0; j < MYOCD.SharedData.secondaryObjectTypes[i].columns.length; j++) {
				var col = MYOCD.SharedData.secondaryObjectTypes[i].columns[j];
				var colIndex = Ext.getStore('viewTemplate.ObjectTypesColumns').findBy(
					function(rec, idx) {
						return rec.data.objectTypeName == col.objectTypeName && rec.data.objectTypeId 
							&& rec.data.fieldName == col.fieldName && !rec.data.primary;

					}
				);
				var colParam = col.fieldName + '::' + colIndex;
				if (FEATURE_PRODUCT_FIELDS.indexOf(col.fieldName) != -1) {
					secondaryObjectTypes['0'].push(colParam);
				} else {
					secondaryObjectTypes[MYOCD.SharedData.secondaryObjectTypes[i].id].push(colParam);
				}
			}
		}
		console.log (secondaryObjectTypes);
		var primaryObjectTypes = new Object();
		primaryObjectTypes['0'] = [];
		for (var i = 0; i < MYOCD.SharedData.primaryObjectTypes.length; i++) {
			primaryObjectTypes[MYOCD.SharedData.primaryObjectTypes[i].id] = [];
			for (var j = 0; j < MYOCD.SharedData.primaryObjectTypes[i].columns.length; j++) {
				var col = MYOCD.SharedData.primaryObjectTypes[i].columns[j];
				var colIndex = Ext.getStore('viewTemplate.ObjectTypesColumns').findBy(
					function(rec, idx) {
						return rec.data.objectTypeName == col.objectTypeName && rec.data.objectTypeId 
							&& rec.data.fieldName == col.fieldName && rec.data.primary;

					}
				);
				var colParam = col.fieldName + '::' + colIndex;
				if (FEATURE_PRODUCT_FIELDS.indexOf(col.fieldName) != -1) {
					primaryObjectTypes['0'].push(colParam);
				} else {
					primaryObjectTypes[MYOCD.SharedData.primaryObjectTypes[i].id].push(colParam);
				}
			}
		}
		console.log (primaryObjectTypes);
		var filters = [];
		for (var i = 0; i < MYOCD.SharedData.filterFields.length;  i++) {
			filters.push(MYOCD.SharedData.filterFields[i].formula);
		}
		var groupBys = [];
		for (var i = 0; i < MYOCD.SharedData.groupByFields.length; i++) {
			if (FEATURE_PRODUCT_FIELDS.indexOf(MYOCD.SharedData.groupByFields[i].fieldName) != -1) {
				groupBys.push('0::'+MYOCD.SharedData.groupByFields[i].fieldName);
			} else {
				groupBys.push(MYOCD.SharedData.groupByFields[i].objectTypeId+'::'+MYOCD.SharedData.groupByFields[i].fieldName);

			}
		}
		var orderBys = [];
		var sortings = [];
		for (var i = 0; i < MYOCD.SharedData.sortingFields.length; i++) {
			if (FEATURE_PRODUCT_FIELDS.indexOf(MYOCD.SharedData.sortingFields[i].fieldName) != -1) {
				orderBys.push('0::'+MYOCD.SharedData.sortingFields[i].fieldName);
			} else {
				if (MYOCD.SharedData.sortingFields[i].objectTypeId.length > 0) {
					orderBys.push(MYOCD.SharedData.sortingFields[i].fieldName)
				} else {
					orderBys.push(MYOCD.SharedData.sortingFields[i].objectTypeId+'::'+MYOCD.SharedData.sortingFields[i].fieldName);
				}
				

			}
			sortings.push(MYOCD.SharedData.sortingFields[i].sorting);
		}
		var aggregations = [];
		for (var i = 0; i < MYOCD.SharedData.aggregations.length; i++) {
			var aggregationParam = new Object();
			aggregationParam.name = MYOCD.SharedData.aggregations[i].name;
			aggregationParam.operator = MYOCD.SharedData.aggregations[i].operator;
			aggregationParam.formula = MYOCD.SharedData.aggregations[i].formula.replace("item", "0");
			aggregationParam.display_column = MYOCD.SharedData.aggregations[i].display_column;
			aggregations.push(aggregationParam);
		}
		this.getNewViewTemplateWithTabs().destroy();
		if (this.getNewViewTemplateWithTabsAggregationsEditor()) {
			this.getNewViewTemplateWithTabsAggregationsEditor().destroy();
		}
		MYOCD.controller.viewTemplate.ViewLibraryStoreController.addNewViewTemplate(url, viewTemplateName, viewTemplateDesc, 
						secondaryObjectTypes, primaryObjectTypes, filters, groupBys, orderBys, sortings, aggregations, this.getViewLibraryManager());
	},
	onUpdateViewTemplateBtnClick: function() {
		var viewTemplateId = this.getNewViewTemplateWithTabs().down('textfield[name="viewTemplateId"]').getValue();
		var viewLocation = this.getNewViewTemplateWithTabs().down('textfield[name="viewLocation"]').getValue();
		var viewTemplateName = this.getNewViewTemplateWithTabs().down('textfield[name="viewTemplateName"]').getValue().trim();
		if (viewTemplateName.length == 0) {
			Ext.Msg.alert('Error!', 'Please enter view template name');
			return;
		}
		var viewTemplateDesc = this.getNewViewTemplateWithTabs().down('textfield[name="viewTemplateDesc"]').getValue().trim();

		var secondaryObjectTypes = new Object();
		secondaryObjectTypes['0'] = [];
		for (var i = 0; i < MYOCD.SharedData.secondaryObjectTypes.length; i++) {
			secondaryObjectTypes[MYOCD.SharedData.secondaryObjectTypes[i].id] = [];
			for (var j = 0; j < MYOCD.SharedData.secondaryObjectTypes[i].columns.length; j++) {
				var col = MYOCD.SharedData.secondaryObjectTypes[i].columns[j];
				var colIndex = Ext.getStore('viewTemplate.ObjectTypesColumns').findBy(
					function(rec, idx) {
						return rec.data.objectTypeName == col.objectTypeName && rec.data.objectTypeId 
							&& rec.data.fieldName == col.fieldName && !rec.data.primary;

					}
				);
				var colParam = col.fieldName + '::' + colIndex;
				if (FEATURE_PRODUCT_FIELDS.indexOf(col.fieldName) != -1) {
					secondaryObjectTypes['0'].push(colParam);
				} else {
					secondaryObjectTypes[MYOCD.SharedData.secondaryObjectTypes[i].id].push(colParam);
				}
			}
		}
		console.log (secondaryObjectTypes);
		var primaryObjectTypes = new Object();
		primaryObjectTypes['0'] = [];
		for (var i = 0; i < MYOCD.SharedData.primaryObjectTypes.length; i++) {
			primaryObjectTypes[MYOCD.SharedData.primaryObjectTypes[i].id] = [];
			for (var j = 0; j < MYOCD.SharedData.primaryObjectTypes[i].columns.length; j++) {
				var col = MYOCD.SharedData.primaryObjectTypes[i].columns[j];
				var colIndex = Ext.getStore('viewTemplate.ObjectTypesColumns').findBy(
					function(rec, idx) {
						return rec.data.objectTypeName == col.objectTypeName && rec.data.objectTypeId 
							&& rec.data.fieldName == col.fieldName && rec.data.primary;

					}
				);
				var colParam = col.fieldName + '::' + colIndex;
				if (FEATURE_PRODUCT_FIELDS.indexOf(col.fieldName) != -1) {
					primaryObjectTypes['0'].push(colParam);
				} else {
					primaryObjectTypes[MYOCD.SharedData.primaryObjectTypes[i].id].push(colParam);
				}
			}
		}
		console.log (primaryObjectTypes);
		var filters = [];
		for (var i = 0; i < MYOCD.SharedData.filterFields.length;  i++) {
			filters.push(MYOCD.SharedData.filterFields[i].formula);
		}
		var groupBys = [];
		for (var i = 0; i < MYOCD.SharedData.groupByFields.length; i++) {
			if (FEATURE_PRODUCT_FIELDS.indexOf(MYOCD.SharedData.groupByFields[i].fieldName) != -1) {
				groupBys.push('0::'+MYOCD.SharedData.groupByFields[i].fieldName);
			} else {
				if (MYOCD.SharedData.groupByFields[i].primary) {
					groupBys.push(MYOCD.SharedData.groupByFields[i].fieldName);
				} else {
					groupBys.push(MYOCD.SharedData.groupByFields[i].objectTypeId+'::'+MYOCD.SharedData.groupByFields[i].fieldName);
				}

			}
		}
		var orderBys = [];
		var sortings = [];
		for (var i = 0; i < MYOCD.SharedData.sortingFields.length; i++) {
			if (FEATURE_PRODUCT_FIELDS.indexOf(MYOCD.SharedData.sortingFields[i].fieldName) != -1) {
				orderBys.push('0::'+MYOCD.SharedData.sortingFields[i].fieldName);
			} else {
				if (MYOCD.SharedData.sortingFields[i].objectTypeId.length == 0) {
					orderBys.push(MYOCD.SharedData.sortingFields[i].fieldName)
				} else {
					orderBys.push(MYOCD.SharedData.sortingFields[i].objectTypeId+'::'+MYOCD.SharedData.sortingFields[i].fieldName);
				}

			}
			sortings.push(MYOCD.SharedData.sortingFields[i].sorting);
		}
		var aggregations = [];
		for (var i = 0; i < MYOCD.SharedData.aggregations.length; i++) {
			var aggregationParam = new Object();
			aggregationParam.name = MYOCD.SharedData.aggregations[i].name;
			aggregationParam.operator = MYOCD.SharedData.aggregations[i].operator;
			aggregationParam.formula = MYOCD.SharedData.aggregations[i].formula.replace("item", "0");
			aggregationParam.display_column = MYOCD.SharedData.aggregations[i].display_column;
			aggregations.push(aggregationParam);
		}
		this.getNewViewTemplateWithTabs().destroy();
		if (this.getNewViewTemplateWithTabsAggregationsEditor()) {
			this.getNewViewTemplateWithTabsAggregationsEditor().destroy();
		}
		MYOCD.controller.viewTemplate.ViewLibraryStoreController.editViewTemplate(viewTemplateId, viewTemplateName, viewTemplateDesc, 
						secondaryObjectTypes, primaryObjectTypes, filters, groupBys, orderBys, sortings, aggregations, this.getViewLibraryManager());
	},


	/////// For parsing view json

	getPrimaryObjectTypes: function(primaryObjectTypesParam) {
		var me = this;
		for (var keyId in primaryObjectTypesParam) {
			if (keyId.toString() == '0') {
				MYOCD.SharedData.zeroPriColumns = [];
				for (var i = 0; i < primaryObjectTypesParam[keyId].length; i++) {
					var objectTypeColumn = new Object();
					var columnFields = primaryObjectTypesParam[keyId][i].toString().split('::');
					objectTypeColumn.fieldName =  columnFields[0];
					objectTypeColumn.index = columnFields[1];
					objectTypeColumn.objectTypeName = 'item';
					objectTypeColumn.primary = true;
					MYOCD.SharedData.zeroPriColumns.push(objectTypeColumn);
				}
			} else {
				var objectTypesStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
				objectTypesStoreController.getObjectTypeInfo(keyId.toString(), me.getNewViewTemplateWithTabs(), 
					function(objectType) {
						var newObjectType = objectType;
						newObjectType.columns = [];
						newObjectType.primary = true;
						console.log('Primary Obj Id:', objectType.id);	
						console.log('Primary Key:', primaryObjectTypesParam[objectType.id.toString()]);
						for (var i = 0; i < primaryObjectTypesParam[objectType.id.toString()].length; i++) {
							var objectTypeColumn = new Object();
							var columnFields = primaryObjectTypesParam[objectType.id.toString()][i].toString().split('::');
							objectTypeColumn.fieldName =  columnFields[0];
							objectTypeColumn.index = columnFields[1];
							objectTypeColumn.objectTypeId = objectType.id;
							objectTypeColumn.objectTypeName = objectType.name;
							objectTypeColumn.primary = true;
							console.log('Primary columns:', objectTypeColumn);
							newObjectType.columns.push(objectTypeColumn);
						}
						if (MYOCD.SharedData.zeroPriColumns && MYOCD.SharedData.zeroPriColumns.length > 0) {
							for (var i = 0; i < MYOCD.SharedData.zeroPriColumns.length; i++) {
								var objectTypeColumn = MYOCD.SharedData.zeroPriColumns[i];
								objectTypeColumn.objectTypeId = objectType.id
								newObjectType.columns.push(objectTypeColumn);
							}
							MYOCD.SharedData.zeroPriColumns.splice(0, MYOCD.SharedData.zeroPriColumns.length);
						}
						MYOCD.SharedData.primaryObjectTypes.push(newObjectType);
						Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').add(newObjectType);
						Ext.getStore('viewTemplate.ObjectTypesColumns').add(newObjectType.columns);
					}
				);
			}	 
		}
	},
	getSecondaryObjectTypes: function(secondaryObjectTypesParam) {
		var me = this;
		for (var keyId in secondaryObjectTypesParam) {
			if (keyId.toString() == '0') {
				MYOCD.SharedData.zeroSecColumns = [];
				for (var i = 0; i < secondaryObjectTypesParam[keyId].length; i++) {
					var objectTypeColumn = new Object();
					var columnFields = secondaryObjectTypesParam[keyId][i].toString().split('::');
					objectTypeColumn.fieldName =  columnFields[0];
					objectTypeColumn.index = columnFields[1];
					objectTypeColumn.objectTypeName = 'item';
					objectTypeColumn.primary = false;
					MYOCD.SharedData.zeroSecColumns.push(objectTypeColumn);
				}
			} else {
				var objectTypesStoreController = MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController;
				objectTypesStoreController.getObjectTypeInfo(keyId.toString(), me.getNewViewTemplateWithTabs(), 
					function(objectType) {
						var newObjectType = objectType;
						newObjectType.columns = [];
						newObjectType.primary = false;
						console.log('Secondary Obj Id:', keyId);
						console.log('Secondary Key:', secondaryObjectTypesParam[keyId.toString()]);
						for (var i = 0; i < secondaryObjectTypesParam[objectType.id.toString()].length; i++) {
							var objectTypeColumn = new Object();
							var columnFields = secondaryObjectTypesParam[objectType.id.toString()][i].toString().split('::');
							objectTypeColumn.fieldName =  columnFields[0];
							objectTypeColumn.index = columnFields[1];
							objectTypeColumn.objectTypeId = objectType.id;
							objectTypeColumn.objectTypeName = objectType.name;
							objectTypeColumn.primary = false;
							console.log('Secondary columns:', objectTypeColumn);
							newObjectType.columns.push(objectTypeColumn);
						}
						if (MYOCD.SharedData.zeroSecColumns && MYOCD.SharedData.zeroSecColumns.length > 0) {
							for (var i = 0; i < MYOCD.SharedData.zeroSecColumns.length; i++) {
								var objectTypeColumn = MYOCD.SharedData.zeroSecColumns[i];
								objectTypeColumn.objectTypeId = objectType.id
								newObjectType.columns.push(objectTypeColumn);
							}
							MYOCD.SharedData.zeroSecColumns.splice(0, MYOCD.SharedData.zeroPriColumns.length);
						}
						MYOCD.SharedData.secondaryObjectTypes.push(newObjectType);
						Ext.getStore('viewTemplate.ObjectTypesColumns').add(newObjectType.columns);
					}
				);
			}
		}
	},
	getFilterItems: function(filtersArray) {
		var filters = [];
		for (var i = 0; i < filtersArray.length; i++) {
			// var operator = new Object();
			// if (filtersArray[i].indexOf(">") != -1) {
			// 	operator.value = ">";
			// 	operator.name = "greater than";
			// } else if (filtersArray[i].indexOf("<") != -1) {
			// 	operator.value = "<";
			// 	operator.name = "less than";
			// } else if (filtersArray[i].indexOf("==") != -1) {
			// 	operator.value = "==";
			// 	operator.name = "equal to";
			// } else if (filtersArray[i].indexOf("!=") != -1) {
			// 	operator.value = "!=";
			// 	operator.name = "not equal to";
			// }
			// var strings = filtersArray[i].split(operator.value);
			// var objFields = strings[0].split("::");
			// var objectTypeId = objFields[0].substring(1, objFields[0].length);
			// var fieldName = objFields[1].substring(0, objFields[1].length-1);
			// var value = strings[1];
			var filterItem = new Object();
			filterItem.displayName = filtersArray[i];
			filterItem.formula = filtersArray[i];
			filters.push(filterItem);
		}
		console.log('filters: ', filters);
		return filters;
	}, 
	getSortingFields: function(sortingFieldsParam, sortingFieldsParamSort) {
		for (var i = 0; i < sortingFieldsParam.length; i++) {
			var sortingField = new Object();
			var fields = sortingFieldsParam[i].split("::");
			if (fields.length > 1) {
				sortingField.objectTypeId = fields[0];
				sortingField.fieldName = fields[1];
			} else {
				sortingField.objectTypeId = '';
				sortingField.fieldName = fields[0];
			}
			
			sortingField.sorting = sortingFieldsParamSort[i];
			MYOCD.SharedData.sortingFields.push(sortingField);
		}
		console.log('sorting fields: ', MYOCD.SharedData.sortingFields);
	},
	getGroupByFields: function(groupByParams) {
		for (var i = 0; i < groupByParams.length; i++) {
			var groupByField = new Object();
			var fields = groupByParams[i].split("::");
			if (fields.length > 1) {
				groupByField.primary = false;
				groupByField.objectTypeId = fields[0];
				groupByField.fieldName = fields[1];
			} else {
				groupByField.primary = true;
				groupByField.objectTypeId = '';
				groupByField.fieldName = fields[0];
			}
			MYOCD.SharedData.groupByFields.push(groupByField);
		}
	},
	getAggregations: function(aggregationsParam) {
		for (var i = 0; i < aggregationsParam.length; i++) {
			var newAggregation = new Object();
			newAggregation.name = aggregationsParam[i][0][1].toString();
			newAggregation.operator = aggregationsParam[i][1][1].toString();
			newAggregation.formula = aggregationsParam[i][2][1].toString().replace('_{0::', '_{item::');
			var handleStrings = newAggregation.formula.split('::');
			var objectTypeId = '';
			var column;
			if (handleStrings.length > 1) {
				objectTypeId = handleStrings[0].substring(2);
				column = handleStrings[1].replace('}','');
			} else {
				column = handleStrings[0].substring(2).replace('}','');
			}
			newAggregation.column = column;
			newAggregation.objectTypeId = objectTypeId; 
			newAggregation.display_column = aggregationsParam[i][3][1].toString();
			MYOCD.SharedData.aggregations.push(newAggregation);
		}
		console.log('aggregation: ', MYOCD.SharedData.aggregations);
	}
});