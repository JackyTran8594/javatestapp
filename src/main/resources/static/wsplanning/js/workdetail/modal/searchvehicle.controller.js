UserWebApp.controller('SearchVehicleModalCtrl', function ($scope, $rootScope, HttpService, $translate, $location, $filter, $uibModal, $uibModalInstance, item) {

  var $ctrl = this;
  $ctrl.item = item;
  $ctrl.selected = item;

  $ctrl.ok = function () {
    $uibModalInstance.close($ctrl.selected);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.openQRCode = function () {
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
          $scope.params.skey = obj.code;
          console.log("------------$scope.params.skey: " + $scope.params.skey);
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

  //ThuyetLV
  $rootScope.$on('openSearchVehicle', function () {
    try {
      $(".firstFocus").focus();
    } catch (e) {
      console.error(e);
    }

  });

});