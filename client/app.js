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
        .otherwise('/jobdDetails');


    $locationProvider.html5Mode(true);
});
app.constant('host',"http://52.24.8.32");
