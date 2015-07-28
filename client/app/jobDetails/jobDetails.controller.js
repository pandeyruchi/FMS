/**
 * Created by ruchyp on 7/22/2015.
 */

angular.module('peninsula').controller('jobDetailsCtrl', function ($scope, $http, $location, host) {
    var stausarray = [];
    $scope.customers=[];


    //$scope.customers = [{"customerName" : "Anjali" ,"description":"change pipeline"},{"customerName" : "Chhaya","description":"attach pipeline" },{"customerName" : "Ruchi" ,"description":"repair pipeline"}];

    $http.get("http://172.25.36.44:3600/api/getAllCustomerReq").then(function (result) {
        console.log(result);
        var data = result.data;
        var arrayLength = data.length;
        for (var i = 0; i < arrayLength; i++) {
            var stauslist = {};
            u = data[i];
            stauslist.customerId = u.customerId;
            stauslist.customerName = u.customerName;
            stauslist.description = u.description;
            stauslist.status = u.status;
            stausarray.push(stauslist);
        }

        customerPush();
    });


    var customerAdd = function (info) {
        $scope.customers.push(info);
    };

    function customerPush() {
        for (i = 0; i < stausarray.length; i++) {
            customerAdd(stausarray[i]);
        }
    }
});

