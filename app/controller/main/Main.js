Ext.define('MYOCD.controller.main.Main', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.fx.Manager'],
    refs: [
    	{
	    	ref: 'viewport',
	    	selector: 'Viewport'
    	},
    	{
	    	ref: 'main',
	    	selector: 'main'
    	},
    	{
	    	ref: 'kitchenImages',
	    	selector: 'image[name="kitchenImages"]'
    	},
    	{
            ref: 'login',
            selector: 'login'
        },
    ],
    
    init:  function() {
	    this.control({
		    'viewport': {
			    afterrender: this.onViewportAfterRendered,
		    },
		    'main': {
			    afterrender: this.onMainAfterRendered,
			    render: this.onMainRender
		    },
	    }) 
    },
    
    onViewportAfterRendered: function() {
    	var me = this;        
    },
  
    onMainRender: function() {
    	var me = this;
    	Ext.Ajax.request({
            url: USER_SIGN_OUT_URL,
            method: 'GET',
            withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(response) {
            },
            failure: function(response) {
            }
        }); 
    },
    onMainAfterRendered: function() {
    	var me = this;
	    var kitchens = Ext.getStore('Kitchens');
	    var kitchensData = kitchens.data.items;
	    var kitchensImgs = [];
	    for(var i = 0; i < kitchensData.length; i++) {
		    var img = new Object();
		    img.thumb = kitchensData[i].data.kitchenImg;
		    img.image = kitchensData[i].data.kitchenImg;
		    img.big = kitchensData[i].data.kitchenImg;
		    img.title = 'Sample kitchen ' + kitchensData[i].data.kitchenId;
		    img.description = 'Description of img : ' + kitchensData[i].data.kitchenId;
		    kitchensImgs.push(img);
	    }
	    Galleria.loadTheme('galleria/themes/azur/galleria.azur.min.js');
	    Galleria.run('#galleria', {
		   dataSource: kitchensImgs 
	    });
	    
	    var loginForm = this.getLogin();
        
        var username =  window.localStorage.getItem('myocUsername');
		var password =	window.localStorage.getItem('myocPassword');
		var remember = 	window.localStorage.getItem('myocRemember');
        
        if(window.localStorage.getItem('myocUsername') !== null ) {
        
			loginForm.down('textfield[name="loginUsername"]').setValue(username);
			loginForm.down('textfield[name="loginPassword"]').setValue(password);
			loginForm.down('checkbox[name="loginRemember"]').setValue(remember);
		}
    }
});