'use strict';

(function () {

  class SaleController {
    constructor($state, $stateParams, $rootScope, BNut, BSale) {
      var ctrl = this;
      this.nut = $rootScope.current.nut;
    }
  }

  class SaleAdminController {
    constructor() {

    }
  }

  class SaleManageController {
    constructor() {

    }
  }

  class SaleClientController {
    constructor() {

    }
  }

  class SaleItemController {
    constructor() {

    }
  }

  angular.module('billynApp.core')
    .controller('SaleController', SaleController)
    .controller('SaleAdminController', SaleAdminController)
    .controller('SaleManageController', SaleManageController)
    .controller('SaleClientController', SaleClientController)
    .controller('SaleItemController', SaleItemController);
})();
