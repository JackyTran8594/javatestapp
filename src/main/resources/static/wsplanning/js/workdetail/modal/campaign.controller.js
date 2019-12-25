UserWebApp.controller('CampaignModalCtrl', function ($scope, item, HttpService, $translate, $location, $filter, $uibModal, $uibModalInstance, item) {

  var $ctrl = this;

  $scope.VehicleNotifications = item;

  $ctrl.ok = function () {
    $uibModalInstance.close($ctrl.selected);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

 
});