'use strict';

angular.module('billynApp.core', [
  'billynApp.auth',
  'billynApp.util',
  'ngCookies',
  'ui.router',
  'ngAnimate',
  'ui.bootstrap',
  'ncy-angular-breadcrumb'
])
  .factory('BConfig', BConfig)
  .run(function ($rootScope) {
    $rootScope.breadcrumb = {};	// To save the breadcrumbs.
  });

function BConfig($http, $q) {

  var service = {};
  var config = {};

  service.loadConfig = function () {
    return $http.get("components/blyn/core/user/config.json")
      .then(function (userConfig) {
        config.user = userConfig;
        return $http.get("components/blyn/core/space/config.json");
      })
      .then(function (spaceConfig) {
        config.space = spaceConfig;
        return $http.get("components/blyn/core/app/config.json");
      }).then(function (appConfig) {
        config.app = appConfig;
        return $q.when(config);
      })
  }

  service.getConfig = function(path){
    return config;
  }

  return service;

}
