/**
 * Created by ruchyp on 7/22/2015.
 */

var app = angular.module('peninsula', [
    'ui.router'
]).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
        .otherwise('/login');

    $locationProvider.html5Mode(true);
});
app.constant('host',"http://52.24.218.178:3600");
