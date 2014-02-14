var saveTemplateFeatureRefTplItemTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/library_icon.png" ></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

var saveTemplateFeatureRefTemplateItemTpl = new Ext.XTemplate (
	'<tpl for=".">',
		'<div class="thumb-wrap">',
			'<div class="thumb"><img src="./resources/images/template64.png"></div>',
			'<span><h3>{name}</h3></span>',
		'</div>',
	'</tpl>'
);

Ext.define('MYOCD.view.project.SaveFeatureTemplate',{
	extend: 'Ext.window.Window',
	xtype: 'saveFeatureTemplate',
	title: 'Save As Template',
	modal: true,
	width: 800,
	height: 600,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	cls: 'customWindow',
	items: [
		{
			xtype: 'container',
			width: '100%',
			height: 120,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'fieldset',
					flex: 1,
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'textfield',
							name: 'featureId',
							hidden: true
						},
						{
							xtype: 'textfield',
							name: 'saveTemplateAtTemplateLibId',
							hidden: true
						},
						{
							xtype: 'textfield',
							name: 'saveTemplateName',
							fieldLabel: 'Name',
							labelWidth: 70,
							allowBlank: false,
							listeners: {
								blur: function() {
									this.setValue(this.getValue().trim());
								}
							}
						},
						{
							xtype: 'textfield',
							name: 'saveTemplateDesc',
							fieldLabel: 'Description',
							labelWidth: 70
						}
					]
				},
				{
					xtype: 'container',
					layout: {
						type: 'hbox',
						pack: 'center'
					},
					items: [
						{
							xtype: 'button',
							width: 100,
							name: 'saveFeatureTemplateBtn',
							text: 'Save'
						}
					]
				}
			]
		},
		{
			xtype: 'panel',
			name: 'saveTemplateSelectLibPanel',
			cls: 'product-view',
			layout: {
				type: 'vbox',
				align: 'stretch',
			},
			tools: [
				{
					type: 'plus',
					name: 'addNewFeatureTemplateTool'
				}
			],
			title: 'Choose A Template Library',
			flex: 1,
			items: [
				{
					xtype: 'dataview',
					flex: 1,
					autoScroll: true,
					layout: 'auto',
					name: 'saveTemplateFeatureRefTplDataView',
					store: 'featureTemplate.RefFeatureTemplatesLibs',
					tpl: saveTemplateFeatureRefTplItemTpl,
					itemSelector: 'div.thumb-wrap',
					overItemCls: 'x-view-over',
					trackOver: true
				}
			]
		},
		{
			xtype: 'container',
			name: 'saveTemplateSavePlacePanel',
			flex: 1,
			hidden: true,
			layout: 'border',
			bodyBorder: false,
			defaults: {
			    collapsible: true,
			    split: true,
			},
			items: [
				{
					xtype: 'panel',
					title: 'Save ... ',
					minHeight: '12%',
					maxHeight: '12%',
					region: 'north',
					collapsible: false,
					items: [
						{
							xtype: 'button',
							text: 'Back To Libraries',
							name: 'saveTemplateFeatureTplsBackBtn',
							ui: 'default-toolbar',
							iconCls: 'back-icon'
						},
					]	
				},
				{
					xtype: 'treepanel',
					name: 'saveTemplateFeatureRefTemplateCateTree',
					title: 'Categories',
					store: 'featureTemplate.RefFeatureTemplatesCategoriesTreeStore',
					rootVisible: true,
					displayField: 'name',
					width: 300,
					height: '88%',
					region: 'west'
				},
				{
					xtype: 'panel',
					title: 'Templates',
					width: 500,
					height: '88%',
					region: 'center',
					collapsible: false,
					layout: 'fit',
					cls: 'product-view',
					items: [
						{
							xtype: 'dataview',
							flex: 1,
							autoScroll: true,
							layout: 'auto',
							name: 'saveTemplateFeatureRefTemplateDataView',
							store: 'featureTemplate.RefFeatureTemplates',
							tpl: saveTemplateFeatureRefTemplateItemTpl,
							itemSelector: 'div.thumb-wrap',
							overItemCls: 'x-view-over'
						}
					]
				}
			]
		}
	]
});