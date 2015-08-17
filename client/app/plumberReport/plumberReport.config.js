/**
 * Created by anjali tanpure on 7/22/2015.
 */

angular.module('peninsula').config(function($stateProvider){
    $stateProvider.state('plumberReport',{
        url:"/plumberReport",
        templateUrl:"app/plumberReport/plumberReport.html",
        controller:"plumberReportCtrl"
    })
});