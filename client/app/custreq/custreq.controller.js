/**
* Created by ruchyp on 7/22/2015.
*/

angular.module('pune').controller('custreqCtrl', function ($scope, $http, $location, host, ngProgressFactory,$analytics) {
  $analytics.pageTrack('/custreq');
  //var user = {};
  $scope.progressbar = ngProgressFactory.createInstance();
  $scope.progressbar.setHeight('4px');
  $scope.progressbar.setColor('#0274ff');

  function computeCoordinates() {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({"address": $scope.user.address}, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
        var location = results[0].geometry.location;
        $scope.user.latitude = location.G;
        $scope.user.longitude = location.K;
      }
    });
  }

  $scope.computeCoordinates = computeCoordinates;

  $scope.user = {};


  /// This method posts customer request data to server
  $scope.custreq = function () {
    $scope.progressbar.start();
    var res = $http.post(host + '/api/jobRequest ', $scope.user);
    res.success(function (data) {
      console.log(data);
      if (!!data.error) {
        $scope.progressbar.complete();
        alert(data.Message);
      }
      else {
        $scope.progressbar.complete();
        alert("Successfully submitted");
        $location.url("/main");
      }
    });
    res.error(function (err) {
      $scope.progressbar.complete();
      console.log(err);
      alert("Please provide all the data \nCustomer request unsuccesful");
    })
  }
});
