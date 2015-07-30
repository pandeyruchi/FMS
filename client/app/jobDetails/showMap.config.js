/**
 * Created by ruchyp on 7/22/2015.
 */
angular.module('peninsula').config(function($stateProvider){
    $stateProvider.state('showMap',{
        url:"/showMap?:address",
        templateUrl:"app/jobDetails/showMap.html",
        controller:"showMapCtrl"

    })
});