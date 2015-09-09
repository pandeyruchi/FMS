/**
 * Created by synerzip on 29/7/15.
 */
angular.module('pune').controller('jobDetailsCtrl', function ($scope, $http, $location, host, $stateParams, $compile, $state, $interval, $timeout) {
  // Variable Declarations
  var marker;
  var infoWindow = new google.maps.InfoWindow();
  var newCenter = {};
  $scope.jobs = {};
  $scope.plumbers = [];

  $scope.filter = {
    jobFilter: 'all',
    plumberFilter: 'all',
    customerFilter:''
  };
  $scope.result1 = '';
  $scope.options1 = null;
  $scope.details1 = '';

  $scope.jobFilterOptions = [
    {id: 'completed', text: 'Completed'},
    {id: 'active', text: 'Open'},
    {id: 'In progress', text: 'In Progress'},
    {id: 'all', text: 'All Jobs'}
  ];

  $scope.plumberFilterOptions = [
    {id: 'available', text: 'Available'},
    {id: 'unavailable', text: 'Un-Available'},
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
    //checkExistingPlumbers();
    var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(lat, long),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    /*
     var circle = new google.maps.Circle({
     map: $scope.map,
     center: new google.maps.LatLng(lat, long),
     radius: 7000,
     strokeColor: "#000000",
     fillColor: "orange"
     });*/


    var marker = new google.maps.Marker({
      map: $scope.map,
      position: new google.maps.LatLng(lat, long, $scope.address),
      title: $scope.address,
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
      zoom: 10
    });


    google.maps.event.addListener(marker, 'click', function () {
      infoWindow.setContent('<h5>' + marker.title + '</h5>');
      infoWindow.open($scope.map, marker);
    });
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
      if (data != null) {
        data.forEach(function (job) {
          if (!$scope.jobs[job.jobId]) {
            job.plumbers = [];
            job.plumbersOriginal = [];
            if (!!job.plumberId || job.plumberId !== null) {
              var plumber = {
                id: parseInt(job.plumberId),
                name: job.firstName + " " + job.lastName
              };
              job.plumbers.push(plumber);
              job.plumbersOriginal.push(plumber);
            }
            $scope.jobs[job.jobId] = job;
          } else {
            if (!!job.plumberId || job.plumberId !== null) {
              var plumber = {
                id: parseInt(job.plumberId),
                name: job.firstName + " " + job.lastName
              };
              $scope.jobs[job.jobId].plumbers.push(plumber);
              $scope.jobs[job.jobId].plumbersOriginal.push(plumber);
            }
          }

        });
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

    var marker = new google.maps.Marker({
      map: $scope.map,
      position: new google.maps.LatLng(plumber.latitude, plumber.longitude, plumber.plumberId),
      icon: 'https://maps.google.com/mapfiles/kml/shapes/man.png',
      title: plumber.firstName + " " + plumber.lastName,
      zoom: 10
    });


    google.maps.event.addListener(marker, 'click', function () {
      infoWindow.setContent('<h5>' + marker.title + '</h5>');
      infoWindow.open($scope.map, marker);
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

    plumbersToAdd.forEach(function (plumber) {
      var res = $http.post(host + '/api/jobRequestUpdation', {jobId: job.jobId, plumberId: plumber.id});
      res.success(function (data) {
        if (!!data.error) {
          alert(data.Message);
        }
      });
      res.error(function (err) {
        console.log(err);
        alert("Error");
      });
    });
    plumbersToDelete.forEach(function (plumber) {
      var res = $http.post(host + '/api/deleteJob', {jobId: job.jobId, plumberId: plumber.id});
      res.success(function (data) {
        console.log(data);
        if (!!data.error) {
          alert(data.Message);
        }
      });
      res.error(function (err) {
        console.log(err);
        alert("Error");
      });
    });
  };


  $scope.openInfoWindow = function (e, selectedMarker) {
    e.preventDefault();
    google.maps.event.trigger(selectedMarker, 'click');
  };


// This function is used to redirect to main page on "OK"
  $scope.redirect_main = function () {
    $location.url("/main");
  }

// Function calls
  createNewMap(18.518920, 73.860736);
  getJobDetails();
  getPlumberDetails();
  $scope.plumberClick = function (plumber) {
    plumber.selected = !plumber.selected;
    if (!!$scope.selectedJob) {
      var assigned = _.filter($scope.selectedJob.plumbers, function (p) {
        return p.id === plumber.plumberId
      });
      if (assigned.length === 0 && plumber.selected) {
        $scope.selectedJob.plumbers.push({id: plumber.plumberId, name: plumber.firstName + " " + plumber.lastName})
      }
      if (assigned.length > 0 && !plumber.selected) {
        $scope.selectedJob.plumbers.splice($scope.selectedJob.plumbers.indexOf(assigned[0]))
      }

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
      }
      else {
        p.selected = false;
      }
    })
  }

  $scope.$watch('selectedJob.plumbers', function (newVal, oldVal) {
    if (newVal !== oldVal) {
      highlightAssignedPlumbers();
    }
  },true)

});
