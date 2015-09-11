/**
 * Created by ruchyp on 7/22/2015.
 */

var app = angular.module('pune', [
    'ui.router','ui.bootstrap','ngProgress','highcharts-ng','angulartics.google.analytics','angulartics','ngMaterial','ngAnimate'
]).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider,$analyticsProvider) {
    $urlRouterProvider
        .otherwise('/login');

    $locationProvider.html5Mode(true);
});
app.constant('host',"http://52.88.162.74:3600");
