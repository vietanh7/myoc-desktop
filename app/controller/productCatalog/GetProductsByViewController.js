Ext.define('MYOCD.controller.productCatalog.GetProductsByViewController',{
	extend: 'Ext.app.Controller',
	refs: [
		{
			ref: 'getProductsByView',
			selector: 'getProductsByView'
		}
	],
	init: function() {
		this.control({
			'getProductsByView': {
				show: this.onGetProductsByViewShow
			}
		});
	},
	capitaliseFirstLetter: function (string)
	{
    	return string.charAt(0).toUpperCase() + string.slice(1);
	},
	handleProductResult: function(groups, parentPanel) {
		var me = this;
		for (var key in groups) {
			console.log('-----property: ' + key + '-----')
			var panel = {
				xtype: 'panel',
				title: parentPanel.title + ': ' + key,
				margin: '1 0 0 2',
				flex: 1,
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				items: [
					// {
					// 	xtype: 'container',
					// 	html: '<font color="blue">'+parentPanel.title + ': ' + key+'</font>'
					// }
				]
			}
			parentPanel.items.push(panel);
			if (groups[key].field) {
				console.log('----------field name: ' + groups[key].field + '----------');
				var valuePanelTitle = {
					xtype: 'container',
					html: '<div style="border:2px solid green;border-top: none; border-left: none; border-right: none;"><font color="gray" size="4">'+me.capitaliseFirstLetter(groups[key].field)+'</font></div>'
				}
				var valuePanel = {
					xtype: 'container',
					margin: '1 0 0 2',
					title: me.capitaliseFirstLetter(groups[key].field),
					flex: 1,
					layout: {
						// type: 'vbox',
						// align: 'stretch'
						type: 'accordion'
					},
					items: [
						
					]
				}
				panel.items.push(valuePanelTitle);
				panel.items.push(valuePanel);
				me.handleProductResult(groups[key].groups, valuePanel);
			} else {
				console.log(groups[key]);
				
				if (groups[key].length > 0) {
					var store = Ext.create('Ext.data.Store', {
					    fields:Object.keys(groups[key][0]),
					});
					var grid = {
						flex: 1,
						xtype: 'grid',
						store: store,
						border: false,
						viewConfig: {forceFit: true},
						columns: [
						]
					}
					for (var property in groups[key][0]) {
						grid.columns.push({text: me.capitaliseFirstLetter(property), dataIndex: property});
					}
					store.loadRawData(groups[key]);
					panel.items.push(grid);
				}
			}
		}
	},
	onGetProductsByViewShow: function() {
		var me = this;
		var productCatalogId = this.getGetProductsByView().down('textfield[name="productCatalogId"]').getValue();
		var productCategoryId = this.getGetProductsByView().down('textfield[name="productCategoryId"]').getValue();
		var viewId = this.getGetProductsByView().down('textfield[name="viewId"]').getValue();
		var callback = function(result) {
			var groups = [];
			console.log(Object.keys(result.groups));
			console.log('----------root field name: ' + result.groups.field + '----------');
			var panelTitle = {
				xtype: 'container',
				html: '<div style="border:2px solid green;border-top: none; border-left: none; border-right: none;"><font color="gray" size="4">'+me.capitaliseFirstLetter(result.groups.field)+'</font></div>'
			}
			var panel = {
				xtype: 'container',
				cls: 'mini-header',
				flex: 1,
				minWidth: 1000,
				minHeight: 600,
				title: me.capitaliseFirstLetter(result.groups.field),
				layout: {
					// type: 'vbox',
					// align: 'stretch',
					type: 'accordion'
				},
				items: [
					
				]
			}
			me.handleProductResult(result.groups.groups, panel);
			me.getGetProductsByView().add(panelTitle);
			me.getGetProductsByView().add(panel);
		}
		if (productCatalogId.length > 0) {
			MYOCD.controller.productCatalog.ProductCatalogsStoreController.getProductsOfProductCatalogByView(productCatalogId, viewId, this.getGetProductsByView(), callback);
		} else {
			MYOCD.controller.productCatalog.ProductCatalogsStoreController.getProductsOfProductCategoryByView(productCategoryId, viewId, this.getGetProductsByView(), callback);
		}
		
	}
});