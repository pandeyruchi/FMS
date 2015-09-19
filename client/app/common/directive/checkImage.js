/**
 * Created by ruchyp on 9/16/2015.
 */

angular.module('pune').directive('checkImage', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            attrs.$observe('ngSrc', function (ngSrc) {
                if(!!ngSrc){
                    $http.get(ngSrc).success(function () {
                        console.log(ngSrc);
                    }).error(function () {
                        element.attr('src', '/assets/images/avatar.png'); // set default image
                    });
                }
                else
                {
                    element.attr('src', '/assets/images/avatar.png'); // set default image
                }

            });
        }
    };
});
