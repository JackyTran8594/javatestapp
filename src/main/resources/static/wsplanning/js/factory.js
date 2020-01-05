UserWebApp.factory('CommonFactory', function ($http, HttpService, $translate, $q) {
    var transactionTypes = [];
    var departments = [];
    var visitReasons = [];
    var workOrderStatuses = [];
    var subStatuses = [];
    var serviceAdvisors = [];
    var jobTypes = [];
    var jobCats = [];
    var lstPayer = [];
    var lstShifts = [];
    var lstChargeCats = [];
    var customers = [];
    var vehicles = [];
    var sites = [];

    var siteId = "";
    var stamping = "";

    function getSite() {
        if (!sites || sites.length <= 0) {
            sites = $http.get('/site/getAll', {})
                .then(function (data) {
                    return data.data;
                })
                .catch(function (reason) {
                    throw new Error(reason.message);
                });
        }

        return sites;

        // if (!sites || sites.length <= 0) {
        //   var deferred = $q.defer();
        //   $http.get('/site/getAll', {}).then(function successCallback(response) {
        //     sites = response.data;
        //     deferred.resolve(sites);
        //   }, function errorCallback(response) {
        //     console.error(response);
        //     deferred.reject(sites);
        //   });
        // }
        // return sites;
    };

    function getStamping() {
        if (!stamping || stamping.length <= 0) {
            stamping = $http.get('/site/getStamping', {})
                .then(function (data) {
                    return data.data;
                })
                .catch(function (reason) {
                    throw new Error(reason.message);
                });
        }

        return stamping;

        // if (!stamping || stamping.length <= 0) {
        //   var deferred = $q.defer();
        //   $http.get('/site/getStamping', {}).then(function successCallback(response) {
        //     stamping = response.data;
        //     deferred.resolve(stamping);
        //   }, function errorCallback(response) {
        //     console.error(response);
        //     deferred.reject(stamping);
        //   });
        // }
        // return stamping;
    };

    function getJobTypes() {
        if (!jobTypes || jobTypes.length <= 0) {
            jobTypes = $http.get('/site/getJobTypes', {})
                .then(function (data) {
                    data.data.unshift({"Id": "", "Name": $translate.instant('pleaseSelect')});
                    return data.data;
                })
                .catch(function (reason) {
                    throw new Error(reason.message);
                });
        }

        return jobTypes;

        // if (!jobTypes || jobTypes.length <= 0) {
        //   var deferred = $q.defer();
        //   $http.get('/site/getJobTypes', {}).then(function successCallback(response) {
        //     response.data.unshift({ "Id": "", "Name": $translate.instant('pleaseSelect') });
        //     jobTypes = response.data;
        //     deferred.resolve(jobTypes);
        //   }, function errorCallback(response) {
        //     console.error(response);
        //     deferred.reject(jobTypes);
        //   });
        // }
        // return jobTypes;
    };

    function getJobCats() {
        if (!jobCats || jobCats.length <= 0) {
            jobCats = $http.get('/site/getJobCats', {cache: true})
                .then(function (data) {
                    data.data.unshift({"Id": "", "Name": $translate.instant('pleaseSelect')});
                    return data.data;
                })
                .catch(function (reason) {
                    throw new Error(reason.message);
                });
        }

        return jobCats;

        // if (!jobCats || jobCats.length <= 0) {
        //   var deferred = $q.defer();
        //   $http.get('/site/getJobCats', {}).then(function successCallback(response) {
        //     response.data.unshift({ "Id": "", "Name": $translate.instant('pleaseSelect') });
        //     jobCats = response.data;
        //     deferred.resolve(jobCats);
        //   }, function errorCallback(response) {
        //     console.error(response);
        //     deferred.reject(jobCats);
        //   });
        // }
        // return jobCats;
    };

    function getPayers() {
        if (!lstPayer || lstPayer.length <= 0) {
            lstPayer = $http.get('/site/getPayers', {cache: true})
                .then(function (data) {
                    data.data.unshift({"Id": "", "Name": $translate.instant('pleaseSelect')});
                    return data.data;
                })
                .catch(function (reason) {
                    throw new Error(reason.message);
                });
        }

        return lstPayer;

        // if (!lstPayer || lstPayer.length <= 0) {
        //   var deferred = $q.defer();
        //   $http.get('/site/getPayers', {}).then(function successCallback(response) {
        //     response.data.unshift({ "Id": "", "Name": $translate.instant('pleaseSelect') });
        //     lstPayer = response.data;
        //     deferred.resolve(lstPayer);
        //   }, function errorCallback(response) {
        //     console.error(response);
        //     deferred.reject(lstPayer);
        //   });
        // }
        // return lstPayer;
    };

    function getShifts() {
        if (!lstShifts || lstShifts.length <= 0) {
            lstShifts = $http.get('/site/getShifts', {})
                .then(function (data) {
                    data.data.unshift({"Id": "", "Name": $translate.instant('pleaseSelect')});
                    return data.data;
                })
                .catch(function (reason) {
                    throw new Error(reason.message);
                });
        }

        return lstShifts;

        // if (!lstShifts || lstShifts.length <= 0) {
        //   var deferred = $q.defer();
        //   $http.get('/site/getShifts', {}).then(function successCallback(response) {
        //     response.data.unshift({ "Id": "", "Name": $translate.instant('pleaseSelect') });
        //     lstShifts = response.data;
        //     deferred.resolve(lstShifts);
        //   }, function errorCallback(response) {
        //     console.error(response);
        //     deferred.reject(lstShifts);
        //   });
        // }
        // return lstShifts;
    };

    function getChargeCats() {
        if (!lstChargeCats || lstChargeCats.length <= 0) {
            var deferred = $q.defer();
            $http.get('/site/getChargeCats', {}).then(function successCallback(response) {
                response.data.unshift({"Id": "", "Name": $translate.instant('pleaseSelect')});
                lstChargeCats = response.data;
                deferred.resolve(lstChargeCats);
            }, function errorCallback(response) {
                console.error(response);
                deferred.reject(lstChargeCats);
            });
        }
        return lstChargeCats;
    };

    function getVisitReasons() {
        if (!visitReasons || visitReasons.length <= 0) {
            visitReasons = $http.get('/site/getVisitReasons', {})
                .then(function (data) {
                    data.data.unshift({"Id": "", "Name": $translate.instant('pleaseSelect')});
                    return data.data;
                })
                .catch(function (reason) {
                    throw new Error(reason.message);
                });
        }

        return visitReasons;

        // if (!visitReasons || visitReasons.length <= 0) {
        //   var deferred = $q.defer();
        //   $http.get('/site/getVisitReasons', {}).then(function successCallback(response) {
        //     response.data.unshift({ "Id": "", "Name": $translate.instant('pleaseSelect') });
        //     visitReasons = response.data;
        //     deferred.resolve(visitReasons);
        //   }, function errorCallback(response) {
        //     console.error(response);
        //     deferred.reject(visitReasons);
        //   });
        // }
        // return visitReasons;
    };

    function getServiceAdvisors() {
        if (!serviceAdvisors || serviceAdvisors.length <= 0) {
            serviceAdvisors = $http.get('/site/getServiceAdvisors', {})
                .then(function (data) {
                    data.data.unshift({"Id": "", "Name": $translate.instant('pleaseSelect')});
                    return data.data;
                })
                .catch(function (reason) {
                    throw new Error(reason.message);
                });
        }

        return serviceAdvisors;

        // if (!serviceAdvisors || serviceAdvisors.length <= 0) {
        //   var deferred = $q.defer();
        //   $http.get('/site/getServiceAdvisors', {}).then(function successCallback(response) {
        //     response.data.unshift({ "Id": "", "Name": $translate.instant('pleaseSelect') });
        //     serviceAdvisors = response.data;
        //     deferred.resolve(serviceAdvisors);
        //   }, function errorCallback(response) {
        //     console.error(response);
        //     deferred.reject(serviceAdvisors);
        //   });
        // }
        // return serviceAdvisors;
    };

    function getTransactionTypes() {
        if (!transactionTypes || transactionTypes.length <= 0) {
            console.log("------getTransactionTypes use http----");
            transactionTypes = $http.get('/site/getTransactionTypes', {cache: true})
                .then(function (data) {
                    data.data.unshift({"Id": "", "Name": $translate.instant('pleaseSelect')});
                    return data.data;
                })
                .catch(function (reason) {
                    throw new Error(reason.message);
                });
        }

        return transactionTypes;

        // console.log("-------getTransactionTypes: " + transactionTypes.length);
        // var deferred = $q.defer();
        // if (!transactionTypes || transactionTypes.length <= 0) {
        //   console.log("-------getTransactionTypes https-----");
        //   $http.get('/site/getTransactionTypes', {}).then(function successCallback(response) {
        //     response.data.unshift({ "Id": "", "Name": $translate.instant('pleaseSelect') });
        //     transactionTypes = response.data;
        //     console.log("-------getTransactionTypes http: " + transactionTypes.length);
        //     deferred.resolve(transactionTypes);
        //   }, function errorCallback(response) {
        //     console.error(response);
        //     deferred.reject(transactionTypes);
        //   });
        // }
        // deferred.resolve(transactionTypes);
        // return deferred.promise;
    };

    function getDepartments() {
        // if (!departments || departments.length <= 0) {
        //   console.log("------getTransactionTypes use http----");
        //   departments = $http.get('/site/getDepartments', {})
        //       .then(function (data) {
        //         data.data.unshift({ "Id": "", "Name": $translate.instant('pleaseSelect') });
        //         return data.data;
        //       })
        //       .catch(function (reason) {
        //         throw new Error(reason.message);
        //       });
        // }
        //
        // return departments;

        var deferred = $q.defer();
        if (!departments || departments.length <= 0) {
            $http.get('/site/getDepartments', {}).then(function successCallback(response) {
                response.data.unshift({"Id": "", "Name": $translate.instant('pleaseSelect')});
                departments = response.data;
                deferred.resolve(departments);
            }, function errorCallback(response) {
                console.error(response);
                deferred.reject(departments);
            });
        }
        deferred.resolve(departments);
        return deferred.promise;
    };

    function getWorkOrderStatuses() {
        if (!workOrderStatuses || workOrderStatuses.length <= 0) {
            workOrderStatuses = $http.get('/site/getWorkOrderStatuses', {})
                .then(function (data) {
                    data.data.unshift({"Id": "", "Name": $translate.instant('pleaseSelect')});
                    return data.data;
                })
                .catch(function (reason) {
                    throw new Error(reason.message);
                });
        }

        return workOrderStatuses;

        // if (!workOrderStatuses || workOrderStatuses.length <= 0) {
        //   var deferred = $q.defer();
        //   $http.get('/site/getWorkOrderStatuses', {}).then(function successCallback(response) {
        //     response.data.unshift({ "Id": "", "Name": $translate.instant('pleaseSelect') });
        //     workOrderStatuses = response.data;
        //     deferred.resolve(workOrderStatuses);
        //   }, function errorCallback(response) {
        //     console.error(response);
        //     deferred.reject(workOrderStatuses);
        //   });
        // }
        // return workOrderStatuses;
    };

    function getSubStatuses() {
        if (!subStatuses || subStatuses.length <= 0) {
            subStatuses = $http.get('/site/getSubStatuses', {})
                .then(function (data) {
                    data.data.unshift({"Id": "", "Name": $translate.instant('pleaseSelect')});
                    return data.data;
                })
                .catch(function (reason) {
                    throw new Error(reason.message);
                });
        }

        return subStatuses;

        // if (!subStatuses || subStatuses.length <= 0) {
        //   var deferred = $q.defer();
        //   $http.get('/site/getSubStatuses', {}).then(function successCallback(response) {
        //     response.data.unshift({ "Id": "", "Name": $translate.instant('pleaseSelect') });
        //     subStatuses = response.data;
        //     deferred.resolve(subStatuses);
        //   }, function errorCallback(response) {
        //     console.error(response);
        //     deferred.reject(subStatuses);
        //   });
        // }
        // return subStatuses;
    };


    getSite();
    getStamping();
    getJobTypes();
    getJobCats();
    getPayers();
    getShifts();
    getChargeCats();
    getVisitReasons();
    getServiceAdvisors();
    getTransactionTypes();
    getDepartments();

    return {
        getSite: getSite,
        getStamping: getStamping,
        getJobTypes: getJobTypes,
        getJobCats: getJobCats,
        getPayers: getPayers,
        getShifts: getShifts,
        getChargeCats: getChargeCats,
        getVisitReasons: getVisitReasons,
        getServiceAdvisors: getServiceAdvisors,
        getTransactionTypes: getTransactionTypes,
        getDepartments: getDepartments,
        getWorkOrderStatuses: getWorkOrderStatuses,
        getSubStatuses: getSubStatuses,
        doQuery: function (type) {
            var d = $q.defer();

            $http.get('/site/' + type, {})
                .then(function (data) {
                    data.data.unshift({"Id": "", "Name": $translate.instant('pleaseSelect')});
                    d.resolve(data.data);
                })
                .catch(function (reason) {
                    throw new Error(reason.message);
                });

            return d.promise;
        },
        getByType: function (type) {
            return $http.get('/site/' + type, {});
        }
    };
});

UserWebApp.factory('AutoCompleteService', ['$http', '$q', '$timeout', function ($http, $q, $timeout) {
    var AutoComplete = new Object();

    AutoComplete.getTextPredict = function (data) {
        var textData = $q.defer();
        var text = [];

        getTextPredict(data);

        function getTextPredict(data) {
            $http.post('/site/getTextPredict', data).then(function (res) {
                text = res.data;
            }, function (err) {
                console.log(err);
            })
        }

        $timeout(function () {
            textData.resolve(text)
        }, 1000)

        return textData.promise;

    }

    return AutoComplete;
}])