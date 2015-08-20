/**
 * Created by anjali tanpure on 7/22/2015.
 */

angular.module('peninsula').config(function($stateProvider){
    $stateProvider.state('plumberFeedback',{
        url:"/plumberFeedback",
        templateUrl:"app/plumberFeedback/plumberFeedback.html",
        controller:"plumberFeedbackCtrl"
    })
});