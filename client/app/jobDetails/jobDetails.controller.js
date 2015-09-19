/**
 * Created by synerzip on 29/7/15.
 */
angular.module('pune').controller('jobDetailsCtrl', function ($scope, $http, $location, host, $filter, $stateParams, $q, $state, $interval, $timeout) {
    // Variable Declarations
    var marker;
    var infoWindow = new google.maps.InfoWindow();
    var newCenter = {};
    $scope.jobs = {};
    $scope.plumbers = [];
    $scope.jobsArray = [];


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
// This method creates map with default lat and lng.
    function createNewMap(lat, long) {
        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(lat, long),
            mapTypeId: google.maps.MapTypeId.RoadMap
        };
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }

///This function calculates centre location based on customer address
    function getCentre() {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({"address": $scope.address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                var location = results[0].geometry.location;
                newCenter.lat = location.lat();
                newCenter.long = location.lng();
                createNewMap(newCenter.lat, newCenter.long);
                $scope.error = "";
            }
            else {
                $scope.error = "Oops! address not found";

            }
        });
    }

    function getJobDetails() {
        var res = $http.get(host + '/api/assignUnassignJobList').success(function (result) {
            //console.log(result.data);
            var data = result;
            $scope.jobsArray = data;
            if (data != null) {
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
                updateCount();
            }

            if (!!$stateParams.job) {
                $scope.selectedJob = JSON.parse($stateParams.job);
                $scope.customerSelected($scope.selectedJob);
            }
        });
        res.error(function (err) {
            console.log(err);
            alert("Error");
        });

    }


// set the default sort type
    $scope.sortReverse = false;  // set the default sort order

    ///This function fetches plumber information
    function getPlumberDetails() {
        var res = $http.get(host + '/api/getAllPlumbersDetail').success(function (result) {
            //console.log(result.data);
            var data = result;
            $scope.plumbersList = data;
            $scope.avail = $filter('plumber')($scope.plumbersList, $scope.filter.availFilter);
            $scope.unavail = $filter('plumber')($scope.plumbersList, $scope.filter.unAvailFilter);
            if (data != null) {
                data.forEach(function (info) {
                    $scope.sortType = info.firstName;
                    $scope.plumbers.push(info);
                });
            }
        });
        res.error(function (err) {
            console.log(err);
            alert("Error");
        });
    }

///This function creates marker on Map
    function createMarkerPlumber(plumber) {
        if (plumber.marker !== undefined) {
            plumber.marker.setMap(null);
        }
        plumber.marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(plumber.latitude, plumber.longitude, plumber.plumberId),
            icon: 'https://maps.google.com/mapfiles/kml/shapes/man.png',
            title: plumber.firstName + " " + plumber.lastName,
            zoom: 10
        });


        google.maps.event.addListener(plumber.marker, 'click', function () {
            infoWindow.setContent('<h5>' + plumber.marker.title + '</h5>');
            infoWindow.open($scope.map, plumber.marker);
        });

    };


    function createMarker(info) {
        if (marker !== undefined) {
            marker.setMap(null);
        }
        marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.latitude, info.longitude, info.jobId),
            icon: 'http://maps.google.com/mapfiles/ms/icons/green.png',
            title: info.customerName,
            zoom: 10
        });
        //marker.setMap(null);
        marker.map.setCenter(marker.getPosition());
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.setContent('<h5>' + marker.title + '</h5>');
            infoWindow.open($scope.map, marker);
        });

    };

// This function assigns job to plumber
    $scope.assignJob = function (job) {

        var plumbersToAdd = _.difference(job.plumbers, job.plumbersOriginal);
        var plumbersToDelete = _.difference(job.plumbersOriginal, job.plumbers);
        var defer = $q.defer();
        var promises = [];
        plumbersToAdd.forEach(function (plumber) {
            var res = $http.post(host + '/api/jobRequestUpdation', {jobId: job.jobId, plumberId: plumber.id});
            promises.push(res);
        });
        plumbersToDelete.forEach(function (plumber) {
            var res = $http.post(host + '/api/deleteJob', {jobId: job.jobId, plumberId: plumber.id});
            promises.push(res);
        });

        $q.all(promises).then(function() {
            $scope.jobs={};
            getJobDetails();
            $scope.plumbers =[];
            getPlumberDetails();
        });
        //to close on save
        job.showDetails = !job.showDetails;


    };


    $scope.openInfoWindow = function (e, selectedMarker) {
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    };


// This function is used to redirect to main page on "OK"
    $scope.redirect_main = function () {
        $location.url("/main");
    };

    $scope.plumberClick = function (plumber) {

        var job = $scope.selectedJob;
        if (!!job) {
            var assigned = _.filter(job.plumbers, function (p) {
                return p.id === plumber.plumberId
            });

            if (assigned.length > 0 && job.status === 'inprogress' && plumber.selected) {
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

    // Function calls
    createNewMap(18.518920, 73.860736);
    getJobDetails();
    getPlumberDetails();

});
