'use strict';

angular.module('billynApp.core')
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/pc/space/:spaceId/app/:appId/mAccount/:mAccountId', '/pc/space/:spaceId/app/:appId/mAccount/:mAccountId/home');
    
    $stateProvider
      .state('pc.space.app.moneyAccount', {
        url: '/mAccount/:mAccountId',
        template: '<div ui-view=""></div>',
        controller: 'MoneyAccountController',
        controllerAs: 'vm',
        ncyBreadcrumb: {label: '金融账号'},
        resolve: {
          moneyAccount: function($q, $stateParams, $rootScope, BSpace, currentUser) {
            // If return a promise with rejected, the controller of this state will not be instantiated.
            return $stateParams.mAccountId ? 
                    BMoneyAccount.getAccount($stateParams.mAccountId).then(function (account) {
                      $rootScope.current.moneyAccount = account;
                      //$rootScope.breadcrumb.space = space.alias;
                    }) : 
                    $q.resolve('No mAccountId.');
          }
        }
      })
      .state('pc.space.app.moneyAccount.home', {
        url: '/home',
        templateUrl: 'components/blyn/nuts/moneyAccount/views/home.html',
        controller: 'MoneyAccountHomeController',
        controllerAs: 'vm',
        ncyBreadcrumb: {skip:true},
        authenticate: true
      })
  });
