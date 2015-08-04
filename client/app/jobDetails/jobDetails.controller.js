/**
 * Created by ruchyp on 7/22/2015.
 */

angular.module('peninsula').controller('jobDetailsCtrl', function ($scope, $http, $location, host,$state) {
    var stausarray = [];
    $scope.customers=[];


    $scope.showMap = function(customerId, address){
        $state.go("showMap",{customerId:customerId,address:address});
    };

    $http.get(host+'/api/getAllCustomerReq').then(function (result) {
        console.log(result);
        var data = result.data;
        data.forEach(function(u){
            $scope.customers.push(u);
        });
    });
});

