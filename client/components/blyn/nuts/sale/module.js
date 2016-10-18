'use strict';

angular.module('billynApp.core')
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/pc/space/:spaceId/app/:appId/sale/:nutId', '/pc/space/:spaceId/app/:appId/sale/:nutId/home');

    $stateProvider
      .state('pc.space.app.sale', {
        url: '/sale/:nutId',
        template: '<div ui-view=""></div>',
        controller: 'saleController',
        controllerAs: 'vm',
        ncyBreadcrumb: { label: '交易' },
        resolve: {
          currentNut: function ($q, $stateParams, $rootScope, BNut, currentSpace) {
            return $stateParams.nutId ?
              BNut.find($stateParams.nutId).then(function (nut) {
                $rootScope.current.nut = nut;
                $rootScope.current.nut.permits = [];
                BNut.findAllUserPermitNut($rootScope.current.app._id).then(function (permitNuts) {
                  for (var i = 0; i < permitNuts.length; i++) {
                    if (permitNuts[i].nut && permitNuts[i].nut.name === 'sale') {
                      $rootScope.current.nut.permits.push(permitNuts[i].permit);
                    }
                  }
                });
              }) :
              $q.resolve('No nutId.');
          }
        }
      })
  .state('pc.space.app.sale.home', {
    url: '/home',
    templateUrl: 'components/blyn/nuts/sale/view/home.html',
    controller: 'saleController',
    controllerAs: 'vm',
    ncyBreadcrumb: { skip: true },
    authenticate: true
  })
  .state('pc.space.app.sale.admin', {
    url: '/admin',
    templateUrl: 'components/blyn/nuts/sale/view/admin.html',
    controller: 'saleAdminController',
    controllerAs: 'vm',
    ncyBreadcrumb: { label: '设置' },
    authenticate: true
  })
  .state('pc.space.app.sale.manage', {
    url: '/manage',
    template: '<div ui-view=""></div>',
    controller: 'saleManageController',
    controllerAs: 'vm',
    ncyBreadcrumb: { label: '管理' }
  })
  .state('pc.space.app.sale.manage.home', {
    url: '/home',
    templateUrl: 'components/blyn/nuts/sale/view/manage.html',
    controller: 'saleManageController',
    controllerAs: 'vm',
    ncyBreadcrumb: { skip: true }
  })
  .state('pc.space.app.sale.manage.approve', {
    url: '/approve',
    templateUrl: 'components/blyn/nuts/sale/view/approve.html',
    controller: 'saleManageController',
    controllerAs: 'vm',
    ncyBreadcrumb: { label: '批准' },
    authenticate: true
  })
  .state('pc.space.app.sale.client', {
    url: '/client',
    template: '<div ui-view=""></div>',
    controller: 'saleClientController',
    controllerAs: 'vm',
    ncyBreadcrumb: { label: '客户' }
  })
  .state('pc.space.app.sale.client.home', {
    url: '/home',
    templateUrl: 'components/blyn/nuts/sale/view/client.html',
    controller: 'saleClientController',
    controllerAs: 'vm',
    ncyBreadcrumb: { skip: true }
  })
  .state('pc.space.app.sale.client.list', {
    url: '/list',
    templateUrl: 'components/blyn/nuts/sale/view/list.html',
    controller: 'saleClientController',
    controllerAs: 'vm',
    ncyBreadcrumb: { label: '商品列表' },
  })
  .state('pc.space.app.sale.client.history', {
    url: '/history',
    templateUrl: 'components/blyn/nuts/sale/view/history.html',
    controller: 'saleClientController',
    controllerAs: 'vm',
    ncyBreadcrumb: { label: '交易记录' },
  })
  .state('pc.space.app.sale.item', {
    url: '/item/:itemId',
    template: '<div ui-view=""></div>',
    controller: 'saleItemController',
    controllerAs: 'vm',
    ncyBreadcrumb: { label: '交易项' },
    authenticate: true
  })
  .state('pc.space.app.sale.item.home', {
    url: '/home',
    templateUrl: 'components/blyn/nuts/sale/view/item.html',
    controller: 'saleItemController',
    controllerAs: 'vm',
    ncyBreadcrumb: { skip: true },
    authenticate: true
  })
  });
