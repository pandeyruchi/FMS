/**
 * Created by synerzip on 29/7/15.
 */
angular.module('pune').controller('jobDetailsCtrl', function ($scope, $http, $location, host, $filter, $stateParams, $q, $state, $interval, $timeout) {
    // Variable Declarations
    var marker;
    var infoWindow = new google.maps.InfoWindow();
    $scope.jobs = {};
    $scope.plumbersMap = {};

    $scope.filter = {
        jobFilter: 'all',
        plumberFilter: 'all',
        customerFilter: '',
        availFilter: 1,
        unAvailFilter: 0
    };
    $scope.jobFilterOptions = [
        {id: 'completed', text: 'Completed'},
        {id: 'active', text: 'Open'},
        {id: 'In progress', text: 'In Progress'},
        {id: 'all', text: 'All Jobs'}
    ];

    $scope.plumberFilterOptions = [
        {id: 1, text: 'Available'},
        {id: 0, text: 'Un-Available'},
        {id: 'all', text: 'All Plumbers'}
    ];


    $scope.predicate = 'jobCount';
    $scope.reverse = true;
    $scope.order = function (predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
// This method creates map with default lat and lng.;
    var map;

    function createNewMap(lat, long) {
        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(lat, long),
            mapTypeId: google.maps.MapTypeId.RoadMap
        };
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }

    $scope.$on('$viewContentLoaded', function () {
        createNewMap(18.518920, 73.860736);
        google.maps.event.trigger(map, 'resize');
    });

    var hash;

    function getJobDetails() {
        var res = $http.get(host + '/api/assignUnassignJobList').success(function (result) {
            //console.log(result.data);
            $scope.jobs = {};
            var data = result[0].list;
            hash = result[0].hash;

            updateJobsMap(data);
            $scope.loaded = true;

        });
        res.error(function (err) {
            console.log(err);
            // alert("Error");
        });
    }


    function updateJobDetails() {
        var res = $http.post(host + '/api/updateStatus', {"hash": hash}).success(function (result) {
            //console.log(result.data);
            if (result.change === 'yes') {
                $scope.jobs = {};
                var data = result[0].list;
                hash = result[0].hash;
                $scope.jobsArray = data;
                updateJobsMap(data);
            }
        });
        res.error(function (err) {
            console.log(err);
            // alert("Error");
        });

    }


    function updateJobsMap(data) {
        if (data != null && data.length > 0) {
            data.forEach(function (job) {

                if (!$scope.jobs[job.jobId]) {
                    job.plumbers = [];
                    job.plumbersOriginal = [];
                    if (!!job.plumberId || job.plumberId !== null) {
                        var plumber = {
                            id: parseInt(job.plumberId),
                            name: job.firstName + " " + job.lastName,
                            status: job.status
                        };
                        job.plumbers.push(plumber);
                        job.plumbersOriginal.push(plumber);
                    }
                    $scope.jobs[job.jobId] = job;

                } else {
                    if (!!job.plumberId || job.plumberId !== null) {
                        var plumber = {
                            id: parseInt(job.plumberId),
                            name: job.firstName + " " + job.lastName,
                            status: job.status
                        };
                        $scope.jobs[job.jobId].plumbers.push(plumber);
                        $scope.jobs[job.jobId].plumbersOriginal.push(plumber);

                    }
                }
            });
            if (!!$scope.jobs[$stateParams.jobId]) {
                $scope.customerSelected($scope.jobs[$stateParams.jobId]);
            }
            updateCount();
        }

    }

// set the default sort type
    $scope.sortReverse = false;  // set the default sort order

    ///This function fetches plumber information
    function getPlumberDetails() {
        var res = $http.get(host + '/api/getAllPlumbersDetail').success(function (result) {
            //console.log(result.data);
            var data = result;
            if (data != null) {

                data.forEach(function (plumber) {
                    if (!$scope.plumbersMap[plumber.plumberId]) {
                        $scope.plumbersMap[plumber.plumberId] = plumber;
                    } else {
                        var temp = $scope.plumbersMap[plumber.plumberId];
                        temp.latitude = plumber.latitude;
                        temp.longitude = plumber.longitude;
                        temp.status = plumber.status;
                        temp.available = plumber.available;
                        temp.jobCount = plumber.jobCount;
                        if (!!temp.selected && !!temp.marker) {
                            temp.marker.setMap(null);
                            createMarkerPlumber(temp);
                        }
                    }
                });
                $scope.plumbers = _.values($scope.plumbersMap);
            }
            $scope.avail = $filter('plumber')($scope.plumbers, $scope.filter.availFilter);
            $scope.unavail = $filter('plumber')($scope.plumbers, $scope.filter.unAvailFilter);
        });
        res.error(function (err) {
            console.log(err);
            // alert("Error");
        });
    }

///This function creates marker on Map
    function createMarkerPlumber(plumber) {
        if (plumber.marker !== undefined) {
            plumber.marker.setMap(null);
        }

        plumber.marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(plumber.latitude, plumber.longitude, plumber.plumberId),
            icon: 'https://maps.google.com/mapfiles/kml/shapes/man.png',
            title: plumber.firstName + " " + plumber.lastName,
            zoom: 10
        });


        google.maps.event.addListener(plumber.marker, 'click', function () {
            infoWindow.setContent('<h5>' + plumber.marker.title + '</h5>');
            infoWindow.open(map, plumber.marker);
        });

    };


    function createMarker(info) {
        if (marker !== undefined) {
            marker.setMap(null);
        }
        marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(info.latitude, info.longitude, info.jobId),
            icon: 'http://maps.google.com/mapfiles/ms/icons/green.png',
            title: info.customerName,
            zoom: 10
        });
        //marker.setMap(null);
        marker.map.setCenter(marker.getPosition());
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.setContent('<h5>' + marker.title + '</h5>');
            infoWindow.open(map, marker);
        });

    };

