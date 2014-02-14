
Ext.define('MYOCD.view.workspace.company.CompanyProfile',{
	extend: 'Ext.Container',
	xtype: 'workspacecompanyprofile',
	requires: [
    ],
    layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'center'
	},

	border: false,
	cls: 'workspacecompanyprofile',
	items: [
		{
			xtype: 'panel',
			layout: 'fit',
			title: 'Public',
			cls: 'workspace-company-public-profile',
	        items: [{
	        	xtype: 'panel',
				border: false,
	        	html: 	'<div style="padding: 10px;"><img id="workspacecompanyprofileImage" src="./resources/images/SampleData/7.jpeg" height="50px"/>',
	        }, {
		        height: 280,
				xtype: 'grid',
				border: false,
				rowLines: false,
    			hideHeaders: true,
				store: 'company.PublicProfile',
		        columns: [
		            {text: "Name", flex: 1, dataIndex: 'name'},
		            {text: "Value", flex: 5, dataIndex: 'value'}
		        ]
	        }]
		},
		{
			xtype: 'panel',
			layout: 'fit',
			title: 'Private',
	        items: [{
				xtype: 'panel',
				height: 300,
	        }]
		}, {
			xtype: 'panel',
			layout: 'fit',
			items: [
				{
					xtype: 'container',
					width: '100%',
					items: [
						{
							xtype: 'button',
							cls: 'company-profile-editBtn',
							height: 25,
							text: 'Edit'
				        }
					]
				}
			]
		}
	]
});