UserWebApp.controller('VehicleCtrl', function ($scope, $rootScope, HttpService, $translate, $location, $filter, $uibModal, CommonServices, $stateParams, $state) {
  $scope.WorkOrderId = $stateParams.id;
  $scope.type = $stateParams.type;

  $scope.isShow = false;

  $scope.WOVehicle = {};

  if ($scope.WorkOrder) {
    $scope.WOVehicle = $scope.WorkOrder.WOVehicle;
  }

  $scope.toogleVehicle = function () {
    $scope.isShow = !$scope.isShow;
    console.log($scope.WOVehicle);
  }


  var $ctrl = this;
  $ctrl.animationsEnabled = true;

  $scope.searchVehicle = function (item) {
    console.log("----open--------");
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: '/wsplanning/templates/pages/workdetail/modal/search_vehicle.html',
      controller: 'SearchVehicleModalCtrl',
      controllerAs: '$ctrl',
      size: "full",
      resolve: {
        item: function () {
          return item;
        }
      }
    });

    modalInstance.rendered.then(function () {
      $rootScope.$broadcast("openSearchVehicle", {});
    });

    modalInstance.result.then(function (selectedItem) {
      // console.log(selectedItem);
      $ctrl.selected = selectedItem;
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };


  $rootScope.$on('chooseVehicle', function (event, obj) {
    console.log(obj.item);
    $scope.WOVehicle = obj.item;
    $scope.WorkOrder.WOVehicle = $scope.WOVehicle;
  });

});