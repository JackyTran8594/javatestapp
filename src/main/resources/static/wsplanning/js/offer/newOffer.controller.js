UserWebApp.controller('newOfferCtrl', function ($scope, $rootScope, $locale, HttpService, $translate, $location, $state, $filter, $uibModal, $window, CommonServices) {



  console.log($scope.typeWO);

  $scope.lstDepartment = [];
  $scope.lstVisitReason = [];
  $scope.lstChargeCats = [];
  $scope.lstJobCats = [];
  $scope.lstPayers = [];
  $scope.lstJobTypes = [];

  $scope.target = {};
  $scope.WOVehicle = "";
  $scope.WOCustomer = "";
  $scope.WOContact = "";

  // datepicker-vutt

  var $ctrl = this;
  $ctrl.animationsEnabled = true;

  $ctrl.vehicle = function (size, item) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: '/wsplanning/templates/pages/newWO/modal/vehicle-form.html',
      controller: 'VehicleModalCtrl',
      controllerAs: '$ctrl',
      size: size,
      backdrop: 'static',
      resolve: {
        item: function () {
          return $scope.typeWO;
          // return $scope.WOVehicle;
        }
        // typeWO: function (params) {
        //   return $scope.typeWO;
        // }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      console.log(selectedItem);
      $scope.WOVehicle = selectedItem;
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };

  $ctrl.customer = function (size, item) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: '/wsplanning/templates/pages/newWO/modal/customer-form.html',
      controller: 'CustomerModalCtrl',
      controllerAs: '$ctrl',
      size: size,
      backdrop: 'static',
      resolve: {
        item: function () {
          return $scope.WOCustomer;
        }
      }
    });

    modalInstance.rendered.then(function () {
      $rootScope.$broadcast("openSearchCustomer", {});
    });

    modalInstance.result.then(function (selectedItem) {
      console.log(selectedItem);
      $scope.WOCustomer = selectedItem;
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };

  $ctrl.contact = function (size, item) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: '/wsplanning/templates/pages/newWO/modal/customer-form.html',
      controller: 'ContactModalCtrl',
      controllerAs: '$ctrl',
      size: size,
      backdrop: 'static',
      resolve: {
        item: function () {
          return $scope.WOContact;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      console.log(selectedItem);
      $scope.WOContact = selectedItem;
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };




  console.log($locale);

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.toggleVehicle = function () {
    $scope.isShowVehicle = !$scope.isShowVehicle;
  }


  $scope.toggleCustomer = function () {
    $scope.isShowCustomer = !$scope.isShowCustomer;
  }

  $scope.toggleContact = function () {
    $scope.isShowContact = !$scope.isShowContact;
  }



  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'dd-MMMM-yyyy HH:mm:ss'];
  $scope.format = $scope.formats[4];
  console.log($scope.format);

  $scope.openServiceDate = function () {
    $rootScope.popupServiceDate.opened = true;
  };

  $scope.openExDeliveryDate = function () {
    $rootScope.popupExDeliveryDate.opened = true;
  };

  $scope.openCheckInTime = function () {
    $rootScope.popupCheckInTime.opened = true;
  };

  $scope.openExcutionTime = function () {
    $rootScope.popupExcutionTime.opened = true;
  };

  $rootScope.popupServiceDate = {
    opened: false
  };

  $rootScope.popupCheckInTime = {
    opened: false
  };

  $rootScope.popupExcutionTime = {
    opened: false
  };

  $rootScope.popupExDeliveryDate = {
    opened: false
  };

  loadCombo();



  function loadCombo() {
    CommonServices.getDepartments().then(function (data) {
      $scope.lstDepartment = data
      $scope.target.department = data[0].Id;
    });
    CommonServices.getVisitReasons().then(function (data) {
      $scope.lstVisitReason = data;
      $scope.target.visitreason = data[0].Id;
    });
    CommonServices.getChargeCats().then(function (data) {
      $scope.lstChargeCats = data;
      $scope.target.chargeCats = data[0].Id;
    });
    CommonServices.getPayers().then(function (data) {
      $scope.lstPayers = data;
      $scope.target.payer = data[0].Id;
    });
    CommonServices.getJobCats().then(function (data) {
      $scope.lstJobCats = data;
      $scope.target.jobcats = data[0].Id;
    });
    CommonServices.getJobTypes().then(function (data) {
      $scope.lstJobTypes = data;
      $scope.target.jobtype = data[0].Id;
    });

  }

  $scope.goBack = function () {
    $window.history.back();
  }

});


