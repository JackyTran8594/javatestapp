UserWebApp.controller('GridWorkOrderCtrl', function ($scope, $rootScope, $locale, HttpService, $translate, $timeout,$location, $state, $filter, $uibModal, CommonServices, listField) {

  $scope.XLfilters = { list: [], dict: {}, results: [] };
  $scope.markAll = function(field, b) {
    $scope.XLfilters.dict[field].list.forEach((x) => {x.checked=b;});
  }
  $scope.clearAll = function(field) {
    $scope.XLfilters.dict[field].searchText='';
    $scope.XLfilters.dict[field].list.forEach((x) => {x.checked=true;});
  }
  $scope.XLfiltrate = function() {
    var i,j,k,selected,blocks,filter,option, data=$scope.XLfilters.all,filters=$scope.XLfilters.list;
    $scope.XLfilters.results=[];
    for (j=0; j<filters.length; j++) {
      filter=filters[j];
      filter.regex = filter.searchText.length?new RegExp(filter.searchText, 'i'):false;
      for(k=0,selected=0;k<filter.list.length;k++){
        if(!filter.list[k].checked)selected++;
        filter.list[k].visible=false;
        filter.list[k].match=filter.regex?filter.list[k].title.match(filter.regex):true;
      }
      filter.isActive=filter.searchText.length>0||selected>0;
    }
    for (i=0; i<data.length; i++){
      blocks={allows:[],rejects:[],mismatch:false};
      for (j=0; j<filters.length; j++) {
        filter=filters[j]; option=filter.dict[data[i][filter.field]];
        (option.checked?blocks.allows:blocks.rejects).push(option);
        if(filter.regex && !option.match) blocks.mismatch=true;
      }
      if(blocks.rejects.length==1) blocks.rejects[0].visible=true;
      else if(blocks.rejects.length==0&&!blocks.mismatch){
        $scope.XLfilters.results.push(data[i]);
        blocks.allows.forEach((x)=>{x.visible=true});
      }
    }
    for (j=0; j<filters.length; j++) {
      filter=filters[j];filter.options=[];
      for(k=0;k<filter.list.length;k++){
        if(filter.list[k].visible && filter.list[k].match) filter.options.push(filter.list[k]);
      }
    }
  }
  function createXLfilters(arr, fields) {
    console.log(arr);
    $scope.XLfilters.all = arr;
    for (var j=0; j<fields.length; j++) $scope.XLfilters.list.push($scope.XLfilters.dict[fields[j]]={list:[],dict:{},field:fields[j],searchText:"",active:false,options:[]});
    for (var i=0,z; i<arr.length; i++) for (j=0; j<fields.length; j++) {
      z=$scope.XLfilters.dict[fields[j]];
      z.dict[arr[i][fields[j]]] || z.list.push(z.dict[arr[i][fields[j]]]={title:arr[i][fields[j]],checked:true, visible:false,match:false});
    }

    $scope.XLfiltrate();
  }





  $scope.employees = [{
    "Name": "Manirul Monir",
    "City": "Sylhet",
    "Country": "Bangladesh"
  }, {
    "Name": "Arup",
    "City": "Sylhet",
    "Country": "Bangladesh"
  }, {
    "Name": "Person 1",
    "City": "Dhaka",
    "Country": "Bangladesh"
  }, {
    "Name": "Person 2",
    "City": "Dhaka",
    "Country": "Bangladesh"
  }, {
    "Name": "Munim Munna",
    "City": "Narshingdi",
    "Country": "Bangladesh"
  }, {
    "Name": "Mahfuz Ahmed",
    "City": "Narshingdi",
    "Country": "Bangladesh"
  }, {
    "Name": "Tawkir Ahmed",
    "City": "Gazipur",
    "Country": "Bangladesh"
  }, {
    "Name": "Alfreds 2",
    "City": "Berlin",
    "Country": "Germany"
  }, {
    "Name": "Alfreds Futterkiste",
    "City": "Berlin",
    "Country": "Germany"
  }, {
    "Name": "Blauer See Delikatessen",
    "City": "Mannheim",
    "Country": "Germany"
  }, {
    "Name": "Blondel père et fils",
    "City": "Strasbourg",
    "Country": "France"
  }, {
    "Name": "Bon app'",
    "City": "Marseille",
    "Country": "France"
  }, {
    "Name": "Centro comercial Moctezuma",
    "City": "México D.F.",
    "Country": "France"
  }];

  createXLfilters($scope.employees, ['Country','City']);

  $scope.checkChange = function () {
    $scope.XLfiltrate();
  }

});
