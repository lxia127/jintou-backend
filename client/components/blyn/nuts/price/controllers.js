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
      this.myProducts = [{alias: "成长基金",
                          price: 8000,
                          paymentType:"元／月",
                          name: "myproduct1", 
                          description:"一年以内，平均期限120天,该基金资产主要投资于短期货币 ..."},
                         {alias:"货币基金", 
                          price: 68000,
                          paymentType:"元／年",
                          name: "myproduct2", 
                          description:"以具有成长性的新兴产业的普通股为主..."}];
    }
  }

  angular.module('billynApp.core')
    .controller('PriceController', PriceController)
    .controller('PriceAdminController', PriceAdminController)
    .controller('PriceManageController', PriceManageController);
})();
