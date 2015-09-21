/**
 * Created by synerzip on 29/7/15.
 */
angular.module('pune').controller('mainCtrl', function ($scope, $http, $location, host,ngProgressFactory) {
    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setHeight('4px');
    $scope.progressbar.setColor('#0274ff');
    // Variable declarations
    $scope.completedList = [];
    $scope.pendingList = [];
    $scope.assignedList = [];
    $scope.durationList = ['Last Three Days','Last Week','Last Month', 'Last Quarter','Last Six Month', 'Last Year', 'All Time'];
    var dur = {};
    var status = "";
    $scope.duration = "Last Three Days";
    $scope.duration2 = "Last Three Days";
    $scope.duration3 = "Last Three Days";


    $scope.setRequired = function() {
        if($scope.optionValue==='Last Week') {
            $scope.textRequired= true;
        }
        else {
            $scope.textRequired = false;
        }
    }

    // Function gets called when user selects a duration from drop down(pending)
    $scope.changedValueDurationPending=function(duration){
        status = "pending";
        if(duration == "Last Three Days"  ){
            duration = "3D";
        }
        else if(duration == "Last Week"){
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
            duration = "AT";
        }
        else if(duration == "Last Year"){
            duration = "1Y";
        }
        sendDuration(duration,status);
    }

    // Function gets called when user selects a duration from drop down(assigned)
    $scope.changedValueDurationAssigned=function(duration2){
        status = "assigned";
        if(duration2 == "Last Three Days"){
            duration2 = "3D";
        }
        else if(duration2 == "Last Week"){
            duration2 = "1W";
        }
        else if(duration2 == "Last Month"){
            duration2 = "1M";
        }
        else if(duration2 == "Last Quarter"){
            duration2 = "3M";
        }
        else if(duration2 == "Last Six Month"){
            duration2 = "6M";
        }
        else if(duration2 == "All Time"){
            duration2 = "AT";
        }
        else if(duration2 == "Last Year"){
            duration2 = "1Y";
        }
        sendDuration(duration2,status);
    }

    // Function gets called when user selects a duration from drop down(completed)
    $scope.changedValueDurationCompleted=function(duration3){
        status = "completed"
        if(duration3 == "Last Three Days"){
            duration3 = "3D";
        }
        if(duration3 == "Last Week"){
            duration3 = "1W";
        }
        else if(duration3 == "Last Month"){
            duration3 = "1M";
        }
        else if(duration3 == "Last Quarter"){
            duration3 = "3M";
        }
        else if(duration3 == "Last Six Month"){
            duration3 = "6M";
        }
        else if(duration3 == "All Time"){
            duration3 = "AT";
        }
        else if(duration3 == "Last Year"){
            duration3 = "1Y";
        }
        sendDuration(duration3,status);
    }


    $scope.changedValueDurationAssigned("Last Three Days");
    $scope.changedValueDurationPending("Last Three Days");
    $scope.changedValueDurationCompleted("Last Three Days");



    // Function used to get information for selected duration
    function sendDuration(duration,status) {
        console.log("Duration is :"+duration + status);
        $scope.progressbar.start();
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
            console.log("REsult : "+result);
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
                    console.log("Assigned : "+info.userName);
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
        });
        $scope.progressbar.complete();
    }
});
