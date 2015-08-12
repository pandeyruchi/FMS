/**
 * Created by anjali on 29/7/15.
 */
angular.module('peninsula').controller('showMapCtrl', function ($scope, $http, $location, host, $stateParams, $compile, $state, $interval) {
    var plumberName = "";
    var jobList = {};
    $scope.iname = [];
    $scope.oname = [];
    var customerId = $stateParams.customerId;
    var infoWindow = new google.maps.InfoWindow();
    $scope.address = $stateParams.address;

    var newCenter = {};


    ///This function creates map
    function createNewMap(lat, long) {
        var mapOptions = {
            zoom: 15,
            center: new google.maps.LatLng(lat, long),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        var circle = new google.maps.Circle({
            map: $scope.map,
            center: new google.maps.LatLng(lat, long),
            radius: 500,
            strokeColor: "#000000",
            fillColor: "orange"
        });


        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(lat, long, $scope.address),
            title: $scope.address,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
            zoom: 18
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

    ///This function computes distance(in Kms) between given lattitude and longitude
    function compute(lat1, lon1, lat2, lon2, unit) {

        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var radlon1 = Math.PI * lon1 / 180;
        var radlon2 = Math.PI * lon2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") {
            dist = dist * 1.609344;
        }
        if (unit == "N") {
            dist = dist * 0.8684;
        }
        return dist;
    }

    ///This function checks existing assigned plumbers
    function checkExistingPlumbers() {
        $http.get(host + '/api/assignJobList').then(function (result) {
            var data = result.data;
            data.forEach(function (info) {
                if (info.customerReqId === customerId) {
                    jobList[info.plumberId] = info;
                    console.log("inside function");
                }
            });
        });

    }

    ///This function creates marker on Map
    function createMarker(plumber) {
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(plumber.latitude, plumber.longitude, plumber.plumberId),
            icon: 'http://maps.google.com/mapfiles/ms/icons/grey.png',
            title: plumber.firstName + " " + plumber.lastName,
            zoom: 18
        });

        var distance = compute(newCenter.lat, newCenter.long, plumber.latitude, plumber.longitude, 'K');
        if (!!jobList[plumber.plumberId.toString()]) {
            plumber.isAssigned = true;
        }
        if (distance < 1) {
            marker.icon = 'http://maps.google.com/mapfiles/ms/icons/green.png';
            $scope.iname.push(plumber);
        }
        else {
            marker.icon = 'http://maps.google.com/mapfiles/ms/icons/red.png';
            $scope.oname.push(plumber);
        }

        //marker.content = '<div class="infoWindowContent">' + plumber.plumberId + '</div>';

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.setContent('<h5>' + marker.title + '</h5>');
            infoWindow.open($scope.map, marker);
        });

    }

    /// This function assigns job to plumber
    $scope.assignJob = function () {
        var plumbers = $scope.iname.concat($scope.oname);

        plumbers.forEach(function (plumber) {
            var customerService = {};
            customerService.customerReqId = customerId;
            customerService.plumberId = plumber.plumberId;
            if (!!plumber.isAssigned) {
                var res = $http.post(host + '/api/customerRequestUpdation', customerService);
                res.success(function (data) {
                    console.log(data);
                    if (!!data.error) {
                        alert(data.Message);
                    }
                    else {
                       // alert("Data submitted successfully!")
                        $state.go("finalJobDescription", {
                            customerReqId: customerService.customerReqId,
                            plumberId: customerService.plumberId
                        });
                    }
                });
                res.error(function (err) {
                    console.log(err);
                    alert("Error");
                });

            }
            else
            {
                res = $http.post(host + '/api/deleteJob', customerService);
                res.success(function (data) {
                    console.log(data);
                    if (!!data.error) {
                        alert(data.Message);
                    }
                    else {
                        //alert("Data submitted successfully!")
                        $state.go("finalJobDescription", {
                            customerReqId: customerService.customerReqId,
                            plumberId: customerService.plumberId
                        });
                    }
                });
                res.error(function (err) {
                    console.log(err);
                    alert("Error");
                });
            }
        });

    };

    $scope.openInfoWindow = function (e, selectedMarker) {
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    };

    function refresh() {
        checkExistingPlumbers();
        getCentre();
        $scope.iname = [];
        $scope.oname = [];
        $http.get(host + '/api/getLocation').then(function (result) {
            var plumbers = result.data;
            plumbers.forEach(function (plumber) {
                createMarker(plumber)
            });
        });
    }


    ///This method checks for the existing plumber, calculates centre based on address and populate IN-OUT tables
    refresh();
    ///This sets refresh interval in milliseconds
    $interval(refresh, 50000);
});
