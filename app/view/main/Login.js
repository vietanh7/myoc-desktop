Ext.define('MYOCD.view.main.Login',{
	extend: 'Ext.Container',
	xtype: 'login',
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
		
	padding: 10,
	items: [
		{
			xtype: 'container',
			layout: {
				type: 'hbox',
				align: 'stretch',
				pack: 'center'
			},
			items: [
				{
					xtype: 'button',
					cls: 'facebookLoginBtn',
					width: 40,
					height: 40,
					margin: '5 10 5 10',
				},
				{
					xtype: 'button',
					cls: 'twitterLoginBtn',
					width: 40,
					height: 40,
					margin: '5 10 5 10',
				},
				{
					xtype: 'button',
					cls: 'googleLoginBtn',
					width: 40,
					height: 40,
					margin: '5 10 5 10',
				},
			]
		},
		{
			xtype: 'container',
			html: '<div align="center"><font color="Black" size="3">Or</font></div>'
		},
		{
			xtype: 'container',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'center'
			},
			items: [
				{
					xtype: 'textfield',
					name: 'loginUsername',
					emptyText: 'Email',
					margin: '5 10 5 10',
				},
				{
					xtype: 'textfield',
					name: 'loginPassword',
					emptyText: 'Password',
					inputType: 'password',
					margin: '0 10 5 10',
				},
				{
					xtype: 'checkbox',
					name: 'loginRemember',
					boxLabel: 'Remember',
					margin: '0 10 5 10',
				},
				{
					xtype: 'button',
					html: 'Sign in',
					cls: 'loginBtn',
					margin: '5 10 5 10',
					height: 25,
					flex: 1,
					padding: 3
				},
				{
					xtype: 'button',
					html: 'Forgot password',
					cls: 'loginBtn',
					height: 25,
					margin: '5 10 5 10',
					flex: 1,
					padding: 3
				},
				{
					xtype: 'container',
					html: '<div align="center"><font color="Black" size="2">Don\'t have an account</font></div>'
				},
				{
					xtype: 'button',
					name: 'createAccountBtn',
					text: 'Sign up',
					height: 25,
					margin: '5 10 5 10',
				},
			]
		},

	]
});