'use strict';

(function () {

  class ProfitController {
    constructor($state, $stateParams, $rootScope, BNut, BProfit) {
            var ctrl = this;
            this.nut = $rootScope.current.nut;
        }
  }

  class ProfitAdminController {
    constructor() {

    }
  }

  class ProfitManageController {
    constructor() {

    }
  }

  class ProfitClientController {
    constructor() {

    }
  }

  angular.module('billynApp.core')
    .controller('ProfitController', ProfitController)
    .controller('ProfitAdminController', ProfitAdminController)
    .controller('ProfitManageController', ProfitManageController)
    .controller('ProfitClientController', ProfitClientController);
})();
