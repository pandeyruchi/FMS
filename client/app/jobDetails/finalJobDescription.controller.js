/**
 * Created by synerzip on 4/8/15.
 */


angular.module('peninsula').controller('finalJobDescriptionCtrl', function ($scope, $http, host, $stateParams) {
    var customerReqId = $stateParams.customerReqId;
    var plumberId = $stateParams.plumberId;
    $scope.assignedPlumberMap = {};
    $scope.custReqNameMap ={};
    var list = [];
    $http.get(host + '/api/assignJobList').then(function (result) {
        var data = result.data;
        data.forEach(function (info) {
            if (!!$scope.assignedPlumberMap[info.customerReqId]) {
                $scope.assignedPlumberMap[info.customerReqId].push(info);
            } else {
                $scope.assignedPlumberMap[info.customerReqId] = [info];
            }
            $scope.custReqNameMap[info.customerReqId] = info.customerName;
        });
    });
});