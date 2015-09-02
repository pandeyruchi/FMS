
angular.module('pune').controller('plumberReportCtrl', function ($scope,$http,host,$location, ngProgressFactory) {

  // Variable declarations
  $scope.plumbers = [];
  var id;
  var plumberData = {};
  $scope.report = [];
  $scope.allTags =[];

  $scope.progressbar = ngProgressFactory.createInstance();
  $scope.progressbar.setHeight('4px');
  $scope.progressbar.setColor('#0274ff');

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
  $scope.progressbar.start();
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
}


$scope.options = {
  chart: {
    type: 'discreteBarChart',
    height: 450,
    x: function(d){return d.month;},
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
});
