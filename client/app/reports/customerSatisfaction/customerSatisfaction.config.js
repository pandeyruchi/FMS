/**
 * Created by anjali tanpure on 7/22/2015.
 */

angular.module('pune').config(function($stateProvider){
    $stateProvider.state('customerSatisfaction',{
        url:"/customerSatisfaction",
        templateUrl:"app/reports/customerSatisfaction/customerSatisfaction.html",
        controller:"customerSatisfactionCtrl"
    })
});
