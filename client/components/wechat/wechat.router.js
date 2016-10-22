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
      .state('wechat.bind', {
        url: '/bind',
        templateUrl: 'components/wechat/views/bind.html',
        controller: 'WechatController',
        controllerAs: 'vm',
        authenticate: true
      })
      .state('wechat.auth', {
        url: '/auth?openid',
        templateUrl: 'components/wechat/views/login.html',
        controller: 'WechatController',
        controllerAs: 'vm',
        authenticate: true,
        resolve: {
          currentUser: function ($q, $stateParams, $rootScope, BUser, $cookies) {
            if ($stateParams.openid) {
              return Auth.getToken({ wechat: openid })
                .then(function (data) {
                  $cookies.put('token', data.token);
                  currentUser = User.get();
                  var user = currentUser.$promise;
                  return user;
                })
                .then(function (user) {
                  return BUser.setCurrent(user);
                }).then(function () {
                  $state.go('pc.dashboard');
                }
                )
            }
          }
        }
      })

  });
