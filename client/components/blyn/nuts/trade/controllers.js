'use strict';

(function () {

  class TradeController {
    constructor($state, $stateParams, $rootScope, BNut, BTrade) {
      var ctrl = this;
      this.nut = $rootScope.current.nut;
    }
  }

  class TradeAdminController {
    constructor() {

    }
  }

  class TradeManageController {
    constructor() {

    }
  }

  class TradeClientController {
    constructor() {

    }
  }

  class TradeItemController {
    constructor() {

    }
  }

  angular.module('billynApp.core')
    .controller('TradeController', TradeController)
    .controller('TradeAdminController', TradeAdminController)
    .controller('TradeManageController', TradeManageController)
    .controller('TradeClientController', TradeClientController)
    .controller('TradeItemController', TradeItemController);
})();
