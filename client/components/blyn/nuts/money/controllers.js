'use strict';

(function () {

  class MoneyController {
    constructor($state, $stateParams, $rootScope, BNut, BMoney) {
            var ctrl = this;
            this.nut = $rootScope.current.nut;
        }
  }

  class MoneyAdminController {
    constructor() {

    }
  }

  class MoneyManageController {
    constructor() {

    }
  }

  class MoneyClientController {
    constructor() {

    }
  }

  class MoneyAccountController {
    constructor() {

    }
  }

  class MoneyCardController {
    constructor() {

    }
  }

  angular.module('billynApp.core')
    .controller('MoneyController', MoneyController)
    .controller('MoneyAdminController', MoneyAdminController)
    .controller('MoneyManageController', MoneyManageController)
    .controller('MoneyClientController', MoneyClientController)
    .controller('MoneyAccountController', MoneyAccountController)
    .controller('MoneyCardController', MoneyCardController);
})();
