Ext.define('MYOCD.controller.others.OtherStoresController', {
	extend: 'Ext.app.Controller',
	singleton: true,
	refs: [
	],
	
	loadUserProfile: function(callBackFunction) {
		Ext.Ajax.request({
			url: API_USER_URL,
			method: 'GET',
            withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(res) {
	            var userData = Ext.decode(res.responseText);
	            Ext.getStore('others.UserProfiles').loadRawData(userData);
	            callBackFunction();
            },
            failure: function(res) {
	            console.log(res);
            }
		});	
	},
	
	loadValueTypes: function() {
		Ext.Ajax.request({
			url: API_VALUETYPES_URL,
			method: 'GET',
            withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(res) {
	            var valueTypeData = Ext.decode(res.responseText);
	            Ext.getStore('others.ValueTypes').loadRawData(valueTypeData);
            },
            failure: function(res) {
	            console.log(res);
            }
		});
	},
	
	loadMeasureUnits: function() {
		Ext.Ajax.request({
			url: API_UNIT_OF_MEASURES_URL,
			method: 'GET',
            withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(res) {
	            var measureUnitData = Ext.decode(res.responseText);
	            Ext.getStore('others.MeasureUnits').loadRawData(measureUnitData);
            },
            failure: function(res) {
	            console.log(res);
            }
		});
	},
	
	searchCompaniesWithKeyWord: function(keyword, inView) {
		if(inView !== null) {
			inView.setLoading('Searching companies ... ');
		}
		Ext.Ajax.request({
			url: API_SEARCH_COMPANIES_BASE_URL + '*',
			method: 'GET',
            withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(res) {
            	if(inView !== null) {
					inView.setLoading(false);
				}
	            var companiesData = Ext.decode(res.responseText);
	            Ext.getStore('company.SearchCompanies').loadRawData(companiesData);
	            Ext.getStore('company.SearchCompanies').filterBy(
	            	function(item) {
		            	return item.get('name').toLowerCase().search(keyword.toLowerCase()) !== -1;
	            	}
	            );
            },
            failure: function(res) {
	            console.log(res);
	            if(inView !== null) {
					inView.setLoading(false);
				}
            }

		});
	},
	
	loadSearchCompanyProfile: function(companyId, companyType, companyName, inView) {
		if(inView !== null) {
			inView.setLoading('Loading company profile ... ');
		}
		Ext.Ajax.request({
			url: API_COMPANIES_BASE_URL + companyId +'/companyprofiles.json',
			method: 'GET',
            withCredentials : true,
            useDefaultXhrHeader : false,
            success: function(res) {
            	if(inView !== null) {
					inView.setLoading(false);
				}
	            var companyData = Ext.decode(res.responseText);
	            var profile = new Object();
	            profile.name = companyName;
	            profile.description = companyType;
	            profile.address = companyData.company_profile.address;
	            profile.email = companyData.company_profile.email;
	            profile.phone = companyData.company_profile.phone;
	            Ext.getStore('company.SearchCompanyProfiles').removeAll();
	            Ext.getStore('company.SearchCompanyProfiles').add(profile);
            },
            failure: function(res) {
	            console.log(res);
	            if(inView !== null) {
					inView.setLoading(false);
				}
            }

		});
	}
});