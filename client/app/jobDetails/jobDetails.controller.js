/**
 * Created by ruchyp on 7/22/2015.
 */

angular.module('peninsula').controller('jobDetailsCtrl', function ($scope, $http, $location, host,$state) {
    $scope.customers=[];
    $scope.assignedPlumberMap = {};
    $scope.custReqNameMap ={};
    $scope.custReqAddressMap ={};
    $scope.custReqDescriptionMap ={};
    var customers =[];
    $http.get(host+'/api/getAllCustomerReq').then(function (result) {
        console.log(result);
        var data = result.data;
        data.forEach(function(info){
            $scope.customers.push(info);
        });
    });

    $http.get(host + '/api/assignJobList').then(function (result) {
        var data = result.data;
        data.forEach(function (info) {
            if (!!$scope.assignedPlumberMap[info.customerReqId]) {
                $scope.assignedPlumberMap[info.customerReqId].push(info);
            } else {
                $scope.assignedPlumberMap[info.customerReqId] = [info];
            }
            $scope.custReqNameMap[info.customerReqId] = info.customerName;
            $scope.customers.forEach(function(info){
                $scope.custReqAddressMap[info.customerId] = info.address;
                $scope.custReqDescriptionMap[info.customerId] = info.description;
            })
        });
    });

    $scope.showMap = function(customerId, address){
        $state.go("showMap",{customerId:customerId,address:address});
    };


});

