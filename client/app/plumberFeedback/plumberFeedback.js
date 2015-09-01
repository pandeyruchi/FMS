
angular.module('pune').controller('plumberReportCtrl', function ($scope,$http,host,$location) {

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
                alert("Plumber Id: "+plumberData.plumberId);
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
        var res = $http.post(host + '/api/plumberTimeReport',plumberData);
        res.success(function (data) {
            $scope.report  = data;
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
});
