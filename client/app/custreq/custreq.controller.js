/**
 * Created by ruchyp on 7/22/2015.
 */

angular.module('pune').controller('custreqCtrl', function ($scope, $http, $location, host, ngProgressFactory, $analytics, $state) {
    $analytics.pageTrack('/custreq');

    var marker;
    $scope.customer = {};
    $scope.request = {
        "check": 2,
        "address": '',
        "issues": '',
        "locality": '',
        "longitude": '',
        "latitude": '',
        "urgentFlag": '',
        "email": '',
        "city": '',
        "mobileNo": '',
        "customerName": ''
    };

    $scope.computeCoordinates = function (object) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({"address": object.address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                var location = results[0].geometry.location;
                object.latitude = location.H;
                object.locality = results[0].address_components[0].long_name;
                object.city = results[0].address_components[1].long_name;
                object.longitude = location.L;
            }
        });
    };

    $scope.getJobDetails = function (contact) {
        if (contact.length < 10) {
            return;
        }
        var res = $http.post(host + '/api/jobReqByMobileNo', {check: 1, mobileNo: contact});
        res.success(function (data) {
            if (!!data && data.length > 0) {
                $scope.request = data[0];
                $scope.customer.customerName = $scope.request.customerName;
                $scope.jobs = data;
                $scope.issues = [];
                data.forEach(function (u) {
                    if ($scope.issues.indexOf(u.issues) < 0) {
                        $scope.issues.push(u.issues);
                    }
                });

            }
        });
        res.error(function (err) {
            console.log(err);
            // alert("Error");
        });
    };


    $scope.jobSelected = function (job) {
        $scope.request = job;
        createMarker(job);
    };

    $scope.isSelected = function (job) {
        return $scope.request === job;
    }


    $scope.ok = function () {
        $scope.request.mobileNo = $scope.customer.mobileNo;
        $scope.request.customerName = $scope.customer.customerName;
        $scope.request.issues = $scope.issues;
        $state.go("customerRequest", {
            job: JSON.stringify($scope.request)
        });
    };

    $scope.new = function (job, address) {
        job.address = address;
        $state.go("customerRequest", {job: JSON.stringify(job), contact: $scope.user.contact});
    };



    function createNewMap(lat, long) {
        //checkExistingPlumbers();
        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(lat, long),
            mapTypeId: google.maps.MapTypeId.RoadMap
        };
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    }

    $scope.$on('$viewContentLoaded', function() {
        createNewMap(18.518920, 73.860736)
    });

    google.maps.event.addDomListener(window, 'load', createNewMap(18.518920, 73.860736));
    google.maps.event.addDomListener(window, "resize", function () {
        google.maps.event.trigger($scope.map, "resize");
    });
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
    /// This method posts customer request data to server
    $scope.custreq = function () {
        $scope.progressbar.start();
        console.log("USER IS :" + $scope.user);
        var res = $http.post(host + '/api/jobRequest ', $scope.user);
        res.success(function (data) {
            console.log(data);
            if (!!data.error) {
                $scope.progressbar.complete();
                alert(data.Message);
            }
            else {
                $scope.progressbar.complete();
                alert("Successfully submitted");
                $location.url("/main");
            }
        });
        res.error(function (err) {
            $scope.progressbar.complete();
            console.log(err);
            alert("Please provide all the data \nCustomer request unsuccesful");
        })
    }

    createNewMap(18.518920, 73.860736);
});
