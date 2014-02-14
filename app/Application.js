// Ext.override(Ext.Window, {
//     beforeShow : function(){

//         if(this.position === 'cascade'){
//             if( MYOCD.SharedData.windowPosition.length == 0) {
//                 MYOCD.SharedData.windowPosition.push(
//                     {
//                         id: this.id,
//                         position: {
//                             x: this.x,
//                             y: this.y
//                         }
    
//                     }
//                 );
//                 return;
//             }
//             var tempX = MYOCD.SharedData.windowPosition[0].position.x;
//             var tempY = MYOCD.SharedData.windowPosition[0].position.y;
//             //console.log(MYOCD.SharedData.windowPosition);
//             //console.log(tempX.toString() +'-'+ tempY.toString());
//             for(var i = 0; i < MYOCD.SharedData.windowPosition.length; i++) {
//                 if(MYOCD.SharedData.windowPosition[i].position.x == tempX) {
//                     //console.log('position increase');
//                     tempX += 50;
//                     tempY += 50;
//                     continue;
//                 } else {
//                     break;
//                 }
//             }
//             this.x = tempX;
//             this.y = tempY;
//             MYOCD.SharedData.windowPosition.push(
//                 {
//                     id: this.id,
//                     position: {
//                         x: tempX,
//                         y: tempY
//                     }

//                 }
//             );
//         }
//         this.el.setLeftTop(this.x, this.y);
//     },
//     listeners: {
//         move: function() {
//             //console.log('move');
//             for(var i = 0; i < MYOCD.SharedData.windowPosition.length; i++) {
//                 if(MYOCD.SharedData.windowPosition[i].id == this.id){
//                     MYOCD.SharedData.windowPosition.splice(i, 1);
//                     break;
//                 }
//             }
//         },
//         close: function() {
//             for(var i = 0; i < MYOCD.SharedData.windowPosition.length; i++) {
//                 if(MYOCD.SharedData.windowPosition[i].id == this.id){
//                     MYOCD.SharedData.windowPosition.splice(i, 1);
//                     break;
//                 }
//             }
//         }
//     }


// });


