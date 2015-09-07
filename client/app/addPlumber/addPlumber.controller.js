
angular.module('pune').controller('addPlumberCtrl', function ($scope, $http,$location,host, ngProgressFactory,$analytics) {
    $analytics.pageTrack('/addPlumber');

    $scope.user = {
        
    };

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

    $scope.addPlumber = function () {
      $scope.progressbar.start();
       var pwd = btoa($scope.user.password);
       $scope.user.password = pwd;
	 var res = $http.post(host+'/api/addPlumber', $scope.user);
        res.success(function (data) {
            console.log(data);
            if (!!data.error) {
              $scope.progressbar.complete();
                alert(data.Message);
            }
            else {
              $scope.progressbar.complete();
                $location.url("/main");
            }
        });
        res.error(function (err) {
          $scope.progressbar.complete();
            console.log(err);
            alert("From Error add plumber unsuccesful");
        })
    }
});
