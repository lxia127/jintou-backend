'use strict';

angular.module('billynApp.core')
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when(
      '/wechat',
      '/wechat/auth');

    $stateProvider
      .state('wechat', {
        url: '/wechat',
        template: '<div ui-view=""></div>',
        controller: 'WechatController',
        controllerAs: 'vm',
        resolve: {         
        }
      })
      .state('wechat.auth', {
        url: '/profile',
        templateUrl: 'components/wechat/views/auth.html',
        controller: 'WechatController',
        controllerAs: 'vm',
        authenticate: true
      })

  });
