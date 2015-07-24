/**
 * Created by ruchyp on 7/22/2015.
 */
angular.module('peninsula').config(function($stateProvider){
    $stateProvider.state('login',{
        url:"/login",
        templateUrl:"app/auth/login/login.html",
        controller:"loginCtrl"
    })
});