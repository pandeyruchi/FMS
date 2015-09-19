/**
 * Created by ruchyp on 9/17/2015.
 */
angular.module('pune').config(function($stateProvider){
    $stateProvider.state('customerRequest',{
        url:"/customerRequest/{job}/{contact}/{issues}",
        templateUrl:"app/custreq/custReq2.html",
        controller:"custReq2Ctrl"
    })
});