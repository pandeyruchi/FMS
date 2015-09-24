/**
 * Created by synerzip on 23/9/15.
 */
angular.module('pune').filter('sortByRank', function () {
    return function (input) {
        input = input || [];
       return _.sortBy(input, 'rank');
    };
});