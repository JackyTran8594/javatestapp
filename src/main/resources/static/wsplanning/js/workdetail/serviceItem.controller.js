UserWebApp.controller('ServiceItemModalCtrl', function ($scope, $rootScope, suppliers, CommonServices, WorkOrderService, $uibModalInstance, item, $translate, $location, $filter, $uibModal, CommonServices, $stateParams, $state) {
  // $scope.WorkOrderId = $stateParams.id;
  // $scope.type = $stateParams.type;

  var $ctrl = this;
  // console.log(suppliers);
  $scope.suppliers = [];
  $scope.suplNo = "";
  $scope.itemType = item.itemType;
  $scope.textTreeList = [];
  $scope.isReference = false;
  $scope.reference = "";


  checkTitle(item.itemType);


  function checkTitle(itemType) {
    $scope.suppliers = suppliers;
    switch (itemType) {
      case 1:
        $scope.title = $translate.instant("Spare");
        $scope.isReference = true;
        break;
      case 2:
        $scope.title = $translate.instant("NonStockItems");
        break;
      case 4:
        $scope.title = $translate.instant("SubContractors");
        $scope.isReference = true;
        break;
      case 7:
        $scope.title = $translate.instant("Labour");
        $scope.isReference = true;
        break;
      case 8:
        $scope.title = $translate.instant("TextRows");
        $scope.isReference = true;
        break;
      case 500:
        $scope.title = $translate.instant("package");
        break;

    }
  }

  $scope.chooseSub = function () {
    if ($scope.listItem) {
      angular.forEach($scope.listItem, function (v, k) {
        v.SuplNo = $scope.suplNo;
      });
    }
  }

  $scope.hide = item.itemType;

  $scope.listItem = [];


  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.isChecked = function (item, checked) {

    console.log(checked);
    var index = 0;
    var lengthList = $scope.listItem.length;
    if ($scope.listItem.length > 0) {
      angular.forEach($scope.listItem, function (v, i) {
        if (item.ItemNo === v.ItemNo && checked === false) {
          $scope.listItem.splice(i, 1);
        } else {
          index = index + 1;
          console.log(index);
        }
      })

      if (index === lengthList) {
        $scope.listItem.push(item);
      }
    }
    else {
      $scope.listItem.push(item);
    }
    console.log($scope.listItem);
  }

  $ctrl.save = function () {

    if ($scope.hide === 8) {
      if ($scope.reference) {
        $scope.$emit('reference', { 'item': $scope.reference });
      }
      $uibModalInstance.close($scope.strItem);
    } else {
      if ($scope.hide === 4 && $scope.listItem) {
        angular.forEach($scope.listItem, function (v, k) {
          v.SuplNo = $scope.suplNo;
          if ($scope.reference) {
            v.Reference = $scope.reference;
          }
        });
      }
      if ($scope.hide == 1 && $scope.reference || $scope.hide == 7 && $scope.reference) {
        angular.forEach($scope.listItem, function (v, k) {
          v.Reference = $scope.reference;
        });
      }
      $uibModalInstance.close($scope.listItem);
    }
  }

  $scope.skey = "";

  $scope.lstAllData = [];
  $scope.lstData = [];
  $scope.lstSearch = [];
  $scope.totalElements = 0;

  $scope.limit = 20;
  $scope.page = 1;


  function loadData(count) {
    common.spinner(true);

    var params = {
      itemType: item.itemType,
      skey: $scope.skey,
      vehiId: item.vehiId,
      custNo: item.custNo,
      page: $scope.page,
      pageCount: $scope.limit
    }

    if (count) {
      WorkOrderService.serviceItem(params).then(function (response) {
        $scope.lstData = response.data;
        // console.log(response);
        $scope.pageGo = $scope.page;
        $scope.isShow = false;
        common.spinner(false);
      }, function error(response) {
        console.log(response);
        common.spinner(false);
      });

      WorkOrderService.countServiceItem(params).then(function (response) {
        $scope.totalElements = response.data;
        // console.log(response);
        $scope.isNoData = ($scope.totalElements <= 0);
        common.spinner(false);
      }, function error(response) {
        console.log(response);
        common.spinner(false);
      });
    } else {
      WorkOrderService.serviceItem(params).then(function (response) {
        $scope.lstData = response.data;
        // console.log(response);
        $scope.pageGo = $scope.page;
        $scope.isShow = false;
        common.spinner(false);
      }, function error(response) {
        console.log(response);
        common.spinner(false);
      });
    }
  }

  // loadData(true);


  //<editor-fold desc="Paging & Search Port">
  $scope.$watch("page", function (newValue, oldValue) {
    if (newValue != oldValue) {
      $scope.page = newValue;
      loadData();
    }
  });

  $scope.go = function () {
    $scope.page = $scope.pageGo;
  }

  $scope.changeLimit = function () {
    loadData(false);
  }
  $scope.doSearch = function () {
    $scope.page = 1;
    $scope.pageGo = 1;
    loadData(true);
  }
  //</editor-fold>



  //tree menu for the text line
  $scope.collapseMenu = function (item) {
    item.selected = !item.selected;
    // console.log($scope.jobTreeList);
  }


  $scope.jobChecked = {
    MainGroup: '',
    SubGroup: ''
  };

  loadDataTree();

  function loadDataTree() {
    common.spinner(true);
    WorkOrderService.getTextLine().then(function (res) {
      console.log(res);
      var data = res.data;
      angular.forEach(data, function (value) {
        var objTree = {};
        objTree.id = value.Id;
        objTree.label = value.Name;
        objTree.selected = false;
        objTree.children = [];
        objTree.SubGroups = value.SubGroups;
        $scope.textTreeList.push(objTree);
      }
      );

      // console.log($scope.jobTreeList);
      common.spinner(false);
      // console.log(res);
    }, function (err) {
      console.log(err);
      common.spinner(false);
    });
  }

  $scope.strItem = "";
  // var lstTextLine = [];
  $scope.addTextLine = function (sub, mainGroup) {
    // var textLine = sub.Name;
    $scope.jobChecked.SubGroup = sub.Name;
    $scope.jobChecked.MainGroup = mainGroup;
    $scope.strItem = $scope.strItem + " " + mainGroup + "/" + sub.Name;

  }

  //ThuyetLV
  $rootScope.$on('openServiceItem_' + item.itemType, function () {
    try {
      $(".firstFocus").focus();
    } catch (e) {
      console.error(e);
    }

  });

});