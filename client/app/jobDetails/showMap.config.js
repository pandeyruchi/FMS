/**
 * Created by ruchyp on 7/22/2015.
 */
angular.module('pune').config(function($stateProvider){
    $stateProvider.state('showMap',{
        url:"/showMap/{jobId}/{address}",
        templateUrl:"app/jobDetails/showMap.html",
        controller:"showMapCtrl"

    })
});