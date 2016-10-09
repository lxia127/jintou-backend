'use strict';

(function () {

  class TradeController {
    constructor() {

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
    .controller('TradeController', MoneyController)
    .controller('TradeAdminController', MoneyAdminController)
    .controller('TradeManageController', MoneyManageController)
    .controller('TradeClientController', MoneyClientController)
    .controller('TradeItemController', MoneyAccountController);
})();
