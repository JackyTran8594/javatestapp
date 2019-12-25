UserWebApp.controller('SaveBookPoolResourceCtrl', function ($scope, $rootScope, HttpService, $translate, $location, $filter, $uibModal, $uibModalInstance, data, title) {

  var $ctrl = this;
  $ctrl.data = data;
  $ctrl.title = title;


  console.log($ctrl.data);

  $ctrl.save = function () {
    //
    // var dateStart = new Date($ctrl.data.Date.getTime());
    // var dateEnd = new Date($ctrl.data.Date.getTime());
    //
    // var tmp = $ctrl.data.sStart.split(":");
    // dateStart.setHours(parseInt(tmp[0]));
    // dateStart.setMinutes(parseInt(tmp[1]));
    // $ctrl.data.StartTime = dateStart;
    //
    // tmp = $ctrl.data.sEnd.split(":");
    // dateEnd.setHours(parseInt(tmp[0]));
    // dateEnd.setMinutes(parseInt(tmp[1]));
    // $ctrl.data.EndTime = dateEnd;

    $uibModalInstance.close($ctrl.data);
  };

  $rootScope.$on('addBookResource', function () {
    $("#startTimeBookPool").focus();
  });

  $ctrl.delete = function () {
    $ctrl.data.RowId = 0 - $ctrl.data.RowId;
    $uibModalInstance.close($ctrl.data);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  var constPlus = 15;
  $ctrl.minus = function (value) {
    var tmp = value.split(":");
    if(tmp.length === 2){
      var hh = parseInt(tmp[0]);
      var mm = parseInt(tmp[1]);
      mm = parseInt(mm) - constPlus;
      if(mm < 0){
        if(hh > 0){
          hh--;
          mm = 60 + mm;
        }else{
          $ctrl.data.sStart = "00:00";
          return;
        }
      }
      var rtn = "";
      if(hh < 10){
        rtn += "0" + hh;
      }else{
        rtn += hh;
      }
      if(mm < 10){
        rtn += ":0" + mm;
      }else{
        rtn += ":" + mm;
      }
      return rtn;
    }
  }
  $ctrl.plus = function (value) {
    var tmp = value.split(":");
    if(tmp.length === 2){
      var hh = parseInt(tmp[0]);
      var mm = parseInt(tmp[1]);
      mm = parseInt(mm)  + constPlus;
      if(mm >= 60){
        if(hh <=22){
          hh++;
          mm = mm-60;
        }else{
          $ctrl.data.sStart = "23:59";
          return;
        }
      }
      var rtn = "";
      if(hh < 10){
        rtn += "0" + hh;
      }else{
        rtn += hh;
      }
      if(mm < 10){
        rtn += ":0" + mm;
      }else{
        rtn += ":" + mm;
      }
      return rtn;
    }
  }
});