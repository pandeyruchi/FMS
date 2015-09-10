/**
 * Created by ruchyp on 9/9/2015.
 */

angular.module('pune')
    .filter('jobCount', function () {
        return function (input, filter) {
            input = input || [];

            var out = [];
            if (filter === 'all') {
                return input;
            }

            for (var i = 0; i < input.length; i++) {
                if (input[i].jobStatus === filter) {
                    out.push(input[i]);
                }
            }
            return out;
        };
    });

