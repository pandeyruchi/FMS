/**
 * Created by ruchyp on 9/7/2015.
 */
angular.module('pune')
    .filter('job', function () {
        return function (input, filter) {
            input = input || [];
            var out = {};
            if (filter === 'all') {
                for (var key in input) {
                    if (input.hasOwnProperty(key)) {
                        if (input[key].jobStatus !== 'completed') {
                            out[key]=input[key];
                        }
                    }
                }
                return out;
            }

            for (var key in input) {
                if (input.hasOwnProperty(key)) {
                    if (input[key].jobStatus === filter) {
                        out[key]=input[key];
                    }
                }
            }
            return out;
        };
    });
