/**
 * Created by synerzip on 29/7/15.
 */
angular.module('peninsula').controller('showMapCtrl', function ($scope, $http, $location, host, $stateParams, $compile) {
    var plumberName = "";
    var plumbers = [];
    var list = [];
    $scope.iname = [];
    $scope.oname = [];
    var customerId = $stateParams.customerId;
    $scope.address = $stateParams.address;
    $scope.exist = true;
    var isChecked = true;

    console.log("cust id :" + customerId);

    $scope.getCentre = function () {
        getCentre();

    };

    var cities = [];
    var circle = {};
    var newCenter = {};
    var plumber = {};

    $scope.refresh = function () {
        refresh();
        $interval(refresh, 5000);
    };
    createMap(18.518920, 73.860736);
    refresh();
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

    function getMarker() {
        for (i = 0; i < cities.length; i++) {
            createMarker(cities[i]);
        }
    }

    $scope.markers = [];

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
            dist = dist * 1.609344
        }

        if (unit == "N") {
            dist = dist * 0.8684
        }

        return dist

    }

    function createMap(lat, long) {
        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(lat, long),
            mapTypeId: google.maps.MapTypeId.RoadMap
        };
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    }

    function createNewMap(lat, long) {
        var mapOptions = {
            zoom: 15,
            center: new google.maps.LatLng(lat, long),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        circle = new google.maps.Circle({
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
            setmarker = true;
            activeMarker = marker;
        });
    }

    function refresh() {
        getCentre();
        $http.get(host + '/api/getLocation').then(function (result) {

            var data = result.data;
            data.forEach(function (u) {
                var city = {};
                city.lat = u.latitude;
                city.long = u.longitude;
                city.plumberId = u.plumberId;
                city.firstName = u.firstName;
                city.lastName = u.lastName;
                city.userName = u.userName;
                cities.push(city);
            });
            getMarker();
        });
    }

    var infoWindow = new google.maps.InfoWindow();
    var setmarker = false;
    var activeMarker = {};

    var createMarker = function (info) {
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long, info.plumberId),
            icon: 'http://maps.google.com/mapfiles/ms/icons/grey.png',
            zoom: 18
        });

        var distance = compute(newCenter.lat, newCenter.long, info.lat, info.long, 'K')
        if (distance < 1) {
            marker.icon = 'http://maps.google.com/mapfiles/ms/icons/green.png';
            var concat = info.plumberId + " " + info.firstName + " " + info.lastName;
            var user = {};
            user.plumberId = info.plumberId;
            user.firstName = info.firstName;
            user.lastName = info.lastName;
            user.userName = info.userName;
            $scope.iname.push(user);
        }
        else {
            marker.icon = 'http://maps.google.com/mapfiles/ms/icons/red.png';
            //var concat = info.plumberId + " " + info.firstName + " " + info.lastName;
            var user2 = {};
            user2.plumberId = info.plumberId;
            user2.firstName = info.firstName;
            user2.lastName = info.lastName;
            user2.userName = info.userName;
            $scope.oname.push(user2);
        }

        marker.content = '<div class="infoWindowContent">' + info.plumberId + '</div>';

        plumber.customerId = info.customerId;
        plumber.plumberId = info.plumberId;

        google.maps.event.addListener(marker, 'click', function () {
            var res = $http.post(host + '/api/getPlumberInformation', plumber);
            res.success(function (data) {
                infoWindow.setContent('<h2>' + data[0].firstName + '</h2>');
                infoWindow.open($scope.map, marker);
                setmarker = true;
                activeMarker = marker;
            });
            res.error(function (err) {
                console.log(err);
            });
        });

        $scope.markers.push(marker);
    };

    $scope.callOuter = function (onam) {

        if ($scope.isChecked) {
            alert("CheckBox is checked.");
            $scope.isChecked = false;
            console.log("Plumber Info: " + onam.plumberId + " : " + onam.firstName);
            $scope.plumberid = onam.plumberId;
            $scope.firstname = onam.firstName;
        } else {
            alert("CheckBox is not checked.");
        }
    };

    $scope.callInner = function (inum) {
        if ($scope.isChecked) {
            alert("CheckBox is checked.");
            $scope.isChecked = false;
            console.log("Plumber Info: " + inum.plumberId + " : " + inum.firstName);
            $scope.plumberid = inum.plumberId;
            $scope.firstname = inum.firstName;
        } else {
            alert("CheckBox is not checked.");
        }

    };

    $scope.Outer = function (onum) {
        console.log("ng-checked");
        var contain = false;

        for (var i = 0; i < list.length; i++) {
            if (list[i] === onum.plumberId) {
                contain = true;
            }
        }

        if (!!contain) {
            var index = plumbers.indexOf(onum.plumberId);
            plumbers.splice(index, 1);
            var index1 = list.indexOf(onum.plumberId);
            list.splice(index1, 1);
            console.log('Invalid');
        }
        else {
            list.push(onum.plumberId);
            plumbers.push(onum.plumberId);
        }

    };


    $scope.Inner = function (inum) {
        console.log("ng-checked");
        var contain = false;

        for (var i = 0; i < list.length; i++) {
            if (list[i] === inum.plumberId) {
                contain = true;
            }
        }

        if (!!contain) {
            var index = plumbers.indexOf(inum.plumberId);
            plumbers.splice(index, 1);
            var index1 = list.indexOf(inum.plumberId);
            list.splice(index1, 1);
            console.log('Invalid');
        }
        else {
            list.push(inum.plumberId)
            plumbers.push(inum.plumberId);
        }

    };



    $scope.openInfoWindow = function (e, selectedMarker) {
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    };

    $scope.assignJob = function () {
        alert("done");


        plumbers.forEach(function (plumberId) {
            var customerService = {};
            customerService.customerReqId = customerId;
            customerService.plumberId = plumberId;
            var res = $http.post(host + '/api/customerRequestUpdation', customerService);
            res.success(function (data) {
                console.log(data);
                if (!!data.error) {
                    alert(data.Message);
                }
                else {
                    $location.url("/main");
                }
            });
            res.error(function (err) {
                console.log(err);
                alert("Error");
            })
        });

    }
});
