/**
 * Created by ruchyp on 7/22/2015.
 */
angular.module('pune').config(function($stateProvider){
    $stateProvider.state('custreq',{
        url:"/custreq",
        templateUrl:"app/custreq/custreq.html",
        controller:"custreqCtrl"
    })
});