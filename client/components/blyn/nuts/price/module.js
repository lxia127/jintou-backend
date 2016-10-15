'use strict';

angular.module('billynApp.core')
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/pc/space/:spaceId/app/:appId/price/:nutId', '/pc/space/:spaceId/app/:appId/price/:nutId/home');

    $stateProvider
      .state('pc.space.app.price', {
        url: '/price/:nutId',
        template: '<div ui-view=""></div>',
        controller: 'PriceController',
        controllerAs: 'vm',
        ncyBreadcrumb: { label: '产品价格' },
        resolve: {
          currentNut: function ($q, $stateParams, $rootScope, BNut, currentSpace) {
            return $stateParams.nutId ?
              BNut.find($stateParams.nutId).then(function (nut) {
                $rootScope.current.nut = nut;
                $rootScope.current.nut.permits = [];
                BNut.findAllUserPermitNut($rootScope.current.app._id).then(function (permitNuts) {
                  for (var i = 0; i < permitNuts.length; i++) {
                    if (permitNuts[i].nut && permitNuts[i].nut.name === 'price') {
                      $rootScope.current.nut.permits.push(permitNuts[i].permit);
                    }
                  }
                });
              }) :
              $q.resolve('No nutId.');
          }
        }
      })
      .state('pc.space.app.price.home', {
        url: '/home',
        templateUrl: 'components/blyn/nuts/price/view/home.html',
        controller: 'PriceController',
        controllerAs: 'vm',
        ncyBreadcrumb: { skip: true }
      })
      .state('pc.space.app.price.admin', {
        url: '/admin',
        templateUrl: 'components/blyn/nuts/price/view/admin.html',
        controller: 'PriceAdminController',
        controllerAs: 'vm',
        ncyBreadcrumb: { label: '设置' },
        authenticate: true
      })
      .state('pc.space.app.price.manage', {
        url: '/manage',
        templateUrl: 'components/blyn/nuts/price/view/manage.html',
        controller: 'PriceManageController',
        controllerAs: 'vm',
        ncyBreadcrumb: { label: '管理' }
      })
  });
