/**
 * Created by ruchyp on 9/7/2015.
 */
angular.module('pune')
    .filter('plumber', function () {
        return function (input, filter) {
            input = input || [];
            var out = [];
            if (filter === 'all') {
                return input;
            }
            for (var i = 0; i < input.length; i++) {
                if (input[i].presence === filter) {
                    out.push(input[i]);
                }
            }
            return out;
        };
    });
