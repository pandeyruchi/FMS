/**
 * Created by ruchyp on 7/22/2015.
 */
angular.module('pune').config(function($stateProvider){
    $stateProvider.state('addPlumber',{
        url:"/addPlumber",
        templateUrl:"app/addPlumber/addPlumber.html",
        controller:"addPlumberCtrl"
    })
});