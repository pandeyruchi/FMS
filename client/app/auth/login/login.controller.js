/**
 * Created by ruchyp on 7/22/2015.
 */

angular.module('peninsula').controller('loginCtrl', function ($scope, $http, $location, host) {

    /// This method posts login request data to server
    $scope.login = function (user) {
        var pwd = btoa(user.password);
        user.password = pwd;
        user.device = "web";
        var res = $http.post(host + '/api/login', user);
        res.success(function (data) {
            console.log(data);
            if (data.error) {
                alert('login un-successful');
            }
            else {
                $location.url("/main");
            }
        });
    }
});
