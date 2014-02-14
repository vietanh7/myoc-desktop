Ext.define('MYOCD.controller.viewTemplate.NewViewTemplateFilterEditorController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'newViewTemplateWithTabsFiltersEditor',
			selector: 'newViewTemplateWithTabsFiltersEditor'
		}
	],
	init: function() {
		this.control({
			'newViewTemplateWithTabsFiltersEditor tabpanel[name="filterEditorTabPanel"]': {
				tabchange: this.onFilterEditorTabPanelChange
			},
			'newViewTemplateWithTabsFiltersEditor grid[name="filterEditorObjectTypesGrid"]': {
				itemclick: this.onFilterEditorObjectTypesGridItemClick
			},
			'newViewTemplateWithTabsFiltersEditor textarea[name="filtersEditorView"]': {
				render: this.onFiltersEditorViewRender
			},
			'newViewTemplateWithTabsFiltersEditor button[name="addMathOperatorbtn"]': {
				click: this.onAddMathOperatorBtnClick
			},
			'newViewTemplateWithTabsFiltersEditor button[name="addComparisonOperatorbtn"]': {
				click: this.onAddComparisonOperatorBtnClick
			},
			'newViewTemplateWithTabsFiltersEditor button[name="addLogicalOperatorbtn"]': {
				click: this.onAddLogicalOperatorBtnClick
			},
			'newViewTemplateWithTabsFiltersEditor button[name="addNewFilterBtn"]': {
				click: this.onAddNewFilterBtnClick
			}
		});
	},
	onFilterEditorTabPanelChange: function(tabPanel, newCard, oldCard, eOpts) {
		Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').removeAll();
		if (newCard.title == "Primary Object Types") {
			Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').loadData(MYOCD.SharedData.primaryObjectTypes);
		} else {
			Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').loadData(MYOCD.SharedData.secondaryObjectTypes);
		}
		Ext.getStore('viewTemplate.AvailableFields').removeAll();
	},
	onFilterEditorObjectTypesGridItemClick: function(grid, record, item, index, e, eOpts) {
		var objectTypeParams = [];
		objectTypeParams.push(record.data.id);
		MYOCD.controller.viewTemplate.ViewLibraryStoreController.loadAvailableAttributesOfObjectTypes(objectTypeParams, this.getNewViewTemplateWithTabsFiltersEditor());
	},
	onFiltersEditorViewRender: function(textarea, e, eOpts) {
		var me = this;
		var formPanelDropTargetEl =  textarea.inputEl.dom;
	    var formPanelDropTarget = Ext.create('Ext.dd.DropTarget', formPanelDropTargetEl, {
	        ddGroup: 'availableFilterFields',
	        notifyEnter: function(ddSource, e, data) { 
	            textarea.inputEl.stopAnimation();
	            textarea.inputEl.highlight();
	        },
	        notifyDrop  : function(ddSource, e, data){

	            // Reference the record (single selection) for readability
	            var selectedRecord = ddSource.dragData.records[0];

	            // Load the record into the form
	            var currentTab = me.getNewViewTemplateWithTabsFiltersEditor().down('tabpanel[name="filterEditorTabPanel"]').getActiveTab();
				var objectType = me.getNewViewTemplateWithTabsFiltersEditor().down('grid[name="filterEditorObjectTypesGrid"]').getSelectionModel().lastSelected;
	            if (currentTab.title != "Primary Object Types") {
	            	if (FEATURE_PRODUCT_FIELDS.indexOf(selectedRecord.data.name) != -1) {
	            		textarea.insertAtCursor('_{0::' + selectedRecord.data.name + '}');
	            	} else {
	            		textarea.insertAtCursor('_{' + objectType.data.id + '::' + selectedRecord.data.name + '}');

	            	}
	            } else {
	            	if (FEATURE_PRODUCT_FIELDS.indexOf(selectedRecord.data.name) != -1) {
	            		textarea.insertAtCursor('_{0::' + selectedRecord.data.name + '}');
	            	} else {
	            		textarea.insertAtCursor('_{' + selectedRecord.data.name + '}');

	            	}
	            }
	            // Delete record from the source store.  not really required.
	            // ddSource.view.store.remove(selectedRecord);

	            return true;
	        }
	    });
	},
	onAddMathOperatorBtnClick: function() {
		var mathOperator = this.getNewViewTemplateWithTabsFiltersEditor().down('combobox[name="mathOperatorsCombobox"]').getValue();
		this.getNewViewTemplateWithTabsFiltersEditor().down('textarea[name="filtersEditorView"]').insertAtCursor(mathOperator);
	},
	onAddComparisonOperatorBtnClick: function() {
		var comparisonOperator = this.getNewViewTemplateWithTabsFiltersEditor().down('combobox[name="comparisonOperatorsCombobox"]').getValue();
		this.getNewViewTemplateWithTabsFiltersEditor().down('textarea[name="filtersEditorView"]').insertAtCursor(comparisonOperator);
	},
	onAddLogicalOperatorBtnClick: function() {
		var logicalOperator = this.getNewViewTemplateWithTabsFiltersEditor().down('combobox[name="logicalOperatorsCombobox"]').getValue();
		this.getNewViewTemplateWithTabsFiltersEditor().down('textarea[name="filtersEditorView"]').insertAtCursor(logicalOperator);
	},
	onAddNewFilterBtnClick: function() {
		var filterValue = this.getNewViewTemplateWithTabsFiltersEditor().down('textarea[name="filtersEditorView"]').getValue();
		if (filterValue.trim().length == 0) {
			return;
		}
		var filter = new Object();
		filter.displayName = filterValue;
		filter.formula = filterValue;
		this.getNewViewTemplateWithTabsFiltersEditor().down('textarea[name="filtersEditorView"]').setValue('');
		Ext.getStore('viewTemplate.Filters').add(filter);
		MYOCD.SharedData.filterFields.push(filter);
	}
});