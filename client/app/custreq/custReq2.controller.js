/**
 * Created by ruchyp on 7/22/2015.
 */

angular.module('pune').controller('custReq2Ctrl', function ($scope, $state, $http, $location, host, ngProgressFactory, $analytics, $stateParams) {
    $analytics.pageTrack('/custreq');

    var marker;
    $scope.job = JSON.parse($stateParams.job);
    $scope.issues = $scope.job.issues;
    $scope.newJob = {};
    if (!!$scope.job.customerId) {
        $scope.newJob.check = 0;
        $scope.newJob.customerId = $scope.job.customerId;
    } else {
        $scope.newJob.check = 2;
        $scope.newJob.customerName = $scope.job.customerName;
    }
    $scope.newJob.mobileNo = $scope.job.mobileNo;
    $scope.newJob.address = $scope.job.address;
    $scope.newJob.locality = $scope.job.locality;
    $scope.newJob.longitude = $scope.job.longitude;
    $scope.newJob.latitude = $scope.job.latitude;
    $scope.newJob.city = $scope.job.city;
    if (!!$scope.job.urgentFlag) {
        $scope.newJob.urgentFlag = $scope.job.urgentFlag.toString();
    }
    else {
        $scope.newJob.urgentFlag = "0";
    }

    if (!!$scope.job.email) {
        $scope.newJob.email = $scope.job.email;
    }
    else {
        $scope.newJob.email = 'xyz@gmail.com';
    }


    $scope.issueSelected = function (issue) {
        $scope.newJob.issues = issue;
    };

    $scope.isIssueSelected = function (issue) {
        return $scope.newJob.issues === issue;
    }

    $scope.addNewIssue = function () {
        $scope.showAddIssue = !$scope.showAddIssue;
        if (!!$scope.showAddIssue) {
            $scope.newJob.issues = '';
        }
    };
    $scope.assignNewJob = function () {
        var res = $http.post(host + '/api/jobReqByMobileNo', $scope.newJob);
        res.success(function (data) {
            data.selected = true;
            $state.go("jobDetails", {
                jobId: data.jobId
            });
           /* $state.go("jobId", data.jobId);*/
        });
        res.error(function (err) {
            console.log(err);
            // alert("Error");
        });

    };


    createNewMap(18.518920, 73.860736);

    function createNewMap(lat, long) {
        //checkExistingPlumbers();
        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(lat, long),
            mapTypeId: google.maps.MapTypeId.RoadMap
        };
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        var circle = new google.maps.Circle({
            map: $scope.map,
            center: new google.maps.LatLng($scope.job.latitude, $scope.job.longitude),
            radius: 7000,
            strokeColor: "#000000",
            fillColor: "orange"
        });

        createMarker($scope.job)

    }


    $scope.user = {};

    $scope.cancel=function(){
        $location.url("/custreq");
    }

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

})
;
