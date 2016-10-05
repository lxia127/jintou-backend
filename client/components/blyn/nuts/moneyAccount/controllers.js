'use strict';

(function () {

  class MoneyAccountController {
    constructor() {

    }
  }

  class MoneyAccountHomeController {
        constructor($state, $stateParams, $rootScope, BNut, BCircle) {
           
        }
    }

  angular.module('billynApp.core')
    .controller('MoneyAccountController', MoneyAccountController)
    .controller('MoneyAccountHomeController', MoneyAccountHomeController);

})();
