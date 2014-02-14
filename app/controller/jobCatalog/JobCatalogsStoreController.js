Ext.define('MYOCD.controller.jobCatalog.JobCatalogsStoreController',{
	extend: 'Ext.app.Controller',
	singleton: true,
	loadJobCatalogsLibs: function(companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Job Catalogs libraries');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/joblibs.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                var JobData = Ext.decode(data.responseText);
                Ext.getStore('jobCatalog.JobCatalogLibs').loadRawData(JobData);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading Job catalogs libraries failure');
			}
		});
	},
	addNewJobCatalogsLib: function(libraryName, libraryDesc, libraryAccess, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating New Job Catalog Library');
		}
		Ext.Ajax.request({
			url: COMPANIES_BASE_URL + companyId + '/joblibs.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				job_catalog: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadJobCatalogsLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Create new Job catalog library failure');
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	editJobCatalogsLib: function(libraryName, libraryDesc, libraryAccess, libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Job Catalog Library');
		}
		Ext.Ajax.request({
			url: JOB_CATALOG_LIB_BASE_URL + libraryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				job_catalog: {
					name: libraryName,
					description: libraryDesc,
					access: libraryAccess
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
                me.loadJobCatalogsLibs(companyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('update Job catalog  library failure');
			}
		});
	},
	deleteJobCatalogsLib: function(libraryId, companyId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Job Catalog Library ...');
		}
		Ext.Ajax.request({
			url: JOB_CATALOG_LIB_BASE_URL + libraryId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadJobCatalogsLibs(companyId, onView);			
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Delete Job catalog  library failure');			
			}
		});	
	},
	loadCategoriesOfJobCatalogsLib: function(libraryId, libraryName, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Job Catalog Categories ...');
		}
		Ext.Ajax.request({
			url: JOB_CATALOG_LIB_BASE_URL + libraryId + '/categories.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var categoryData = Ext.decode(data.responseText);
				Ext.getStore('jobCatalog.JobCatalogsCategoriesTreeStore').setRootNode(
					{
						name: libraryName,
						children: categoryData,
						expanded: true
					}
				) 
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Load Job catalog categories failure');			
			}
		});
	},
	loadCategoriesOfJobCatalogsCategory: function(categoryId, categoryTreeNode, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Job Catalog Categories ...');
		}
		Ext.Ajax.request({
			url: JOB_CATALOG_CATEGORY_BASE_URL + categoryId + '/categories.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var categoryData = Ext.decode(data.responseText);
				if(categoryData.length == 0) {
					return;
				}
				categoryTreeNode.removeAll();
				categoryTreeNode.appendChild(categoryData);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Load Job Catalog categories failure');			
			}
		});
	},
	loadJobsOfJobCatalogsLib: function(libraryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Jobs ...');
		}
		Ext.Ajax.request({
			url: JOB_CATALOG_LIB_BASE_URL + libraryId + '/jobs.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var JobData = Ext.decode(data.responseText);
				Ext.getStore('jobCatalog.Jobs').loadRawData(JobData);
				Ext.getStore('jobCatalog.Jobs').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading Jobs failure');			
			}
		});
	},
	loadJobsOfJobCatalogsCategory: function(categoryId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Jobs ...');
		}
		Ext.Ajax.request({
			url: JOB_CATALOG_CATEGORY_BASE_URL + categoryId + '/jobs.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var classificationData = Ext.decode(data.responseText);
				Ext.getStore('jobCatalog.Jobs').loadRawData(classificationData);
				Ext.getStore('jobCatalog.Jobs').sort([
	            	{property: 'name', direction: 'ASC'}
	            ]);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading Jobs failure');			
			}
		});
	},
	addNewJobCatalogsCategory: function(url, categoryName, categoryDesc, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Job Catalog Category ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				job_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.AddingChildOnJobCatalogNode.data.id !== 'root') {
					var node = MYOCD.SharedData.AddingChildOnJobCatalogNode;
					node.expand(false, function() {
						me.loadCategoriesOfJobCatalogsCategory(node.data.id, node, onView);
					});
				} else {
					me.loadCategoriesOfJobCatalogsLib(
						MYOCD.SharedData.currentJobCatalogLibId, 
						MYOCD.SharedData.AddingChildOnJobCatalogNode.data.name, 
						onView);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Create Job catalog category failure');			
			}
		});
	},
	editJobCatalogsCategory: function(categoryName, categoryDesc, onView){
		var me = this;
		if(onView) {
			onView.setLoading('Updating Jobs Category ...');
		}
		var categoryId = MYOCD.SharedData.currentJobCatalogsCategoryNodeContextMenu.data.id;
		Ext.Ajax.request({
			url: JOB_CATALOG_CATEGORY_BASE_URL + categoryId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				job_category: {
					name: categoryName,
					description: categoryDesc
				}
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				MYOCD.SharedData.currentJobCatalogsCategoryNodeContextMenu.set('name', categoryName);
				MYOCD.SharedData.currentJobCatalogsCategoryNodeContextMenu.set('description', categoryDesc);
				MYOCD.SharedData.currentJobCatalogsCategoryNodeContextMenu.commit();
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update Jobs category failure');			
			}
		});

	},
	deleteJobCatalogsCategory: function(onView){
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Jobs Category ...');
		}
		var categoryId = MYOCD.SharedData.currentJobCatalogsCategoryNodeContextMenu.data.id;
		var deleteNode = MYOCD.SharedData.currentJobCatalogsCategoryNodeContextMenu;
		Ext.Ajax.request({
			url: JOB_CATALOG_CATEGORY_BASE_URL + categoryId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var store = deleteNode.stores[0];
				store.remove (deleteNode);
				deleteNode.destroy();
				if(deleteNode == MYOCD.SharedData.currentJobCatalogsCategory) {
					MYOCD.SharedData.currentJobCatalogsCategory = null;
					Ext.getStore('JobCatalog.Jobs').removeAll();
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update Jobs category failure');			
			}
		});
	},
	addNewJob: function(url, JobName, JobDesc, objectTypeId, objectTypeVersion, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Creating Job ...');
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				job: {
					name: JobName,
					description: JobDesc				
				},
				object_type_id: objectTypeId,
				version_id: objectTypeVersion
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentJobCatalogsCategory == null || MYOCD.SharedData.currentJobCatalogsCategory.data.id == 'root') {
					me.loadJobsOfJobCatalogsLib(MYOCD.SharedData.currentJobCatalogLibId, onView);
					
				} else {
					me.loadJobsOfJobCatalogsCategory(MYOCD.SharedData.currentJobCatalogsCategory.data.id, onView);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Create Job failure');			
			}
		});
	},
	editJob: function(JobId, JobName, JobDesc, objectTypeId, objectTypeVersion, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Updating Job ...');
		}
		Ext.Ajax.request({
			url: JOB_BASE_URL + JobId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				job: {
					name: JobName,
					description: JobDesc
				},
				object_type_id: objectTypeId,
				version_id: objectTypeVersion
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentJobCatalogsCategory == null || MYOCD.SharedData.currentJobCatalogsCategory.data.id == 'root') {
					me.loadJobsOfJobCatalogsLib(MYOCD.SharedData.currentJobCatalogLibId, onView);
					
				} else {
					me.loadJobsOfJobCatalogsCategory(MYOCD.SharedData.currentJobCatalogsCategory.data.id, onView);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Update Job failure');			
			}
		});
	},
	deleteJob: function(JobId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Job ...');
		}
		Ext.Ajax.request({
			url: JOB_BASE_URL + JobId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(MYOCD.SharedData.currentJobCatalogsCategory == null || MYOCD.SharedData.currentJobCatalogsCategory.data.id == 'root') {
					me.loadJobsOfJobCatalogsLib(MYOCD.SharedData.currentJobCatalogLibId, onView);
					
				} else {
					me.loadJobsOfJobCatalogsCategory(MYOCD.SharedData.currentJobCatalogsCategory.data.id, onView);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Delete Job failure');			
			}
		});
	},
	getJobInfo: function(JobId, callBack, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Job ...');
		}
		Ext.Ajax.request({
			url: JOB_BASE_URL + JobId + '.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				if(callBack) {
					callBack(Ext.decode(data.responseText));
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Load Job failure');			
			}
		});
	},
	loadAttributeOfJob: function(jobId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Loading Job Attributes ...');
		}
		Ext.Ajax.request({
			url: JOB_BASE_URL + jobId + '/attributes.json',
			method: 'GET',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				Ext.getStore('jobCatalog.JobAttributes').removeAll();
				var attributeData = Ext.decode(data.responseText);
				for(var i = 0; i < attributeData.attributes.length; i++) {
					var att = attributeData.attributes[i];
					att.isInherited = false;
					Ext.getStore('jobCatalog.JobAttributes').add(att);
				}
				for(var i = 0; i < attributeData.inherited_attributes.length; i++) {
					var att = attributeData.inherited_attributes[i];
					att.isInherited = true;
					Ext.getStore('jobCatalog.JobAttributes').add(att);
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log('Loading Job Attributes failure');			
			}
		});
	},
	addNewJobAttribute: function(jobId, attributeName, attributeDesc, attributeValueType, attributeHidden, 
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, onView, callBack) {
		
		var me = this;
		if(onView) {
			onView.setLoading('Creating Job Attribute ...');
		}
		Ext.Ajax.request({
			url: JOB_BASE_URL + jobId + '/attributes.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				attribute: {
					name: attributeName,
					description: attributeDesc,
					value_type: attributeValueType,
					hidden: attributeHidden,
					constant: attributeConstant,
					mandatory: attributeMandatory,
					deprecated: attributeDeprecated,
					default_value: attributeDefaultValue
				}	
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var newAttribute = Ext.decode(data.responseText);
				if (callBack) {
					callBack(newAttribute);
				}
				me.loadAttributeOfJob(jobId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Create Job Attribute failure');			
			}
		});
	},
	editJobAttribute: function(attributeId, attributeName, attributeDesc, attributeValueType, attributeHidden, 
		attributeConstant, attributeMandatory, attributeDeprecated, attributeDefaultValue, onView) {
		
		var me = this;
		if(onView) {
			onView.setLoading('Updating Job Attribute ...');
		}
		Ext.Ajax.request({
			url: ATTRIBUTE_BASE_URL + attributeId + '.json',
			method: 'PUT',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				attribute: {
					name: attributeName,
					description: attributeDesc,
					value_type: attributeValueType,
					hidden: attributeHidden,
					constant: attributeConstant,
					mandatory: attributeMandatory,
					deprecated: attributeDeprecated,
					default_value: attributeDefaultValue
				}	
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadAttributeOfJob(MYOCD.SharedData.currentJob.id, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Edit Job Attribute failure');			
			}
		});
	},
	deleteJobAttribute: function(attributeId, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Deleting Job Attribute ...');
		}
		Ext.Ajax.request({
			url: ATTRIBUTE_BASE_URL + attributeId + '.json',
			method: 'DELETE',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				me.loadAttributeOfJob(MYOCD.SharedData.currentJob.id, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
				console.log('Delete Job Attribute failure');			
			}
		});
	},
	copyJobCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			MYOCD.SharedData.jobCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Copying Job Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = JOB_CATALOG_CATEGORY_BASE_URL + sourceFeature.data.id + '/copy/' + MYOCD.SharedData.currentJobCatalogLibId + '.json';  
		} else {
			url = JOB_CATALOG_CATEGORY_BASE_URL + sourceCategory.data.id + '/copy/' + destCategory.data.id + '.json';
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				MYOCD.SharedData.jobCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfJobCatalogsLib(MYOCD.SharedData.currentJobCatalogLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfJobCatalogsCategory(destCategory.data.id, destCategory, onView)
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	moveJobCategory: function(sourceCategory, destCategory, onView) {
		var me = this;
		if(sourceCategory.data.id == destCategory.data.id || sourceCategory.parentNode.data.id ==  destCategory.data.id) {
			var treePanel = MYOCD.SharedData.currentJobCategoryTree;
			treePanel.ownerCt.getView().removeRowCls(MYOCD.SharedData.jobCategorySourceNode,'opacity-treenode');
			MYOCD.SharedData.jobCategorySourceNode = null;
			return;
		}
		if(onView) {
			onView.setLoading('Moving Job Category ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = JOB_CATALOG_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + MYOCD.SharedData.currentJobCatalogLibId + '.json';  
		} else {
			url = JOB_CATALOG_CATEGORY_BASE_URL + sourceCategory.data.id + '/move/' + destCategory.data.id + '.json';
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var store = MYOCD.SharedData.jobCategorySourceNode.stores[0];
				store.remove (MYOCD.SharedData.jobCategorySourceNode);
				MYOCD.SharedData.jobCategorySourceNode.destroy();
				if(MYOCD.SharedData.jobCategorySourceNode == MYOCD.SharedData.currentJobCatalogsCategory) {
					MYOCD.SharedData.currentJobCatalogsCategory = null;
					Ext.getStore('jobCatalog.Jobs').removeAll();
				}
				MYOCD.SharedData.jobCategorySourceNode = null;
				if(destCategory.data.id == 'root') {
                	me.loadCategoriesOfJobCatalogsLib(MYOCD.SharedData.currentJobCatalogLibId, destCategory.data.name, onView);
				} else {
					me.loadCategoriesOfJobCatalogsCategory(destCategory.data.id, destCategory, onView)
				}
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	moveJob: function(jobId, destCategory, onView) {
		var me = this;
		if(onView) {
			onView.setLoading('Moving Job ...');
		}
		var url;
		if(destCategory.data.id == 'root') {
			url = JOB_BASE_URL + jobId + '/move/' + MYOCD.SharedData.currentJobCatalogLibId + '.json';  
		} else {
			url = JOB_BASE_URL + jobId + '/move/' + destCategory.data.id + '.json';
		}
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				MYOCD.SharedData.currentJobCatalogsCategory = destCategory;
				if(MYOCD.SharedData.currentJobCatalogsCategory.data.id == 'root') {
                	me.loadJobsOfJobCatalogsLib(MYOCD.SharedData.currentJobCatalogLibId, onView);
				} else {
					me.loadJobsOfJobCatalogsCategory(MYOCD.SharedData.currentJobCatalogsCategory.data.id, onView);
				}
				
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	},
	importJobCatalogLibraries: function(libraryId, onView) {
		var me = this;
		if (onView) {
			onView.setLoading('Importing Library ...');
		}
		Ext.Ajax.request({
			url: JOB_CATALOG_LIB_BASE_URL + 'import.json',
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				library_ids: [libraryId]
			},
			success: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				console.log(data.responseText);
				me.loadJobCatalogsLibs(MYOCD.SharedData.currentCompanyId, onView);
			},
			failure: function(data) {
				if(onView) {
					onView.setLoading(false);
				}
				var error = Ext.decode(data.responseText);
				if (error.error) {
					Ext.Msg.alert('Error!', error.error.toString());
				}
			}
		});
	}     
});