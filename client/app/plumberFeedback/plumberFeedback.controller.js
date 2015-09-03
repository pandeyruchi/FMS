
angular.module('pune').controller('plumberFeedbackCtrl', function ($scope,$http,host,$interval, ngProgressFactory) {

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
  function send (query) {
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


  $scope.changedValue=function(plumberName) {
    $scope.itemList.push(plumberName);
    send(plumberName);
  }


  // function to post the plumberId of selected plumber and get data
  function sendPlumberId(plumberData) {
    console.log(plumberData);
    $scope.progressbar.start();
    var res = $http.post(host + '/api/plumberFeedbackReport',plumberData);
    res.success(function (data) {
      $scope.report  = data;
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
