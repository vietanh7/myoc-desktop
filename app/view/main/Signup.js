Ext.define('MYOCD.view.main.Signup',{
	extend: 'Ext.window.Window',
	xtype: 'signup',
	modal: true,
	width: 500,
	height: 260,
	title: 'Sign Up',
	cls: 'customWindow',
	constrainHeader:true,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	items: [
		{
			xtype: 'fieldset',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'textfield',
					name: 'userName',
					fieldLabel: 'User Name',
					emptyText: 'Enter your email here',
					labelWidth: 110
				},
				{
					xtype: 'textfield',
					name: 'password',
					inputType: 'password',
					fieldLabel: 'Password',
					labelWidth: 110
				},
				{
					xtype: 'textfield',
					name: 'rePassword',
					inputType: 'password',
					fieldLabel: 'Re-Type',
					labelWidth: 110
				},
				{
					xtype: 'textfield',
					name: 'firstName',
					fieldLabel: 'First Name',
					labelWidth: 110	
				},
				{
					xtype: 'textfield',
					name: 'lastName',
					fieldLabel: 'Last Name',
					labelWidth: 110	
				}
			]
		},
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
					name: 'signUpBtn',
					text: 'Sign Up',
					width: 100
				}
			]
		}
	]
});