UserWebApp.controller('VehicleModalCtrl', function ($scope, $rootScope, $timeout,
  $state, $uibModal, $uibModalInstance, CommonServices, $cookies) {

  var type = '';
  var $ctrl = this;
  // console.log(item);

  $scope.siteId = $cookies.get('siteId');

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.skey = "";

  function loadData(skey) {
    console.log(skey);
    CommonServices.getVehicles(skey).then(function (data) {

      $scope.lstVehicles = data;
      // angular.forEach(data, function (v, k) {
      //   angular.forEach(v.OpenWorkOrders, function (value, key) {
      //     console.log({
      //       license: v.LicenseNo,
      //       id: value.SiteId,
      //       no: value.WorkOrderNo,
      //       ref: value.Reference
      //     });
      //   });
      // });
    }, function (error) {
      console.log(error);
    });
  }

  loadData($scope.skey);

  $scope.doSearch = function () {
    loadData($scope.skey)
  }

  $scope.openCamera = function () {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: '/wsplanning/templates/pages/scan_barcode.html',
      controller: 'ScanBarcodeModalCtrl',
      controllerAs: '$ctrl',
      size: "full",
      resolve: {

      }
    });

    modalInstance.rendered.then(function () {
      $rootScope.$broadcast("modalOpen", {});
    });

    modalInstance.result.then(function (value) {
      if (value) {
        $scope.skey = value;
        $scope.doSearch();
      }
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  }

  $scope.openQRCode = function () {
    console.log("----openQRCode----");
    Instascan.Camera.getCameras().then(function (cameras) {

      var modalInstance = $uibModal.open({
        animation: $ctrl.animationsEnabled,
        templateUrl: '/wsplanning/templates/pages/scan_qrcode.html',
        controller: 'ScanQRcodeModalCtrl',
        controllerAs: '$ctrl',
        size: "lg",
        resolve: {
          cameras: function () {
            return cameras;
          }
        }
      });

      modalInstance.rendered.then(function () {
        $rootScope.$broadcast("modalOpenQR", {});
      });

      modalInstance.result.then(function (obj) {
        console.log(obj);

        if(obj.scanner){
          obj.scanner.stop();
        }

        if (obj.code) {
          $scope.skey = obj.code;
          $scope.doSearch();
        }
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });

    }).catch(function (e) {
      common.notifyError("Cannot init camera!")
      console.error(e);
    });

  }

  $scope.doPick = function (selectedItem) {
    $uibModalInstance.close(selectedItem);
  }

  $scope.reLoadWithWO = function (obj) {
    $uibModalInstance.dismiss('cancel');
    $timeout(function () {
      $state.go('app.main.workdetail', {
        'locale': $rootScope.lang,
        'id': obj.WorkOrderId,
        'type': 'allWO',
        'tab': 'job'
      });
    });
  }

  //ThuyetLV
  $rootScope.$on('openSearchVehicle', function () {
    try {
      $(".firstFocus").focus();
    } catch (e) {
      console.error(e);
    }

  });

})


UserWebApp.controller('CustomerModalCtrl', function ($scope, $rootScope, $locale, HttpService, $translate,
  $location, $state, $filter, $uibModal, $uibModalInstance, CommonServices) {



  var $ctrl = this;

  $scope.skey = "";
  $scope.custNo = "";

  $scope.lstCustomers = []

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  function loadData(skey, custNo) {
    CommonServices.getCustomers(skey, custNo).then(function (data) {
      console.log(data);
      $scope.lstCustomers = data;
    })
  }


  $scope.doSearch = function () {
    loadData($scope.skey, $scope.custNo)
  }

  loadData($scope.skey, $scope.custNo);

  $scope.doPick = function (selectedItem) {
    $uibModalInstance.close(selectedItem);
  }

  //ThuyetLV
  $rootScope.$on('openSearchCustomer', function () {
    try {
      $(".firstFocus").focus();
    } catch (e) {
      console.error(e);
    }

  });

})


UserWebApp.controller('ContactModalCtrl', function ($scope, $rootScope, $locale, HttpService, $translate,
  $location, $state, $filter, $uibModal, $uibModalInstance, CommonServices, WorkOrderService, item) {



  var $ctrl = this;

  $scope.skey = "";
  $scope.custNo = "";

  $scope.lstCustomers = []

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  function loadData(skey, custNo) {
    CommonServices.getCustomers(skey, custNo).then(function (data) {
      $scope.lstCustomers = data;
    })
  }

  function loadCustomer(item) {
    common.spinner(true);
    WorkOrderService.customer(item).then(function (res) {
      $scope.lstCustomers = res.data;
      common.spinner(false);
    })
  }


  $scope.doSearch = function () {
    loadData($scope.skey, $scope.custNo)
  }

  loadCustomer(item);

  $scope.doPick = function (selectedItem) {
    $uibModalInstance.close(selectedItem);
  }

  //ThuyetLV
  $rootScope.$on('openSearchContact', function () {
    try {
      $(".firstFocus").focus();
    } catch (e) {
      console.error(e);
    }

  });

})

