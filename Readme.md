# MYOCD/app

This folder contains the javascript files for the application.

# MYOCD/resources

This folder contains static resources (typically an `"images"` folder as well).

# MYOCD/overrides

This folder contains override classes. All overrides in this folder will be 
automatically included in application builds if the target class of the override
is loaded.

# MYOCD/sass/etc

This folder contains misc. support code for sass builds (global functions, 
mixins, etc.)

# MYOCD/sass/src

This folder contains sass files defining css rules corresponding to classes
included in the application's javascript code build.  By default, files in this 
folder are mapped to the application's root namespace, 'MYOCD'. The
namespace to which files in this directory are matched is controlled by the
app.sass.namespace property in MYOCD/.sencha/app/sencha.cfg. 

# MYOCD/sass/var

This folder contains sass files defining sass variables corresponding to classes
included in the application's javascript code build.  By default, files in this 
folder are mapped to the application's root namespace, 'MYOCD'. The
namespace to which files in this directory are matched is controlled by the
app.sass.namespace property in MYOCD/.sencha/app/sencha.cfg. 
