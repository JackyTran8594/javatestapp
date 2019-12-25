UserWebApp.controller('BookingCtrl', function ($scope, $rootScope, HttpService, $translate, $location, $filter, $uibModal, WorkOrderService, CommonServices, $stateParams, $state, $timeout) {
    var calendar = null;

    var EmployeeData = $("#EmployeeData").data("employee");
    $scope.DeptId = EmployeeData.DeptId;
    $scope.ShiftId = EmployeeData.ShiftId;

    $scope.loadData = function () {

    }

    function createCalendar(gotoDate, deptId) {
        var calendarEl = document.getElementById('calendarBook');

        calendar = new FullCalendar.Calendar(calendarEl, {
            plugins: ['dayGrid', 'timeGrid', 'interaction', 'resourceTimeline'],
            timeZone: 'UTC',
            // defaultView: 'resourceTimelineWeek',
            defaultView: 'resourceTimeline', // the name of a generic view
            duration: { days: 3 },
            aspectRatio: 1.5,
            height: 600,
            scrollTime: '07:00',
            slotDuration: "00:15:00",
            header: {
                left: false,
                center: 'title',
                right: false
            },
            editable: true,
            resourceLabelText: $translate.instant('mechanic'),
            refetchResourcesOnNavigate: true,
            resourceAreaWidth: "15%",
            resources: {
                url: '/resources',
                method: 'GET',
                extraParams: function () {
                    return {
                        "DeptId": $scope.DeptId,
                        "ShiftId": $scope.ShiftId,
                    };
                },
            },
            resourceOrder: 'title,-id',
            resourceRender: function (renderInfo) {
                var info = renderInfo.resource._resource;
                if (info.breakHours) {
                    console.log(info);
                }
            },
            // resources: callResource(deptId),
            selectable: true,
            select: function (selectionInfo) {
                // return;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/wsplanning/templates/pages/workdetail/tabs/planning/modal/save_resource.html',
                    controller: 'SaveBookPoolResourceCtrl',
                    controllerAs: '$ctrl',
                    size: "lg",
                    resolve: {
                        data: function () {
                            var start = dateFromStringWithTimeZone(selectionInfo.startStr);
                            var end = dateFromStringWithTimeZone(selectionInfo.endStr);
                            return {
                                "RowId": 0,
                                "StartTime": start,
                                "EndTime": end,
                                "Date": start,
                                "sStart": formatToTimeHHmm(start),
                                "sEnd": formatToTimeHHmm(end),
                                "Duration": 0,
                                "ResourceId": selectionInfo.resource.id,
                                "ResourceType": selectionInfo.resource._resource.extendedProps.ResType,
                            };
                        },
                        title: function () {
                            return $translate.instant('addBookResource');
                        }
                    }
                });

                modalInstance.rendered.then(function () {
                    $rootScope.$broadcast("addBookResource", {});
                });

                modalInstance.result.then(function (value) {
                    if (value) {
                        //Add event (starttime and endtime add timezone
                        var timezone = 0 - new Date().getTimezoneOffset();
                        var newEvent = new Object();
                        newEvent.title = "";
                        newEvent.resourceId = selectionInfo.resource.id;
                        newEvent.start = moment(value.StartTime).add(timezone, 'minutes').format();
                        newEvent.end = moment(value.EndTime).add(timezone, 'minutes').format();
                        newEvent.color = "orange";
                        newEvent.allDay = false;
                        console.log(newEvent);
                        calendar.addEvent(newEvent);

                        //Add to Workorder
                        var duration = moment.duration(moment(value.EndTime).diff(moment(value.StartTime)));
                        var hours = duration.asHours();

                        console.log("duration: " + hours);

                        if (!$scope.WorkOrder.BookedResources) {
                            $scope.WorkOrder.BookedResources = [];
                        }

                        $scope.WorkOrder.BookedResources.push({
                            "RowId": 0,
                            "Duration": hours,
                            // "StartTime": value.StartTime,
                            // "EndTime": value.EndTime,
                            "StartTime": moment(value.StartTime).format("YYYY-MM-DDTHH:mm:ss.000"),
                            "EndTime": moment(value.EndTime).format("YYYY-MM-DDTHH:mm:ss.000"),
                            "ResourceId": value.ResourceId,
                            "ResourceType": value.ResourceType
                        });

                    }
                }, function () {
                });

                // });

            },
            eventClick: function (info) {
                evenClick(info);
            },
            events: {
                url: '/events2',
                method: 'GET',
                headers: {"Content-type": "application/json"},
                contentType: 'application/json',
                dataType: "json",
                extraParams: function () {
                    common.spinner(true);
                    if($scope.WorkOrder.WorkOrderId) {
                        return {
                            "DeptId": $scope.DeptId,
                            "ShiftId": $scope.ShiftId,
                            "WorkOrderId": $scope.WorkOrder.WorkOrderId,
                        };
                    }else{
                        return {
                            "DeptId": $scope.DeptId,
                            "ShiftId": $scope.ShiftId,
                            "WorkOrderId": 0,
                        };
                    }
                },
                success: function () {
                    common.spinner(false);
                },
                failure: function () {
                    common.spinner(false);
                }
            }
        });

        calendar.render();

        $(".fc-left").hide();
        $(".fc-right").hide();

        if (gotoDate) {
            calendar.gotoDate(new Date(gotoDate.getTime() + 24 * 60 * 60 * 1000));
        }
    }

    $scope.init = function () {
    }


    createCalendar(new Date(), $scope.DeptId);


    function evenClick(info) {

        console.log(info);
        console.log(info.event);
        console.log(info.event.title);
        console.log(info.event._instance.instanceId);
        console.log(calendar.getEventById(info.event.id));
        if ($scope.WorkOrder.WorkOrderId && $scope.WorkOrder.WorkOrderId > 0){
            //Remove type T,P
            if (info.event._def.extendedProps.Type != 'Booking'
                || info.event._def.extendedProps.WorkOrderId != $scope.WorkOrder.WorkOrderId) {
                return;
            }
        }


        // change the border color just for fun
        info.el.style.borderColor = 'red';


        var start = dateToUTC2(info.event.start);
        var end = dateToUTC2(info.event.end);


        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/wsplanning/templates/pages/workdetail/tabs/planning/modal/save_resource.html',
            controller: 'SaveBookPoolResourceCtrl',
            controllerAs: '$ctrl',
            size: "lg",
            resolve: {
                data: function () {
                    return {
                        "id": info.event.id,
                        "RowId": info.event._def.extendedProps.RowId,
                        "StartTime": start,
                        "EndTime": end,
                        "Date": start,
                        "sStart": formatToTimeHHmm(start),
                        "sEnd": formatToTimeHHmm(end),
                        "Duration": 0,
                        "ResourceId": info.event._def.resourceIds[0],
                        "ResourceType": "0",
                        "title": info.event.title,
                    };
                },
                title: function () {
                    return $translate.instant('editBookResource');
                }
            }
        });

        modalInstance.result.then(function (value) {
            if (value) {
                if (!$scope.WorkOrder.BookedResources) {
                    $scope.WorkOrder.BookedResources = [];
                }

                if(value.RowId){
                    console.log($scope.WorkOrder.BookedResources);
                    var length = $scope.WorkOrder.BookedResources.length;
                    console.log(length);
                    var item = {};
                    for (var i = 0; i < length; i++) {
                        item = $scope.WorkOrder.BookedResources[i];
                        console.log(item);
                        if(item && item.RowId == value.RowId){
                            $scope.WorkOrder.BookedResources.splice(i, 1);
                            break;
                        }
                    }
                }

                console.log($scope.WorkOrder.BookedResources);
                if(value.RowId && value.RowId < 0){
                    //Delete
                    $scope.WorkOrder.BookedResources.push({
                        "RowId": value.RowId,
                        "Duration": 0,
                        "StartTime": moment(value.StartTime).format("YYYY-MM-DDTHH:mm:ss.000"),
                        "EndTime": moment(value.EndTime).format("YYYY-MM-DDTHH:mm:ss.000"),
                        "ResourceId": value.ResourceId,
                        "ResourceType": value.ResourceType
                    });

                    var eventCal = calendar.getEventById(value.id);
                    eventCal.remove();
                }else {

                    var timezone = 0 - new Date().getTimezoneOffset();

                    var eventCal = calendar.getEventById(value.id);
                    eventCal.setStart(moment(value.StartTime).add(timezone, 'minutes').format(), false);
                    eventCal.setEnd(moment(value.EndTime).add(timezone, 'minutes').format(), false);

                    //Add to Workorder
                    var duration = moment.duration(moment(value.EndTime).diff(moment(value.StartTime)));
                    var hours = duration.asHours();

                    console.log("duration: " + hours);



                    $scope.WorkOrder.BookedResources.push({
                        "RowId": value.RowId,
                        "Duration": hours,
                        "StartTime": moment(value.StartTime).format("YYYY-MM-DDTHH:mm:ss.000"),
                        "EndTime": moment(value.EndTime).format("YYYY-MM-DDTHH:mm:ss.000"),
                        "ResourceId": value.ResourceId,
                        "ResourceType": value.ResourceType
                    });
                }

            }
        }, function () {
        });


    }


});