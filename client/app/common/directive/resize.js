/**
 * Created by ruchyp on 9/23/2015.
 */
angular.module('pune').directive('setHeight', function ($window) {
    return {
        link: function (scope, element, attrs) {
            console.log($window.innerHeight);
            var window = angular.element($window);
            element.css('height', $window.innerHeight - 60);
            element.css('max-height', $window.innerHeight - 60);
            element.css('min-height', $window.innerHeight - 60);

            window.bind('resize', function () {
                element.css('height', $window.innerHeight - 60);
                element.css('max-height', $window.innerHeight - 60);
                element.css('min-height', $window.innerHeight - 60);
            });
        }
    }
})

angular.module('pune').directive('setHeightDashboard', function ($window) {
    return {
        link: function (scope, element, attrs) {
            console.log($window.innerHeight);
            var window = angular.element($window);
            element.css('height', $window.innerHeight - 70);
            element.css('max-height', $window.innerHeight - 70);
            element.css('min-height', $window.innerHeight - 70);

            window.bind('resize', function () {
                element.css('height', $window.innerHeight - 70);
                element.css('max-height', $window.innerHeight - 70);
                element.css('min-height', $window.innerHeight - 70);
            });
        }
    }
})

angular.module('pune').directive('maxHeight', function ($window) {
    return {
        link: function (scope, element, attrs) {
            console.log($window.innerHeight);
            var window = angular.element($window);
            element.css('height', $window.innerHeight - 125);
            element.css('max-height', $window.innerHeight - 125);
            element.css('min-height', $window.innerHeight - 125);

            window.bind('resize', function () {
                element.css('height', $window.innerHeight - 125);
                element.css('max-height', $window.innerHeight - 125);
                element.css('min-height', $window.innerHeight - 125);
            });
        }
    }
})

angular.module('pune').directive('maxHeightDashboard', function ($window) {
    return {
        link: function (scope, element, attrs) {
            console.log($window.innerHeight);
            var window = angular.element($window);
            element.css('height', $window.innerHeight - 330);
            element.css('max-height', $window.innerHeight - 330);
            element.css('min-height', $window.innerHeight - 330);

            window.bind('resize', function () {
                element.css('height', $window.innerHeight - 330);
                element.css('max-height', $window.innerHeight - 330);
                element.css('min-height', $window.innerHeight - 330);
            });
        }
    }
})