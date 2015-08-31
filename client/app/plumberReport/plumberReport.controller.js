
angular.module('peninsula').controller('plumberReportCtrl', function ($scope,$http,host,$location) {

    // Variable declarations
    $scope.plumbers = [];
    var id;
    var plumberData = {};
    $scope.report = [];
    $scope.allTags =[];


    /*.controller('tagsCtrl', function ( $scope ) {
        $scope.tags = [ 'bootstrap', 'list', 'angular' ];
        $scope.allTags = [ 'bootstrap', 'list', 'angular', 'directive', 'edit', 'label', 'modal', 'close', 'button', 'grid', 'javascript', 'html', 'badge', 'dropdown'];
    });*/
    // API called to get the data
    $http.get(host + '/api/getLocation').then(function (result) {
        var data = result.data;

        data.forEach(function (info) {
            $scope.plumbers[info.plumberId] = info.firstName;
            $scope.allTags.push(info.firstName);
           // console.log($scope.plumbers);
        });
    });

    // Helper function to compare plumber's name
    $scope.send = function(query) {
        for(var i = 0;i < $scope.plumbers.length;i++){
            if($scope.plumbers[i] == query){
                plumberData.plumberId = i;
               // alert("Plumber Id: "+plumberData.plumberId);
                sendPlumberId(plumberData);
                break;
            }
        }
        if(i == $scope.plumbers.length){
            alert("Error : Please search again");
        }
    };

    // function to post the plumberId of selected plumber
   function sendPlumberId(plumberData) {
       console.log(plumberData);
        var res = $http.post(host + '/api/plumberThreeMonthlyTimeReport',plumberData);
        res.success(function (data) {
            $scope.report  = [{values:data}];
           // $scope.report =[{"month":"March","count":2},{"month":"January","count":0},{"month":"July","count":6},{"month":"May","count":4},{"month":"December","count":8}];
            console.log($scope.report);
            if (!!data.error) {
                alert(data.Message);
            }
            else {
               /* alert("There is a problem!\nPlease search again!");*/
            }
        });
    }


    $scope.options = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            x: function(d){return d.Month;},
            y: function(d){return d.count;},
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.2f')(d);
            },
            transitionDuration: 500,
            xAxis: {
                axisLabel: 'Month',
                rotateLabels: -20
            },
            yAxis: {
                axisLabel: 'Count',
                axisLabelDistance: 30
            }
        }
    }


   /* $scope.report = [
        {
            values: [
                {
                    "Month": "Aug",
                    "count": 1
                },
                {
                    "Month": "Jul",
                    "count": 7
                },
                {
                    "Month": "Jun",
                    "count": 5
                },
                {
                    "Month": "Nov",
                    "count": 4
                },
                {
                    "Month": "Dec",
                    "count": 3
                }
            ]
        }
    ]*/

});
