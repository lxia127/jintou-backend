'use strict';

(function () {

    function BMoney($resource, User, $q, Util, $rootScope, $http) {
        var safeCb = Util.safeCb;
        var current = {};
        var resAccount = $resource('/api/money/accounts/:id/:controller', {
            id: '@_id'
        }, {
                queryUserAccounts: {
                    method: 'GET',
                    params: {
                        id: 'user'
                    }
                }
            });


        var resCard = $resource('/api/money/cards/:id/:controller', {
            id: '@_id'
        }, {
                queryUserCards: {
                    method: 'GET',
                    params: {
                        id: 'user'
                    }
                }
            });

        var current = {};

        var service = {};

        service.setCurrent = function(data){

        }

        service.getCurrent = function(){

        }

        service.getConfig = function(){

        }

        service.loadConfig = function(){
            
        }

        service.asyncCreateAccount = function (data) {

        }

        service.asyncCreateCard = function (data) {

        }

        service.asyncUpdateAccount = function (data) {

        }

        service.asyncUpdateCard = function (data) {

        }

        service.loadAccounts = function (data) {

        }

        service.loadAccount = function (data) {

        }

        service.loadCard = function (data) {

        }

        service.loadUserAccounts = function (data) {

        }

        service.loadUserCards = function (data) {

        }

        service.asyncDoTransaction = function (data) {

        }

        service.loadTransactions = function (data) {

        }

        service.loadTransaction = function (data) {

        }

        return service;
    }

    angular.module('billynApp.core')
        .factory('BMoney', BMoney);

})();

