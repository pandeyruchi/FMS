/**
 * Created by ruchyp on 7/22/2015.
 */

angular.module('pune').controller('custReq2Ctrl', function ($scope,$state, $http, $location, host, ngProgressFactory, $analytics,$stateParams) {
        $analytics.pageTrack('/custreq');
        //var user = {};
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.setHeight('4px');
        $scope.progressbar.setColor('#0274ff');
        var marker;
        $scope.job = JSON.parse($stateParams.job);
        $scope.contact = $stateParams.contact;


        function computeCoordinates() {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({"address": $scope.user.address}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                    var location = results[0].geometry.location;
                    $scope.user.latitude = location.G;
                    $scope.user.longitude = location.K;
                }
            });
        }

        $scope.assign = function(){
            $scope.newJob = {};
            $scope.newJob.check =0;
            $scope.newJob.customerId = $scope.job.customerId;
            $scope.newJob.issues =$scope.job.issues;
            $scope.newJob.address = $scope.job.address;
            $scope.newJob.locality =$scope.job.locality;
            $scope.newJob.longitude =$scope.job.longitude;
            $scope.newJob.latitude =$scope.job.latitude;
            $scope.newJob.urgentFlag =$scope.job.urgentFlag.toString();
            $scope.newJob.email =$scope.job.email;
            $scope.newJob.city =$scope.job.city;
            var res = $http.post(host + '/api/jobReqByMobileNo', $scope.newJob);
            res.success(function (data) {
                data.selected = true;
                $state.go("jobDetails",{job:JSON.stringify(data)});
            });
            res.error(function (err) {
                console.log(err);
                alert("Error");
            });

        }

        $scope.getJobDetails = function (contact) {
            if (contact.length < 10) {
                return;
            }
            var res = $http.post(host + '/api/jobReqByMobileNo', {check: 1, mobileNo: contact});
            res.success(function (data) {
                if (!!data && data.length > 0) {
                    $scope.customerName = data[0].customerName;
                    $scope.jobs = data;
                }
            });
            res.error(function (err) {
                console.log(err);
                alert("Error");
            });
        };


        $scope.jobSelected =function(job){
            $scope.selectedJob = job;
            createMarker(job);
        }

        $scope.ok =function(){
            $state.go("customerRequest",{job:$scope.selectedJob,contact:$scope.user.contact});
        }

        $scope.assignNew =function(job, issues){
            $scope.newJob = {};
            $scope.newJob.check =0;
            $scope.newJob.customerId = job.customerId;
            $scope.newJob.issues =issues;
            $scope.newJob.address = job.address;
            $scope.newJob.locality =job.locality;
            $scope.newJob.longitude =job.longitude;
            $scope.newJob.latitude =job.latitude;
            $scope.newJob.urgentFlag =job.urgentFlag.toString();
            $scope.newJob.email =job.email;
            $scope.newJob.city =job.city;
            var res = $http.post(host + '/api/jobReqByMobileNo', $scope.newJob);
            res.success(function (data) {
                data.selected = true;
                $state.go("jobDetails",{job:JSON.stringify(data)});
            });
            res.error(function (err) {
                console.log(err);
                alert("Error");
            });
        }

        createNewMap(18.518920, 73.860736);

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


        $scope.computeCoordinates = computeCoordinates;

        $scope.user = {};

        function createMarker(info) {
            if (marker !== undefined) {
                marker.setMap(null);
            }
            marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(18.518920, 73.860736, info.jobId),
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
    }
)
;