Ext.define('MYOCD.Application', {
    name: 'MYOCD',

    extend: 'Ext.app.Application',

    requires: [
        'Skirtle.grid.column.Component',
        'MYOCD.Global', 'MYOCD.SharedData', 'MYOCD.NotifCenter',
        'MYOCD.controller.workspace.WorkspaceStoreController',
        'MYOCD.controller.project.ProjectsStoreController',
        'MYOCD.controller.project.getItemByView.ItemInViewStoreController',

        //////////////////
        /// new store controller for new APIs
        //////////////////
        'MYOCD.controller.main.AssociatedTypesStoreController',
        'MYOCD.controller.main.UserStoreController',
        'MYOCD.controller.main.ContactStoreController',
        'MYOCD.controller.user.UserWorkspaceProfileStoreController',
        'MYOCD.controller.company.CompaniesStoreController',
        'MYOCD.controller.company.CompanySettingsController',
        'MYOCD.controller.companyTemplate.CompanyTemplatesStoreController',
        'MYOCD.controller.companyTemplate.RefCompanyTemplatesStoreController',
        'MYOCD.controller.communityTemplate.CommunityTemplatesStoreController',
        'MYOCD.controller.communityTemplate.RefCommunityTemplatesStoreController',
        'MYOCD.controller.classification.ClassificationsStoreController',
        'MYOCD.controller.classification.RefClassificationsStoreController',
        'MYOCD.controller.roleLibrary.RoleLibraryStoreController',
        'MYOCD.controller.roleLibrary.RefRoleLibraryStoreController',
        'MYOCD.controller.objectTypeLibrary.ObjectTypesStoreController',
        'MYOCD.controller.objectTypeLibrary.RefObjectTypesStoreController',
        'MYOCD.controller.permissionLibrary.PermissionLibraryStoreController',
        'MYOCD.controller.permissionLibrary.RefPermissionLibraryStoreController',
        'MYOCD.controller.productCatalog.ProductCatalogsStoreController',
        'MYOCD.controller.productCatalog.RefProductCatalogsStoreController',
        'MYOCD.controller.jobCatalog.JobCatalogsStoreController',
        'MYOCD.controller.jobCatalog.RefJobCatalogsStoreController',
        'MYOCD.controller.projectTemplate.ProjectTemplatesStoreController',
        'MYOCD.controller.projectTemplate.RefProjectTemplatesStoreController',
        'MYOCD.controller.featureTemplate.FeatureTemplatesStoreController',
        'MYOCD.controller.featureTemplate.RefFeatureTemplatesStoreController',
        'MYOCD.controller.viewTemplate.ViewLibraryStoreController',
        'MYOCD.controller.viewTemplate.RefViewLibraryStoreController',
        'MYOCD.controller.authorization.AuthorizationStoreController',
        'MYOCD.controller.attributeAction.AttributeActionStoreController',

        'MYOCD.controller.modules.ModulesStoreController',

        'MYOCD.model.objectTypeLibrary.ParentType'
    ],
    
    stores: [
        'Blogs', 'HomeownerTips', 'WeeklyDeals', 'Kitchens', 'Workspace',
        'company.CompanyRoles', 'company.AssignedRoles', 'company.AssignedUsers', 'company.AssignedOrgs', 'company.AuthorizationEntities',
        'company.SearchCompanies', 'company.WorkspaceViews',
        
        'others.ValueTypes', 'others.MeasureUnits', 'others.UserProfiles',
        
        'project.Projects', 'project.FeaturesTreeStore', 'project.FeatureAttributes', 'project.FeatureInheritedAttributes',  
        'project.ProjectProducts', 'project.ProjectProductAttributes', 'project.FeaturesVersionTreeStore', 
        'project.FeatureTagVersions', 
        'project.FeatureVersionProducts', 'project.ProductItemAttributes', 'project.security.ProjectRoles', 'project.security.ProjectRoleUsersAndRoles',
        'project.security.ProjectAuthorizationContexts',
        'project.FeatureAttributesInView',
        'project.ProductItemAttributesInView',
        
        
        /////////////////
        // new stores for new APIs
        /////////////////
        
        'main.Users', 'company.Companies', 'main.ContactPeople', 'main.ContactOrganizations', 'main.AssociatedTypes',
        'user.EmployeeProfiles', 'user.PersonalProfiles',
        
        'companyTemplate.CompanyTemplatesLibs', 'companyTemplate.CompanyTemplatesCategoriesTreeStore', 'companyTemplate.CompanyTemplates',
        'companyTemplate.RefCompanyTemplatesLibs', 'companyTemplate.RefCompanyTemplatesCategoriesTreeStore', 'companyTemplate.RefCompanyTemplates',
        'companyTemplate.PublicCompanyTemplatesLibs',
        
        'communityTemplate.CommunityTemplateLibs', 'communityTemplate.CommunityTemplatesCategoriesTreeStore', 
        'communityTemplate.CommunityTemplates', 'communityTemplate.PublicCommunityTemplateLibs',
        
        'classification.ClassificationsLibraries', 'classification.ClassificationsCategoriesTreeStore', 'classification.Classifications',
        'classification.PublicClassificationLibraries',
        
        'roleLibrary.RoleLibraries', 'roleLibrary.RoleCategoriesTreeStore', 'roleLibrary.Roles',
        'roleLibrary.RefRoleLibraries', 'roleLibrary.RefRoleCategoriesTreeStore', 'roleLibrary.RefRoles', 'roleLibrary.PublicRoleLibraries',
        
        'objectTypeLibrary.ObjectTypeLibraries', 'objectTypeLibrary.ObjectTypeCategoriesTreeStore', 'objectTypeLibrary.ObjectTypes',
        'objectTypeLibrary.RefObjectTypeLibraries', 'objectTypeLibrary.RefObjectTypeCategoriesTreeStore', 'objectTypeLibrary.RefObjectTypes',
        'objectTypeLibrary.ObjectTypeAttributes', 'objectTypeLibrary.RefObjectTypeVersions', 'objectTypeLibrary.PublicObjectTypeLibraries',
        
        'permissionLibrary.PermissionLibraries', 'permissionLibrary.PermissionCategoriesTreeStore', 'permissionLibrary.Permissions',
        'permissionLibrary.RefPermissionLibraries', 'permissionLibrary.RefPermissionCategoriesTreeStore', 'permissionLibrary.RefPermissions',
        'permissionLibrary.PublicPermissionLibraries',
        
        'productCatalog.ProductCatalogLibs', 'productCatalog.ProductCatalogsCategoriesTreeStore', 'productCatalog.Products', 'productCatalog.ProductAttributes',
        'productCatalog.RefProductCatalogLibs', 'productCatalog.RefProductCatalogsCategoriesTreeStore', 'productCatalog.RefProducts',
        'productCatalog.PublicProductCatalogLibs',
        
        'jobCatalog.JobCatalogLibs', 'jobCatalog.JobCatalogsCategoriesTreeStore', 'jobCatalog.Jobs', 'jobCatalog.JobAttributes', 'jobCatalog.PublicJobCatalogLibraries',
        
        'projectTemplate.ProjectTemplatesLibs', 'projectTemplate.ProjectTemplatesCategoriesTreeStore', 'projectTemplate.ProjectTemplates',
        'projectTemplate.ProjectTemplateFeatureTreeStore', 'projectTemplate.FeatureAttributes', 'projectTemplate.Products',
        'projectTemplate.ProductItemAttributes',
        'projectTemplate.RefProjectTemplatesLibs', 'projectTemplate.RefProjectTemplatesCategoriesTreeStore', 'projectTemplate.RefProjectTemplates',
        'projectTemplate.PublicProjectTemplateLibs',
        
        'featureTemplate.FeatureTemplatesLibs', 'featureTemplate.FeatureTemplatesCategoriesTreeStore', 'featureTemplate.FeatureTemplates',
        'featureTemplate.FeatureTemplateFeatureTreeStore', 'featureTemplate.FeatureAttributes', 'featureTemplate.Products',
        'featureTemplate.RefFeatureTemplatesLibs', 'featureTemplate.RefFeatureTemplatesCategoriesTreeStore', 'featureTemplate.RefFeatureTemplates',
        'featureTemplate.ProductItemAttributes', 'featureTemplate.PublicFeatureTemplatesLibs',
        
        'viewTemplate.ViewLibraries', 'viewTemplate.ViewCategoriesTreeStore', 'viewTemplate.ViewTemplates', 'viewTemplate.PublicViewLibraries',
        'viewTemplate.NewViewTemplateObjectTypes', 'viewTemplate.AvailableFields', 'viewTemplate.SortingFields', 'viewTemplate.Filters', 'viewTemplate.ObjectTypesColumns',
        'viewTemplate.GroupByFields', 'viewTemplate.Aggregations',
        'viewTemplate.RefViewLibraries', 'viewTemplate.RefViewCategoriesTreeStore', 'viewTemplate.RefViewTemplates', 
        
        'authorization.RoleAuthorizationContexts', 'authorization.EmployeeProfileAuthorizationContexts', 'authorization.OrganizationAuthorizationContexts',
        'authorization.AuthorizationContexts', 'authorization.AuthorizationContextRoleUsersAndRoles', 'authorization.AuthorizationActionsPermissions',
        'authorization.RefContactOrganizations', 'authorization.RefContactPeople',
        
        'attributeAction.AttributeActions'

    ],
    
    controllers: [
        'main.Main', 'main.Login', 
        'workspace.Workspace', 
        
        'wsWindowsController.CreateCompanyController', 'wsWindowsController.CreateCompanySelectTemplateController', 'wsWindowsController.JoinCompanyController',
        
        'project.ProjectController', 'project.ProjectEstimatingController', 'project.NewProjectFeatureFromOtlsController', 'project.EditFeatureController',
        'project.NewProjectFeatureFromTplsController', 'project.AddProductController', 'project.security.ProjectSecurityController', 
        'project.security.ProjectSecuritySelectRoleController', 'project.security.ProjectUsersPermissionsController',
        'project.NewProjectController', 'project.SaveFeatureAsTemplateController', 'project.GetItemsByViewController',
        'project.getItemByView.ItemInViewController',

                
        'workspaceToolbar.WorkspaceToolbarController', 'workspaceToolbar.ProfileEditorController',
        'workspaceToolbar.securityDialog.SecurityController', 'workspaceToolbar.securityDialog.SecurityDialogSelectRoleController',
        'workspaceToolbar.securityDialog.SecurityDialogSelectPermissionController',
        'workspaceToolbar.ContactController',
        'workspaceToolbar.settingsDialog.SettingsController', 'workspaceToolbar.settingsDialog.AddViewToWorkspaceController',
                
        'companyTemplate.CompanyTemplatesController', 'companyTemplate.CompanyTemplatesLibManagerController',
        'communityTemplate.CommunityTemplatesController', 'communityTemplate.CommunityTemplatesLibManagerController',
        'classification.ClassificationsController', 'classification.ClassificationsLibraryManagerController',
        'roleLibrary.RoleLibraryController', 'roleLibrary.RoleLibraryManagerController', 'roleLibrary.NewRoleController', 'roleLibrary.SelectPermissionController',
        'objectTypeLibrary.ObjectTypesController', 'objectTypeLibrary.ObjectTypeLibraryManagerController', 'objectTypeLibrary.NewObjectTypeController',
        'permissionLibrary.PermissionLibraryController', 'permissionLibrary.PermissionLibraryManagerController',
        'productCatalog.ProductCatalogsController', 'productCatalog.ProductCatalogsLibraryManagerController', 'productCatalog.NewProductController',
        'productCatalog.GetProductsByViewController',
        'jobCatalog.JobCatalogsController', 'jobCatalog.JobCatalogsLibraryManagerController', 'jobCatalog.NewJobController',
        
        //temporary
        'authorization.AuthorizationController', 'authorization.SelectPermissionForAuthorizationController', 'authorization.SelectRoleForAuthorizationController',
        
        'projectTemplate.ProjectTemplatesController', 'projectTemplate.ProjectTemplatesLibManagerController', 
        'projectTemplate.NewProjectTemplateController', 'projectTemplate.ProjectTemplateManagerController',
        'projectTemplate.NewProjectTemplateFeatureFromOtlsController', 'projectTemplate.EditProjectTemplateFeatureController', 'projectTemplate.AddProductController',
        'projectTemplate.NewProjectTemplateFeatureFromTplsController',
        
        'featureTemplate.FeatureTemplatesController', 'featureTemplate.FeatureTemplatesLibManagerController', 
        'featureTemplate.NewFeatureTemplateController', 'featureTemplate.FeatureTemplateManagerController',
        'featureTemplate.NewFeatureFromOtlsController', 'featureTemplate.EditFeatureController', 'featureTemplate.AddProductController',
        'featureTemplate.NewFeatureFromTplsController',
        
        'viewTemplate.ViewLibraryController', 'viewTemplate.ViewLibraryManagerController', 'viewTemplate.NewViewTemplateController', 'viewTemplate.NewViewTemplateSelectObjectTypeController',
        'viewTemplate.NewViewTemplateWithTabsController', 'viewTemplate.NewViewTemplateAggregationEditorController',
        'viewTemplate.NewViewTemplateFilterEditorController',
        
        'attributeAction.AttributeActionController', 'attributeAction.SelectPermissionForActionController'
        
    ],

    launch: function(){
        this.viewport = Ext.ComponentQuery.query('viewport')[0];
        MYOCD.SharedData.windowPosition = [];
        MYOCD.SharedData.application = this; 
    }
});
