/**
 * Created by ruchyp on 7/22/2015.
 */

var app = angular.module('pune', [
    'ui.router','ui.bootstrap','nvd3ChartDirectives','nvd3','ngProgress','highcharts-ng','angulartics',
    'angulartics.google.analytics'
]).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider,$analyticsProvider) {
    $urlRouterProvider
        .otherwise('/login');

    $locationProvider.html5Mode(true);
});
app.constant('host',"http://52.24.1.69:3600");
