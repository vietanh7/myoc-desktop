Ext.define('MYOCD.view.Viewport', {
    renderTo: Ext.getBody(),
    extend: 'Ext.container.Viewport',
    requires:[
        'Ext.tab.Panel',
        'Ext.layout.container.Border',
        'MYOCD.view.main.Main',
        'MYOCD.view.Workspace'
    ],
    autoScroll: true,
    overflow: 'auto',
    width: window.innerWidth,
/*
    layout: {
	    type: 'vbox',
	    align: 'stretchmax',
	    pack: 'center'
    },
*/
 
    items: [	
		{
	    	xtype: 'main',
		}
    ]
});