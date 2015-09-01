/**
 * Created by synerzip on 4/8/15.
 */
angular.module('pune').config(function($stateProvider){
    $stateProvider.state('finalJobDescription',{
        url:"/finalJobDescription/{jobReqId}/{plumberId}",
        templateUrl:"app/jobDetails/finalJobDescription.html",
        controller:"finalJobDescriptionCtrl"
    })
});



