Ext.define('MYOCD.view.workspace.Company',{
	extend: 'Ext.Container',
	xtype: 'workspacecompany',
	requires:[
        'MYOCD.view.workspace.company.Home',
        'MYOCD.view.workspace.company.CompanyProfile',
        'MYOCD.view.project.ProjectDetail',
    ],
	layout: {
		type: 'vbox',
		align: 'stretch',
	},
		
	padding: 10,
	cls: 'workspacecompany',
	//style: 'padding: 5px 0px 5px 0px;',
	items: [
		{
			xtype: 'panel',
			cls: 'workspacecompanyTitle',
			height: 65,
			style: 'padding-top: 5px;',
			html: 	'<div style="padding: 10px;"><img src="./resources/images/SampleData/7.jpeg" height="40px" style="float: left"/>' + 
					'<div id="workspacecompanyTitleText" style="margin-left: 50px; height: 100%; vertical-align: middle; padding-top: 2px; padding-left: 20px; position: absolute; font-size: 30px; color: rgb(111, 150, 39); font-weight: bold; clear: both">Company Workspace</div></div>'
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
    						xtype: 'workspacecompanyhome'
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