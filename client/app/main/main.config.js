/**
 * Created by ruchyp on 7/22/2015.
 */
angular.module('pune').config(function($stateProvider){
    $stateProvider.state('main',{
        url:"/main",
        templateUrl:"app/main/main.html",
        controller:"mainCtrl"
    })
});
