/**
 * Created by ruchyp on 7/22/2015.
 */

angular.module('peninsula').controller('custreqCtrl', function ($scope, $http, $location, host) {

    //var user = {};

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

    $scope.custreq = function () {

        var res = $http.post(host + '/api/customerRequest ', $scope.user);
        res.success(function (data) {
            console.log(data);
            if (!!data.error) {
                alert(data.Message);
            }
            else {
                alert("Successfully submitted");
                $location.url("/main");
            }
        });
        res.error(function (err) {
            console.log(err);
            alert("From Error custreq unsuccesful");
        })
    }
});
