/**
 * Created by ruchyp on 7/22/2015.
 */

var app = angular.module('peninsula', [
    'ui.router','ui.bootstrap'
]).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
        .otherwise('/login');

    $locationProvider.html5Mode(true);
});
app.constant('host',"http://54.191.207.203:3600");
