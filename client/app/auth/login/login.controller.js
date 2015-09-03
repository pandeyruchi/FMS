/**
 * Created by ruchyp on 7/22/2015.
 */


   angular.module('pune').controller('loginCtrl', function ($scope, $http, $location, host, ngProgressFactory) {
    /// This method posts login request data to server
    $scope.login = function (user) {
      $scope.progressbar = ngProgressFactory.createInstance();
      $scope.progressbar.setHeight('4px');
      $scope.progressbar.setColor('#0274ff');
      $scope.progressbar.start();
        var pwd = btoa(user.password);
        user.password = pwd;
        user.device = "web";
        var res = $http.post(host + '/api/login', user);
        res.success(function (data) {
            console.log(data);
            if (data.error) {
              $scope.progressbar.complete();
                alert('login un-successful');
            }
            else {
              $scope.progressbar.complete();
                $location.url("/main");
            }
        });
        res.error(function (err) {
            $scope.progressbar.complete();
            console.log(err);
            alert("Username or password incorrect !\nLogin Unsuccessful !");
        })
    }
});
