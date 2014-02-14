Ext.define('MYOCD.controller.main.Login', {
    extend: 'Ext.app.Controller',
    requires: [
    	'Ext.window.MessageBox',
    	'Ext.History',
    	'Ext.container.Viewport'
    ],

    refs: [
        {
            ref: 'login',
            selector: 'login'
        },
        {
	      	ref: 'signup',
	      	selector: 'signup'  
        },
        {
            ref: 'main',
            selector: 'main'
        },
        {
            ref: 'viewport',
            selector: 'viewport'
        },
        {
            ref: 'workspacepersonal',
            selector: 'workspacepersonal'
        }
    ],

    init: function() {
    	Ext.History.init();
        this.control({
            'button[cls=loginBtn]': {
                'click': this.onLoginBtnClick
            },
		    'viewport': {
			    render: this.onViewportRendered
		    },
            'menuitem[name=logoutBtn]': {
                'click': this.onLogoutBtnClick
            },
            'button[name="signUpBtn"]': {
	            click: this.onSignUpBtnClick
            },
            'button[name="createAccountBtn"]': {
	            click: this.onCreateAccountBtnClick
            }
		    
        });
    },
    
    onViewportRendered: function() {
    	me = this;
    },
       
    onLoginBtnClick: function() {
	    var me = this;
        var username, password, remember;
        var loginForm = this.getLogin();

        username = loginForm.down('textfield[name="loginUsername"]').getValue();
        password = loginForm.down('textfield[name="loginPassword"]').getValue();
        remember = loginForm.down('checkbox[name="loginRemember"]').getValue();

		me.getViewport().setLoading('Logging in ...');
		Ext.Ajax.request({
			url: USER_LOGIN_URL,
			method: 'POST',
			withCredentials: true,
			useDefaultXhrHeader: false,
			jsonData: {
				user: {
					email: username,
					password: password,
					remember_me: remember
				}	
			},
			success: function(data) {
				me.getViewport().setLoading(false);
				me.setActiveItems('workspace');
				if(remember) {
                    window.localStorage.setItem('myocUsername', username);
                    window.localStorage.setItem('myocPassword', password);
                    window.localStorage.setItem('myocRemember', remember);
                } else {
                    window.localStorage.removeItem('myocUsername');
                    window.localStorage.removeItem('myocPassword');
                    window.localStorage.removeItem('myocRemember');
                }
			},
			failure: function() {
				me.getViewport().setLoading(false);
			}
		});

    },
   

    onLogoutBtnClick: function(btn) {
        console.log('Logout button click');
        var me = this;
        // Ext.Msg.confirm('Logout MYOC', 'Really want to logout?', function(btn) {
        //     if (btn == 'yes') {
        //         me.doLogout();
        //     };
        // });
        // Ext.Msg.confirm({
        //     title: 'Logout',
        //     msg: 'Really want to logout?',
        //     width: 200,
        //     buttons: Ext.Msg.YESNO,
        //     icon: Ext.Msg.QUESTION,
        //     fn: function(btn) {
        //         if(btn == 'yes') {
                    me.doLogout();                
        //         }
        //     }
        // });
    },

    doLogout: function() {
        var me = this;
        this.getViewport().setLoading('Logout...');
        Ext.Ajax.request({
            url: USER_SIGN_OUT_URL,
            method: 'GET',
            withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(response) {
                me.setActiveItems('main');
                me.getViewport().setLoading(false);
                window.localStorage.removeItem('myocUsername');
                window.localStorage.removeItem('myocPassword');
                Ext.WindowManager.each(function(item){
                    if (item.isXType('window'))
                        item.destroy();
                });
            },
            failure: function(response) {
                me.getViewport().setLoading(false);
            }
        });    
    },

    setActiveItems: function(className) {
        var viewportPanel = this.getViewport(),
            newItem;
        if (className == 'main') {
        	newItem = Ext.create('MYOCD.view.main.Main');
        } else if (className == 'workspace') {
        	newItem = Ext.create('MYOCD.view.Workspace');
        }

        viewportPanel.removeAll();
        viewportPanel.add(newItem);
    },
    
    onSignUpBtnClick: function() {
	    var me = this;
	    var loginForm = this.getLogin();
	    var userName = this.getSignup().down('textfield[name="userName"]').getValue();
	    var password = this.getSignup().down('textfield[name="password"]').getValue();
	    var rePassword = this.getSignup().down('textfield[name="rePassword"]').getValue();
	    var firstName = this.getSignup().down('textfield[name="firstName"]').getValue();
	    var lastName = this.getSignup().down('textfield[name="lastName"]').getValue();
	    
	    if(userName.trim().length == 0) {
		    Ext.Msg.alert('Error!', 'Missing username');
		    return;
	    }
	    if(password !== rePassword) {
		    Ext.Msg.alert('Error!', 'Passwords don\'t match');
		    return;
	    }
	    this.getSignup().destroy();
	    this.getMain().setLoading('Signing up...');
	    
	    Ext.Ajax.request({
		    url: USER_REGISTRATION_URL,
		    method: 'POST',
            withCredentials : true,
            useDefaultXhrHeader : false,
		    jsonData: {
		        user: {
			        email: userName,
			        password: password,
			        password_confirmation: rePassword,
			        first_name: firstName,
			        last_name: lastName
		        }
		    },
		    success: function(response){
		    	console.log(response);
		    	me.getMain().setLoading(false);
		    	loginForm.down('textfield[name="loginUsername"]').setValue(userName);
		    	loginForm.down('textfield[name="loginPassword"]').setValue(password);
				me.onLoginBtnClick();
                MYOCD.SharedData.firstSignUp = true;
		    	
		    },
		    failure: function(response) {
		    	me.getMain().setLoading(false);
		    	if (response.responseText.length > 0) {
			    	var responseObj = Ext.decode(response.responseText);
			    	console.log(responseObj);
			    	if(responseObj.email) {
				    	Ext.Msg.alert('Register failed', 'Email ' + responseObj.email[0]);
				    } else {
					    if(responseObj.password) {
						    Ext.Msg.alert('Register failed', 'Password ' + responseObj.password[0] + ' or ' + responseObj.password[1]);
					    }
				    } 
			    } else {
				    Ext.Msg.alert('Register failed', 'Please try again later');
			    }

		    }
		});  
    },
    onCreateAccountBtnClick: function() {
	    if(this.getSignup()) {
		    return
	    }
	    var popup = Ext.create('MYOCD.view.main.Signup');
	    popup.show();
    }
});