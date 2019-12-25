UserWebApp.controller('WorkDetailCtrl', function ($scope, $rootScope, HttpService, $translate, $location, $filter, $uibModal, CommonServices, CommonFactory, $stateParams, $state, WorkOrder, lstMonth, WorkOrderService) {

    console.log("--------WorkDetailCtrl-----------");
    $scope.WorkOrderId = $stateParams.id;
    $scope.type = $stateParams.type;
    $scope.WOJobs = WorkOrder.data.WOJobs;
    $scope.lstMonth = lstMonth.data;
    $scope.jobObject = {};
    $scope.actionType = "";

    $scope.WOVehicle = "";
    $scope.WOCustomer = "";
    $scope.WOContact = "";

    $scope.WorkOrderData = WorkOrder.data;
    $scope.WorkOrder = WorkOrder.data;


    console.log($scope.WorkOrder);

    loadCommon();
    $scope.lstTrans = [];
    $scope.lstDepartment = [];
    $scope.lstServ = [];
    $scope.lstVisitReason = [];
    $scope.jobTypes = [];
    $scope.jobCats = [];
    $scope.lstChargeCats = [];
    $scope.lstPayer = [];
    $scope.lstShifts = [];

    function loadCommon() {
        $scope.lstTrans = CommonFactory.getTransactionTypes();
        $scope.lstVisitReason = CommonFactory.getVisitReasons();
        // $scope.lstDepartment = CommonFactory.getDepartments();
        // $scope.lstDepartmentSearch = $scope.lstDepartment.slice();
        // $scope.lstDepartmentSearch.shift();
        // $scope.lstDepartmentSearch.unshift({"Id": "", "Name": $translate.instant('all')});
        //
        $scope.lstServ = CommonFactory.getServiceAdvisors();
        $scope.jobTypes = CommonFactory.getJobTypes();
        $scope.jobCats = CommonFactory.getJobCats();
        $scope.lstPayer = CommonFactory.getPayers();
        // $scope.lstShifts = CommonFactory.getShifts();
        
        CommonServices.getDepartments().then(function (data) {
            $scope.lstDepartment = data;

            $scope.lstDepartmentSearch = $scope.lstDepartment.slice();
            $scope.lstDepartmentSearch.shift();
            $scope.lstDepartmentSearch.unshift({ "Id": "", "Name": $translate.instant('all') });
        });
   
        CommonServices.getShifts().then(function (data) {
            $scope.lstShifts = data;

            $scope.lstShiftSearch = $scope.lstShifts.slice();
            $scope.lstShiftSearch.shift();
            $scope.lstShiftSearch.unshift({"Id": "", "Name": $translate.instant('all')});
        });


    }


    checkWorkOrder($stateParams)

    function checkWorkOrder(item) {
        if (item.action) {
            if (item.action === "offer" || item.action === "newoffer") {
                $scope.WorkOrder.IsTimeReservation = 2;
            } else if (item.action === "booking") {
                $scope.WorkOrder.IsTimeReservation = 1;
            } else {
                $scope.WorkOrder.IsTimeReservation = 0;
            }
        }


        if (item.id === undefined) {
            $scope.jobObject = {
                SiteId: '',
                CustNo: '',
                VehiId: '',
                WarrantyInfo: '',
                VHCLink: '',
                VehicleNotifications: [],
            }
            $scope.actionType = "new";
        } else {
            $scope.jobObject = {
                SiteId: WorkOrder.data.SiteId,
                CustNo: (WorkOrder.data.WOCustomer && WorkOrder.data.WOCustomer.CustNo) ? WorkOrder.data.WOCustomer.CustNo : "",
                VehiId: (WorkOrder.data.WOVehicle && WorkOrder.data.WOVehicle.VehiId) ? WorkOrder.data.WOVehicle.VehiId : "",
                WarrantyInfo: (WorkOrder.data.WOVehicle && WorkOrder.data.WOVehicle.WarrantyInfo) ? WorkOrder.data.WOVehicle.WarrantyInfo : "",
                VHCLink: (WorkOrder.data.WOVehicle && WorkOrder.data.WOVehicle.VHCLink) ? WorkOrder.data.WOVehicle.VHCLink : "",
                VehicleNotifications: (WorkOrder.data.WOVehicle && WorkOrder.data.WOVehicle.VehicleNotifications) ? WorkOrder.data.WOVehicle.VehicleNotifications: ""
            }
            $scope.actionType = "update";
        }

    }

    function tokenObject() {
        var token = {
            DMSUserId: "",
            EmployeeData: {},
            ErrorDesc: "",
            Expired: "",
            LangId: "",
            ProfileId: "",
            SiteId: "",
            Token: "",
        }
        return token;
    }


    // $scope.isNew = angular.equals($scope.WorkOrder, {});
    $scope.isNew = $stateParams.action;
    console.log($scope.WorkOrder);

    if ($scope.isNew) {
        var EmployeeData = $("#EmployeeData").data("employee");
        $scope.WorkOrder.DeptId = EmployeeData.DeptId;
        $scope.WorkOrder.Token = tokenObject();
        $scope.WorkOrder.Token.EmployeeData = EmployeeData;
        $scope.cusInfo = '';
    } else {
        $scope.cusInfo = {
            custNo: WorkOrder.data.WOCustomer.CustNo,
            lastName: WorkOrder.data.WOCustomer.LName,
        }
    }
    $scope.workOrderNo = WorkOrder.data.WorkOrderNo;


    if ($scope.WorkOrder.ServiceDate == "" || $scope.WorkOrder.ServiceDate == "0001-01-01T00:00:00") {
        $scope.WorkOrder.ServiceDate = "";
    } else {
        $scope.WorkOrder.ServiceDate = new Date($scope.WorkOrder.ServiceDate);
    }
    if ($scope.WorkOrder.CheckOutDate == "" || $scope.WorkOrder.CheckOutDate == "0001-01-01T00:00:00") {
        $scope.WorkOrder.CheckOutDate = "";
    } else {
        $scope.WorkOrder.CheckOutDate = new Date($scope.WorkOrder.CheckOutDate);
    }
    if ($scope.WorkOrder.CheckInDate == "" || $scope.WorkOrder.CheckInDate == "0001-01-01T00:00:00") {
        $scope.WorkOrder.CheckInDate = "";
    } else {
        $scope.WorkOrder.CheckInDate = new Date($scope.WorkOrder.CheckInDate);
    }

    if ($scope.WorkOrder.ExecutionDate == "" || $scope.WorkOrder.ExecutionDate == "0001-01-01T00:00:00") {
        $scope.WorkOrder.ExecutionDate = "";
    } else {
        $scope.WorkOrder.ExecutionDate = new Date($scope.WorkOrder.ExecutionDate);
    }

    if ($scope.WorkOrder.BookMOTDate == "" || $scope.WorkOrder.BookMOTDate == "0001-01-01T00:00:00") {
        $scope.WorkOrder.BookMOTDate = "";
    } else {
        $scope.WorkOrder.BookMOTDate = new Date($scope.WorkOrder.BookMOTDate);
    }

    // $scope.$watch('WorkOrder.Mileage',function(){
    //   console.log($scope.WorkOrder.Mileage);
    //   $scope.WorkOrder.Mileage = $filter('number')($scope.WorkOrder.Mileage);
    //   console.log($scope.WorkOrder.Mileage);
    // });


    var lstab = JSON.parse(localStorage.getItem('info_tab'));
    $scope.tabs = lstab;

    $scope.tabActive = $stateParams.tab;


    console.log($stateParams);

    loadTab($stateParams.id);

    // load job tab with workorderId
    function loadTab(id) {
        if (id == null) {
            return $scope.tabActive = "header";
        }

        if ($stateParams.tab) {
            $scope.tabActive = $stateParams.tab;
        } else {
            return $scope.tabActive = "job";
        }
    }

    var isSave = false;

    $scope.$on("isSave", function (evt, obj) {
        console.log(obj);
        isSave = obj.modified;
    })

    function changeTab(tabActive) {
        $scope.tabActive = tabActive;
        var params = {
            locale: $stateParams.locale,
            type: $stateParams.type,
            id: $stateParams.id,
            tab: $scope.tabActive
        };
        console.log($state.current.name);
        console.log($stateParams.action);
        if ($state.current.name == "app.main.newwo") {
            params.action = $stateParams.action;
        } else {
            $state.transitionTo($state.current, params, {
                reload: false, inherit: false, notify: false, location: "replace"
            });
        }
    }

    $rootScope.WorkOrderOrg = {};
    $scope.changeTab = function (tabActive, abc) {
        $scope.$broadcast('isCollapsed');

        if ($scope.tabActive == "checkin") {
            if (isSave == true) {
                openConfirmSaveTab($scope.tabActive, tabActive);
            } else {
                changeTab(tabActive);
            }

        } else if (angular.equals($rootScope.WorkOrderOrg, $scope.WorkOrder)) {
            changeTab(tabActive);
        } else {
            if ($scope.tabActive == "header") {
                changeTab(tabActive);
            } else {
                openConfirmSaveTab($scope.tabActive, tabActive);
            }
        }
    }


    //Modal
    var $ctrl = this;
    $ctrl.animationsEnabled = true;

    $ctrl.openSearchVehicle = function (size, item) {
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            templateUrl: '/wsplanning/templates/pages/common/vehicle-form.html',
            controller: 'VehicleModalCtrl',
            controllerAs: '$ctrl',
            size: size,
            backdrop: 'static',

        });

        modalInstance.rendered.then(function () {
            $rootScope.$broadcast("openSearchVehicle", {});
        });

        modalInstance.result.then(function (selectedItem) {
            // $scope.WOVehicle = selectedItem;
            $scope.jobObject.VehiId = selectedItem.VehiId
            $scope.jobObject.WarrantyInfo = selectedItem.WarrantyInfo

            if (selectedItem.PayerCustomer != null) {
                $rootScope.$broadcast("choosePayerCustomer", {"item": selectedItem.PayerCustomer});
                $scope.jobObject.CustNo = selectedItem.PayerCustomer.CustNo;
            }

            if (selectedItem.UserCustomer != null) {
                $rootScope.$broadcast("chooseUserCustomer", {"item": selectedItem.UserCustomer});
                // $scope.jobObject.CustNo = selectedItem.PayerCustomer.CustNo;
            }
            $rootScope.$broadcast("chooseVehicle", {"item": selectedItem});

        }, function () {
        });
    };

    $ctrl.openSearchCustomer = function (size, item) {
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            templateUrl: '/wsplanning/templates/pages/common/customer-form.html',
            controller: 'CustomerModalCtrl',
            controllerAs: '$ctrl',
            size: size,
            backdrop: 'static',

        });

        modalInstance.rendered.then(function () {
            $rootScope.$broadcast("openSearchCustomer", {});
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.WOCustomer = selectedItem;
            $scope.jobObject.CustNo = selectedItem.CustNo

            $rootScope.$broadcast("chooseCustomer", {"item": selectedItem});
        }, function () {
        });
    };

    $ctrl.openSearchContact = function (size, item) {
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            templateUrl: '/wsplanning/templates/pages/common/customer-form.html',
            controller: 'ContactModalCtrl',
            controllerAs: '$ctrl',
            size: size,
            backdrop: 'static',
            resolve: {
                item: function () {
                    return $scope.jobObject
                }
            }

        });

        modalInstance.rendered.then(function () {
            $rootScope.$broadcast("openSearchContact", {});
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.WOContact = selectedItem;
            $rootScope.$broadcast("chooseContact", {"item": selectedItem});
        }, function () {
        });
    };

    var openConfirmSaveTab = function (currentTab, tabActive) {
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            templateUrl: '/wsplanning/templates/pages/common/confirm-form.html',
            controller: 'ConfirmSaveTabCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            backdrop: 'static',
        });

        modalInstance.result.then(function (selectedItem) {
            var params = {
                locale: $stateParams.locale,
                type: $stateParams.type,
                id: $stateParams.id,
                tab: tabActive
            };

            if ($state.current == "app.main.wo") {
                params.action = $stateParams.action;
            }
            if (selectedItem) {
                $scope.saveForm(currentTab, params);
            } else {
                $scope.tabActive = tabActive;
                $state.transitionTo($state.current, params, {
                    reload: false, inherit: false, notify: false, location: "replace"
                });
            }
        }, function () {
        });
    };

    //Submit tren header
    $scope.saveForm = function (type, params) {
        if (type == "header") {
            $rootScope.$broadcast("saveHeader", {"item": params});
        } else if (type == "job") {
            $rootScope.$broadcast("saveJob", {"item": params});
        } else if (type == "planning") {
            $rootScope.$broadcast("savePlanning", {"item": params});
        } else if (type == "checkin") {
            $rootScope.$broadcast("saveCheckin", {"item": params});
        }
    }


    $scope.afterRender = function () {
        $rootScope.WorkOrderOrg = angular.copy($scope.WorkOrder);
    }


    $scope.openModalTasklist = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/wsplanning/templates/pages/common/create-task.html',
            controller: 'CreateTaskModalCtrl',
            controllerAs: '$ctrl',
            size: "full",
            resolve: {
                TaskCustomer: function () {
                    return $scope.WorkOrder.WOCustomer ? $scope.WorkOrder.WOCustomer : {};
                },
                WorkOrderNo: function () {
                    return $scope.WorkOrder.WorkOrderNo ? $scope.WorkOrder.WorkOrderNo : null;
                }
            }
        });

        modalInstance.result.then(function (value) {
            console.log(value);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

});

UserWebApp.controller('ConfirmSaveTabCtrl', function ($scope, $uibModalInstance) {

    var $ctrl = this;

    $ctrl.save = function () {
        $uibModalInstance.close(true);
    }

    $ctrl.cancel = function () {
        $uibModalInstance.close(false);
    }

})