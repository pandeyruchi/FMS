
angular.module('peninsula').controller('addPlumberCtrl', function ($scope, $http,$location,host) {

    $scope.user = {
        
    };

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
       var pwd = btoa($scope.user.password);
       $scope.user.password = pwd;
	 var res = $http.post(host+'/api/addPlumber', $scope.user);
        res.success(function (data) {
            console.log(data);
            if (!!data.error) {
                alert(data.Message);
            }
            else {
                $location.url("/main");
            }
        });
        res.error(function (err) {
            console.log(err);
            alert("From Error add plumber unsuccesful");
        })
    }
});
