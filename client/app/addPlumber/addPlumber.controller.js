
angular.module('peninsula').controller('addPlumberCtrl', function ($scope, $http,$location,host) {

    $scope.user = {
        
    };

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
