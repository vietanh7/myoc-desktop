Ext.define('MYOCD.controller.project.GetItemsByViewController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'getItemsByView',
			selector: 'getItemsByView'
		},
		{
			ref: 'newViewTemplateWithTabs',
			selector: 'newViewTemplateWithTabs'
		},
		{
			ref: 'itemAttributeInView',
			selector: 'itemAttributeInView'
		}
	],
	init: function() {
		this.control({
			'getItemsByView': {
				show: this.onGetItemsByViewShow
			},
			'getItemsByView tool[name="editViewTemplateTool"]': {
				click: this.onEditViewTemplateToolClick
			},
			'getItemsByView tool[name="refreshViewTool"]': {
				click: this.onRefreshViewToolClick
			},
			'getItemsByView grid[name="viewItemGrid"]': {
				// itemclick: this.onViewItemGridItemClick,
				cellclick: this.onViewItemGridCellClick
			},
			'getItemsByView tool[name="printViewTemplateTool"]': {
				click: this.onPrintViewTemplateToolClick
			}
		});
	},
	capitaliseFirstLetter: function (string)
	{
		if (!string) return "";
    	return string.charAt(0).toUpperCase() + string.slice(1);
	},
	handleFeatureResult: function(groups, parentPanel, level) {
		level++;
		if (level > 5) {
			level = 5;
		}
		// var cls = "view-header-lever-"+level;
		// console.log ("cls: ", cls);
		var me = this;
		for (var key in groups) {
			console.log('-----property: ' + key + '-----')
			if (key.length == 0) continue;
			var panel = {
				xtype: 'panel',
				// title: parentPanel.title + ': ' + key,
				title: key,
				margin: '1 0 0 2',
				// flex: 1,
				// cls: cls,
				hidden: key.length == 0 ? true : false,
				level: level,
				collapsible: true,
				border: false,
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				listeners: {
					render: function() {
						var cls = "view-header-lever-"+(this.level + MYOCD.SharedData.difLevel);
						// console.log ("cls: ", cls);
						this.addCls(cls);
						if (this.topAggregation) {
							console.log("panel aggregations: ", this.topAggregation, this.needAggregationPanel);
							this.insert(0, this.needAggregationPanel);
						}
						if (this.level == 1 && cls != "view-header-lever-5") {
							this.addCls('view-top-level-border');
						}
					},
					collapse: function() {
						var topAggregationPanel = this.down('container[name="groupTopAggregation"]');
						if (!topAggregationPanel) {
							topAggregationPanel = this.down('container[name="groupAggregation"]');
						}
						console.log("panel collapse", topAggregationPanel.getEl().dom);
					},
					show: function() {
						var topAggregationPanel = this.header.down('container[name="groupTopAggregation"]');
						if (!topAggregationPanel) {
							topAggregationPanel = this.header.down('container[name="groupAggregation"]');
						}
					}
				},
				items: [
					// {
					// 	xtype: 'container',
					// 	html: '<font color="blue">'+parentPanel.title + ': ' + key+'</font>'
					// }
				]
			}
			var aggrParent = null;
			if (groups[key].aggregations && Object.keys(groups[key].aggregations).length > 0) {
				aggrParent = {
					xtype: 'container',
					name: 'groupAggregation',
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					items: []
				}				
			}
			if (level == 1) {
				parentPanel.items.push({
					xtype: 'container',
					height: 10
				});
			}
			parentPanel.items.push(panel);
			if (groups[key].field) {
				
				console.log('----------field name: ' + groups[key].field + '----------');
				var title = groups[key].field.split('::').length > 1 ? groups[key].field.split('::')[1] : groups[key].field.split('::')[0]
				var containerTitle = {
					xtype: 'container',
					layout: {
						type: 'hbox',
						align: 'stretch',
					},
					height: 30,
					html: '<font color="blue" size="2">Group: </font><font color="black" size="2">'+me.capitaliseFirstLetter(title)+'</font>'
				}
				var valuePanel = {
					xtype: 'container',
					margin: '1 0 0 2',
					title: me.capitaliseFirstLetter(title),
					// flex: 1,
					collapsible: true,
					border: false,
					layout: {
						type: 'vbox',
						align: 'stretch'
						// type: 'accordion'
					},
					items: [
						
					]
				}
				// panel.items.push(containerTitle);
				if (aggrParent) {
					console.log ("group aggregations: ", groups[key].aggregations);
					panel.topAggregation = groups[key].aggregations;
				}
				MYOCD.SharedData.currentParentPanel = panel;
				panel.items.push(valuePanel);
				me.handleFeatureResult(groups[key].groups, valuePanel, level);
			} else {
				console.log("got items: ",groups[key].items);
				console.log("columns: ", Object.keys(groups[key].items[0]));
				if (groups[key].items.length > 0) {
					var columnsLength = 0;
					var columns = [];
					var index = 0;
					for (var i = 0; i < groups[key].items.length; i++) {
						if (Object.keys(groups[key].items[i]).length > columnsLength) {
							columnsLength = Object.keys(groups[key].items[i]).length;
							index = i;
						}
					}
					for (var property in groups[key].items[index]) {
						var columnNames = property.split("::");
						if (columnNames.length > 1) {
							var columnName = columnNames.length == 3 ? groups[key].items[index][columnNames[0] + "::type_name"] + ' ' + columnNames[1] : columnNames[0];
							columns.push(columnName);
						} else {
							columns.push(columnNames[0]);
						}
					}
					console.log('columns fields:', columns);
					var store = Ext.create('Ext.data.Store',{
						fields: columns
					});

					var gridTitle = {
						xtype: 'grid',
						cls: 'mini-header',
						margin: '0 0 0 25',
						border: false,
						enableColumnHide: false,
						enableColumnMove: false,	
						enableColumnResize: false,							
						columns: [
						]
					}
					var grid = {
						// flex: 1,
						hideHeaders: true,
						margin: '0 0 0 25',
						// height: height,
						name: 'viewItemGrid',
						xtype: 'grid',
						store: store,
						border: false,						
						columns: [
						]
					}
					// create columns
					for (var property in groups[key].items[index]) {
						var columnNames = property.split("::");
						if (columnNames.indexOf('Id') != -1 || columnNames.indexOf('route') != -1 || columnNames.indexOf('type_name') != -1) {
							continue;
						}
						
						var columnName;
						if (columnNames.length == 1) {
							columnName = columnNames[0];
							gridTitle.columns.push({text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1, sortable: false});
							grid.columns.push({text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1});
						} else {
							var ix = parseInt(columnNames[columnNames.length-1]);
							columnName = columnNames.length == 3 ? groups[key].items[index][columnNames[0] + "::type_name"] + ' ' + columnNames[1] : columnNames[0];
							if (isNaN(ix) || ix < 0){
								gridTitle.columns.push({text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1, sortable: false});
								if (me.capitaliseFirstLetter(columnName).indexOf('Name') != -1) {
									grid.columns.push(
										{
											text: me.capitaliseFirstLetter(columnName), 
											dataIndex: columnName, 
											autoWidth: true, 
											flex: 1,
											xtype: 'templatecolumn',
											tpl: '<a href=#>{'+columnName+'}</a>'
										}
									);
								} else {
									grid.columns.push({text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1});
								}
							} else {
								gridTitle.columns[ix] = {text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1, sortable: false};
								if (me.capitaliseFirstLetter(columnName).indexOf('Name') != -1) {
									grid.columns[ix] = {
										text: me.capitaliseFirstLetter(columnName), 
										dataIndex: columnName, 
										autoWidth: true, 
										flex: 1,
										xtype: 'templatecolumn',
										tpl: '<a href=#>{'+columnName+'}</a>'
									}
								} else {
									grid.columns[ix] = {text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1};
								}
							}
							// var objectName = groups[key].items[index][columnNames[0] + "::type_name"];
							// gridTitle.columns.push({text: objectName + '-' + me.capitaliseFirstLetter(columnNames[1]), dataIndex: columnNames[1], autoWidth: true, flex: 1,  sortable: false});
							// grid.columns.push({text: objectName + '-' + me.capitaliseFirstLetter(columnNames[1]), dataIndex: columnNames[1], autoWidth: true, flex: 1});
						}
					}

					if (aggrParent) {
						var topAggregationPanel = {
							xtype: 'container',
							name: 'groupTopAggregation',
							layout: {
								type: 'hbox',
								align: 'stretch'
							},
							items: []
						}
						if (!MYOCD.SharedData.currentParentPanel) {
							topAggregationPanel = null;
						}
						for (var i = 0; i < gridTitle.columns.length; i++) {
							var notAddAgrr = true;
							for (var aggr in groups[key].aggregations) {
								console.log("childAggrkey: ", groups[key].aggregations[aggr]);
								if (topAggregationPanel) {
									console.log("parentPanelAggrkey: ", MYOCD.SharedData.currentParentPanel.topAggregation[aggr]);

								}
								var aggregations = groups[key].aggregations[aggr].display_column.split("::");
								// var aggrColumn = aggregations.length > 1 ? groups[key].items[index][aggregations[0] + "::type_name"] + ' ' + aggregations[1] : aggregations[0];
								var aggrColumn;
								if (aggregations.length > 1) {
									if (aggregations[0] != '0') {
										aggrColumn = groups[key].items[index][aggregations[0] + "::type_name"] + ' ' + aggregations[1];
									} else {
										aggrColumn = aggregations[1];
									}
								} else {
									aggrColumn = aggregations[0];
								}

								if (me.capitaliseFirstLetter(aggrColumn) == gridTitle.columns[i].text) {
									var aggregationContainer = {
										xtype: 'container',
										margin: '0 0 0 5',
										flex: 1,
										html: '<font color="gray" size="2">'+me.capitaliseFirstLetter(groups[key].aggregations[aggr].name.toString())+': ' + groups[key].aggregations[aggr].value + '</font>'
									}
									if (topAggregationPanel) {
										var topAggregationContainer = {
											xtype: 'container',
											margin: '0 0 0 5',
											flex: 1,
											html: '<font color="gray" size="2">'+me.capitaliseFirstLetter(groups[key].aggregations[aggr].name.toString())+': ' + MYOCD.SharedData.currentParentPanel.topAggregation[aggr].value + '</font>'
										}
										topAggregationPanel.items.push(topAggregationContainer);
									}
									aggrParent.items.push(aggregationContainer);
									notAddAgrr = false;
									break;
								}
							}
							if (notAddAgrr) {
								if (topAggregationPanel) {
									topAggregationPanel.items.push({xtype: 'container', flex: 1});
								}
								aggrParent.items.push({xtype: 'container', flex: 1});
							}
						}
						if (topAggregationPanel) {
							MYOCD.SharedData.currentParentPanel.needAggregationPanel = topAggregationPanel;
						}
					}
					console.log('grid columns', grid.columns);
					for (var i = 0; i < groups[key].items.length; i++) {
						var item = new Object(); 
						for (var property in groups[key].items[i]) {
							var columnNames = property.split("::");
							if (columnNames.length > 1) {
								var columnName = columnNames.length == 3 ? groups[key].items[index][columnNames[0] + "::type_name"] + ' ' + columnNames[1] : columnNames[0];
								item[columnName] = groups[key].items[i][property];
							} else {
								item[columnNames[0]] = groups[key].items[i][property];

							}
						}
						console.log('added item:', item);
						store.add(item);
					}
					// store.loadRawData(groups[key].items);
					// panel.items.push(gridTitle);
					if (MYOCD.SharedData.notAddedTitle) {
						MYOCD.SharedData.viewGridTitle = gridTitle;
						me.getGetItemsByView().insert(0, gridTitle);
						MYOCD.SharedData.notAddedTitle = false;
						if (MYOCD.SharedData.rootAggregation) {
							var rootAggrParent = {
								xtype: 'container',
								margin: '5 0 0 0',
								height: 30,
								layout: {
									type: 'hbox',
									align: 'stretch'
								},
								items: []
							}
							for (var i = 0; i < gridTitle.columns.length; i++) {
								var notAddAgrr = true;
								for (var aggr in MYOCD.SharedData.rootAggregation) {
									var aggregations = MYOCD.SharedData.rootAggregation[aggr].display_column.split("::");
									// var aggrColumn = aggregations.length > 1 ? result.results.items[index][aggregations[0] + "::type_name"] + ' ' + aggregations[1] : aggregations[0];
									var aggrColumn;
									if (aggregations.length > 1) {
										if (aggregations[0] != '0') {
											aggrColumn = result.results.items[index][aggregations[0] + "::type_name"] + ' ' + aggregations[1]
										} else {
											aggrColumn = aggregations[1];
										}
									} else {
										aggrColumn = aggregations[0];
									}
									if (me.capitaliseFirstLetter(aggrColumn) == gridTitle.columns[i].text) {
										var aggregationContainer = {
											xtype: 'container',
											margin: '0 0 0 5',
											flex: 1,
											html: '<font color="gray" size="2">'+me.capitaliseFirstLetter(MYOCD.SharedData.rootAggregation[aggr].name.toString())+': ' + MYOCD.SharedData.rootAggregation[aggr].value + '</font>'
										}
										rootAggrParent.items.push(aggregationContainer);
										notAddAgrr = false;
										break;
									}
								}
								if (notAddAgrr) {
									rootAggrParent.items.push({xtype: 'container', flex: 1});
								}
							}
							me.getGetItemsByView().insert(1, rootAggrParent);
						}
					}
					if (aggrParent) {
						panel.items.push(aggrParent);
					}
					panel.items.push(grid);
					panel.minHeight = grid.height + 60;
				}
				MYOCD.SharedData.difLevel = 5 - level;
			}
		}
	},
	onGetItemsByViewShow: function() {
		MYOCD.SharedData.notAddedTitle = true;
		var level = 0;
		var me = this;
		var getProduct = this.getGetItemsByView().down('textfield[name="getProduct"]').getValue();
		var projectId = this.getGetItemsByView().down('textfield[name="projectId"]').getValue();
		var featureId = this.getGetItemsByView().down('textfield[name="featureId"]').getValue();
		var viewId = this.getGetItemsByView().down('textfield[name="viewId"]').getValue();
		var callback = function(result) {
			var groups = [];
			console.log(Object.keys(result.results));
			console.log('----------root field name: ' + result.results.field + '----------');
			MYOCD.SharedData.rootAggregation = null;
			if (result.results.aggregations) {
				MYOCD.SharedData.rootAggregation = result.results.aggregations;
			}
			if (result.results.field) {
				var title = result.results.field.split('::').length > 1 ? result.results.field.split('::')[1] : result.results.field.split('::')[0];
				var panelTitle = {
					xtype: 'container',
					html: '<font color="blue" size="2">Group: </font><font color="black" size="2">'+me.capitaliseFirstLetter(title)+'</font>'
				}
				var panel = {
					xtype: 'container',
					name: 'mainContainer',
					cls: 'mini-header',
					// flex: 1,
					border: false,
					// minWidth: 1000,
					// minHeight: 1000,
					// autoScroll: true,
    				// overflow: 'auto',
					title: me.capitaliseFirstLetter(title),
					layout: {
						type: 'vbox',
						align: 'stretch',
						// type: 'accordion'
					},
					items: [
						
					]
				}
				me.handleFeatureResult(result.results.groups, panel, level);
				// me.getGetItemsByView().add(panelTitle);
				me.getGetItemsByView().down('container[name="mainViewItemContainer"]').add(panel);
				var dif = 5 - level;
				for (var i = level; i>=1; i--) {
					var queryString = 'panel[level="' + i + '"]';
					console.log("queryString: ", queryString);
					var components = me.getGetItemsByView().down(queryString);
					console.log("components: ", components);
					for (var j = 0; j < components.length; j++) {
						var clsName = "view-header-lever-"+ (level+dif);
						components[j].addCls(clsName);
					}
				}
			} else {
				var containerTitle = {
					xtype: 'container',
					layout: {
						type: 'vbox',
						align: 'stretch',
					},
					items: []
				}
				var valuePanelTitle = {
					xtype: 'container',
					html: '<font color="gray" size="4">Items: </font>',
					style: 'border:2px solid green;border-top: none; border-left: none; border-right: none;'
				}
				// containerTitle.items.push(valuePanelTitle);
				var aggrParent = null;
				if (result.results.aggregations && Object.keys(result.results.aggregations).length > 0) {
					aggrParent = {
						xtype: 'container',
						margin: '5 0 0 0',
						height: 30,
						layout: {
							type: 'hbox',
							align: 'stretch'
						},
						items: []
					}
				}
				if (result.results.items.length > 0) {
					var columnsLength = 0;
					var columns = [];
					var index = 0;
					for (var i = 0; i < result.results.items.length; i++) {
						if (Object.keys(result.results.items[i]).length > columnsLength) {
							columnsLength = Object.keys(result.results.items[i]).length;
							index = i;
						}
					}
					for (var property in result.results.items[index]) {
						var columnNames = property.split("::");
						if (columnNames.length == 1) {
							columns.push(columnNames[0]);
						} else {
							var columnName = columnNames.length == 3 ? result.results.items[index][columnNames[0] + "::type_name"] + ' ' + columnNames[1] : columnNames[0];
							columns.push(columnName);
						}
					}
					var store = Ext.create('Ext.data.Store', {
					    fields: columns,
					});

					var gridTitle = {
						margin: '0 0 0 25',
						xtype: 'grid',
						cls: 'mini-header',
						border: false,
						enableColumnHide: false,
						enableColumnMove: false,	
						enableColumnResize: false,							
						columns: [
						]
					}
					var height = result.results.items.length*60;
					console.log('grid height', height);
					var grid = {
						// flex: 1,
						xtype: 'grid',
						cls: 'mini-header',
						name: 'viewItemGrid',
						hideHeaders: true,
						margin: '0 0 0 25',
						// height: height,
						store: store,
						border: false,						
						columns: [
						]
					}
					// create columns
					for (var property in result.results.items[index]) {
						var columnNames = property.split("::");
						console.log("processing columnNames: ", columnNames);
						if (columnNames.indexOf('Id') != -1 || columnNames.indexOf('route') != -1 || columnNames.indexOf('type_name') != -1) {
							continue;
						}
						
						var columnName;
						if (columnNames.length == 1) {
							columnName = columnNames[0];
							gridTitle.columns.push({text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1, sortable: false});
							grid.columns.push({text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1});
						} else {
							// var objectName = result.results.items[index][columnNames[0] + "::type_name"];
							// gridTitle.columns.push({text: objectName + '-' + me.capitaliseFirstLetter(columnNames[0]), dataIndex: columnNames[0], autoWidth: true, flex: 1, sortable: false});
							// grid.columns.push({text: objectName + '-' + me.capitaliseFirstLetter(columnNames[0]), dataIndex: columnNames[0], autoWidth: true, flex: 1});

							columnName = columnNames.length == 3 ? result.results.items[index][columnNames[0] + "::type_name"] + ' ' + columnNames[1] : columnNames[0];
							var ix = parseInt(columnNames[columnNames.length-1]);
							if (isNaN(ix) || ix < 0){
								gridTitle.columns.push({text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1, sortable: false});
								if (me.capitaliseFirstLetter(columnName).indexOf('Name') != -1) {
									grid.columns.push(
										{
											text: me.capitaliseFirstLetter(columnName), 
											dataIndex: columnName, 
											autoWidth: true, 
											flex: 1,
											xtype: 'templatecolumn',
											tpl: '<a href=#>{'+columnName+'}</a>'
										}
									);
								} else {
									grid.columns.push({text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1});
								}
							} else {
								gridTitle.columns[ix] = {text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1, sortable: false};
								if (me.capitaliseFirstLetter(columnName).indexOf('Name') != -1) {
									grid.columns[ix] = {
										text: me.capitaliseFirstLetter(columnName), 
										dataIndex: columnName, 
										autoWidth: true, 
										flex: 1,
										xtype: 'templatecolumn',
										tpl: '<a href=#>{'+columnName+'}</a>'
									}
								} else {
									grid.columns[ix] = {text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1};
								}
							}
						}
						
							
					}
					if (aggrParent) {
						for (var i = 0; i < gridTitle.columns.length; i++) {
							var notAddAgrr = true;
							for (var aggr in result.results.aggregations) {
								var aggregations = result.results.aggregations[aggr].display_column.split("::");
								// var aggrColumn = aggregations.length > 1 ? result.results.items[index][aggregations[0] + "::type_name"] + ' ' + aggregations[1] : aggregations[0];
								var aggrColumn;
								if (aggregations.length > 1) {
									if (aggregations[0] != '0') {
										aggrColumn = result.results.items[index][aggregations[0] + "::type_name"] + ' ' + aggregations[1]
									} else {
										aggrColumn = aggregations[1];
									}
								} else {
									aggrColumn = aggregations[0];
								}
								if (me.capitaliseFirstLetter(aggrColumn) == gridTitle.columns[i].text) {
									var aggregationContainer = {
										xtype: 'container',
										margin: '0 0 0 5',
										flex: 1,
										html: '<font color="gray" size="3">'+me.capitaliseFirstLetter(result.results.aggregations[aggr].name.toString())+': ' + result.results.aggregations[aggr].value + '</font>'
									}
									aggrParent.items.push(aggregationContainer);
									notAddAgrr = false;
									break;
								}
							}
							if (notAddAgrr) {
								aggrParent.items.push({xtype: 'container', flex: 1});
							}
						}
					}
					console.log('grid columns', grid.columns);
					for (var i = 0; i < result.results.items.length; i++) {
						var item = new Object(); 
						for (var property in result.results.items[i]) {
							var columnNames = property.split("::");
							if (columnNames.length > 1) {
								var columnName = columnNames.length == 3 ? result.results.items[index][columnNames[0] + "::type_name"] + ' ' + columnNames[1] : columnNames[0];
								item[columnName] = result.results.items[i][property];
							} else {
								item[columnNames[0]] = result.results.items[i][property];

							}
						}
						console.log('added item:', item);
						store.add(item);
					}
					me.getGetItemsByView().down('container[name="mainViewItemContainer"]').add(containerTitle);
					if (MYOCD.SharedData.notAddedTitle) {
						MYOCD.SharedData.viewGridTitle = gridTitle;
						me.getGetItemsByView().insert(0, gridTitle);
						MYOCD.SharedData.notAddedTitle = false;
						if (MYOCD.SharedData.rootAggregation) {
							var aggrParent = {
								xtype: 'container',
								margin: '5 0 0 0',
								height: 30,
								layout: {
									type: 'hbox',
									align: 'stretch'
								},
								items: []
							}
							for (var i = 0; i < gridTitle.columns.length; i++) {
								var notAddAgrr = true;
								for (var aggr in MYOCD.SharedData.rootAggregation) {
									var aggregations = MYOCD.SharedData.rootAggregation[aggr].display_column.split("::");
									// var aggrColumn = aggregations.length > 1 ? result.results.items[index][aggregations[0] + "::type_name"] + ' ' + aggregations[1] : aggregations[0];
									var aggrColumn;
									if (aggregations.length > 1) {
										if (aggregations[0] != '0') {
											aggrColumn = result.results.items[index][aggregations[0] + "::type_name"] + ' ' + aggregations[1]
										} else {
											aggrColumn = aggregations[1];
										}
									} else {
										aggrColumn = aggregations[0];
									}
									if (me.capitaliseFirstLetter(aggrColumn) == gridTitle.columns[i].text) {
										var aggregationContainer = {
											xtype: 'container',
											margin: '0 0 0 5',
											flex: 1,
											html: '<font color="gray" size="3">'+me.capitaliseFirstLetter(MYOCD.SharedData.rootAggregation[aggr].name.toString())+': ' + MYOCD.SharedData.rootAggregation[aggr].value + '</font>'
										}
										aggrParent.items.push(aggregationContainer);
										notAddAgrr = false;
										break;
									}
								}
								if (notAddAgrr) {
									aggrParent.items.push({xtype: 'container', flex: 1});
								}
							}
							me.getGetItemsByView().insert(1, aggrParent);
						}
					}
					if (aggrParent) {
						me.getGetItemsByView().down('container[name="mainViewItemContainer"]').add(aggrParent);
					}
					me.getGetItemsByView().down('container[name="mainViewItemContainer"]').add(grid);
				}
			}
		}
		// if (getProduct.length == 0) {
		// 	if (projectId.length > 0) {
		// 		MYOCD.controller.project.ProjectsStoreController.getFeaturesOfProjectByViews(projectId, viewId, this.getGetItemsByView(), callback);
		// 	} else {
		// 		MYOCD.controller.project.ProjectsStoreController.getFeaturesOfFeatureByViews(featureId, viewId, this.getGetItemsByView(), callback);
		// 	}
		// } else {
		// 	if (projectId.length > 0) {
		// 		MYOCD.controller.project.ProjectsStoreController.getProductItemsOfProjectByViews(projectId, viewId, this.getGetItemsByView(), callback);
		// 	} else {
		// 		MYOCD.controller.project.ProjectsStoreController.getProductItemsOfFeatureByViews(featureId, viewId, this.getGetItemsByView(), callback);
		// 	}
		// }
		if (projectId.length > 0) {
			MYOCD.controller.project.ProjectsStoreController.getItemsByView(projectId, viewId, this.getGetItemsByView(), callback);
		} else {
			MYOCD.controller.project.ProjectsStoreController.getItemsByView(featureId, viewId, this.getGetItemsByView(), callback);
		}
	},
	onEditViewTemplateToolClick: function() {
		var me = this;
		var templateId = this.getGetItemsByView().down('textfield[name="viewId"]').getValue();
		var templateName = this.getGetItemsByView().title;
		// this.getGetItemsByView().destroy();
		var getProduct = this.getGetItemsByView().down('textfield[name="getProduct"]').getValue();
		var projectId = this.getGetItemsByView().down('textfield[name="projectId"]').getValue();
		var featureId = this.getGetItemsByView().down('textfield[name="featureId"]').getValue();
		if(this.getNewViewTemplateWithTabs()) {
			this.getNewViewTemplateWithTabs().destroy();
		}
		MYOCD.SharedData.refreshAfterUpdateView = function() {
			console.log('trigger refresh view');
			me.getGetItemsByView().removeAll();
			me.getGetItemsByView().add([
				{
					xtype: 'textfield',
					name: 'getProduct',
					hidden: true,
					value: getProduct
				},
				{
					xtype: 'textfield',
					name: 'featureId',
					hidden: true,
					value: featureId
				},
				{
					xtype: 'textfield',
					name: 'projectId',
					hidden: true,
					value: projectId
				},
				{
					xtype: 'textfield',
					name: 'viewId',
					hidden: true,
					value: templateId
				},
				{
					xtype: 'container',
					name: 'mainViewItemContainer',
					autoScroll: true,
		    		overflow: 'auto',
		    		flex: 1,
					layout: {
						type: 'vbox',
						align: 'stretch'
					}
				}
			]);
			me.onGetItemsByViewShow();
			MYOCD.SharedData.refreshAfterUpdateView = null;
		}
		var popup = Ext.create('MYOCD.view.viewTemplate.NewViewTemplateWithTabs');
		popup.setTitle('Edit View Template');
		popup.down('textfield[name="viewTemplateId"]').setValue(templateId);
		popup.down('textfield[name="viewTemplateName"]').setValue(templateName);
		popup.down('button[name="updateViewTemplateBtn"]').hidden = false;
		popup.down('button[name="createNewViewTemplateBtn"]').hidden = true;
		popup.show();
	},
	onRefreshViewToolClick: function () {
		var me = this;
		var templateId = this.getGetItemsByView().down('textfield[name="viewId"]').getValue();
		var templateName = this.getGetItemsByView().title;
		// this.getGetItemsByView().destroy();
		var getProduct = this.getGetItemsByView().down('textfield[name="getProduct"]').getValue();
		var projectId = this.getGetItemsByView().down('textfield[name="projectId"]').getValue();
		var featureId = this.getGetItemsByView().down('textfield[name="featureId"]').getValue();
		console.log('trigger refresh view');
		me.getGetItemsByView().removeAll();
		me.getGetItemsByView().add([
			{
				xtype: 'textfield',
				name: 'getProduct',
				hidden: true,
				value: getProduct
			},
			{
				xtype: 'textfield',
				name: 'featureId',
				hidden: true,
				value: featureId
			},
			{
				xtype: 'textfield',
				name: 'projectId',
				hidden: true,
				value: projectId
			},
			{
				xtype: 'textfield',
				name: 'viewId',
				hidden: true,
				value: templateId
			},
			{
				xtype: 'container',
				name: 'mainViewItemContainer',
				autoScroll: true,
	    		overflow: 'auto',
	    		flex: 1,
				layout: {
					type: 'vbox',
					align: 'stretch'
				}
			}
		]);
		me.onGetItemsByViewShow();
	},
	onViewItemGridCellClick: function( grid, htmlElement, columnIndex, record) {
		var me = this;
		console.log('click on column: ', grid.getHeaderCt().getHeaderAtIndex(columnIndex));
		var headerName = grid.getHeaderCt().getHeaderAtIndex(columnIndex).text;
		if (headerName == 'Name') {
			if(me.getItemAttributeInView()) {
				me.getItemAttributeInView().destroy();
			}
			var popup = Ext.create('MYOCD.view.project.getItemByView.ItemAttributeInView');
			popup.down('textfield[name="itemId"]').setValue(record.data.Id);
			popup.down('textfield[name="route"]').setValue(record.data.route);
			popup.show();
			popup.setTitle(record.get('Name') + "'s Attributes");
		}

	},
	onPrintViewTemplateToolClick: function() {
		var me = this;
        var gridHeader = me.getGetItemsByView().getEl().dom.children[1].children[0].children[0].children[0];
        
        var parentAgrr = null; 
        if (MYOCD.SharedData.rootAggregation) {
        	parentAgrr = me.getGetItemsByView().getEl().dom.children[1].children[0].children[0].children[1];
        }
        var itemLength = me.getGetItemsByView().getEl().dom.children[1].children[0].children[0].children.length;
        var itemBody = me.getGetItemsByView().getEl().dom.children[1].children[0].children[0].children[itemLength-1];
        console.log("header: ", gridHeader);
        console.log("parentAgrr: ", parentAgrr);
        console.log("itemBody: ", itemBody);
        var divText; 
        if (parentAgrr) {
        	divText = gridHeader.innerHTML + '<div style="height: 50px">&nbsp;</div>' + '<div style="top: 50px">' + parentAgrr.innerHTML + itemBody.innerHTML + '</div>';

        } else {
        	divText = gridHeader.innerHTML + '<div style="top: 50px">' + parentAgrr.innerHTML + itemBody.innerHTML + '</div>';

        }
        // divText = parentAgrr.innerHTML;
        var content = '<html><head><title>';
        content = content + MYOCD.SharedData.currentProjectName+' - '+me.getGetItemsByView().title;
        content = content + '</title><link rel="stylesheet" href="resources/css/default/app.css">';
        content = content + '<style type="text/css" media="print"> @page { size: landscape; }</style>';
        content = content + '</head><body class="printing">'; 
        content = content + divText + '</body>';
		var myWindow = window.open("","","top=50,left=600,width=1000,height=700");
		var doc = myWindow.document;
		doc.open();
		doc.write(content);
		doc.close();
		myWindow.print();
		myWindow.close();
	},


	// testing
	handleFeatureResult_non_recursive: function(groupsParam, parentPanelParam, levelParam) {				
		var me = this;

		var params = [];
		params.push({
			level: levelParam,
			groups: groupsParam,
			parentPanel: parentPanelParam
		})

		do {
			var level = params[params.length-1].level;
			var groups = params[params.length-1].groups;
			var parentPanel = params[params.length-1].parentPanel;
			level ++;
			if (level > 5) {
				level = 5;
			}
			// var cls = "view-header-lever-"+level;
			// console.log ("cls: ", cls);
			for (var key in groups) {
				console.log('-----property: ' + key + '-----')
				if (key.length == 0) continue;
				var panel = {
					xtype: 'panel',
					// title: parentPanel.title + ': ' + key,
					title: key,
					margin: '1 0 0 2',
					// flex: 1,
					// cls: cls,
					hidden: key.length == 0 ? true : false,
					level: level,
					collapsible: true,
					border: false,
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					listeners: {
						render: function() {
							var cls = "view-header-lever-"+(this.level + MYOCD.SharedData.difLevel);
							// console.log ("cls: ", cls);
							this.addCls(cls);
							if (this.topAggregation) {
								console.log("panel aggregations: ", this.topAggregation, this.needAggregationPanel);
								this.insert(0, this.needAggregationPanel);
							}
						},
						collapse: function() {
							var topAggregationPanel = this.down('container[name="groupTopAggregation"]');
							if (!topAggregationPanel) {
								topAggregationPanel = this.down('container[name="groupAggregation"]');
							}
							console.log("panel collapse", topAggregationPanel.getEl().dom);
						},
						show: function() {
							var topAggregationPanel = this.header.down('container[name="groupTopAggregation"]');
							if (!topAggregationPanel) {
								topAggregationPanel = this.header.down('container[name="groupAggregation"]');
							}
						}
					},
					items: [
						// {
						// 	xtype: 'container',
						// 	html: '<font color="blue">'+parentPanel.title + ': ' + key+'</font>'
						// }
					]
				}
				var aggrParent = null;
				if (groups[key].aggregations && Object.keys(groups[key].aggregations).length > 0) {
					aggrParent = {
						xtype: 'container',
						name: 'groupAggregation',
						layout: {
							type: 'hbox',
							align: 'stretch'
						},
						items: []
					}				
				}
				if (level == 1) {
					parentPanel.items.push({
						xtype: 'container',
						height: 10
					});
				}
				parentPanel.items.push(panel);
				if (groups[key].field) {
					
					console.log('----------field name: ' + groups[key].field + '----------');
					var title = groups[key].field.split('::').length > 1 ? groups[key].field.split('::')[1] : groups[key].field.split('::')[0]
					var containerTitle = {
						xtype: 'container',
						layout: {
							type: 'hbox',
							align: 'stretch',
						},
						height: 30,
						html: '<font color="blue" size="2">Group: </font><font color="black" size="2">'+me.capitaliseFirstLetter(title)+'</font>'
					}
					var valuePanel = {
						xtype: 'container',
						margin: '1 0 0 2',
						title: me.capitaliseFirstLetter(title),
						// flex: 1,
						collapsible: true,
						border: false,
						layout: {
							type: 'vbox',
							align: 'stretch'
							// type: 'accordion'
						},
						items: [
							
						]
					}
					// panel.items.push(containerTitle);
					if (aggrParent) {
						console.log ("group aggregations: ", groups[key].aggregations);
						panel.topAggregation = groups[key].aggregations;
					}
					MYOCD.SharedData.currentParentPanel = panel;
					panel.items.push(valuePanel);
					// me.handleFeatureResult(groups[key].groups, valuePanel, level);
					params.push({
						level: level,
						groups: groups[key].groups,
						parentPanel: valuePanel
					})
				} else {
					params.pop();
					console.log("got items: ",groups[key].items);
					console.log("columns: ", Object.keys(groups[key].items[0]));
					if (groups[key].items.length > 0) {
						var columnsLength = 0;
						var columns = [];
						var index = 0;
						for (var i = 0; i < groups[key].items.length; i++) {
							if (Object.keys(groups[key].items[i]).length > columnsLength) {
								columnsLength = Object.keys(groups[key].items[i]).length;
								index = i;
							}
						}
						for (var property in groups[key].items[index]) {
							var columnNames = property.split("::");
							if (columnNames.length > 1) {
								var columnName = columnNames.length == 3 ? groups[key].items[index][columnNames[0] + "::type_name"] + ' ' + columnNames[1] : columnNames[0];
								columns.push(columnName);
							} else {
								columns.push(columnNames[0]);
							}
						}
						console.log('columns fields:', columns);
						var store = Ext.create('Ext.data.Store',{
							fields: columns
						});

						var gridTitle = {
							xtype: 'grid',
							cls: 'mini-header',
							margin: '0 0 0 25',
							border: false,
							enableColumnHide: false,
							enableColumnMove: false,	
							enableColumnResize: false,							
							columns: [
							]
						}
						var grid = {
							// flex: 1,
							hideHeaders: true,
							margin: '0 0 0 25',
							// height: height,
							name: 'viewItemGrid',
							xtype: 'grid',
							store: store,
							border: false,						
							columns: [
							]
						}
						// create columns
						for (var property in groups[key].items[index]) {
							var columnNames = property.split("::");
							if (columnNames.indexOf('Id') != -1 || columnNames.indexOf('route') != -1 || columnNames.indexOf('type_name') != -1) {
								continue;
							}
							
							var columnName;
							if (columnNames.length == 1) {
								columnName = columnNames[0];
								gridTitle.columns.push({text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1, sortable: false});
								grid.columns.push({text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1});
							} else {
								var ix = parseInt(columnNames[columnNames.length-1]);
								columnName = columnNames.length == 3 ? groups[key].items[index][columnNames[0] + "::type_name"] + ' ' + columnNames[1] : columnNames[0];
								if (isNaN(ix) || ix < 0){
									gridTitle.columns.push({text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1, sortable: false});
									if (me.capitaliseFirstLetter(columnName).indexOf('Name') != -1) {
										grid.columns.push(
											{
												text: me.capitaliseFirstLetter(columnName), 
												dataIndex: columnName, 
												autoWidth: true, 
												flex: 1,
												xtype: 'templatecolumn',
												tpl: '<a href=#>{'+columnName+'}</a>'
											}
										);
									} else {
										grid.columns.push({text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1});
									}
								} else {
									gridTitle.columns[ix] = {text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1, sortable: false};
									if (me.capitaliseFirstLetter(columnName).indexOf('Name') != -1) {
										grid.columns[ix] = {
											text: me.capitaliseFirstLetter(columnName), 
											dataIndex: columnName, 
											autoWidth: true, 
											flex: 1,
											xtype: 'templatecolumn',
											tpl: '<a href=#>{'+columnName+'}</a>'
										}
									} else {
										grid.columns[ix] = {text: me.capitaliseFirstLetter(columnName), dataIndex: columnName, autoWidth: true, flex: 1};
									}
								}
								// var objectName = groups[key].items[index][columnNames[0] + "::type_name"];
								// gridTitle.columns.push({text: objectName + '-' + me.capitaliseFirstLetter(columnNames[1]), dataIndex: columnNames[1], autoWidth: true, flex: 1,  sortable: false});
								// grid.columns.push({text: objectName + '-' + me.capitaliseFirstLetter(columnNames[1]), dataIndex: columnNames[1], autoWidth: true, flex: 1});
							}
						}

						if (aggrParent) {
							var topAggregationPanel = {
								xtype: 'container',
								name: 'groupTopAggregation',
								layout: {
									type: 'hbox',
									align: 'stretch'
								},
								items: []
							}
							if (!MYOCD.SharedData.currentParentPanel) {
								topAggregationPanel = null;
							}
							for (var i = 0; i < gridTitle.columns.length; i++) {
								var notAddAgrr = true;
								for (var aggr in groups[key].aggregations) {
									console.log("childAggrkey: ", groups[key].aggregations[aggr]);
									if (topAggregationPanel) {
										console.log("parentPanelAggrkey: ", MYOCD.SharedData.currentParentPanel.topAggregation[aggr]);

									}
									var aggregations = groups[key].aggregations[aggr].display_column.split("::");
									// var aggrColumn = aggregations.length > 1 ? groups[key].items[index][aggregations[0] + "::type_name"] + ' ' + aggregations[1] : aggregations[0];
									var aggrColumn;
									if (aggregations.length > 1) {
										if (aggregations[0] != '0') {
											aggrColumn = groups[key].items[index][aggregations[0] + "::type_name"] + ' ' + aggregations[1];
										} else {
											aggrColumn = aggregations[1];
										}
									} else {
										aggrColumn = aggregations[0];
									}

									if (me.capitaliseFirstLetter(aggrColumn) == gridTitle.columns[i].text) {
										var aggregationContainer = {
											xtype: 'container',
											margin: '0 0 0 5',
											flex: 1,
											html: '<font color="gray" size="2">'+me.capitaliseFirstLetter(groups[key].aggregations[aggr].name.toString())+': ' + groups[key].aggregations[aggr].value + '</font>'
										}
										if (topAggregationPanel) {
											var topAggregationContainer = {
												xtype: 'container',
												margin: '0 0 0 5',
												flex: 1,
												html: '<font color="gray" size="2">'+me.capitaliseFirstLetter(groups[key].aggregations[aggr].name.toString())+': ' + MYOCD.SharedData.currentParentPanel.topAggregation[aggr].value + '</font>'
											}
											topAggregationPanel.items.push(topAggregationContainer);
										}
										aggrParent.items.push(aggregationContainer);
										notAddAgrr = false;
										break;
									}
								}
								if (notAddAgrr) {
									if (topAggregationPanel) {
										topAggregationPanel.items.push({xtype: 'container', flex: 1});
									}
									aggrParent.items.push({xtype: 'container', flex: 1});
								}
							}
							if (topAggregationPanel) {
								MYOCD.SharedData.currentParentPanel.needAggregationPanel = topAggregationPanel;
							}
						}
						console.log('grid columns', grid.columns);
						for (var i = 0; i < groups[key].items.length; i++) {
							var item = new Object(); 
							for (var property in groups[key].items[i]) {
								var columnNames = property.split("::");
								if (columnNames.length > 1) {
									var columnName = columnNames.length == 3 ? groups[key].items[index][columnNames[0] + "::type_name"] + ' ' + columnNames[1] : columnNames[0];
									item[columnName] = groups[key].items[i][property];
								} else {
									item[columnNames[0]] = groups[key].items[i][property];

								}
							}
							console.log('added item:', item);
							store.add(item);
						}
						// store.loadRawData(groups[key].items);
						// panel.items.push(gridTitle);
						if (MYOCD.SharedData.notAddedTitle) {
							MYOCD.SharedData.viewGridTitle = gridTitle;
							me.getGetItemsByView().insert(0, gridTitle);
							MYOCD.SharedData.notAddedTitle = false;
							if (MYOCD.SharedData.rootAggregation) {
								var rootAggrParent = {
									xtype: 'container',
									margin: '5 0 0 0',
									height: 30,
									layout: {
										type: 'hbox',
										align: 'stretch'
									},
									items: []
								}
								for (var i = 0; i < gridTitle.columns.length; i++) {
									var notAddAgrr = true;
									for (var aggr in MYOCD.SharedData.rootAggregation) {
										var aggregations = MYOCD.SharedData.rootAggregation[aggr].display_column.split("::");
										// var aggrColumn = aggregations.length > 1 ? result.results.items[index][aggregations[0] + "::type_name"] + ' ' + aggregations[1] : aggregations[0];
										var aggrColumn;
										if (aggregations.length > 1) {
											if (aggregations[0] != '0') {
												aggrColumn = result.results.items[index][aggregations[0] + "::type_name"] + ' ' + aggregations[1]
											} else {
												aggrColumn = aggregations[1];
											}
										} else {
											aggrColumn = aggregations[0];
										}
										if (me.capitaliseFirstLetter(aggrColumn) == gridTitle.columns[i].text) {
											var aggregationContainer = {
												xtype: 'container',
												margin: '0 0 0 5',
												flex: 1,
												html: '<font color="gray" size="2">'+me.capitaliseFirstLetter(MYOCD.SharedData.rootAggregation[aggr].name.toString())+': ' + MYOCD.SharedData.rootAggregation[aggr].value + '</font>'
											}
											rootAggrParent.items.push(aggregationContainer);
											notAddAgrr = false;
											break;
										}
									}
									if (notAddAgrr) {
										rootAggrParent.items.push({xtype: 'container', flex: 1});
									}
								}
								me.getGetItemsByView().insert(1, rootAggrParent);
							}
						}
						if (aggrParent) {
							panel.items.push(aggrParent);
						}
						panel.items.push(grid);
						panel.minHeight = grid.height + 60;
					}
					MYOCD.SharedData.difLevel = 5 - level;
				}
			}
		} while (params.length > 0);
	}
});