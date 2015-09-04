angular.module('pune').controller('plumberFeedbackCtrl', function ($scope,$http,host,$interval,ngProgressFactory) {
  $scope.plumbers = [];
  var id;
  var plumberData = {};
  $scope.itemList=[];
  var plumberName;
  $scope.report = [];
  $scope.plumberNames=[];
  $scope.reportDuration = [];
  var reportss=[];
  $scope.TREND_LIST = [];
  $scope.topPlumbers = [];
  $scope.one;
  $scope.two;
  $scope.three;

  Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
    return {
        radialGradient: {
            cx: 0.5,
            cy: 0.3,
            r: 0.7
        },
        stops: [
            [0, color],
            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
        ]
    };
  });

  $scope.progressbar = ngProgressFactory.createInstance();
  $scope.progressbar.setHeight('4px');
  $scope.progressbar.setColor('#0274ff');

  $http.get(host + '/api/bestThreePlumberReport').then(function (result) {
    $scope.topPlumbers.length = 0;
    $scope.progressbar.start();
    var data = result.data;
    data.forEach(function (info) {
      $scope.topPlumbers.push(info.firstName);
    });

    $scope.one = $scope.topPlumbers[0];
    $scope.two = $scope.topPlumbers[1];
    $scope.three = $scope.topPlumbers[2];
    $scope.progressbar.complete();

    send($scope.one);
  });

  $http.get(host + '/api/getLocation').then(function (result) {
    $scope.plumberNames.length = 0;
    var data = result.data;
    data.forEach(function (info) {
      $scope.plumbers[info.plumberId] = info.firstName;
      if($scope.topPlumbers.indexOf(info.firstName) == -1) {
        $scope.plumberNames.push(info.firstName);
      }
    });
  });

  function send(query) {
      $scope.itemList.length = 0;
      $scope.itemList.push(query);
      for(var i = 0;i < $scope.plumbers.length;i++){
        if($scope.plumbers[i] == query){
          plumberData.plumberId = i;
          //alert("Plumber Id: "+plumberData.plumberId);
          sendPlumberId(plumberData);
          $scope.name = plumberData.firstName;
          break;
        }
      }
      // if(i == $scope.plumbers.length){
      //   alert("Error : Please search again");
      // }
  };

  $scope.changedValue=function(plumberName) {
    $scope.itemList.length = 0;
    $scope.itemList.push(plumberName);
    send(plumberName);
  }

  function sendPlumberId(plumberData) {
    $scope.progressbar.start();
    var res = $http.post(host + '/api/plumberFeedbackReport',plumberData);
    res.success(function (data) {
      $scope.report  = data;
      $scope.TREND_LIST.length = 0
      data.forEach(function(elem){
        if(elem["count"] > 0){
          $scope.TREND_LIST.push({
              name: elem["label"],
              visible: true,
              y: elem["count"]
          });
        }
      })
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
    })
  }

  var chartConfig = {
      title: {
          text: 'Customer Satisfaction Report'
      },
      subtitle: {
          text: $scope.itemList
      },
      plotOptions: {
          series: {
              dataLabels: {
                  enabled: true,
                  format: '{point.name}: {point.y:.1f}%'
              }
          }
      },

      tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
      },
      options: {
            chart: {
              type: 'pie'
            },
            legend: {
              align: 'center',
              x: -70,
              verticalAlign: 'center',
              y: 20,
              floating: true,
              backgroundColor: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'white',
              borderColor: '#CCC',
              borderWidth: 1,
              shadow: false
            },
            tooltip: {
              headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
              pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black, 0 0 3px black'
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Rating',
            colorByPoint: true,
            data: $scope.TREND_LIST
        }]
    };
	$scope.chartConfig = chartConfig;
});
