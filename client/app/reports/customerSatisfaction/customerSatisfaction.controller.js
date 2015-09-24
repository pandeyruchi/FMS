angular.module('pune').controller('customerSatisfactionCtrl', function ($scope, $http, host, $interval, ngProgressFactory) {

    // Variable declarations
    $scope.pieData = [];

    // To display progress bar
    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setHeight('4px');
    $scope.progressbar.setColor('#0274ff');

    // Options to display chart
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

    // Get the data for plumber reports
    var res = $http.get(host + '/api/PlumberPerformanceReport').success(function (result) {
        $scope.progressbar.start();

        chartConfig.loading = true;
        $scope.plumbers = [];
        var data = result;

        if (data != null) {
            data.forEach(function (elem) {
                var plumber = {};
                plumber.name = elem.firstName;
                plumber.lastName = elem.lastName;
                plumber.id = elem.userId;
                plumber.photoUrl = elem.photoUrl;
                plumber.rank = elem.rank;
                if (plumber.rank === "1") {
                    plumber.selected = true;
                    $scope.selectedPlumber = plumber;
                    $scope.selectedPlumber.selected = true;
                    $scope.generateChart(plumber);
                }
                $scope.plumbers.push(plumber);
            });
        }
        $scope.progressbar.complete();
    });

    // Function gets called to enerate the chart for selected plumber
    $scope.generateChart = function (plumber) {
        if ($scope.selectedPlumber === plumber) {
            $scope.selectedPlumber.selected = !$scope.selectedPlumber.selected;
            plumber.selected = !plumber.selected;
        }
        if ($scope.selectedPlumber !== plumber) {
            if (!!$scope.selectedPlumber) {
                $scope.selectedPlumber.selected = false;
            }
            plumber.selected = true;
            $scope.selectedPlumber = plumber;
        }
        chartConfig.loading = true;
        $http.post(host + '/api/plumberFeedbackReport', {"plumberId": plumber.id}).then(function (result) {
            $scope.pieData.length = 0;
            result.data.forEach(function (elem) {
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
