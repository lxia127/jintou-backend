'use strict';

(function () {

  class PriceController {
    constructor($state, $stateParams, $rootScope, BNut, BPrice) {
            var ctrl = this;
            this.nut = $rootScope.current.nut;
        }
  }

  class PriceAdminController {
    constructor() {

    }
  }

  class PriceManageController {
    constructor() {

    }
  }

  angular.module('billynApp.core')
    .controller('PriceController', PriceController)
    .controller('PriceAdminController', PriceAdminController)
    .controller('PriceManageController', PriceManageController);
})();
