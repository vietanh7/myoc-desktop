Ext.define('MYOCD.controller.viewTemplate.NewViewTemplateAggregationEditorController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'newViewTemplateWithTabsAggregations',
			selector: 'newViewTemplateWithTabsAggregations'
		},
		{
			ref: 'newViewTemplateWithTabsAggregationsEditor',
			selector: 'newViewTemplateWithTabsAggregationsEditor'
		}
	],
	init: function() {
		this.control({
			'newViewTemplateWithTabsAggregationsEditor': {
				show: this.onNewViewTemplateWithTabsAggregationEditorShow
			},
			'newViewTemplateWithTabsAggregationsEditor combobox[name="aggregationObjectTypes"]': {
				change: this.onAggregationObjectTypesComboboxChange
			},
			'newViewTemplateWithTabsAggregationsEditor button[name="addKeywordBtn"]': {
				click: this.onAddKeyWordBtnClick
			},
			'newViewTemplateWithTabsAggregationsEditor button[name="addFormulaBtn"]': {
				click: this.onAddFormulaBtnClick
			},
			'newViewTemplateWithTabsAggregationsEditor button[name="formulaAddValueBtn"]': {
				click: this.onFormulaAddValueBtnClick
			},
			'newViewTemplateWithTabsAggregationsEditor radiogroup[name="radioTypeGroup"]': {
				change: this.onRadioTypeGroupChange
			},
			'newViewTemplateWithTabsAggregationsEditor button[name="clearFunction"]': {
				click: this.onClearFunctionBtnClick
			},
			'newViewTemplateWithTabsAggregationsEditor button[name="addAggregationBtn"]': {
				click: this.onAddAggregationBtnClick
			}
		});
	},
	onNewViewTemplateWithTabsAggregationEditorShow: function() {
		MYOCD.SharedData.aggregationOperands = [];
		MYOCD.SharedData.aggregationOperators = [];
		Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').removeAll();
		Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').add(MYOCD.SharedData.primaryObjectTypes);
	},
	formulaProcess: function() {
		var formula = "";
		var col = null;
		for (var i = 0; i < MYOCD.SharedData.aggregationOperands.length; i++) {
			if (MYOCD.SharedData.aggregationOperands[i].objectType) {
				// if (i == 0 || !MYOCD.SharedData.aggregationOperands[i-1].objectType) {
				if (FEATURE_PRODUCT_FIELDS.indexOf(MYOCD.SharedData.aggregationOperands[i].objectType.fieldName) != -1) {
					formula = formula + "_{" + "item" + "::" + MYOCD.SharedData.aggregationOperands[i].objectType.fieldName + "}";
				} else {
					formula = formula + "_{" + MYOCD.SharedData.aggregationOperands[i].objectType.id + "::" + MYOCD.SharedData.aggregationOperands[i].objectType.fieldName + "}";
				}
				// 	if (i == MYOCD.SharedData.aggregationOperands.length - 1) {
				// 		formula = formula + "}";
				// 	}
				// } else if (MYOCD.SharedData.aggregationOperands[i+1] && !MYOCD.SharedData.aggregationOperands[i+1].objectType) {
				// 	formula = formula + MYOCD.SharedData.aggregationOperands[i].objectType.id + "::" + MYOCD.SharedData.aggregationOperands[i].objectType.fieldName + "}";
				// } else {
				// 	formula = formula + MYOCD.SharedData.aggregationOperands[i].objectType.id + "::" + MYOCD.SharedData.aggregationOperands[i].objectType.fieldName;
				// 	if (i == MYOCD.SharedData.aggregationOperands.length - 1) {
				// 		formula = formula + "}";
				// 	}
				// }
				if (!col) {
					if (FEATURE_PRODUCT_FIELDS.indexOf(MYOCD.SharedData.aggregationOperands[i].objectType.fieldName) != -1) {
						col = "0" + "::" + MYOCD.SharedData.aggregationOperands[i].objectType.fieldName ;
					} else {
						col =  MYOCD.SharedData.aggregationOperands[i].objectType.id + "::" + MYOCD.SharedData.aggregationOperands[i].objectType.fieldName;
					}
				} 
			} else {
				formula = formula + MYOCD.SharedData.aggregationOperands[i].value;
			}
			if (MYOCD.SharedData.aggregationOperators.length > 0) {
				if (MYOCD.SharedData.aggregationOperators[i]) {
					formula = formula + MYOCD.SharedData.aggregationOperators[i];
				}
			}
		}
		MYOCD.SharedData.displayColumn = col;
		return formula;
	},
	onAggregationObjectTypesComboboxChange: function(combobox, newValue, oldValue, eOpts) {
		var objectTypeParams = [];
		objectTypeParams.push(newValue);
		MYOCD.controller.viewTemplate.ViewLibraryStoreController.loadAvailableAttributesOfObjectTypes(objectTypeParams, this.getNewViewTemplateWithTabsAggregationsEditor());

	},
	onAddKeyWordBtnClick: function() {
		console.log(MYOCD.SharedData.aggregationOperands);
		console.log(MYOCD.SharedData.aggregationOperators);
		if ((MYOCD.SharedData.aggregationOperands.length + 1 - MYOCD.SharedData.aggregationOperators.length) > 1) {
			return;
		}
		if (!this.getNewViewTemplateWithTabsAggregationsEditor().down('combobox[name="aggregationAvailableFields"]').getValue() 
			|| this.getNewViewTemplateWithTabsAggregationsEditor().down('combobox[name="aggregationAvailableFields"]').getValue().length == 0) {
			return;
		}
		var newOperand = new Object();
		newOperand.objectType = new Object();
		newOperand.objectType.id = this.getNewViewTemplateWithTabsAggregationsEditor().down('combobox[name="aggregationObjectTypes"]').getValue();
		newOperand.objectType.fieldName = this.getNewViewTemplateWithTabsAggregationsEditor().down('combobox[name="aggregationAvailableFields"]').getValue();
		MYOCD.SharedData.aggregationOperands.push(newOperand);
		var formula = this.formulaProcess();
		this.getNewViewTemplateWithTabsAggregationsEditor().down('textarea[name="aggregationFormula"]').setValue(formula);
	},
	onAddFormulaBtnClick: function() {
		if ((MYOCD.SharedData.aggregationOperands.length - (MYOCD.SharedData.aggregationOperators.length + 1)) < 0) {
			return;
		}
		MYOCD.SharedData.aggregationOperators.push(this.getNewViewTemplateWithTabsAggregationsEditor().down('combobox[name="formulaOperator"]').getValue());
		var formula = this.formulaProcess();
		this.getNewViewTemplateWithTabsAggregationsEditor().down('textarea[name="aggregationFormula"]').setValue(formula);
	},
	onFormulaAddValueBtnClick: function() {
		if (this.getNewViewTemplateWithTabsAggregationsEditor().down('textfield[name="formularValue"]').getValue().trim().length == 0) {
			return;
		}
		if ((MYOCD.SharedData.aggregationOperands.length + 1 - MYOCD.SharedData.aggregationOperators.length) > 1) {
			return;
		}
		var newOperand = new Object();
		newOperand.value = this.getNewViewTemplateWithTabsAggregationsEditor().down('textfield[name="formularValue"]').getValue().trim();
		MYOCD.SharedData.aggregationOperands.push(newOperand);
		var formula = this.formulaProcess();
		this.getNewViewTemplateWithTabsAggregationsEditor().down('textarea[name="aggregationFormula"]').setValue(formula);
	},
	onClearFunctionBtnClick: function() {
		MYOCD.SharedData.aggregationOperands = [];
		MYOCD.SharedData.aggregationOperators = [];
		this.getNewViewTemplateWithTabsAggregationsEditor().down('textarea[name="aggregationFormula"]').setValue('');
	},
	onAddAggregationBtnClick: function() {
		// var aggregationName = this.getNewViewTemplateWithTabsAggregationsEditor().down('textfield[name="aggregationName"]').getValue().trim();
		var aggregationName = this.getNewViewTemplateWithTabsAggregationsEditor().down('combobox[name="aggregationOperator"]').getValue();
		// if (aggregationName.length == 0) {
		// 	Ext.Msg.alert('Error!', 'Please enter aggregation name');
		// 	return;
		// }
		if (!this.getNewViewTemplateWithTabsAggregationsEditor().down('combobox[name="aggregationAvailableFields"]').getValue() 
			|| this.getNewViewTemplateWithTabsAggregationsEditor().down('combobox[name="aggregationAvailableFields"]').getValue().length == 0) {
			return;
		}
		var newAggregation = new Object();
		newAggregation.name = aggregationName;
		newAggregation.operator = this.getNewViewTemplateWithTabsAggregationsEditor().down('combobox[name="aggregationOperator"]').getValue();
		var availableField = this.getNewViewTemplateWithTabsAggregationsEditor().down('combobox[name="aggregationAvailableFields"]').getValue(); 
		var radioTypeValue = this.getNewViewTemplateWithTabsAggregationsEditor().down('radiogroup[name="radioTypeGroup"]').getValue().typeRadio;
		var objectTypeId = this.getNewViewTemplateWithTabsAggregationsEditor().down('combobox[name="aggregationObjectTypes"]').getValue();
		var objectType = this.getNewViewTemplateWithTabsAggregationsEditor().down('combobox[name="aggregationObjectTypes"]').findRecordByValue(objectTypeId);
		var formula = radioTypeValue == 'primary' ? '_{'+availableField+'}' : '_{'+objectTypeId+'::'+availableField+'}';
		newAggregation.objectTypeId = objectTypeId;
		newAggregation.objectTypeName = objectType.data.name;
		newAggregation.formula = formula;
		newAggregation.column = availableField;
		newAggregation.display_column = radioTypeValue == 'primary' ? availableField : objectTypeId+'::'+availableField;
		MYOCD.SharedData.aggregations.push(newAggregation);
		Ext.getStore('viewTemplate.Aggregations').add(newAggregation);
	},
	onRadioTypeGroupChange: function( radiogroup, newValue, oldValue, eOpts) {
		if (newValue.typeRadio == 'primary') {
			Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').removeAll();
			Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').add(MYOCD.SharedData.primaryObjectTypes);
		} else {
			Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').removeAll();
			Ext.getStore('viewTemplate.NewViewTemplateObjectTypes').add(MYOCD.SharedData.secondaryObjectTypes);
		}
		Ext.getStore('viewTemplate.AvailableFields').removeAll();
	}
});