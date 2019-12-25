UserWebApp.controller('ScanQRcodeModalCtrl', function ($scope, $rootScope, HttpService, $translate, $location,
                                                       $filter, $uibModal, $uibModalInstance, $timeout,cameras) {

    $scope.cancel = function () {
        console.log("-----cancel------");
        if (scanner != null) {
            scanner.stop();
            scanner = null;
        }
        $uibModalInstance.dismiss('cancel');
    };


    $scope.code = "";
    $scope.$watch("code", function (newValue, oldValue) {
        if (newValue != oldValue) {
            console.log("$watch: " + newValue);
            $uibModalInstance.close({scanner: scanner,code: $scope.code});
        }
    });

    $scope.activeCameraId = null;
    $scope.cameras = cameras;

    $scope.formatName = function (name) {
        return name || '(unknown)';
    }
    $scope.selectCamera = function (camera) {
        $scope.activeCameraId = camera.id;
        scanner.start(camera);
    }

    var scanner = null;
    $rootScope.$on('modalOpenQR', function () {
        scanner = new Instascan.Scanner({
            continuous: true,
            video: document.getElementById('preview'),
            scanPeriod: 5,
            refractoryPeriod: 5000,
            backgroundScan: false
        });
        console.log(scanner);
        scanner.addListener('scan', function (content) {
            console.log(content);
            $scope.code = content;
            $uibModalInstance.close({scanner: scanner,code: $scope.code});
        });

        if ($scope.cameras.length > 0) {
            $scope.activeCameraId = cameras[0].id;
            scanner.start(cameras[0]);
        } else {
            console.error('No cameras found.');
        }

    });

});