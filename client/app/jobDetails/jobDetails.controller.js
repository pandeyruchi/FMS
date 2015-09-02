/**
* Created by ruchyp on 7/22/2015.
*/

angular.module('pune').controller('jobDetailsCtrl', function ($scope, $http, $location, host, $state, ngProgressFactory) {
  $scope.customers = [];
  $scope.assignedPlumberMap = {};
  $scope.custReqNameMap = {};
  $scope.custReqAddressMap = {};
  $scope.custReqDescriptionMap = {};

  $scope.progressbar = ngProgressFactory.createInstance();
  $scope.progressbar.setHeight('4px');
  $scope.progressbar.setColor('#0274ff');

  // This is a get request for job assignment
  $http.get(host + '/api/assignUnassignJobList').then(function (result) {
    var data = result.data;
    $scope.progressbar.start();
    data.forEach(function (info) {
      if (!!$scope.assignedPlumberMap[info.jobId]) {
        $scope.assignedPlumberMap[info.jobId].push(info);
      } else {
        $scope.assignedPlumberMap[info.jobId] = [info];
      }
      $scope.custReqNameMap[info.jobId] = info.customerName;
      $scope.custReqAddressMap[info.jobId] = info.address;
      $scope.custReqDescriptionMap[info.jobId] = info.description;
      $scope.progressbar.complete();
    });
  });

  // This function sends selected customer id & address to the map page
  $scope.showMap = function (jobId, address) {
    $state.go("showMap", {jobId: jobId, address: address});
  };


});

