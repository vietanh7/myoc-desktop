Ext.define('MYOCD.view.templates.TemplatesWindow',{
	extend: 'Ext.window.Window',
	requires: [
		'MYOCD.view.companyTemplate.CompanyTemplatesTab',
		'MYOCD.view.communityTemplate.CommunityTemplatesTab',
		'MYOCD.view.projectTemplate.ProjectTemplatesTab',
		'MYOCD.view.featureTemplate.FeatureTemplatesTab',
		'MYOCD.view.viewTemplate.ViewLibrariesTab'
	],
	xtype: 'templatesWindow',
	title: 'Templates',
	width: 1100,
	height: 700,
	cls: 'customWindow',
	constrainHeader:true,
	position: 'cascade',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	items: [
		{
			xtype: 'tabpanel',
			flex: 1,
			name: 'allTemplatesTabPanel',
			items: [
				{
					title: 'Companies',
					xtype: 'companyTemplatesTab'
				},
				{
					title: 'Communities',
					xtype: 'communityTemplatesTab'	
				},
				{
				    title: 'Role Definitions',
				    xtype: 'roleLibrariesTab'
			    },
				{
					title: 'Projects',
					xtype: 'projectTemplatesTab'
				},
				{
					title: 'Features',
					xtype: 'featureTemplatesTab'
					
				},
				{
					title: 'Views',
					xtype: 'viewLibrariesTab'
				}
			]	
		},

	]
});