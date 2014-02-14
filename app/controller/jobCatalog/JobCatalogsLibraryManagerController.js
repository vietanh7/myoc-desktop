Ext.define('MYOCD.controller.jobCatalog.JobCatalogsLibraryManagerController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'main',
			selector: 'main'
		},
		{
			ref: 'jobCatalogsTab',
			selector: 'jobCatalogsTab'
		},
		{
			ref: 'jobCatalogsLibManager',
			selector: 'jobCatalogsLibManager'
		},
		{
			ref: 'jobCatalogsCategoriesTree',
			selector: 'jobCatalogsLibManager treepanel[name="jobCatalogsCategoriesTree"]'
		},
		{
			ref: 'newJob',
			selector: 'newJob'
		},
		{
			ref: 'editJobCatalogCategory',
			selector: 'editJobCatalogCategory'
		},
		{
			ref: 'jobAttributes',
			selector: 'jobAttributes'
		},
		{
			ref: 'jobOwnedAtts',
			selector: 'jobOwnedAtts'
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
			'jobCatalogsLibManager button[name="jobCatalogsLibsBackButton"]': {
				click: this.onJobCatalogsLibsBackButtonClick
			},
			'jobCatalogsLibManager treepanel[name="jobCatalogsCategoriesTree"]': {
				render: this.onJobCatalogsCategoriesTreeRender,
				itemclick: this.onJobCatalogsCategoriesTreeItemClick,
				itemexpand: this.onJobCatalogsCategoriesTreeItemExpand,
				itemcontextmenu: this.onJobCatalogsCategoriesTreeItemContext,
				containercontextmenu: this.onJobCatalogsCategoriesTreeContextMenu,
				edit: this.onJobCatalogsCategoriesTreeEdit,
				canceledit: this.onJobCatalogsCategoriesTreeCancelEdit
			},
			'jobCatalogsLibManager tool[name="addNewJobCatalogCategoryTool"]': {
				click: this.onAddNewJobCatalogCategoryToolClick
			},
			'jobCatalogsLibManager dataview[name="jobsDataView"]': {
				itemcontextmenu: this.onJobsDataViewItemContextMenu,
				containercontextmenu: this.onJobsDataViewContextMenu,
				itemdblclick: this.onJobDataViewItemDblClick,
				render: this.onJobDataViewRender,
				itemclick: this.onJobsDataViewItemClick
			},
			'jobCatalogsLibManager tool[name="addNewJobTool"]' : {
				click: this.onAddNewJobToolClick
			},
			'jobCatalogsLibManager tool[name="jobCatalogsLibraryToggleViewTool"]': {
				click: this.onJobCatalogsLibraryToggleViewToolClick
			},
			'jobCatalogsLibManager grid[name="jobsGrid"]': {
				itemcontextmenu: this.onJobsDataViewItemContextMenu,
				containercontextmenu: this.onJobsDataViewContextMenu,
				itemdblclick: this.onJobDataViewItemDblClick,
				render: this.onJobGridRender,
				itemclick: this.onJobsDataViewItemClick
			},
			'editJobCatalogCategory button[name="updateJobCatalogCategoryBtn"]': {
				click: this.onUpdateJobCatalogCategoryBtnClick
			},
			'jobOwnedAtts button[name="createJobAttBtn"]': {
				click: this.onCreateJobAttBtnClick
			},
			'jobOwnedAtts grid[name="jobOwnedAttsGrid"]': {
				render: this.onJobOwnedAttsGridRender,
				itemcontextmenu: this.onJobOwnedAttsGridItemContextMenu,
				edit: this.onJobOwnedAttsGridEdit,
				beforeedit: this.onJobOwnedAttsGridBeforeEdit
			},
			'jobOwnedAtts': {
				removeinheritedattribute: this.onJobOwnedAttsRemoveInheritedAttribute
			},
			'jobCatalogsLibManager treepanel tool[name="jobCatalogCategoryAuthorTool"]': {
				click: this.onJobCatalogCategoryAuthorToolClick
			},
			'jobCatalogsLibManager tool[name="jobAuthorTool"]': {
				click: this.onJobAuthorToolClick
			} 
		});
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
	onJobCatalogsLibsBackButtonClick: function() {
		this.getJobCatalogsTab().down('grid[name="jobCatalogLibrariesGrid"]').setVisible(true);
		this.getJobCatalogsTab().down('jobCatalogsLibManager').setVisible(false);
		MYOCD.SharedData.currentJobCatalogsCategory = null;
		Ext.getStore('jobCatalog.Jobs').removeAll();
		Ext.getStore('jobCatalog.JobCatalogsCategoriesTreeStore').setRootNode(null);
		Ext.getStore('jobCatalog.JobCatalogsCategoriesTreeStore').removeAll();
	},
	onJobCatalogsCategoriesTreeRender: function( treePanel, eOpts ) {
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
	        	MYOCD.SharedData.currentJobCategoryTreeDropNode = record;
	        	if(data.jobData) {
	        		treePanel.getSelectionModel().select(record);
	        		var jobCatalogStoreCtl = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
	        		jobCatalogStoreCtl.moveJob(data.jobData.id, record, me.getJobCatalogsTab());
	        		return true;
	        	} else {
		        	return false
	        	}
	            return true;
	        }
	    });
	},
	onJobCatalogsCategoriesTreeItemClick: function( treePanel, record, item, index, e, eOpts )  {
	    MYOCD.SharedData.currentJobCatalogsCategory = record;
		var jobCatalogStoreCtl = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
		
		if(record.get('id')!=='root') {
			jobCatalogStoreCtl.loadJobsOfJobCatalogsCategory(record.get('id'));
		} else {
			jobCatalogStoreCtl.loadJobsOfJobCatalogsLib(MYOCD.SharedData.currentJobCatalogLibId);
		}
		//MYOCD.SharedData.currentJob = null;
    },
    onJobCatalogsCategoriesTreeItemExpand: function( categoryNode, eOpts ) {
		MYOCD.SharedData.currentJobCatalogsCategory = categoryNode;
		var jobCatalogStoreCtl = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
		if(categoryNode.data.id !== 'root') {
			jobCatalogStoreCtl.loadJobsOfJobCatalogsCategory(categoryNode.data.id);
			jobCatalogStoreCtl.loadCategoriesOfJobCatalogsCategory(categoryNode.data.id, categoryNode);
		} else {
			jobCatalogStoreCtl.loadJobsOfJobCatalogsLib(MYOCD.SharedData.currentClassificationsLibId);
		}
		//MYOCD.SharedData.currentJob = null;
	},
	onJobCatalogsCategoriesTreeItemContext: function( treePanel, record, item, index, e, eOpts ) {
		var me = this;
		MYOCD.SharedData.currentJobCatalogsCategoryNodeContextMenu = record;
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
				MYOCD.SharedData.AddingChildOnJobCatalogNode = record;
				treePanel.ownerCt.getPlugin('cellEditingPlugin').startEdit(newRecord, treePanel.ownerCt.columns[0]);
			});
		}
		var editCateFunc = function() {
			if(me.getEditJobCatalogCategory()) {
				return;
			}
			var popup = Ext.create('MYOCD.view.jobCatalog.EditJobCatalogCategory');
			popup.down('textfield[name="jobCatalogCategoryName"]').setValue(record.get('name'));
			popup.down('textfield[name="jobCatalogCategoryDesc"]').setValue(record.get('description'));
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
					    var jobCatalogStoreCtl = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
					    jobCatalogStoreCtl.deleteJobCatalogsCategory();
				    }
			    }
			});
		}
		var copyCateFunc = function() {
			MYOCD.SharedData.jobCategorySourceNode = record;
			MYOCD.SharedData.jobCategorySourceNode.isCut = false;
		}
		var cutCateFunc = function() {
			MYOCD.SharedData.jobCategorySourceNode = record;
			treePanel.ownerCt.getView().addRowCls(record,'opacity-treenode');
			MYOCD.SharedData.currentJobCategoryTree = treePanel;
			MYOCD.SharedData.jobCategorySourceNode.isCut = true;
		}
		var pasteCateFunc = function() {
			var jobCatalogStoreCtl = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
			if(MYOCD.SharedData.jobCategorySourceNode.isCut) {
				jobCatalogStoreCtl.moveJobCategory(MYOCD.SharedData.jobCategorySourceNode, record, me.getJobCatalogsTab());
			} else {
				jobCatalogStoreCtl.copyJobCategory(MYOCD.SharedData.jobCategorySourceNode, record, me.getJobCatalogsTab());

			}
		}
		var securityFunc = function() {
			if (me.getAuthorizationDialog()) {
				me.getAuthorizationDialog().destroy();
			}		
			var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
			if (record.data.id == 'root') {
				popup.down('textfield[name="baseUrl"]').setValue(JOB_CATALOG_LIB_BASE_URL);
				popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentJobCatalogLibId);
			} else {
				popup.down('textfield[name="baseUrl"]').setValue(JOB_CATALOG_CATEGORY_BASE_URL);
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
						disabled: MYOCD.SharedData.jobCategorySourceNode == null,
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
						disabled: MYOCD.SharedData.jobCategorySourceNode == null,
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
	onJobCatalogsCategoriesTreeContextMenu: function(treePanel, e, eOpts) {
		e.stopEvent();
	},
	onJobCatalogsCategoriesTreeEdit: function(editor, e, eOpts) {
		var data = e.record.data;
	    var url;
	    if(data.parentId !== 'root') {
		    url = JOB_CATALOG_CATEGORY_BASE_URL + data.parentId + '/categories.json'
	    } else {
		    url = JOB_CATALOG_LIB_BASE_URL + MYOCD.SharedData.currentJobCatalogLibId  + '/categories.json'
	    }
	    var categoryName = data.name;
	    if(categoryName.trim().length == 0){
		    Ext.Msg.alert('Missing Category Name', 'Please enter category name');
		    e.record.stores[0].remove(e.record);
		    e.record.destroy();
		    return;
	    }
	    
	    var jobCatalogStoreCtl = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
		jobCatalogStoreCtl.addNewJobCatalogsCategory(url, categoryName, '', this.getJobCatalogsTab());
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onJobCatalogsCategoriesTreeCancelEdit: function(editor, e, eOpts) {
		e.record.stores[0].remove(e.record);
		e.record.destroy();
	},
	onAddNewJobCatalogCategoryToolClick: function() {
		var me = this;
		if(MYOCD.SharedData.currentJobCatalogsCategory == null || MYOCD.SharedData.currentJobCatalogsCategory.data.id == 'root') {
			var root = Ext.getStore('jobCatalog.JobCatalogsCategoriesTreeStore').getRootNode();
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
				MYOCD.SharedData.AddingChildOnJobCatalogNode = root;
				me.getJobCatalogsCategoriesTree().getPlugin('cellEditingPlugin').startEdit(
					newRecord, me.getJobCatalogsCategoriesTree().columns[0]);
			});
		} else {
			var record = MYOCD.SharedData.currentJobCatalogsCategory;
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
				MYOCD.SharedData.AddingChildOnJobCatalogNode = record;
				me.getJobCatalogsCategoriesTree().getPlugin('cellEditingPlugin').startEdit(
					newRecord, me.getJobCatalogsCategoriesTree().columns[0]);
			});
		}
	},
	onJobsDataViewItemContextMenu: function( dataview, record, item, index, e, eOpts ) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Edit',
					handler: function() {
						if(me.getNewJob()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.jobCatalog.NewJob');
						popup.setTitle('Edit Job');
						popup.down('textfield[name="jobId"]').setValue(record.get('id'));
						popup.down('textfield[name="jobName"]').setValue(record.get('name'));
						popup.down('textfield[name="jobDesc"]').setValue(record.get('description'));
						popup.down('button[name="updateJobBtn"]').hidden = false;
						popup.down('button[name="createNewJobBtn"]').hidden = true;
						popup.show();
						
						var callback = function(Job) {
							var parentType;
							if(Job.object_types.length > 0) {
								parentType = Job.object_types[0];
								popup.down('textfield[name="parentObjectTypeId"]').setValue(parentType.id);
								popup.down('textfield[name="parentObjectType"]').setValue(parentType.name);
							}
						}
						popup.show();
						var jobCatalogStoreCtl = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
						jobCatalogStoreCtl.getJobInfo(record.data.id, callback, popup);
					}
				},
				{
					text: 'Delete',
					handler: function() {
						Ext.Msg.confirm({
						    title: 'Delete Job',
						    msg: 'Do you really want to delete this Job?',
						    width: 200,
						    buttons: Ext.Msg.YESNO,
						    icon: Ext.Msg.QUESTION,
						    fn: function(btn) {
							    if(btn == 'yes') {
								    var jobCatalogStoreCtl = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
								    jobCatalogStoreCtl.deleteJob(record.get('id'), me.getJobCatalogsTab());
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
						popup.down('textfield[name="baseUrl"]').setValue(JOB_BASE_URL);
						popup.down('textfield[name="currentObjectId"]').setValue(record.data.id);
						popup.show(); 
					}
				}
			]
		}).showAt(e.xy);
	},
	onJobsDataViewContextMenu: function(dataview, e, eOpts) {
		var me = this;
		e.stopEvent()
		var menu = new Ext.menu.Menu({
			items: [
				{
					text: 'Add New Job',
					handler: function() {
						if(me.getNewJob()) {
							return;
						}
						var popup = Ext.create('MYOCD.view.jobCatalog.NewJob');
						popup.show();
					}
				}
			]
		}).showAt(e.xy);
	},
	onJobDataViewItemDblClick: function( dataview, record, item, index, e, eOpts ) {
		if(this.getJobAttributes()) {
			return;
		}
		MYOCD.SharedData.currentJob = record.data;
		var popup = Ext.create('MYOCD.view.jobCatalog.JobAttributes');
		popup.show();
		var jobCatalogStoreCtl = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
		jobCatalogStoreCtl.loadAttributeOfJob(record.get('id'), popup);
	},
	onAddNewJobToolClick: function() {
		var me = this;
		if(me.getNewJob()) {
			return;
		}
		var popup = Ext.create('MYOCD.view.jobCatalog.NewJob');
		popup.show();
	},
	onJobCatalogsLibraryToggleViewToolClick: function(tool) {
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
		this.getJobCatalogsLibManager().down('dataview[name="jobsDataView"]').setVisible(!isDataView);
		this.getJobCatalogsLibManager().down('grid[name="jobsGrid"]').setVisible(isDataView);
	},
	onUpdateJobCatalogCategoryBtnClick: function() {
		var categoryName = this.getEditJobCatalogCategory().down('textfield[name="jobCatalogCategoryName"]').getValue();
		var categoryDesc = this.getEditJobCatalogCategory().down('textfield[name="jobCatalogCategoryDesc"]').getValue();
		if(categoryName.length == 0) {
			return;
		}
		this.getEditJobCatalogCategory().destroy();

		var jobCatalogStoreCtl = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
		jobCatalogStoreCtl.editJobCatalogsCategory(categoryName, categoryDesc, this.getJobCatalogsTab());
	},
	onJobDataViewRender: function(dataview, eOpts) {
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
	                    jobData: dataview.getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onJobGridRender: function(grid, eOpts) {
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
	                    jobData: grid.getView().getRecord(sourceEl).data
	                }
	            }
	        },
	        getRepairXY: function() {
	            return this.dragData.repairXY;
	        }
	    });
	},
	onCreateJobAttBtnClick: function() {
		var attributeName = this.getJobOwnedAtts().down('textfield[name="jobAttName"]').getValue();
		var attributeDesc = this.getJobOwnedAtts().down('textfield[name="jobAttDesc"]').getValue(); 
		var attributeValueType = this.getJobOwnedAtts().down('combobox[name="jobAttValueType"]').getValue();
		var attributeHidden = this.getJobOwnedAtts().down('checkboxfield[name="jobAttHiddenCheck"]').getValue();
		var attributeConstant = this.getJobOwnedAtts().down('checkboxfield[name="jobAttConstantCheck"]').getValue();
		var attributeMandatory = this.getJobOwnedAtts().down('checkboxfield[name="jobAttMandatoryCheck"]').getValue();
		var attributeDeprecated = this.getJobOwnedAtts().down('checkboxfield[name="jobAttDeprecatedCheck"]').getValue();
		var attributeDefaultValue = this.getJobOwnedAtts().down('textfield[name="jobAttDefaultValue"]').getValue();
		
		if(attributeName.length == 0) {
			return;
		}

		var setActionPermission = this.getJobOwnedAtts().down('setActionPermission');
		var callBack = function(newAttribute) {
			setActionPermission.fireEvent('setPermissionForAction', setActionPermission, newAttribute.id);
		}
		
		var jobCatalogStoreCtl = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
		jobCatalogStoreCtl.addNewJobAttribute(MYOCD.SharedData.currentJob.id, attributeName, attributeDesc, attributeValueType, attributeHidden, 
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, this.getJobAttributes(), callBack);
	},
	onJobOwnedAttsGridRender: function(grid, e, eOpts) {
		this.createToolTipForGrid(grid);	
	},
	onJobOwnedAttsGridItemContextMenu: function( grid, record, item, index, e, eOpts ) {
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
								   var jobCatalogStoreCtl = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
								   jobCatalogStoreCtl.deleteJobAttribute( record.data.id, me.getJobAttributes());
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
	onJobOwnedAttsGridEdit: function(editor, e, eOpts) {
		var attribute = e.record.data;
		var jobCatalogStoreCtl = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
		jobCatalogStoreCtl.editJobAttribute(attribute.id, attribute.name, attribute.description, attribute.value_type, attribute.hidden, 
		attribute.constant, attribute.mandatory, attribute.deprecated, attribute.default_value, this.getJobAttributes());
	},
	onJobOwnedAttsGridBeforeEdit: function (editor, e, eOpts) {
		return !e.record.data.isInherited && !e.record.data.constant;
	},
	onJobOwnedAttsRemoveInheritedAttribute: function(grid, record) {
		var me = this;
		Ext.Msg.confirm({
		    title: 'Delete Attribute',
		    msg: 'Do you really want to delete this attribute?',
		    width: 200,
		    buttons: Ext.Msg.YESNO,
		    icon: Ext.Msg.QUESTION,
		    fn: function(btn) {
			    if(btn == 'yes') {
				   var jobCatalogStoreCtl = MYOCD.controller.jobCatalog.JobCatalogsStoreController;
				   jobCatalogStoreCtl.deleteJobAttribute( record.data.id, me.getJobAttributes());
			    }
		    }
		});
	},
	onJobCatalogCategoryAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}		
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		if (!MYOCD.SharedData.currentJobCatalogsCategory || MYOCD.SharedData.currentJobCatalogsCategory.data.id == 'root') {
			popup.down('textfield[name="baseUrl"]').setValue(JOB_CATALOG_LIB_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentJobCatalogLibId);
		} else {
			popup.down('textfield[name="baseUrl"]').setValue(JOB_CATALOG_CATEGORY_BASE_URL);
			popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentJobCatalogsCategory.data.id);
		}
		popup.show(); 

	},
	onJobsDataViewItemClick: function( dataview, record, item, index, e, eOpts ) {
		//MYOCD.SharedData.currentJob = record.data;
	},
	onJobAuthorToolClick: function() {
		if(this.getAuthorizationDialog()) {
			return;
		}
		if (!MYOCD.SharedData.currentJob) {
			return;
		}
		var popup = Ext.create('MYOCD.view.authorization.AuthorizationDialog');
		popup.down('textfield[name="baseUrl"]').setValue(JOB_BASE_URL);
		popup.down('textfield[name="currentObjectId"]').setValue(MYOCD.SharedData.currentJob.id);
		popup.show(); 
	} 
});