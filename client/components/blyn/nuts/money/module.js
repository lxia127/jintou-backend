'use strict';

angular.module('billynApp.core')
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/pc/space/:spaceId/app/:appId/money/:nutId', '/pc/space/:spaceId/app/:appId/money/:nutId/home');

    $stateProvider
      .state('pc.space.app.money', {
        url: '/money/:nutId',
        template: '<div ui-view=""></div>',
        controller: 'MoneyController',
        controllerAs: 'vm',
        ncyBreadcrumb: { label: '金融账户' },
        resolve:{
          currentNut: function ($q, $stateParams, $rootScope, BNut, currentSpace) {
            return $stateParams.nutId ?
              BNut.find($stateParams.nutId).then(function (nut) {
                $rootScope.current.nut = nut;
                $rootScope.current.nut.permits = [];
                BNut.findAllUserPermitNut($rootScope.current.app._id).then(function (permitNuts) {
                  for (var i = 0; i < permitNuts.length; i++) {
                    if (permitNuts[i].nut && permitNuts[i].nut.name === 'money') {
                      $rootScope.current.nut.permits.push(permitNuts[i].permit);
                    }
                  }
                });
              }) :
              $q.resolve('No nutId.');
          }
        }
      })
      .state('pc.space.app.money.home', {
        url: '/home',
        templateUrl: 'components/blyn/nuts/money/view/home.html',
        controller: 'MoneyController',
        controllerAs: 'vm',
        ncyBreadcrumb: { skip: true }
      })
      .state('pc.space.app.money.admin', {
        url: '/admin',
        templateUrl: 'components/blyn/nuts/money/view/admin.html',
        controller: 'MoneyAdminController',
        controllerAs: 'vm',
        ncyBreadcrumb: { label: '设置' },
        authenticate: true
      })
      .state('pc.space.app.money.manage', {
        url: '/manage',
         templateUrl: 'components/blyn/nuts/money/view/manage.html',
        //template: '<div ui-view=""></div>',
        controller: 'MoneyManageController',
        controllerAs: 'vm',
        ncyBreadcrumb: { label: '管理' }
      })
      // .state('pc.space.app.money.manage.home', {
      //   url: '/home',
      //   templateUrl: 'components/blyn/nuts/money/view/manage.html',
      //   controller: 'MoneyManageController',
      //   controllerAs: 'vm',
      //   ncyBreadcrumb: { skip: true }
      // })
      .state('pc.space.app.money.manage.approve', {
        url: '/approve',
        templateUrl: 'components/blyn/nuts/money/view/approve.html',
        controller: 'MoneyManageController',
        controllerAs: 'vm',
        ncyBreadcrumb: { label: '批准' },
        authenticate: true
      })
      .state('pc.space.app.money.client', {
        url: '/client',
      //  template: '<div ui-view=""></div>',
       templateUrl: 'components/blyn/nuts/money/view/client.html',
        controller: 'MoneyClientController',
        controllerAs: 'vm',
        ncyBreadcrumb: { label: '客户' }
      })
      // .state('pc.space.app.money.client.home', {
      //   url: '/home',
      //   templateUrl: 'components/blyn/nuts/money/view/client.html',
      //   controller: 'MoneyManageController',
      //   controllerAs: 'vm',
      //   ncyBreadcrumb: { skip: true }
      // })
      .state('pc.space.app.money.client.applyAccount', {
        url: '/apply',
        templateUrl: 'components/blyn/nuts/money/view/applyAccount.html',
        controller: 'MoneyClientController',
        controllerAs: 'vm',
        ncyBreadcrumb: { label: '申请账号' },
        authenticate: true
      })
      .state('pc.space.app.money.client.applyCard', {
        url: '/apply',
        templateUrl: 'components/blyn/nuts/money/view/applyCard.html',
        controller: 'MoneyClientController',
        controllerAs: 'vm',
        ncyBreadcrumb: { label: '申请卡' },
        authenticate: true
      })
      .state('pc.space.app.money.account', {
        url: '/account/:accountId',
        template: '<div ui-view=""></div>',
        controller: 'MoneyAccountController',
        controllerAs: 'vm',
        ncyBreadcrumb: { label: '账号' },
        authenticate: true
      })
      .state('pc.space.app.money.account.home', {
        url: '/home',
        templateUrl: 'components/blyn/nuts/money/view/account.html',
        controller: 'MoneyAccountController',
        controllerAs: 'vm',
        ncyBreadcrumb: { skip: true },
        authenticate: true
      })
      .state('pc.space.app.money.card', {
        url: '/card/:cardId',
        template: '<div ui-view=""></div>',
        controller: 'MoneyCardController',
        controllerAs: 'vm',
        ncyBreadcrumb: { label: '金融卡' },
        authenticate: true
      })
      .state('pc.space.app.money.card.home', {
        url: '/home',
        templateUrl: 'components/blyn/nuts/money/view/card.html',
        controller: 'MoneyCardController',
        controllerAs: 'vm',
        ncyBreadcrumb: { skip: true },
        authenticate: true
      })
  });
