/**
 * Created by ruchyp on 7/22/2015.
 */
angular.module('peninsula').config(function($stateProvider){
    $stateProvider.state('signup',{
        url:"/signup",
        templateUrl:"app/auth/signup/signup.html",
        controller:"signupCtrl"
    })
});