angular.module('pune').controller('signupCtrl', function ($scope, $http,$location,host, ngProgressFactory) {
  $scope.progressbar = ngProgressFactory.createInstance();
  $scope.progressbar.setHeight('4px');
  $scope.progressbar.setColor('#0274ff');

    $scope.user = {

    };
    /// This method posts sign up user data to server
    $scope.signup = function () {
      $scope.progressbar.start();

       var pwd = btoa($scope.user.password);
       $scope.user.password = pwd;
	 var res = $http.post(host+'/api/signup', $scope.user);
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
        /*res.error(function (err) {
            console.log(err);
            alert("Please provide all details!\nsignup unsuccesful");
        })*/
        res.error(function(data) {
            alert( "failure message: " + data.message);
        });
    }
});
