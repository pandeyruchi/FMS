/**
 * Created by ruchyp on 7/22/2015.
 */

var app = angular.module('pune', [
    'ui.router','ui.bootstrap','nvd3ChartDirectives','nvd3','ngProgress'
]).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
        .otherwise('/login');

    $locationProvider.html5Mode(true);
});
app.constant('host',"http://52.88.22.96:3600");
