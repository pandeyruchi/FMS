/**
 * Created by ruchyp on 7/22/2015.
 */

angular.module('peninsula').controller('loginCtrl', function ($scope, $http, $location, host) {
    $scope.login = function (user) {
        var res = $http.post(host + '/api/login', user);
        res.success(function (data) {
            console.log(data);
            if (data.error) {
                alert('login un-successful');
            }
            else {
                $location.url('/main')
            }
        });

    }
});