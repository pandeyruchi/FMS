
angular.module('peninsula').controller('plumberFeedbackCtrl', function ($scope,$http,host,$interval) {

    // Variable declarations
    $scope.plumbers = [];
    var id;
    var plumberData = {};
    $scope.report = [];

    // API called to get the data
    $http.get(host + '/api/getLocation').then(function (result) {
        var data = result.data;

        data.forEach(function (info) {
            $scope.plumbers[info.plumberId] = info.firstName;
           // console.log($scope.plumbers);
        });
    });

    // Helper function to compare plumber's name
    $scope.send = function(query) {
        for(var i = 0;i < $scope.plumbers.length;i++){
            if($scope.plumbers[i] == query){
                plumberData.plumberId = i;
                //alert("Plumber Id: "+plumberData.plumberId);
                sendPlumberId(plumberData);
                $scope.name = plumberData.firstName;
                break;
            }
        }
        if(i == $scope.plumbers.length){
            alert("Error : Please search again");
        }
    };

    // function to post the plumberId of selected plumber and get data
   function sendPlumberId(plumberData) {
       console.log(plumberData);
        var res = $http.post(host + '/api/plumberFeedbackReport',plumberData);
        res.success(function (data) {
            $scope.report  = data;
            console.log($scope.report);
            if (!!data.error) {
                alert(data.Message);
            }
            else {
               /* alert("There is a problem!\nPlease search again!");*/
            }
        });
    }

    $scope.xFunction = function(){
        return function(d) {
            return d.label;
        };
    }

    $scope.yFunction = function(){
        return function(d){
            return d.count;
        };
    }

});
