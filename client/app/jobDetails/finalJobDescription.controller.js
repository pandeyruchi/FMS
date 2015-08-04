/**
 * Created by synerzip on 4/8/15.
 */


    angular.module('peninsula').controller('finalJobDescriptionCtrl', function ($scope, $http, host, $stateParams) {
        var customerReqId = $stateParams.customerReqId;
        var plumberId = $stateParams.plumberId;

        $scope.Hello = function(){
            alert("Done!");
        }

    });

