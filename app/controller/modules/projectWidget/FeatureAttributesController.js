Ext.define('MYOCD.controller.modules.projectWidget.FeatureAttributesController',{
	extend: 'Ext.app.Controller',
	refs: [

	],
	mainXtype: '',
	featureOwnedAttributesGrid: 'grid[name="featureOwnedAttributesGrid"]',
	createNewAttributePanel: 'panel[name="createNewAttributePanel"]',
	getMainXtype: function() {
		var me = this;
		return Ext.ComponentQuery.query(me.mainXtype)[0];
	},
	getComponent: function(component) {
		var me = this;
		return Ext.ComponentQuery.query(me.mainXtype + ' ' + component)[0];
	},
	init: function() {
		var controller = new Object();
		controller[this.mainXtype + ' featureAttributesWidget button[name="createFeatureAttBtn"]'] = {
			click: this.onCreateFeatureAttBtnClick
		}
		controller[this.mainXtype + ' featureAttributesWidget grid[name="featureOwnedAttributesGrid"]'] = {
			render: this.onFeatureOwnedAttributesGridRender,
			itemcontextmenu: this.onFeatureOwnedAttributesGridItemContextMenu,
			beforeedit: this.onFeatureOwnedAttributesGridBeforeEdit,
			edit: this.onFeatureOwnedAttributesGridEdit,
		},
		this.application = MYOCD.SharedData.application;
		this.control(controller);
		MYOCD.NotifCenter.addObserverForEvent(this, 'ClickOnTreePanel', this.onClickOnTreePanelHandle);	
	},
	onClickOnTreePanelHandle: function(sender, param) {0
		var me = this;
		var treePanel = param.treepanel;
		var record = param.featureRecord;
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		var featureAttributesStore = me.getComponent(me.featureOwnedAttributesGrid).getStore();
		if(record.data.id == 'root') {
			if (featureAttributesStore) {
				featureAttributesStore.removeAll();
			}
			return;
		}
		
	    projectStoreController.loadFeatureAttributesWithStore(record.get('id'), featureAttributesStore);
	},
	onCreateFeatureAttBtnClick: function() {
		var createNewAttributePanel = this.getComponent(this.createNewAttributePanel);
		var attributeName = createNewAttributePanel.down('textfield[name="featureAttName"]').getValue();
		var attributeDesc = createNewAttributePanel.down('textfield[name="featureAttDesc"]').getValue(); 
		var attributeValueType = createNewAttributePanel.down('combobox[name="featureAttValueType"]').getValue();
		var attributeHidden = createNewAttributePanel.down('checkboxfield[name="featureAttHiddenCheck"]').getValue();
		var attributeConstant = createNewAttributePanel.down('checkboxfield[name="featureAttConstantCheck"]').getValue();
		var attributeMandatory = createNewAttributePanel.down('checkboxfield[name="featureAttMandatoryCheck"]').getValue();
		var attributeDeprecated = createNewAttributePanel.down('checkboxfield[name="featureAttDeprecatedCheck"]').getValue();
		var attributeDefaultValue = createNewAttributePanel.down('textfield[name="featureAttDefaultValue"]').getValue();
		
		if(attributeName.length == 0) {
			return;
		}
		var featureStore = this.getComponent(this.featureOwnedAttributesGrid).getStore();
		var setActionPermission = createNewAttributePanel.down('setActionPermission');
		var callBack = function(newAttribute) {
			setActionPermission.fireEvent('setPermissionForAction', setActionPermission, newAttribute.id);
		}
		
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectStoreController.addNewFeatureAttributeWithStore(MYOCD.SharedData.currentProjectFeature.data.id, attributeName, attributeDesc, attributeValueType, 
		attributeHidden, attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, this.getMainXtype(), callBack, featureStore);	
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
	onFeatureOwnedAttributesGridRender: function(grid, e, eOpts) {
		var store = new Ext.data.Store({
			model: 'MYOCD.model.project.FeatureAttribute',
			groupField: 'type_group'
		});
		grid.bindStore(store);
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
								   projectStoreController.deleteFeatureAttributeRecord( record, me.getMainXtype());
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
		var me = this;
		var featureId = me.getMainXtype().down('featureAttributesWidget').down('textfield[name=featureId]').getValue();
		var attribute = e.record.data;
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectStoreController.editFeatureAttributeValueWithStore(featureId, attribute.id, attribute.value, e.record.store, this.getMainXtype());
	}
});