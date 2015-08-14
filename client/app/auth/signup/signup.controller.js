angular.module('peninsula').controller('signupCtrl', function ($scope, $http,$location,host) {

    $scope.user = {
        
    };
    /// This method posts sign up user data to server
    $scope.signup = function () {
       var pwd = btoa($scope.user.password);
       $scope.user.password = pwd;
	 var res = $http.post(host+'/api/signup', $scope.user);
        res.success(function (data) {
            console.log(data);
            if (!!data.error) {
                alert(data.Message);
            }
            else {
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
