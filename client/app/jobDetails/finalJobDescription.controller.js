/**
 * Created by anjali tanpure on 4/8/15.
 */


angular.module('pune').controller('finalJobDescriptionCtrl', function ($scope, $http, host, $stateParams,$modal, ngProgressFactory) {
    var jobReqId = $stateParams.jobReqId;
    var plumberId = $stateParams.plumberId;
    $scope.assignedPlumberMap = {};
    $scope.custReqNameMap ={};
    $scope.isOpen =  false;

    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setHeight('4px');
    $scope.progressbar.setColor('#0274ff');
    var list = [];

    // This function is used to get the customer-plumber job assignments
    function mapping(){
    $http.get(host + '/api/assignJobList').then(function (result) {
      $scope.progressbar.start();
        var data = result.data;

        // This function prints the customer & assigned plumbers
        data.forEach(function (info) {
            if(jobReqId === info.jobReqId)
            {
                if (!!$scope.assignedPlumberMap[info.jobReqId]) {
                    $scope.assignedPlumberMap[info.jobReqId].push(info);
                } else {
                    $scope.assignedPlumberMap[info.jobReqId] = [info];
                }
                $scope.custReqNameMap[info.jobReqId] = info;
                console.log("info : "+info.mobileNo);
                $scope.progressbar.complete();
            }
        });
        $scope.progressbar.complete();
    });
    }

    mapping();

    // This function is used to show pop up
    $scope.open = function () {
        $scope.isOpen = true;
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            // size: size,
            resolve: {
                assignedPlumberMap: function () {
                    console.log($scope.assignedPlumberMap);
                    return $scope.assignedPlumberMap;

                },
                custReqNameMap: function () {
                    console.log("cust"+$scope.custReqNameMap);
                    return $scope.custReqNameMap;

                }
            }
        });

    };
});

// This is the helper controller used for modal instance
angular.module('pune').controller('ModalInstanceCtrl', function ($scope, $modalInstance, assignedPlumberMap,custReqNameMap) {

    $scope.assignedPlumberMap = assignedPlumberMap;
    $scope.custReqNameMap = custReqNameMap;

    $scope.ok = function () {
        $modalInstance.dismiss('ok');
    };
});
