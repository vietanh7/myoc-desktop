Ext.define('MYOCD.view.workspace.Personal',{
	extend: 'Ext.Container',
	xtype: 'workspacepersonal',
	requires:[
        'MYOCD.view.workspace.personal.Home',               
        'MYOCD.view.project.ProjectDetail'
    ],
	layout: {
		type: 'vbox',
		align: 'stretch',
	},
		
	padding: 10,
	cls: 'workspacepersonal',
	//style: 'padding: 5px 0px 5px 0px;',
	items: [
		{
			xtype: 'panel',
			cls: 'workspacepersonalTitle',
			height: 65,
			style: 'padding-top: 5px;',
			html: 	'<div style="padding: 10px;"><img src="./resources/images/SampleData/7.jpeg" height="40px" style="float: left"/>' + 
					'<div id="workspacepersonalTitleText" style="margin-left: 50px; height: 100%; verical-align: middle; padding-top: 2px; padding-left: 20px; position: absolute; font-size: 30px; color: rgb(111, 150, 39); font-weight: bold; clear: both">Personal Workspace</div></div>'
		},
		{
			xtype: 'panel',
			flex: 1,
			layout: 'fit',
			style: 'padding-bottom: 5px;',
			items: [
				{
					title: 'Home',
					xtype: 'container',
					margin: 10,
					name: 'workspaceProjectContainer',
					layout: 'card',
					items: [
						{
    						xtype: 'workspacepersonalhome'
						}
						// ,
						// {
    		// 				xtype: 'projectDetail'
						// }
					]
				}
			]
		}
	]
});