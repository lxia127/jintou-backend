'use strict';

(function () {

  class ProductController {
    constructor() {

    }
  }

  class ProductAdminController {
    constructor() {

    }
  }

  class ProductManageController {
    constructor() {

    }
  }

  class ProductClientController {
    constructor() {

    }
  }

  class ProductItemController {
    constructor() {

    }
  }

  angular.module('billynApp.core')
    .controller('ProductController', MoneyController)
    .controller('ProductAdminController', MoneyAdminController)
    .controller('ProductManageController', MoneyManageController)
    .controller('ProductClientController', MoneyClientController)
    .controller('ProductItemController', MoneyAccountController)
})();
