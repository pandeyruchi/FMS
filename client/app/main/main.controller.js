/**
 * Created by synerzip on 29/7/15.
 */
angular.module('pune').controller('mainCtrl', function ($scope, $http, $location, host,$filter, $stateParams, $compile, $state, $interval, $timeout) {

    $scope.completedList = [];
    $scope.pendingList = [];
    $scope.assignedList = [];
    $scope.durationList = ['Last Three Days','Last Week','Last Month', 'Last Qarter','Last Six Month', 'Last Year', 'All Time'];
    var dur = {};
    var status = "";

    $scope.changedValueDurationPending=function(duration){
        status = "pending";
        /*if(duration == "Last Three Days"  ){
         duration = "plumberMonthlyTimeReport";
         }*/
        alert(duration);
        if(duration == "Last Week"){
            duration = "1W";
        }
        else if(duration == "Last Month"){
            duration = "1M";
        }
        else if(duration == "Last Quarter"){
            duration = "3M";
        }
        else if(duration == "Last Six Month"){
            duration = "6M";
        }
        else if(duration == "All Time"){
            duration = "1Y";
        }
        sendDuration(duration,status);
    }


    $scope.changedValueDurationAssigned=function(duration){
        status = "assigned";
        /*if(duration == "Last Three Days"){
         duration = "plumberMonthlyTimeReport";
         }*/
        alert(duration);
        if(duration == "Last Week"){
            duration = "1W";
        }
        else if(duration == "Last Month"){
            duration = "1M";
        }
        else if(duration == "Last Quarter"){
            duration = "3M";
        }
        else if(duration == "Last Six Month"){
            duration = "6M";
        }
        else if(duration == "All Time"){
            duration = "1Y";
        }
        sendDuration(duration,status);
    }


    $scope.changedValueDurationCompleted=function(duration){
        status = "completed"
        /*if(duration == "Last Three Days"){
         duration = "plumberMonthlyTimeReport";
         }*/
        alert(duration);
        if(duration == "Last Week"){
            duration = "1W";
        }
        else if(duration == "Last Month"){
            duration = "1M";
        }
        else if(duration == "Last Quarter"){
            duration = "3M";
        }
        else if(duration == "Last Six Month"){
            duration = "6M";
        }
        else if(duration == "All Time"){
            duration = "1Y";
        }
        sendDuration(duration,status);
    }

    function sendDuration(duration,status) {



        console.log("Duration is :"+duration + status);
        if(status == "completed"){
            $scope.completedList = [];
        }
        if(status=="assigned"){
            $scope.assignedList = [];
        }
        if(status=="pending"){
            $scope.pendingList = [];
        }
        dur.duration = duration;
        var res = $http.post(host + '/api/assignUnassignDateWiseJobList',dur);
        res.success(function (result) {
            console.log(result);
            var data = result;
            data.forEach(function (info) {
                console.log("Info is : "+info);
                if (info.jobStatus == "completed" && status=="completed") {

                    $scope.completedList.push(info);
                }
                if (info.jobStatus == "unassigned" && status == "pending") {
                    $scope.pendingList.push(info);
                    console.log(info.customerName + " "+ info.mobileNo);
                }
                if (info.jobStatus == "assigned" && status=="assigned") {
                    $scope.assignedList.push(info);
                }
            });
            if (!!data.error) {
                // $scope.progressbar.complete();
                alert(data.Message);
            }
            else {
                //$scope.progressbar.complete();
                /* alert("There is a problem!\nPlease search again!");*/
            }
        });
        res.error(function (err) {
            // $scope.progressbar.complete();
            console.log(err);
        })
    }




    /*
     function send(duration) {
     if (duration == "assignUnassignWeeklyJobList") {
     $http.get(host + '/api/assignUnassignWeeklyJobList').then(function (result) {
     var data = result.data;
     console.log(result.data);
     data.forEach(function (info) {
     if (info.jobStatus == "completed") {
     $scope.completedList.push(info);
     }
     if (info.jobStatus == "active") {
     $scope.pendingList.push(info);
     }
     if (info.jobStatus == "In progress") {

     $scope.assignedList.push(info);
     }
     });
     });
     }
     else if (duration == "assignUnassignMonthlyJobList") {
     $http.get(host + '/api/assignUnassignMonthlyJobList').then(function (result) {
     var data = result.data;
     console.log(result.data);
     data.forEach(function (info) {
     if(info.jobStatus == "completed"){
     $scope.completedList.push(info);
     }
     if(info.jobStatus == "active"){
     $scope.pendingList.push(info);
     }
     if(info.jobStatus == "In progress"){

     $scope.assignedList.push(info);
     }
     });
     });
     }
     else if (duration == "assignUnassignThreeMonthlyJobList") {
     $http.get(host + '/api/assignUnassignThreeMonthlyJobList').then(function (result) {
     var data = result.data;
     console.log(result.data);
     data.forEach(function (info) {
     if(info.jobStatus == "completed"){
     $scope.completedList.push(info);
     }
     if(info.jobStatus == "active"){
     $scope.pendingList.push(info);
     }
     if(info.jobStatus == "In progress"){

     $scope.assignedList.push(info);
     }
     });
     });
     }
     else if (duration == "assignUnassignSixMonthlyJobList") {
     $http.get(host + '/api/assignUnassignSixMonthlyJobList').then(function (result) {
     var data = result.data;
     console.log(result.data);
     data.forEach(function (info) {
     if(info.jobStatus == "completed"){
     $scope.completedList.push(info);
     }
     if(info.jobStatus == "active"){
     $scope.pendingList.push(info);
     }
     if(info.jobStatus == "In progress"){

     $scope.assignedList.push(info);
     }
     });
     });
     }
     else if (duration == "assignUnassignYearlyJobList") {
     $http.get(host + '/api/assignUnassignYearlyJobList').then(function (result) {
     var data = result.data;
     console.log(result.data);
     data.forEach(function (info) {
     if(info.jobStatus == "completed"){
     $scope.completedList.push(info);
     }
     if(info.jobStatus == "active"){
     $scope.pendingList.push(info);
     }
     if(info.jobStatus == "In progress"){

     $scope.assignedList.push(info);
     }
     });
     });
     }
     else if (duration == "assignUnassignJobList") {
     $http.get(host + '/api/assignUnassignJobList').then(function (result) {
     var data = result.data;
     console.log(result.data);
     data.forEach(function (info) {
     if(info.jobStatus == "completed"){
     $scope.completedList.push(info);
     }
     if(info.jobStatus == "active"){
     $scope.pendingList.push(info);
     }
     if(info.jobStatus == "In progress"){

     $scope.assignedList.push(info);
     }
     });
     });
     }
     }



     */








    /* $http.get(host + '/api/assignUnassignJobList').then(function (result) {
     var data = result.data;
     console.log(result.data);
     data.forEach(function (info) {
     if(info.jobStatus == "completed"){
     $scope.completedList.push(info);
     }
     if(info.jobStatus == "active"){
     $scope.pendingList.push(info);
     }
     if(info.jobStatus == "In progress"){

     $scope.assignedList.push(info);
     }
     });
     });



     $scope.lastWeek = function(){
     $http.get(host + '/api/assignUnassignWeeklyJobList').then(function (result) {
     var data = result.data;
     console.log(result.data);
     data.forEach(function (info) {
     if(info.jobStatus == "completed"){
     $scope.completedList.push(info);
     }
     if(info.jobStatus == "active"){
     $scope.pendingList.push(info);
     }
     if(info.jobStatus == "In progress"){

     $scope.assignedList.push(info);
     }
     });
     });
     }

     $scope.lastMonth = function(){
     $http.get(host + '/api/assignUnassignMonthlyJobList').then(function (result) {
     var data = result.data;
     console.log(result.data);
     data.forEach(function (info) {
     if(info.jobStatus == "completed"){
     $scope.completedList.push(info);
     }
     if(info.jobStatus == "active"){
     $scope.pendingList.push(info);
     }
     if(info.jobStatus == "In progress"){

     $scope.assignedList.push(info);
     }
     });
     });
     }

     $scope.lastQuarter = function(){
     $http.get(host + '/api/assignUnassignThreeMonthlyJobList').then(function (result) {
     var data = result.data;
     console.log(result.data);
     data.forEach(function (info) {
     if(info.jobStatus == "completed"){
     $scope.completedList.push(info);
     }
     if(info.jobStatus == "active"){
     $scope.pendingList.push(info);
     }
     if(info.jobStatus == "In progress"){

     $scope.assignedList.push(info);
     }
     });
     });
     }


     $scope.lastYear = function(){
     $http.get(host + '/api/assignUnassignYearlyJobList').then(function (result) {
     var data = result.data;
     console.log(result.data);
     data.forEach(function (info) {
     if(info.jobStatus == "completed"){
     $scope.completedList.push(info);
     }
     if(info.jobStatus == "active"){
     $scope.pendingList.push(info);
     }
     if(info.jobStatus == "In progress"){

     $scope.assignedList.push(info);
     }
     });
     });
     }

     $scope.allTime = function(){
     $http.get(host + '/api/assignUnassignJobList').then(function (result) {
     var data = result.data;
     console.log(result.data);
     data.forEach(function (info) {
     if(info.jobStatus == "completed"){
     $scope.completedList.push(info);
     }
     if(info.jobStatus == "active"){
     $scope.pendingList.push(info);
     }
     if(info.jobStatus == "In progress"){

     $scope.assignedList.push(info);
     }
     });
     });
     }
     */

});
