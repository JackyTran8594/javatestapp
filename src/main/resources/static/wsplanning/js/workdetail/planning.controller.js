UserWebApp.controller('PlanningJobCtrl', function ($scope, $rootScope, WorkOrderService, HttpService, $translate, $location, $filter, $uibModal, CommonServices, $stateParams, $timeout, $state) {
    //JOB
    //Config
    moment()._locale._week.dow = 1;
    //$scope.jobTabList = $scope.$parent.WOJobs;

    $scope.jobTabList = $scope.WorkOrder.WOJobs;

    $scope.totalHours = 0;
    $scope.totalDurationPool = 0;
    $scope.totalDurationBooking = 0;

    calcTotalDuration();

    function calcTotalDuration() {
        $scope.totalDurationPool = 0;
        $scope.totalDurationBooking = 0;

        //Create WoResourcePool Duration
        var length = 0;
        if ($scope.WorkOrder.BookedResourcePools) {
            length = $scope.WorkOrder.BookedResourcePools.length;
        }

        if (length > 0) {
            for (var i = 0; i < length; i++) {
                $scope.totalDurationPool += $scope.WorkOrder.BookedResourcePools[i].Duration;
            }
        }

        //Create BookedResources.Duration
        var length = 0;
        if ($scope.WorkOrder.BookedResources) {
            length = $scope.WorkOrder.BookedResources.length;
        }

        if (length > 0) {
            for (var i = 0; i < length; i++) {
                $scope.totalDurationBooking += $scope.WorkOrder.BookedResources[i].Duration;
            }
        }
    }

    if ($scope.jobTabList) {
        var length = $scope.jobTabList.length;
        for (var i = 0; i < length; i++) {
            $scope.totalHours += $scope.jobTabList[i].EstimatedTime;
        }
    }

    var EmployeeData = $("#EmployeeData").data("employee");
    $scope.DeptId = EmployeeData.DeptId;
    $scope.ShiftId = EmployeeData.ShiftId;

    //These variables MUST be set as a minimum for the calendar to work
    $scope.calendarView = 'month';
    $scope.calendarViewNext = 'day';
    // $scope.calendarView = 'week';
    $scope.viewDate = new Date();

    $scope.lstPlanning = [];
    $scope.loadData = function () {
        if($scope.viewDate) {
            getCalendarWeek($scope.viewDate);
        }
    }

    $scope.totalColor = function(){
        var totalHours = $filter('number')($scope.totalHours, 2);
        var totalDurationPool = $filter('number')($scope.totalDurationPool, 2);
        var totalDurationBooking = $filter('number')($scope.totalDurationBooking / 60, 2);
        if(totalHours <= (totalDurationPool + totalDurationBooking)){
            return "green";
        }
        return "black";
    }

    $scope.WoResourcePoolDuration = [];
    $scope.BookedResourcesDuration = [];

    function calcDuration() {
        $scope.WoResourcePoolDuration = [];
        $scope.BookedResourcesDuration = [];

        //Create WoResourcePool Duration
        var length = 0;
        if ($scope.WorkOrder.BookedResourcePools) {
            length = $scope.WorkOrder.BookedResourcePools.length;
        }

        var key = "";
        var value = 0;
        if (length > 0) {
            for (var i = 0; i < length; i++) {
                key = "" + $scope.WorkOrder.BookedResourcePools[i].WorkDay;
                value = $scope.WoResourcePoolDuration["" + key];
                if (value) {
                    $scope.WoResourcePoolDuration["" + key] = value + $scope.WorkOrder.BookedResourcePools[i].Duration;
                } else {
                    $scope.WoResourcePoolDuration["" + key] = $scope.WorkOrder.BookedResourcePools[i].Duration;
                }
            }
        }

        //Create BookedResources.Duration
        var length = 0;
        if ($scope.WorkOrder.BookedResources) {
            length = $scope.WorkOrder.BookedResources.length;
        }

        if (length > 0) {
            for (var i = 0; i < length; i++) {
                key = "" + $scope.WorkOrder.BookedResources[i].StartTime;
                key = key.substring(0, key.indexOf("T")) + "T00:00:00";
                value = $scope.BookedResourcesDuration["" + key];
                if (value) {
                    $scope.BookedResourcesDuration["" + key] = value + $scope.WorkOrder.BookedResources[i].Duration;
                } else {
                    $scope.BookedResourcesDuration["" + key] = $scope.WorkOrder.BookedResources[i].Duration;
                }
            }
        }
    }

    function getCalendarWeek(date) {
        common.spinner(true);
        $rootScope.$broadcast("bookingClick", { "date": date, "DeptId": $scope.DeptId, "ShiftId": $scope.ShiftId });

        var startDate = date;
        var endDate = moment(startDate).add('days', 7).toDate();
        var params = {
            "DayFrom": formatDateToApi(startDate),
            "DayTo": formatDateToApi(endDate),
            "DeptId": $scope.DeptId,
            "ShiftId": $scope.ShiftId,
        };
        HttpService.postData('/planning', params).then(function (response) {
            $scope.lstPlanning = [];
            var date;
            var found = false;
            while (startDate < endDate) {
                found = false;
                for (var i = 0; i < response.length; i++) {
                    date = new Date(response[i].WorkDay);
                    if (date.getDate() == startDate.getDate()) {
                        response[i].Day = moment(startDate).format('ddd');
                        $scope.lstPlanning.push(response[i]);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    $scope.lstPlanning.push({
                        "FreeCapacity": 0,
                        "FreeHour": 0,
                        "WorkDay": formatDateToYYYYMMDD000000(startDate),
                        "Day": moment(startDate).format('ddd'),
                    });
                }
                startDate = moment(startDate).add('days', 1).toDate();
            }

            //Tinh duration
            calcDuration();
            var length = $scope.lstPlanning.length;
            var key = "";
            var value = 0;
            for (var i = 0; i < length; i++) {
                key = "" + $scope.lstPlanning[i]["WorkDay"];
                value = $scope.WoResourcePoolDuration[key];
                if (value) {
                    $scope.lstPlanning[i]["WoResourcePoolDuration"] = value;
                } else {
                    $scope.lstPlanning[i]["WoResourcePoolDuration"] = 0;
                }

                value = $scope.BookedResourcesDuration[key];
                if (value) {
                    $scope.lstPlanning[i]["BookedResourcesDuration"] = value;
                } else {
                    $scope.lstPlanning[i]["BookedResourcesDuration"] = 0;
                }
            }

            console.log($scope.lstPlanning);

            common.spinner(false);
        }, function error(response) {
            $scope.lstPlanning = [];
            console.log(response);
            common.spinner(false);
        });
    }

    $scope.events = [];
    if ($scope.WorkOrderData.BookedResourcePools) {
        var itemEvent = {};
        var objTemp = {};
        var startTime = new Date();
        var endTime = new Date();
        for (var i = 0; i < $scope.WorkOrderData.BookedResourcePools.length; i++) {
            objTemp = $scope.WorkOrderData.BookedResourcePools[i];
            startTime = new Date(objTemp.WorkDay);
            startTime.setHours(8);
            endTime = new Date(objTemp.WorkDay);
            endTime.setHours(12);
            itemEvent = {
                "title": "",
                "startsAt": startTime,
                "endsAt": endTime,
                "color": { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
                    "primary": '#e3bc08', // the primary event color (should be darker than secondary)
                    "secondary": '#fdf1ba' // the secondary event color (should be lighter than primary)
                },
                "draggable": false,
                "resizable": false,
                "incrementsBadgeTotal": true,
            };
            $scope.events.push(itemEvent);
        }
    }

    if ($scope.WorkOrderData.BookedResources) {
        var itemEvent = {};
        var objTemp = {};
        for (var i = 0; i < $scope.WorkOrderData.BookedResources.length; i++) {
            objTemp = $scope.WorkOrderData.BookedResources[i];
            itemEvent = {
                "title": "",
                "startsAt": new Date(objTemp.StartTime),
                "endsAt": new Date(objTemp.EndTime),
                "color": { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
                    "primary": '#e3bc08', // the primary event color (should be darker than secondary)
                    "secondary": '#fdf1ba' // the secondary event color (should be lighter than primary)
                },
                "draggable": false,
                "resizable": false,
                "incrementsBadgeTotal": true,
            };
            $scope.events.push(itemEvent);
        }
    }

    $scope.cellIsOpen = false;

    $scope.dayClicked = function ($event, field, event) {
        console.log("------dayClicked-------------");
    };

    $scope.timespanClicked = function (date, cell) {
        cell.cssClass = 'cal-day-selected';
        if ($scope.viewDate.getMonth() != date.getMonth()) {
            gotoDateMonth(date);
            $scope.viewDate = date;
        } else {
            $scope.viewDate = date;
            getCalendarWeek($scope.viewDate);
        }
    };

    //Gen CSS cho cell (day in month)
    $scope.cellModifier = function (cell) {
        $scope.setCss();
        cell.id = "cell_" + cell.date._d.getDate() + "_" + cell.date._d.getMonth();
        var length = $scope.lstMonth.length;
        var WorkDay = null;
        var date = new Date();
        var now = new Date();
        for (var i = 0; i < length; i++) {
            WorkDay = $scope.lstMonth[i];
            date = new Date(WorkDay.WorkDay);
            if (now.getMonth() == cell.date._d.getMonth() && now.getDate() == cell.date._d.getDate()) {
                cell.cssClass = 'cal-day-today';
                return;
            }
            if (date.getMonth() == cell.date._d.getMonth() && date.getDate() == cell.date._d.getDate()) {
                if (WorkDay.FreeCapacity >= 75) {
                    cell.cssClass = 'cap75';
                } else if (WorkDay.FreeCapacity > 25 && WorkDay.FreeCapacity < 75) {
                    cell.cssClass = 'cap50';
                } else if (WorkDay.FreeCapacity <= 25) {
                    cell.cssClass = 'cap25';
                }else{
                    cell.cssClass = 'inherit';
                }
                return;
            }else{
                cell.cssClass = 'inherit';
            }
        }
    };

    $scope.setCss = function(){
        $('.cap25').css('background-color', "inherit");
        $('.cap50').css('background-color', "inherit");
        $('.cap75').css('background-color', "inherit");
        $('.inherit').css('background-color', "inherit");
        $('.cal-day-today').css('background-color', "#e8fde7");

        var cssJobHeader = JSON.parse(localStorage.getItem("info_css_jobHeader"));
        if(cssJobHeader && cssJobHeader.length > 0) {
            var item;
            for (var i = 0; i < cssJobHeader.length; i++) {
                item = cssJobHeader[i];
                $('.'+item.name).css('background-color', "inherit");
                $('.'+item.name).css('background-color', item.value);
            }
        }


    }


    $scope.onClickCal = function (item) {
    }

    $scope.dateClicked = function (item) {
    }

    $scope.detailBooking = function (item) {
        $rootScope.$broadcast("bookingClick", {
            "date": item.WorkDay,
            "DeptId": $scope.DeptId,
            "ShiftId": $scope.ShiftId
        });
    }


    $scope.changeDeptId = function (item) {
        if (isNaN(item.DeptId)) {
            $scope.DeptId = "0";
        } else {
            $scope.DeptId = item.DeptId;
        }
        getCalendarMonth();
    }
    $scope.changeShiftId = function (item) {
        if (isNaN(item.ShiftId)) {
            $scope.ShiftId = "0";
        } else {
            $scope.ShiftId = item.ShiftId;
        }
        getCalendarMonth();
    }

    function getCalendarMonth() {
        common.spinner(true);
        var startDate = $scope.viewDate;
        var endDate = moment(startDate).add(1, 'M');

        var params = {
            "DayFrom": formatDateToApi(moment(startDate).startOf('month').toDate()),
            "DayTo": formatDateToApi(moment(endDate).startOf('month').toDate()),
            "DeptId": $scope.DeptId,
            "ShiftId": $scope.ShiftId,
        };
        $scope.lstMonth = [];
        HttpService.postData('/planning', params).then(function (response) {
            $scope.lstMonth = response;
            common.spinner(false);

            getCalendarWeek($scope.viewDate);
        }, function error(response) {
            $scope.lstMonth = [];
            common.spinner(false);
        });
    }

    function gotoDateMonth(goDate) {
        common.spinner(true);
        var endDate = moment(goDate).add(1, 'M');

        var params = {
            "DayFrom": formatDateToApi(moment(goDate).startOf('month').toDate()),
            "DayTo": formatDateToApi(moment(endDate).startOf('month').toDate()),
            "DeptId": $scope.DeptId,
            "ShiftId": $scope.ShiftId,
        };
        $scope.lstMonth = [];
        HttpService.postData('/planning', params).then(function (response) {
            $scope.lstMonth = response;
            common.spinner(false);

            $timeout(function () {
                $("#cell_" + goDate.getDate() + "_" + goDate.getMonth()).click();
            }, 100);


        }, function error(response) {
            $scope.lstMonth = [];
            common.spinner(false);

            $timeout(function () {
                $("#cell_" + goDate.getDate() + "_" + goDate.getMonth()).click();
            }, 100);

        });
    }

    //Action
    $scope.previous = function () {
        if ($scope.viewDate.getDate() == 1) {
            var preDate = moment($scope.viewDate).add('days', -1).toDate();
            var lastDateOfMonth = moment(preDate).endOf('month').toDate().getDate();
            $timeout(function () {
                $(".day_" + lastDateOfMonth).first().click();
            }, 1);
        } else {
            var preDate = moment($scope.viewDate).add('days', -1).toDate();
            if (preDate.getDate() <= 8) {
                $timeout(function () {
                    $(".day_" + preDate.getDate()).first().click();
                }, 10000);
            } else {
                $timeout(function () {
                    $(".day_" + preDate.getDate()).last().click();
                }, 10000);
            }
        }
    }

    $scope.today = function () {
        $scope.viewDate = new Date();
        $scope.viewDate.setHours(0, 0, 0, 0);

        gotoDateMonth($scope.viewDate);

    }

    $scope.next = function () {
        var tmpDate = moment($scope.viewDate).endOf('month').toDate();
        tmpDate = moment(tmpDate).add('days', 1).toDate();

        $timeout(function () {
            getCalendarMonth2(tmpDate);
        });

        // var oldMonth = $scope.viewDate.getMonth();
        var lastDateOfMonth = moment($scope.viewDate).endOf('month').toDate().getDate();

        if ($scope.viewDate.getDate() == lastDateOfMonth) {
            $timeout(function () {
                $(".day_1").last().click();
            }, 1);
        } else {
            var nextDate = moment($scope.viewDate).add('days', 1).toDate();
            if (nextDate.getDate() <= 8) {
                $timeout(function () {
                    $(".day_" + nextDate.getDate()).first().click();
                }, 100);
            } else {
                $timeout(function () {
                    $(".day_" + nextDate.getDate()).last().click();
                }, 100);
            }
        }
        // getCalendarMonth();
        // if($scope.viewDate.getMonth() != oldMonth){
        //   getCalendarMonth();
        // }else{
        //   getCalendarWeek($scope.viewDate);
        // }
    }

    $scope.previousMonth = function () {
        var preDate = moment($scope.viewDate).add('month', -1).toDate();
        preDate.setDate(1);
        $scope.viewDate = preDate;

        gotoDateMonth($scope.viewDate);

    }

    $scope.nextMonth = function () {
        var nextDate = moment($scope.viewDate).add('month', 1).toDate();
        nextDate.setDate(1);

        $scope.viewDate = nextDate;

        gotoDateMonth($scope.viewDate);

    }


    //Right click
    $scope.menuOptions =
        [
            {
                label: 'Add',      // menu option label
                onClick: menuAdd   // on click handler
            },
            {
                label: 'Edit',
                onClick: menuEdit,
            }
        ]


    function menuAdd($event) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/wsplanning/templates/pages/workdetail/tabs/planning/modal/save_pool.html',
            controller: 'SaveBookPoolModalCtrl',
            controllerAs: '$ctrl',
            size: "lg",
            resolve: {
                data: function () {
                    return $event.dataContext;
                },
                title: function () {
                    return $translate.instant('addBookPool');
                }
            }
        });

        modalInstance.rendered.then(function () {
            $rootScope.$broadcast("addBookPool", {});
        });

        modalInstance.result.then(function (value) {
            if (!$scope.WorkOrder.BookedResourcePools) {
                $scope.WorkOrder.BookedResourcePools = [];
            }
            $scope.WorkOrder.BookedResourcePools.push({
                "RowId": 0,
                "Duration": value.duration,
                "WorkDay": value.WorkDay,
                "DeptId": $scope.DeptId,
                "ShiftId": $scope.ShiftId,
            });

        }, function () {
        });

    }

    function menuEdit($event) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/wsplanning/templates/pages/workdetail/tabs/planning/modal/list_pool.html',
            controller: 'EditBookPoolModalCtrl',
            controllerAs: '$ctrl',
            size: "lg",
            resolve: {
                data: function () {
                    return $event.dataContext;
                },
                listData: function () {
                    if (!$scope.WorkOrder.BookedResourcePools) {
                        $scope.WorkOrder.BookedResourcePools = [];
                    }
                    return $scope.WorkOrder.BookedResourcePools;
                },
                title: function () {
                    return $translate.instant('editBookPool');
                }
            }
        });

        modalInstance.rendered.then(function () {
            $rootScope.$broadcast("editBookPool", {});
        });

        modalInstance.result.then(function (listPool) {
            $scope.WorkOrder.BookedResourcePools = listPool;
        }, function () {
        });
    }

    $scope.onSubmitForm = function (params) {
        var postAction = "saveResource";
        var data = JSON.stringify($scope.WorkOrder);

        common.btnLoading($(".btnSubmit"), true);
        WorkOrderService.postWorkOrder(data, postAction).then(function (res) {
            common.btnLoading($(".btnSubmit"), false);
            if (res.data.Token && res.data.Token.ErrorDesc) {
                common.notifyWithMessage("Warning!!!", res.status, res.data.Token.ErrorDesc)
            } else {
                common.notifySuccess("Success!!!");
            }
            if (params) {
                if (params.id) {
                    $state.transitionTo($state.current, params, {
                        reload: false, inherit: false, notify: false, location: "replace"
                    });
                } else {
                    if ($scope.WorkOrder && $scope.WorkOrder.WorkOrderId) {
                        location.reload();
                    }
                }
            } else {
                if ($scope.WorkOrder && $scope.WorkOrder.WorkOrderId) {
                    location.reload();
                }
            }

        }, function (err) {
            common.btnLoading($(".btnSubmit"), true);
            common.notifyError("Error!!!", err.status);
        });

    }

    //Save from button header
    $rootScope.$on('savePlanning', function (event, obj) {
        $scope.onSubmitForm(obj.item);
    });

    $scope.afterRender = function () {
        $rootScope.WorkOrderOrg = angular.copy($scope.WorkOrder);
    }


});