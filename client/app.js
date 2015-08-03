/**
 * Created by ruchyp on 7/22/2015.
 */

var app = angular.module('peninsula', [
    'ui.router'
]).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
        .otherwise('/signup');
    $urlRouterProvider
        .otherwise('/custreq');
    $urlRouterProvider
        .otherwise('/jobDetails');

    $urlRouterProvider
        .otherwise('/login');

    $locationProvider.html5Mode(true);
});
app.constant('host',"http://54.68.120.146:3600");
//app.constant('host',"http://172.25.36.44:3600");
