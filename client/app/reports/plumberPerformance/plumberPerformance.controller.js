angular.module('pune').controller('plumberPerformanceCtrl', function ($scope, $http, host, $location, ngProgressFactory) {

    // To display progress bar
    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setHeight('4px');
    $scope.progressbar.setColor('#0274ff');

    // Variable declartions
    var id;
    var plumberId = 0;
    var duration = "1W";
    $scope.chartDisplay = false;
    $scope.tab = "1";
    $scope.itemList = "";
    $scope.category = [];
    $scope.seriesData = [];

    // Options to display chart
    var chartConfig = {
        options: {
            chart: {
                type: 'column'
            },
            events: {
                redraw: function () {
                    alert('The chart is being redrawn');
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
                }
                $scope.plumbers.push(plumber);
            });
        }
        $scope.progressbar.complete();
    });

    // Function gets called when user selects particular plumber
    $scope.plumberChange = function (plumber) {
        chartConfig.loading = true;
        //chartConfig.subtitle.text = pName;
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

        // Posting data to get the performance result
        var res = $http.post(host + '/api/plumberWorkTimeReport', {"plumberId": plumber.id, "duration": duration});
        id = plumber.id;
       //console.log("1. plumberId : " + plumber.id + " Duration :" + duration);

        $scope.seriesData.length = 0;
        res.success(function (result) {
            result.forEach(function (elem) {
                $scope.category.push(elem.day);
                $scope.seriesData.push(elem.count);
                //console.log("1" + elem.day + " " + elem.count)
            });
            chartConfig.loading = false;
        });
        res.error(function (err) {
            chartConfig.loading = false;
        });
    };

    $scope.isSelected = function (checkTab) {
        return $scope.tab === checkTab;
    };

    // Function gets called when user selects particular duration
    $scope.selectTab = function (setTab) {
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

    // Function gets called when user changes the duration to send the duration
    function durationChange(dId) {
        duration = dId;
        var res = $http.post(host + '/api/plumberWorkTimeReport', {"plumberId": id, "duration": dId});
        //console.log("2. plumberId : " + id + " Duration :" + duration);

        $scope.seriesData.length = 0;
        res.success(function (result) {
            result.forEach(function (elem) {
                $scope.category.push(elem.day);
                $scope.seriesData.push(elem.count)
                console.log("2" + elem.day + " " + elem.count)
            })
            chartConfig.loading = false;
        });

        res.error(function (err) {
            chartConfig.loading = false;
        });
    }
    $scope.chartConfig = chartConfig;
});
