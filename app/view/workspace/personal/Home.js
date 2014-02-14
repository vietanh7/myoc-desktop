var activeWsTpl = new Ext.XTemplate(
    '<tpl for=".">',
    	'<div style="vertical-align: middle">',
    	/*
'<tpl if="projectStatus == \'1\'">',
        	'<span class="avatar"><img src="resources/images/icon_home.png" height="24" width="24"></span>',
        '<tpl else>',
*/
        	'<span class="avatar"><img src="resources/images/p-icon.png" height="24" width="24"></span>',
/*         '</tpl>', */
        '<div class="name">{name}</div>',
        '<div class="desc">{description}&nbsp;</div>',
        '</div>',
    '</tpl>'
);

Ext.define('MYOCD.view.workspace.personal.Home',{
	extend: 'Ext.Container',
	xtype: 'workspacepersonalhome',
	requires: [
		'MYOCD.view.project.NewProject'
	],
	layout: {
		type: 'hbox',
		align: 'stretch',
	},
	
	items: [
		{
			xtype: 'panel',
			flex: 1,
			cls: 'workspace-personal-home-projects',

			layout: 'vbox',
			height: 600,
			items: [
			{
    			xtype: 'grid',
    			title: 'Projects',
    			tools: [
					{
						type: 'plus',
						xtype: 'tool',
						name: 'personalNewProjectTool'
					}
				],
				layout: 'fit',
				width: '100%',
				height: 450,
    			cls: 'personal-projects-grid',
    			name: 'personalProjectsGrid',
    			store: 'project.Projects',
    			columns: [
    				{xtype: 'templatecolumn', tpl: activeWsTpl, flex: 1, text: 'Name', dataIndex: 'projectName'},
	    			{xtype: 'templatecolumn', tpl: '<div align="center">{projectStatus}</div>', text: 'Status', flex: 0.5, dataIndex: 'projectStatus'}
    			]
			},
			{
				xtype: 'button',
				hidden: true,
				style: 'margin: 10px 0 10px 20px;',
				height: 25,
				width: 100,
				html: 'New Project',
				cls: 'workspacePersonalNewprojectBtn',
			}
			]
		},
		{
			xtype: 'panel',
			flex: 2,
			title: 'Today',
			height: 600,
		}
	]
});