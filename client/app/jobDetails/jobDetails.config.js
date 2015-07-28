/**
 * Created by ruchyp on 7/22/2015.
 */
angular.module('peninsula').config(function($stateProvider){
    $stateProvider.state('jobDetails',{
        url:"/jobDetails",
        templateUrl:"app/jobDetails/jobDetails.html",
        controller:"jobDetailsCtrl"
    })
});