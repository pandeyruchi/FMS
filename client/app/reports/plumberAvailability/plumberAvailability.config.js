angular.module('pune').config(function($stateProvider){
    $stateProvider.state('plumberAvailability',{
        url:"/plumberAvailability",
        templateUrl:"app/reports/plumberAvailability/plumberAvailability.html",
        controller:"plumberAvailabilityCtrl"
    })
});
