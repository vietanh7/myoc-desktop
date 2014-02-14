Ext.define('MYOCD.controller.modules.projectWidget.EditProjectProductController',{
	extend: 'Ext.app.Controller',
	refs: [
	],
	objectCreatedId: '',
	init: function() {
		var controller = new Object();
		controller['editProjectProductWidget[createdId="' + this.objectCreatedId + '"]' + ' button[name="updateProductBtn"]'] = {
			click: this.onUpdateProductBtnClick
		}
		this.application = MYOCD.SharedData.application;
		this.control(controller);
	},
	getEditProjectWidget: function() {
		return Ext.ComponentQuery.query('editProjectProductWidget[createdId="' + this.objectCreatedId + '"]')[0];
	},
	onUpdateProductBtnClick: function() {
		var editProjectProductWidget = this.getEditProjectWidget();
		var productId = editProjectProductWidget.down('textfield[name="productId"]').getValue();
		var productName = editProjectProductWidget.down('textfield[name="productName"]').getValue();
		var productDesc = editProjectProductWidget.down('textfield[name="productDesc"]').getValue();
		var productParentId = editProjectProductWidget.down('textfield[name="parentProductId"]').getValue();
		var productPrice = editProjectProductWidget.down('textfield[name="productPrice"]').getValue();
		var productQuantity = editProjectProductWidget.down('textfield[name="productQuantity"]').getValue();
		if (productName.length == 0) {
			return;
		}
		productParentId = productParentId.length > 0 ? productParentId : null;
		var projectStoreController = MYOCD.controller.project.ProjectsStoreController;
		projectStoreController.editProductRecord(productId, productName, productDesc, productParentId, productPrice, productQuantity, editProjectProductWidget.productRecord);
		editProjectProductWidget.destroy();
	}
});