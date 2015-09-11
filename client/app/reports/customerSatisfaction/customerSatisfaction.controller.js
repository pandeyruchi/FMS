angular.module('pune').controller('customerSatisfactionCtrl', function($scope, $http, host, $interval, ngProgressFactory) {
  var plumberId = 0;

  $scope.plumberNames = [];
  $scope.pieData = [];

  $scope.one = {};
  $scope.two = {};
  $scope.three = {};

  $scope.progressbar = ngProgressFactory.createInstance();
  $scope.progressbar.setHeight('4px');
  $scope.progressbar.setColor('#0274ff');

  var chartConfig = {
    title: {
      text: 'Customer Satisfaction Report'
    },
    subtitle: {
      text: ''
    },
    loading: false,
    options: {
      chart: {
        type: 'pie',
      },
      legend: {
        align: 'center',
        x: -70,
        verticalAlign: 'center',
        y: 20,
        floating: true,
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
              enabled: true,
              format: '{point.name} ({point.y})'
          }
        }
      }
    },
    series: [{
      name: 'Rating',
      colorByPoint: true,
      data: $scope.pieData
    }]
  };

  $http.get(host + '/api/PlumberPerformanceReport').then(function(result) {
    $scope.progressbar.start();

    chartConfig.loading = true;

    $scope.one.id = result.data[result.data.length - 3].userId;
    $scope.two.id = result.data[result.data.length - 2].userId;
    $scope.three.id = result.data[result.data.length - 1].userId;

    plumberId = $scope.one.id;
    chartConfig.subtitle.text = result.data[result.data.length - 3].firstName;

    $scope.one.name = result.data[result.data.length - 3].firstName;
    $scope.two.name = result.data[result.data.length - 2].firstName;
    $scope.three.name = result.data[result.data.length - 1].firstName;

    var remainingPlumbers = result.data.slice(0, result.data.length - 3);

    $scope.plumberNames.length = 0;
    remainingPlumbers.forEach(function(elem){
      var plumber = {};
      plumber.name = elem.firstName;
      plumber.id = elem.userId;

      $scope.plumberNames.push(plumber);
    });

    $scope.progressbar.complete();
    $scope.generateChart(plumberId, $scope.one.name);
  });

  $scope.generateChart = function(plumberId, plumberName) {
    chartConfig.loading = true;
    chartConfig.subtitle.text = plumberName;

    $http.post(host + '/api/plumberFeedbackReport', {"plumberId" : plumberId}).then(function(result) {
      $scope.pieData.length = 0;
      result.data.forEach(function(elem) {
        if (elem["count"] > 0) {
          switch (elem["label"]) {
            case "Poor":
              $scope.pieData.push({
                name: elem["label"],
                visible: true,
                y: elem["count"],
                color: '#de0012'
              });
              break;
            case "Bad":
              $scope.pieData.push({
                name: elem["label"],
                visible: true,
                y: elem["count"],
                color: '#ff4775'
              });
              break;
            case "Average":
              $scope.pieData.push({
                name: elem["label"],
                visible: true,
                y: elem["count"],
                color: '#ffce22'
              });
              break;
            case "Good":
              $scope.pieData.push({
                name: elem["label"],
                visible: true,
                y: elem["count"],
                color: '#07a100'
              });
              break;
            case "Excellent":
              $scope.pieData.push({
                name: elem["label"],
                visible: true,
                y: elem["count"],
                color: '#6162ff'
              });
              break;
            default:

          }
        }
      })
      chartConfig.loading = false;
    });
  }

  $scope.chartConfig = chartConfig;
});
