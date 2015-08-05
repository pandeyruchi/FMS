/**
 * Created by synerzip on 4/8/15.
 */


    angular.module('peninsula').controller('finalJobDescriptionCtrl', function ($scope, $http, host, $stateParams) {
        var customerReqId = $stateParams.customerReqId;
        var plumberId = $stateParams.plumberId;
       var list = [];
        $http.get(host + '/api/assignJobList').then(function (result) {
            var data = result.data;
            data.forEach(function (info) {
               /* if($scope.jobList.customerReqId === info.customerReqId){
                    $scope.plumberList.push(info.plumberId);
                }
                else{
                    $scope.jobList.push(info.customerReqId);
                    $scope.plumberList.push(info.plumberId);
                }*/


                for(var i=0;i<list.length;i++){
                    list.sort();
                    if(list[i].customerReqId === info.customerReqId){
                        list[i].plumberList.push(info.plumberId);

                      }
                    else{
                        list[i].push(info.customerReqId);
                        list[i].plumberList.push(info.plumberId);
                    }
                }
            });
        });
    });