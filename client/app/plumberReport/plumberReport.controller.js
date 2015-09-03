
angular.module('pune').controller('plumberReportCtrl', function ($scope,$http,host,$location, ngProgressFactory) {

    // Variable declarations
    $scope.plumbers = [];
    var id;
    var plumberData = {};
    $scope.itemList=[];
    var plumberName;
    $scope.report = [];
    $scope.plumberNames=[];
    $scope.reportDuration = [];
    var reportss=[];

    // Adding values in array for plumber reports duration
    $scope.reportDuration.push("plumber Weekly Time Report","plumber Monthly Time Report","plumber Three Monthly Time Report","plumber Six Monthly Time Report","plumber Yearly Time Report");

    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setHeight('4px');
    $scope.progressbar.setColor('#0274ff');

    // API called to get the data
    $http.get(host + '/api/getLocation').then(function (result) {
        var data = result.data;
        console.log(result.data);
        data.forEach(function (info) {
            $scope.plumbers[info.plumberId] = info.firstName;
            $scope.plumberNames.push(info.firstName);
       });
    });

    // Helper function to compare plumber's name
    function send(query,item){
        for(var i = 0;i < $scope.plumbers.length;i++){
            if($scope.plumbers[i] == query){
                plumberData.plumberId = i;
                //alert("Plumber Id: "+plumberData.plumberId);
                sendPlumberId(plumberData,item);
                break;
            }
        }
        if(i == $scope.plumbers.length){
            alert("Error : Please search again");
        }
    };

    // function to post the plumberId of selected plumber according to report
   function sendPlumberId(plumberData,item) {
        $scope.progressbar.start();
       if(item =="plumberThreeMonthlyTimeReport"){
           var res = $http.post(host + '/api/plumberThreeMonthlyTimeReport',plumberData);
           res.success(function (data) {
               $scope.report  = [{values:data}];
               console.log($scope.report);
               if (!!data.error) {
                    $scope.progressbar.complete();
                   alert(data.Message);
               }
               else {
                    $scope.progressbar.complete();
                   /* alert("There is a problem!\nPlease search again!");*/
               }
           });
           res.error(function (err) {
             $scope.progressbar.complete();
               console.log(err);
           })
       }
       else if(item =="plumberSixMonthlyTimeReport"){
           var res = $http.post(host + '/api/plumberSixMonthlyTimeReport',plumberData);
           res.success(function (data) {
               $scope.report  = [{values:data}];
               console.log($scope.report);
               if (!!data.error) {
                    $scope.progressbar.complete();
                   alert(data.Message);
               }
               else {
                    $scope.progressbar.complete();
                   /* alert("There is a problem!\nPlease search again!");*/
               }
           });
           res.error(function (err) {
             $scope.progressbar.complete();
               console.log(err);
               alert("From Error add plumber unsuccesful");
           })
       }
       else if(item =="plumberWeeklyTimeReport"){
           var res = $http.post(host + '/api/plumberWeeklyTimeReport',plumberData);
           res.success(function (data) {
               $scope.report  = [{values:data}];
               console.log($scope.report);
               if (!!data.error) {
                    $scope.progressbar.complete();
                   alert(data.Message);
               }
               else {
                    $scope.progressbar.complete();
                   /* alert("There is a problem!\nPlease search again!");*/
               }
           });
           res.error(function (err) {
             $scope.progressbar.complete();
               console.log(err);
           })
       }
       else if(item =="plumberMonthlyTimeReport"){
           var res = $http.post(host + '/api/plumberMonthlyTimeReport',plumberData);
           res.success(function (data) {
               $scope.report  = [{values:data}];
               console.log($scope.report);
               if (!!data.error) {
                    $scope.progressbar.complete();
                   alert(data.Message);
               }
               else {
                    $scope.progressbar.complete();
                   /* alert("There is a problem!\nPlease search again!");*/
               }
           });
       }
       else if(item =="plumberYearlyTimeReport"){
           var res = $http.post(host + '/api/plumberYearlyTimeReport',plumberData);
           res.success(function (data) {
               $scope.report  = [{values:data}];
               console.log($scope.report);
               if (!!data.error) {
                    $scope.progressbar.complete();
                   alert(data.Message);
               }
               else {
                    $scope.progressbar.complete();
                    /* alert("There is a problem!\nPlease search again!");*/
               }
           });
       }
    }


    $scope.options = {
        chart: {

            staggerLabels : true,
            type: 'discreteBarChart',
            height: 450,
            x: function(d){return d.day;},
            y: function(d){return d.count;},
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.2f')(d);
            },
            transitionDuration: 500,
            xAxis: {
                axisLabel: 'Day',
                rotateLabels: -20
            },
            yAxis: {
                axisLabel: 'Count',
                axisLabelDistance: 30
            }
        }
    }

    console.log($scope.plumbers);

    $scope.changedValue=function(item) {
        $scope.itemList.push(item);
        plumberName = item;
        var item = "plumberWeeklyTimeReport";
        send(plumberName,item);
    }




    $scope.changedValueDuration=function(item) {
        if(plumberName == "undefined"){
            alert("Please select plumber");
        }
        if(item == "plumber Monthly Time Report"){
            item = "plumberMonthlyTimeReport";
        }
        else if(item == "plumber Weekly Time Report"){
            item = "plumberWeeklyTimeReport";
        }
        else if(item == "plumber Three Monthly Time Report"){
            item = "plumberThreeMonthlyTimeReport";
        }
        else if(item == "plumber Six Monthly Time Report"){
            item = "plumberSixMonthlyTimeReport";
        }
        else if(item == "plumber Yearly Time Report"){
            item = "plumberYearlyTimeReport";
        }
        reportss.push(item);
        //alert(plumberName+item);
        send(plumberName,item);
    }
});
