/**
 * Created by ruchyp on 7/22/2015.
 */

angular.module('peninsula').controller('jobDetailsCtrl', function ($scope, $http, $location, host, $state) {
    $scope.customers = [];
    $scope.assignedPlumberMap = {};
    $scope.custReqNameMap = {};
    $scope.custReqAddressMap = {};
    $scope.custReqDescriptionMap = {};

    // This is a get request for job assignment
    $http.get(host + '/api/assignUnassignJobList').then(function (result) {
        var data = result.data;
        data.forEach(function (info) {
            if (!!$scope.assignedPlumberMap[info.customerId]) {
                $scope.assignedPlumberMap[info.customerId].push(info);
            } else {
                $scope.assignedPlumberMap[info.customerId] = [info];
            }
            $scope.custReqNameMap[info.customerId] = info.customerName;
            $scope.custReqAddressMap[info.customerId] = info.address;
            $scope.custReqDescriptionMap[info.customerId] = info.description;
        });
    });

    // This function sends selected customer id & address to the map page
    $scope.showMap = function (customerId, address) {
        $state.go("showMap", {customerId: customerId, address: address});
    };


});

