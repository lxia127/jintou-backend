'use strict';

angular.module('billynApp.core')
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/pc/space/:spaceId/app/:appId/profit/:nutId', '/pc/space/:spaceId/app/:appId/profit/:nutId/home');

    $stateProvider
      .state('pc.space.app.profit', {
        url: '/profit/:nutId',
        template: '<div ui-view=""></div>',
        controller: 'ProfitController',
        controllerAs: 'vm',
        ncyBreadcrumb: { label: '收益' },
        resolve:{
          currentNut: function ($q, $stateParams, $rootScope, BNut, currentSpace) {
            return $stateParams.nutId ?
              BNut.find($stateParams.nutId).then(function (nut) {
                $rootScope.current.nut = nut;
                $rootScope.current.nut.permits = [];
                BNut.findAllUserPermitNut($rootScope.current.app._id).then(function (permitNuts) {
                  for (var i = 0; i < permitNuts.length; i++) {
                    if (permitNuts[i].nut && permitNuts[i].nut.name === 'profit') {
                      $rootScope.current.nut.permits.push(permitNuts[i].permit);
                    }
                  }
                });
              }) :
              $q.resolve('No nutId.');
          }
        }
      })
      .state('pc.space.app.profit.home', {
        url: '/home',
        templateUrl: 'components/blyn/nuts/profit/view/home.html',
        controller: 'ProfitController',
        controllerAs: 'vm',
        ncyBreadcrumb: { skip: true }
      })
      .state('pc.space.app.profit.admin', {
        url: '/admin',
        templateUrl: 'components/blyn/nuts/money/view/admin.html',
        controller: 'ProfitAdminController',
        controllerAs: 'vm',
        ncyBreadcrumb: { label: '设置' },
        authenticate: true
      })
      .state('pc.space.app.profit.manage', {
        url: '/home',
        templateUrl: 'components/blyn/nuts/profit/view/manage.html',
        controller: 'ProfitManageController',
        controllerAs: 'vm',
        ncyBreadcrumb: { skip: true }
      })
      .state('pc.space.app.profit.client', {
        url: '/home',
        templateUrl: 'components/blyn/nuts/profit/view/client.html',
        controller: 'ProfitClientController',
        controllerAs: 'vm',
        ncyBreadcrumb: { skip: true }
      })
      
  });
