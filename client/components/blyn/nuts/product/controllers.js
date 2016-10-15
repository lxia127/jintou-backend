'use strict';

(function () {

  class ProductController {
    constructor($state, $stateParams, $rootScope, BNut, BProduct) {
      var ctrl = this;
      this.nut = $rootScope.current.nut;
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
    .controller('ProductController', ProductController)
    .controller('ProductAdminController', ProductAdminController)
    .controller('ProductManageController', ProductManageController)
    .controller('ProductClientController', ProductClientController)
    .controller('ProductItemController', ProductItemController);
})();
