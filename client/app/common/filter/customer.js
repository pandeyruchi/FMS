/**
 * Created by ruchyp on 9/9/2015.
 */
angular.module('pune')
    .filter('customer', function () {
        return function (input, filter) {
            input = input || [];
            var out = [];
            if (filter === '') {
                return input;
            }
            for (var key in input) {
                if (input.hasOwnProperty(key)) {
                    /*if (input[key].contains(filter)) {
                        out.push(input[key]);
                    }*/
                    if (input[key].customerName === filter) {
                        out.push(input[key]);
                    }
                }
            }
            return out;
        };
    });
