angular.module('pune').controller('signupCtrl', function ($scope, $http,$location,host, ngProgressFactory,$analytics) {
  $analytics.pageTrack('/addAdmin');
  $scope.progressbar = ngProgressFactory.createInstance();
  $scope.progressbar.setHeight('4px');
  $scope.progressbar.setColor('#0274ff');

  $scope.user = {

  };

  function computeCoordinates() {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({"address": $scope.user.address}, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
              var location = results[0].geometry.location;
              $scope.user.latitude = location.G;
              $scope.user.longitude = location.K;
            console.log("hi"+$scope.user.latitude + " " + $scope.user.longitude);
          }
      });
  }
  $scope.computeCoordinates = computeCoordinates;

  /// This method posts sign up user data to server
  $scope.signup = function () {
    $scope.progressbar.start();


    computeCoordinates();



    var pwd = btoa($scope.user.password);
    var confirmPwd = btoa($scope.user.confirmPassword);
    $scope.user.password = pwd;
    $scope.user.confirmPassword=confirmPwd;
    var res = $http.post(host+'/api/signup', $scope.user);
    console.log("hi"+$scope.user.latitude + " " + $scope.user.longitude);
    res.success(function (data) {
      console.log(data);
      if (!!data.error) {
        $scope.progressbar.complete();
        alert(data.message);
      }
      else {
        $scope.progressbar.complete();
        $location.url("/main");
      }
    });
    /*res.error(function (err) {
    console.log(err);
    alert("Please provide all details!\nsignup unsuccesful");
  })*/
  res.error(function(data) {
    $scope.progressbar.complete();
    alert( "failure message: " + data.message);
  });
}
});
