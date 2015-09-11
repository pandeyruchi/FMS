angular.module('pune').controller('plumberPerformanceCtrl', function($scope, $http, host, $location, ngProgressFactory) {
  $scope.progressbar = ngProgressFactory.createInstance();
  $scope.progressbar.setHeight('4px');
  $scope.progressbar.setColor('#0274ff');

  $scope.chartDisplay = false;

  $scope.tab = "1";
  $scope.plumberNames = [];
  $scope.itemList = "";
  $scope.topPlumbers = [];
  var plumbers = [];

  $scope.one = {};
  $scope.two = {};
  $scope.three = {};

  $scope.category = [];
  $scope.seriesData = [];

  var plumberId = 0;
  var duration = "1W";

  var chartConfig = {
    options: {
      chart: {
        type: 'column'
      },
      events: {
        redraw: function() {
            alert ('The chart is being redrawn');
        }
      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
      },
      plotOptions: {
        series: {
          pointPadding: 0.2,
          borderWidth: 0,
          stacking: ''
        }
      },
    },
    chart: {
        type: 'column'
    },
    title: {
        text: 'Plumber Performance Report'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: $scope.category,
        crosshair: true
    },
    yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
            text: 'Job(s) Comepleted'
        }
    },
    loading: false,
    series: [{
        name: 'Completed Job Count',
        data: $scope.seriesData
    }]
  };

  $http.get(host + '/api/PlumberPerformanceReport').then(function(result) {
    $scope.chartConfig = chartConfig;
    chartConfig.loading = true;
    $scope.topPlumbers.length = 0;
    $scope.progressbar.start();

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
    generateChart();
  });

  function generateChart() {
    $http.post(host + '/api/plumberWorkTimeReport', {"plumberId" : plumberId, "duration" : duration}).then(function(result) {
      result.data.forEach(function(elem) {
        $scope.category.push(elem.day);
        $scope.seriesData.push(elem.count)
      })

      chartConfig.loading = false;
    });
  }

  $scope.reflow = function () {
    $scope.$broadcast('highchartsng.reflow');
  };

  $scope.plumberChange = function(pId, pName) {
    chartConfig.loading = true;
    chartConfig.subtitle.text = pName;

    plumberId = pId;
    plumberName = pName;

    var res = $http.post(host + '/api/plumberWorkTimeReport', {"plumberId" : pId, "duration" : duration});

    $scope.seriesData.length = 0;
    res.success(function(result) {
      result.forEach(function(elem) {
        $scope.category.push(elem.day);
        $scope.seriesData.push(elem.count)
      })

      chartConfig.loading = false;
    });

    res.error(function(err) {
      chartConfig.loading = false;
    });
  }

  $scope.isSelected = function(checkTab) {
    return $scope.tab === checkTab;
  };

  $scope.selectTab = function(setTab) {
    chartConfig.loading = true;
    $scope.tab = setTab;
    switch (setTab) {
      case "1":
        durationChange("1W");
        break;
      case "2":
        durationChange("1M");
        break;
      case "3":
        durationChange("3M");
        break;
      case "4":
        durationChange("6M");
        break;
      case "5":
        durationChange("1Y");
        break;
      }
  };

  function durationChange(dId) {
    duration = dId;

    var res = $http.post(host + '/api/plumberWorkTimeReport', {"plumberId" : plumberId, "duration" : dId});

    $scope.seriesData.length = 0;
    res.success(function(result) {
      result.forEach(function(elem) {
        $scope.category.push(elem.day);
        $scope.seriesData.push(elem.count)
      })
      chartConfig.loading = false;
    });

    res.error(function(err) {
      chartConfig.loading = false;
    });
  }

  $scope.chartConfig = chartConfig;
});
