var tipTpl = new Ext.XTemplate (
	'<span>',
		'<font color="Black" size=3>{tipTitle}</font>',
	'</span>'
);

var dealTpl = new Ext.XTemplate (
	'<div>',
		'<div style="float: left; width: 25%; margin-top: 5px;">',
			'<img src={dealImgLink} width="96" height="80">',
		'</div>',
		'<div style="float: left; width: 75%; padding: 20px">',
			'<div>',
				'<font color="Black" size="3">{dealTitle}</font>',
			'</div>',
			'<div style="padding: 5px">',
				'<span><img src="./resources/images/like.png" width="20"/>  {dealLikes}</span>',
				'&nbsp;&nbsp;&nbsp;',
				'<span><img src="./resources/images/dislike.png" width="20"/>  {dealDislikes}</span>',
			'<div>',
		'</div>',
	'</div>'
);

Ext.define("MYOCD.view.main.Main", {
    extend: 'Ext.Panel',
    xtype: 'main',
    requires: [
    	'Ext.tab.Panel',
    	'Ext.grid.Panel',
    	'Ext.data.Store',
    	'MYOCD.view.main.Login'
    ],
    //padding: '10 25 10 25',

    width: 1300,
    style: 'margin: auto',
    cls: 'mainpage',
    layout: {
    	type: 'vbox',
    	align: 'stretch',
    	pack: 'start'
	},
    items: [
    	{
	    	xtype: 'panel',
	    	cls: 'main-header',
	    	// flex: 1,
	    	height: 90,
	    	layout: {
		    	type: 'hbox',
		    	align: 'stretch',
		    	pack: 'start'
	    	},
	    	items: [
	    		{
		    		xtype: 'container',
		    		layout: {
		    			type: 'hbox',
			    		align: 'middle'	
		    		},
		    		html: '<h1 style="padding: 15px"><font size="6">My Home Space</font></h1>',
		    		flex: 7,
	    		},
	    		{
		    		xtype: 'container',
		    		layout: {
			    		type: 'hbox',
				    	pack: 'center',
				    	align: 'middle'
		    		},
		    		flex: 2,
		    		items: [
		    			{
				    		xtype: 'button',
				    		html: '<font color="white" size="3">Tour</font>',
				    		scale: 'large',
				    		flex: 10
			    		},
			    		{
				    		xtype: 'container',
				    		flex: 1	
			    		},
			    		{
				    		xtype: 'button',
				    		html: '<font color="white" size="3">Plans & Pricing</font>',
				    		scale: 'large',
				    		flex: 15
			    		},
			    		{
				    		xtype: 'container',
				    		flex: 1	
			    		}
		    		]
	    		},

	    	]
    	},
    	{
	    	xtype: 'container',
	    	height: 700,
	    	margin: '10 0 10 0',
	    	layout: {
		    	type: 'hbox',
		    	align: 'stretch',
		    	pack: 'start'
	    	},
	    	items: [
	    		{
		    		xtype: 'container',
		    		flex: 1.5,
		    		layout: {
			    		type: 'vbox',
			    		align: 'stretch',
				    	pack: 'start'
		    		},
		    		margin: '0 5 0 0',
		    		items: [
		    			{
			    			xtype: 'panel',
			    			flex: 1
		    			},
		    			{
			    			xtype: 'panel',
			    			title: 'Blogs',
							layout: {
						    	type: 'vbox',
						    	align: 'stretch',
						    	pack: 'start'
					    	},			    			
					    	flex: 1,
			    			items: [
			    				{
				    				xtype: 'grid',
				    				margin: '2 2 2 2',
				    				border: false,
				    				store:  'Blogs',
				    				columns: [
				    					{ text: 'Title', dataIndex: 'blogTitle', flex: 3 },
				    					{ text: 'Like', dataIndex: 'liked', flex: 1 },
				    					{ text: 'Dislike', dataIndex: 'disliked', flex: 1 }
				    				]
			    				},
			    				{
				    				xtype: 'container',
				    				margin: '2 2 2 2',
				    				html: '<div align="right"><a href="">more</a></div>'
			    				}
			    			]
		    			}
		    		]

	    		},
	    		{
		    		xtype: 'container',
		    		flex: 2.5,
		    		layout: {
			    		type: 'vbox',
			    		align: 'stretch',
				    	pack: 'start'
		    		},
		    		margin: '0 5 0 5',
		    		items: [
		    			{
			    			xtype: 'panel',
			    			title: 'Top Pics',
			    			flex: 1,
			    			layout: 'fit',
			    			items: [
			    				{
				    				xtype: 'tabpanel',
				    				name: 'mainPageTab',
				    				items: [
				    					{
					    					title: 'Kitchens',
					    					xtype: 'panel',
					    					layout: 'fit',
					    					items: [	
						    					{
						    						xtype: 'container',
						    						flex: 1,
						    						name: 'kitchenImages',
						    						id: 'galleria',
					    						}
					    					]
				    					},
				    					{
					    					title: 'Bathrooms'
				    					},
				    					{
					    					title: 'Living rooms'
				    					},
				    					{
					    					title: 'Dining rooms'
				    					},
				    					{
					    					title: 'Master Bedrooms'
				    					},
				    					{
					    					title: 'More...'
				    					},
				    				]
			    				}
			    			]
		    			},
		    			{
			    			xtype: 'panel',
			    			title: 'Deals of the Week',
			    			autoScroll: true,
				    		overflow: 'auto',
			    			flex: 1,
			    			items: [
			    				{
				    				xtype: 'grid',
				    				store: 'WeeklyDeals',
				    				border: false,
				    				hideHeaders: true,
				    				columns: [
				    					{text: 'Deals of the Week', xtype: 'templatecolumn', tpl: dealTpl, flex:1}
				    				]
			    				}
			    			]
		    			}
		    		]
	    		},
	    		{
		    		xtype: 'container',
		    		flex: 1,
		    		layout: {
			    		type: 'vbox',
			    		align: 'stretch',
				    	pack: 'start'
		    		},
		    		margin: '0 0 0 5',
		    		items: [
		    			{
			    			xtype: 'panel',
			    			flex: 1,
			    			title: 'Login',
			    			items: [
			    				{
				    				xtype: 'login'
			    				}
			    			]
		    			},
		    			{
			    			xtype: 'panel',
			    			title: 'Homeowner Tips',
			    			flex: 1,
			    			layout: {
					    		type: 'vbox',
					    		align: 'stretch',
						    	pack: 'start'
				    		},
				    		items: [
				    			{
					    			xtype: 'grid',
					    			padding: 2,
					    			store: 'HomeownerTips',
					    			border: false,
					    			hideHeaders: true,
					    			columns: [
					    				{text: 'Homeowner Tips', xtype: 'templatecolumn', tpl: tipTpl, flex: 1}
					    			]
				    			},
				    			{
				    				xtype: 'container',
				    				margin: '2 2 2 2',
				    				html: '<div align="right"><a href="">more</a></div>'
			    				}
				    		]
		    			}
		    		]
	    		}
	    	]
    	},
    	{
	    	xtype: 'panel',
	    	height: 100,
	    	// flex: 1
    	}
    ]
});