/**
 * Created by anjali tanpure on 7/22/2015.
 */

angular.module('pune').config(function($stateProvider){
    $stateProvider.state('plumberPerformance',{
        url:"/plumberPerformance",
        templateUrl:"app/reports/plumberPerformance/plumberPerformance.html",
        controller:"plumberPerformanceCtrl"
    })
});
