'use strict';

(function () {

    function BProduct($resource, $q, Util, $rootScope, $http, $stateParams) {
        var safeCb = Util.safeCb;
        var current = {};
        var resProduct = $resource('/api/products/:id/:controller', {
            id: '@_id'
        }, {

            });

        var service = {};

        service.addProduct = function (productData) {
            //将会执行POST http://.../api/products/
            return resProduct.create(productData).$promise;
        }

        service.loadConfig = function (path) {
            var that = this;
            path = path || "components/blyn/nuts/product/config.json"
            return $http.get(path).then(function (oConfig) {
                current.config = oConfig.data;

                return $q.when(current.config);

            })
        }

        service.setCurrent = function (user) {
            //return currentUser = user;
            var that = this;
            return this.loadConfig()
                .then(function () {
                    if ($StateParams.productId) {
                        return resProduct.get({
                            id: $StateParams.productId
                        }).$promise;
                    } else {
                        return $q.when(null);
                    }
                });
        }


        service.getCurrent = function () {
            return current;
            /*
            if (arguments.length === 0) {
                return currentUser;
            }
            var value = (currentUser.hasOwnProperty('$promise')) ?
                currentUser.$promise : currentUser;

            return $q.when(value)
                .then(user => {
                    safeCb(callback)(user);
                    return user;
                }, () => {
                    safeCb(callback)({});
                    return {};
                })*/
        }

        service.getUserProfiles = function (findContext) {
            return resUserProfile.get(findContext).$promise;
        }

        service.bulkAddUserProfile = function (bulkData, context) {
            context = context || {};
            if (!context.hasOwnProperty('spaceId')) {
                context.spaceId = $rootScope.current.space._id;
            }
            context.data = bulkData;
            return resUserProfile.bulkAdd(context).$promise;
        }

        service.addGroup = function (data) {
            if (!data.spaceId) {
                data.spaceId = $rootScope.current.space._id;
            }
            return resUserGroup.add(data).$promise;
        }

        service.findOneUserGroup = function (data) {
            return resUserGroup.findOne(data).$promise;
        }

        service.findAllUserGroup = function (data) {
            return resUserGroup.findAll(data).$promise;
        }

        service.findUserGroupRoles = function (data) {

            if (angular.isObject(data)) {
                var userGroupId;
                for (var key in data) {
                    if (key.toLocaleLowerCase() === 'usergroupid') {
                        userGroupId = data[key];
                    }
                }
                if (userGroupId) {
                    return resUserGroup.findRoles(
                        {
                            userGroupId: userGroupId
                        }
                    ).$promise;
                } else {
                    return $q.reject('fail to find group roles');
                }
            }
        }

        service.addUserGroupRole = function (data) {
            var roleId, userGroupId;

            if (angular.isObject(data)) {
                for (var key in data) {
                    if (key.toLocaleLowerCase() === 'roleid') {
                        roleId = data[key];
                    }
                    if (key.toLocaleLowerCase() === 'usergroupid') {
                        userGroupId = data[key];
                    }
                    if (key.toLocaleLowerCase() === 'groupid') {
                        userGroupId = data[key];
                    }
                }
            }

            if (roleId && userGroupId) {
                return resUserGroup.addRole({
                    roleId: roleId,
                    userGroupId: userGroupId
                }).$promise;
            } else {
                return $q.reject('fail to add role');
            }
        }

        service.loadConfig = function (path) {
            var that = this;
            return $http.get("components/blyn/core/user/config.json").then(function (oConfig) {
                current.config = oConfig.data;

                return $q.when(current.config);

            })
        }

        service.getConfig = function (path) {
            var config = current.config;
            var list = path.splite('.');
            var o = config;
            var error = false;
            list.forEach(function (s) {
                if (o[s]) {
                    o = o[s];
                } else {
                    error = true;
                }
            })
            if (error) {
                return config;
            } else {
                return o;
            }
        }

        return service;
    }

    angular.module('billynApp.core')
        .factory('BProduct', BProduct);

})();

