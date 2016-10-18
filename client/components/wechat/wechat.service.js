'use strict';

(function () {

	function WechatService($resource, User, $q, Util, $http, $rootScope) {
		var safeCb = Util.safeCb;
		var resWechat = $resource('/api/wechat/:id/:controller', {
			id: '@_id'
		}, {
				getUser: {
					method: 'GET',
					params: {
						id: 'user'
					}
				},				
			});
		

		var service = {};

		return service;
	}

	angular.module('billynApp.core')
		.factory('Wechat', WechatService);

})();