// This function assigns job to plumber
    $scope.assignJob = function (job) {
        var plumbersToAdd = _.difference(job.plumbers, job.plumbersOriginal);
        var plumbersToDelete = _.difference(job.plumbersOriginal, job.plumbers);
        var defer = $q.defer();
        var promises = [];
        if (plumbersToAdd.length == 0 && plumbersToDelete.length == 0) {
            var res = $http.post(host + '/api/jobRequestUpdation', {
                jobId: job.jobId,
                plumberId: job.plumberId,
                urgentFlag: job.urgentFlag.toString()
            });
            promises.push(res);
        }
        plumbersToAdd.forEach(function (plumber) {
            var res = $http.post(host + '/api/jobRequestUpdation', {
                jobId: job.jobId,
                plumberId: plumber.id,
                urgentFlag: job.urgentFlag.toString()
            });
            promises.push(res);
        });
        plumbersToDelete.forEach(function (plumber) {
            var res = $http.post(host + '/api/deleteJob', {
                jobId: job.jobId,
                plumberId: plumber.id,
                urgentFlag: job.urgentFlag.toString()
            });
            promises.push(res);
        });

        $q.all(promises).then(function () {
            getJobDetails();
            getPlumberDetails();
        });
        //to close on save
        job.showDetails = !job.showDetails;


    };


    $scope.openInfoWindow = function (e, selectedMarker) {
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    };


    $scope.plumberClick = function (plumber) {

        var job = $scope.selectedJob;
        if (!!job) {
            var assigned = _.filter(job.plumbers, function (p) {
                return p.id === plumber.plumberId
            });

            if (assigned.length > 0 && job.status === 'inProgress' && plumber.selected) {
                // Plumber is already assigned check for job status if it is 'in progress' dont allow plumber to be removed
                alert("Job is in Progress. Plumber can't be removed");
                return;
            }
            plumber.selected = !plumber.selected;
            if (assigned.length === 0 && plumber.selected) {
                job.plumbers.push({id: plumber.plumberId, name: plumber.firstName + " " + plumber.lastName})

            }
            if (assigned.length > 0 && !plumber.selected) {
                job.plumbers.splice(job.plumbers.indexOf(assigned[0]), 1)
            }

        } else {
            plumber.selected = !plumber.selected;
        }
        if (!!plumber.selected) {
            createMarkerPlumber(plumber);
        }

    };

    $scope.customerSelected = function (job) {
        job.showDetails = !job.showDetails;
        if ($scope.selectedJob === job) {
            $scope.selectedJob.selected = !$scope.selectedJob.selected;

        }
        if ($scope.selectedJob !== job) {
            if (!!$scope.selectedJob) {
                $scope.selectedJob.selected = false;
            }
            job.selected = true;
            $scope.selectedJob = job;
        }
        if (!!$scope.selectedJob.selected) {
            highlightAssignedPlumbers();
            createMarker(job);
        }
    };

    function highlightAssignedPlumbers() {
        var plumbers = _.map($scope.selectedJob.plumbers, function (p) {
            return p.id;
        });
        $scope.plumbers.forEach(function (p) {
            if (plumbers.indexOf(p.plumberId) > -1) {
                p.selected = true;
                createMarkerPlumber(p);

            }
            else {
                p.selected = false;
                if (p.marker !== undefined) {
                    p.marker.setMap(null);
                }
            }
            $scope.plumbersMap[p.plumberId] = p;
        })

    }

    $scope.$watch('selectedJob.plumbers', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            highlightAssignedPlumbers();
        }
    }, true);


    function updateCount() {
        $scope.pendingJobCount = _.filter($scope.jobs, function (job) {
            return job.jobStatus === 'unassigned';
        }).length;
        $scope.assignedJobCount = _.filter($scope.jobs, function (job) {
            return job.jobStatus === 'assigned';
        }).length;

    }

    getJobDetails();
    getPlumberDetails();

    var loop = $interval(function () {
        updateJobDetails();
        getPlumberDetails();
    }, 10000);

    $scope.$on('$destroy', function () {
        $interval.cancel(loop);
    });

});
