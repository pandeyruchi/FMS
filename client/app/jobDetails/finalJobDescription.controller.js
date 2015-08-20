/**
 * Created by anjali tanpure on 4/8/15.
 */


angular.module('peninsula').controller('finalJobDescriptionCtrl', function ($scope, $http, host, $stateParams,$modal) {
    var customerReqId = $stateParams.customerReqId;
    var plumberId = $stateParams.plumberId;
    $scope.assignedPlumberMap = {};
    $scope.custReqNameMap ={};
    $scope.isOpen =  false;

    var list = [];

    // This function is used to get the customer-plumber job assignments
    function mapping(){
    $http.get(host + '/api/assignJobList').then(function (result) {
        var data = result.data;

        // This function prints the customer & assigned plumbers
        data.forEach(function (info) {
            if(customerReqId === info.customerReqId)
            {
                if (!!$scope.assignedPlumberMap[info.customerReqId]) {
                    $scope.assignedPlumberMap[info.customerReqId].push(info);
                } else {
                    $scope.assignedPlumberMap[info.customerReqId] = [info];
                }
                $scope.custReqNameMap[info.customerReqId] = info;
                console.log("info : "+info.mobileNo);
            }
        });
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
angular.module('peninsula').controller('ModalInstanceCtrl', function ($scope, $modalInstance, assignedPlumberMap,custReqNameMap) {

    $scope.assignedPlumberMap = assignedPlumberMap;
    $scope.custReqNameMap = custReqNameMap;

    $scope.ok = function () {
        $modalInstance.dismiss('ok');
    };
});