angular.module('pune').controller('plumberAvailabilityCtrl', function ($scope, $http, host, $interval, ngProgressFactory) {


    var seriesData = [];
    var drillDownData = [];

    var availablePlumbers = [];
    var unAvailablePlumbers = [];

    var chartConfig = {
        title: {
            text: 'Plumber Availability Report'
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
                pointFormat: '<span style="color:{point.color}">{point.name} ({point.y})</span>: <b>{point.z:.2f}%</b> of total<br/>'
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
            name: 'Plumber Availability',
            colorByPoint: true,
            data: seriesData
        }]
    };

    $http.get(host + '/api/getAvailablePlumbers').then(function (result) {

        chartConfig.loading = true;

        result.data.forEach(function (elem) {
            availablePlumbers.push(elem);
        })

        $http.get(host + '/api/getUnavailablePlumbers').then(function (result) {
            result.data.forEach(function (elem) {
                unAvailablePlumbers.push(elem);
            })


            generateChart();
        });
    });

    function generateChart() {
        var avail = {};
        var availDetails = {};
        var unavailDetails = {};

        avail.name = "Available Plumbers";
        avail.visible = true;
        avail.color = "#006400";
        avail.y = availablePlumbers.length;
        avail.z = (availablePlumbers.length * 100) / (availablePlumbers.length + unAvailablePlumbers.length)

        var availData = [];
        availablePlumbers.forEach(function (elem) {
            availData.push([elem.firstName + " " + elem.lastName + " (" + elem.mobileNo + ") ", 100 / availablePlumbers.length])
        });

        availDetails.id = "Available";
        availDetails.name = "Available Plumbers";
        availDetails.data = availData;

        var unAvail = {};
        unAvail.name = "Unavailable Plumbers";
        unAvail.visible = true;
        unAvail.color = "#FF8C00";
        unAvail.y = unAvailablePlumbers.length;
        unAvail.z = (unAvailablePlumbers.length * 100) / (availablePlumbers.length + unAvailablePlumbers.length)

        var unavailData = [];
        unAvailablePlumbers.forEach(function (elem) {
            unavailData.push([elem.firstName + " " + elem.lastName + " (" + elem.mobileNo + ") ", 0])
        });

        unavailDetails.id = "Unavailable";
        unavailDetails.name = "Unavailable Plumbers";
        unavailDetails.data = unavailData;

        seriesData.push(avail);
        seriesData.push(unAvail);

        drillDownData.push(availDetails);
        drillDownData.push(unavailDetails);

        chartConfig.loading = false;
    }

    $scope.chartConfig = chartConfig;
});
