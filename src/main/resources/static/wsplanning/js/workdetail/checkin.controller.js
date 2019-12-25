UserWebApp.controller('CheckInCtrl', function ($scope, $state, $rootScope, WorkOrderService, HttpService, $translate, $location, $filter, $uibModal, CommonServices, $stateParams, $timeout, $window, $element) {

    //<editor-fold desc="Variable">
    $scope.imgTemplate = "";


    $scope.VehiId = ($scope.WorkOrder && $scope.WorkOrder.WOVehicle && $scope.WorkOrder.WOVehicle.VehiId) ? $scope.WorkOrder.WOVehicle.VehiId : 0;
    $scope.template = "1";
    $scope.templateSelected = { "Id": "01" };
    $scope.templateName = {};
    $scope.lstTemplate = [];

    $scope.boundingBox = {
        "width": 900,
        "height": 336,
    };

    $scope.data = {
        "Mileage": ($scope.WorkOrder && $scope.WorkOrder.Mileage) ? $scope.WorkOrder.Mileage : 0,
        "Remark": "",
        "legalText": "",
    };

    $scope.color = "green";
    //</editor-fold>

    copyObject();

    function copyObject() {
        $scope.originalTemplateSelected = angular.copy($scope.templateSelected);
        $scope.originalData = angular.copy($scope.data);
        $scope.originalColor = angular.copy($scope.color);
    }


    $scope.$watch("color", function (newValue, oldValue) {
        var modified = false;
        if (newValue != oldValue) {
            console.log(newValue);
            $timeout(function () {
                angular.element('#btnUpdateColor').triggerHandler('click');
            });
            modified = true;
        } else if (newValue != "green") {
            modified = true;
        } else {
            modified = false;
        }
        $scope.$emit('isSave', {
            modified: modified,
        }
        );
    });

    $scope.$watch("templateSelected", function (newValue, oldValue) {
        compareValue(newValue, oldValue, $scope.originalTemplateSelected);
    });

    $scope.$watch("data.Mileage", function (newValue, oldValue) {
        compareValue(newValue, oldValue, $scope.originalData.Mileage);
    });

    function compareValue(newValue, oldValue, originalValue) {
        console.log(typeof newValue);
        var modified = false;
        if (angular.equals(newValue, {}) && !angular.equals(newValue, originalValue)) {
            modified = false;
        } else if (!angular.equals(newValue, originalValue)) {
            modified = true;
        } else {
            modified = false;
        }
        $scope.$emit('isSave', {
            modified: modified,
        }
        );
    }

    $scope.$watch("data.Remark", function (newValue, oldValue) {
        compareValue(newValue, oldValue, $scope.originalData.Remark);

    });

    $scope.$watch("data.legalText", function (newValue, oldValue) {
        compareValue(newValue, oldValue, $scope.originalData.legalText);

    });


    //<editor-fold desc="listTemplateType">
    $scope.listTemplateType = function () {
        $scope.base64Encode = "";
        common.spinner(true);
        HttpService.postDataWithCache('/checkin/template-type', { VehiId: $scope.VehiId }).then(function (response) {
            $scope.lstTemplate = response;
            if ($scope.lstTemplate.length > 0) {
                $scope.templateSelected = $scope.lstTemplate[0];
            }
            $scope.templateSelected = {};
            $scope.data.legalText = "";
            $scope.templateName = "";
            $scope.changeTemplate();
            common.spinner(false);
        }, function error(response) {
            $scope.lstTemplate = [];
            $scope.templateSelected = {};
            $scope.data.legalText = "";
            $scope.templateName = "";
            $scope.changeTemplate();
            console.log(response);
            common.spinner(false);
        });
    }
    $scope.listTemplateType();
    //</editor-fold>

    //<editor-fold desc="changeTemplate">
    $scope.changeTemplate = function () {
        console.log($scope.templateSelected);

        $scope.templateName = "";
        if ($scope.templateSelected && $scope.templateSelected.Items && $scope.templateSelected.Items.length > 0) {
            for (var i = 0; i < $scope.templateSelected.Items.length; i++) {
                if ($scope.templateSelected.Items[i].Id == "Image") {
                    $scope.templateName = $scope.templateSelected.Items[i].Value;
                } else if ($scope.templateSelected.Items[i].Id == "LegacyText") {
                    $scope.data.legalText = $scope.templateSelected.Items[i].Value;
                }
            }
        }
        $scope.base64Encode = "";
        common.spinner(true);
        if ($scope.templateName != "") {
            HttpService.postData('/checkin/template', { name: $scope.templateName }).then(function (response) {
                $scope.imgTemplate = "data:image/png;base64," + response.base64;
                common.spinner(false);
            }, function error(response) {
                $scope.imgTemplate = "";
                console.log(response);
                common.spinner(false);
            });
        } else {
            // HttpService.postData('/checkin/template', {type: $scope.template}).then(function (response) {
            //     $scope.imgTemplate = "data:image/png;base64," + response.base64;
            //     common.spinner(false);
            // }, function error(response) {
            //     $scope.imgTemplate = "";
            //     console.log(response);
            //     common.spinner(false);
            // });
        }
    }
    //</editor-fold>


    //<editor-fold desc="onSubmitForm">
    function createListWOAttachment() {
        var list = [];
        var i = 0;
        //template da danh dau
        var template = $scope.acceptTemplate();
        if (!template.isEmpty) {
            var templateMark = {};
            templateMark.FileId = 0;
            templateMark.FileName = $scope.templateName;
            templateMark.dataUrl = template.dataUrl;
            templateMark.ImageData = template.dataUrl.replace("data:image/png;base64,", "");
            templateMark.AttachType = "VHC";
            templateMark.AttachTypeDescription = "";
            templateMark.FileDescription = "";
            list[i++] = templateMark;
        }

        var signCanvas = $scope.accept();
        if (!signCanvas.isEmpty) {
            var sign = {};
            sign.FileId = 0;
            sign.FileName = "Signature_of_customer.png";
            sign.dataUrl = signCanvas.dataUrl;
            sign.ImageData = signCanvas.dataUrl.replace("data:image/png;base64,", "");
            sign.AttachType = "SIGNATUREP";
            sign.AttachTypeDescription = "";
            sign.FileDescription = "";
            list[i++] = sign;
        }

        if ($scope.listImage && $scope.listImage.length > 0) {
            Array.prototype.push.apply(list, $scope.listImage);
        }

        return list;
    }

    $scope.onSubmitForm = function (params) {
        var list = createListWOAttachment();

        var postAction = "checkIn";

        $scope.WorkOrder.WOAttachments = list;
        $scope.WorkOrder.CustomerComplaint = $scope.data.Remark;
        $scope.WorkOrder.Mileage = $scope.data.Mileage;

        console.log($scope.WorkOrder);
        var data = JSON.stringify($scope.WorkOrder);

        common.btnLoading($(".btnSubmit"), true);
        WorkOrderService.postWorkOrder(data, postAction).then(function (res) {
            common.btnLoading($(".btnSubmit"), false);
            console.log(res);
            if (res.data.Token && res.data.Token.ErrorDesc) {
                common.notifyWithMessage("Warning!!!", res.status, res.data.Token.ErrorDesc)
            } else {
                common.notifySuccess("Success!!!");
            }
            console.log($scope.WorkOrder);

            if (params) {
                $scope.$emit('isSave', {

                    modified: false,
                }
                );
                console.log(params);
                console.log($state.current);
                $state.transitionTo($state.current, params, {
                    reload: false, inherit: false, notify: false, location: "replace"
                });
            } else {
                if ($scope.WorkOrder && $scope.WorkOrder.WorkOrderId) {
                    location.reload();
                }
            }

        }, function (err) {
            common.btnLoading($(".btnSubmit"), true);
            console.log(err);
            common.notifyError("Error!!!", err.status);
        });
    }


    //Save from button header
    $scope.$on('saveCheckin', function (event, obj) {
        $scope.onSubmitForm(obj.item);
    });
    //</editor-fold>


    //<editor-fold desc="openImage">
    $scope.listImage = [];
    $scope.openImage = function () {
        $scope.listImage = [];
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/wsplanning/templates/pages/common/photo-form.html',
            controller: 'PhotoModalCtrl',
            backdrop: 'static',
            controllerAs: '$ctrl',
            size: "full",
            resolve: {
                data: {
                    item: null,
                    workOrderId: $scope.WorkOrder.WorkOrderId,
                    jobAttachments: null
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            console.log(selectedItem);
            Array.prototype.push.apply($scope.listImage, selectedItem);
            console.log($scope.listImage);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    //</editor-fold>

});