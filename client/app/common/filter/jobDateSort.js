/**
 * Created by ruchyp on 9/7/2015.
 */
angular.module('pune').filter('sortByDate', function () {
    return function (input) {
        input = input || [];
        var jobs = _.sortBy(input, 'date');
        for (var key in jobs) {
            if (jobs.hasOwnProperty(key)) {
                if (jobs[key].jobStatus === 'unassigned') {
                    jobs[key].jobStatusPriority = 0;
                }
                if (jobs[key].jobStatus === 'assigned') {
                    jobs[key].jobStatusPriority = 1;
                }
                if (jobs[key].jobStatus === 'In progress') {
                    jobs[key].jobStatusPriority = 2;
                }
            }
        }

        return _.sortBy(jobs, 'jobStatusPriority');
    };
});
