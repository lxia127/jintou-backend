/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/apps              ->  index
 * POST    /api/apps              ->  create
 * GET     /api/apps/:id          ->  show
 * PUT     /api/apps/:id          ->  update
 * DELETE  /api/apps/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { SaleListType } from '../../sqldb';
import { SaleList } from '../../sqldb';
import { SaleListAttribute } from '../../sqldb';
var Promise = require('bluebird');


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function (entity) {
    return entity.updateAttributes(updates)
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

/**
 * @desc {POST http://hostname/api/products/types}
 * 这个函数用来创建新的产品类型。函数首先会在数据库中查找，如果发现已经存在，不会操作。
 * 如果没有发现类型，就进行创建
 * @param {object} req.body type data for add new type
 * @return {json} json object for new type
 * @example
 * POST
 * http://hostname/api/products/types
 * req.body example:
      {
          "name": "type1",
          "alias": "type1 alias",
          "attributes": {
              "attr1": {
                  "value": "value1",
                  "grants": {
                      "manager": "allow.input"
                  }
              },
              "attr2": {
                  "value": "value2",
                  "grants": {
                      "client": "allow.input"
                  }
              }
          }
      }
 * @example
 * json result example
      {
        "_id": 2,
        "parentId": -1,
        "name": "type1",
        "fullname": null,
        "alias": null,
        "description": null,
        "data": null,
        "spaceId": 1,
        "circleId": -1,
        "active": null,
        "attributes": [
          {
            "_id": 6,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr1",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "a1",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 40,
                "owner": "ProductAttribute",
                "ownerId": 6,
                "permitId": 64,
                "roleId": 5,
                "spaceId": 1,
                "active": null
              }
            ]
          },
          {
            "_id": 7,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr2",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "v2",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 41,
                "owner": "ProductAttribute",
                "ownerId": 7,
                "permitId": 67,
                "roleId": 13,
                "spaceId": 1,
                "active": null
              }
            ]
          }
        ]
      }
 */
export function addSaleListType(req, res) {
  var query = req.query;
  var body = req.body;

  if (!query.spaceId) {
    return res.status(500).send('please provide spaceId in query');
  }

  return ProductType.addType(req.body, { spaceId: query.spaceId })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * @desc {POST http://hostname/api/products/types/batch}
 * 这个函数用来批量创建新的产品类型。默认情况下，函数首先会在数据库中查找，如果发现已经存在，不会操作。
 * 如果没有发现类型，就进行创建
 * @param {typeData[]} req.body array for type data
 * @return {type[]} list of new created type
 * @example
 * POST
 * http://hostname/api/products/types/batch
 * req.body example:
      [{
          "name": "type1",
          "alias": "type1 alias",
          "attributes": {
              "attr1": {
                  "value": "value1",
                  "grants": {
                      "manager": "allow.input"
                  }
              },
              "attr2": {
                  "value": "value2",
                  "grants": {
                      "client": "allow.input"
                  }
              }
          }
      },
      {
          "name": "type2",
          "alias": "type2 alias",
          "attributes": {
              "attr1": {
                  "value": "value1",
                  "grants": {
                      "manager": "allow.input"
                  }
              },
              "attr2": {
                  "value": "value2",
                  "grants": {
                      "client": "allow.input"
                  }
              }
          }
      },
      ]
 * @example
 * json result example
      [{
        "_id": 2,
        "parentId": -1,
        "name": "type1",
        "fullname": null,
        "alias": null,
        "description": null,
        "data": null,
        "spaceId": 1,
        "circleId": -1,
        "active": null,
        "attributes": [
          {
            "_id": 6,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr1",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "a1",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 40,
                "owner": "ProductAttribute",
                "ownerId": 6,
                "permitId": 64,
                "roleId": 5,
                "spaceId": 1,
                "active": null
              }
            ]
          },
          {
            "_id": 7,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr2",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "v2",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 41,
                "owner": "ProductAttribute",
                "ownerId": 7,
                "permitId": 67,
                "roleId": 13,
                "spaceId": 1,
                "active": null
              }
            ]
          }
        ]
      },
      ....
      ]
 */
export function addSaleListTypes(req, res) {
  var query = req.query;
  var body = req.body;

  if (!query.spaceId) {
    return res.status(500).send('please provide spaceId in query');
  }

  return SaleListType.addTypes(req.body, { spaceId: req.query.spaceId })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * @desc {GET http://hostname/api/sales/saleLists/types/:id[?spaceId=xxx]}
 * 这个函数用来获取某一个类型。如果:id是integer，用id获取type.如果:id是name,同时提供spaceId，
 * 也可以用typename来获取type
 * @param {integer or string} req.params.id[req.query.spaceId]
 * @return {json} json object for type
 * @example
 * GET
 * http://hostname/api/sales/saleLists/types/5
 * or
 * http://hostname/api/sales/saleLists/types/type1?spaceId=2
 * type1 is name of type
 * @example
 * json result example
      {
        "_id": 2,
        "parentId": -1,
        "name": "type1",
        "fullname": null,
        "alias": null,
        "description": null,
        "data": null,
        "spaceId": 1,
        "circleId": -1,
        "active": null,
        "attributes": [
          {
            "_id": 6,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr1",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "a1",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 40,
                "owner": "ProductAttribute",
                "ownerId": 6,
                "permitId": 64,
                "roleId": 5,
                "spaceId": 1,
                "active": null
              }
            ]
          },
          {
            "_id": 7,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr2",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "v2",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 41,
                "owner": "ProductAttribute",
                "ownerId": 7,
                "permitId": 67,
                "roleId": 13,
                "spaceId": 1,
                "active": null
              }
            ]
          }
        ]
      }
 */
export function getSaleListType(req, res) {
  var id, spaceId;
  if (req.params.id) {
    id = req.params.id;
  }
  if (req.query.spaceId) {
    spaceId = req.query.spaceId;
  }

  if (!isNaN(id) && id > 0) {
    return SaleListType.getType(id)
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
      .catch(handleError(res));
  } else if (id && spaceId) {
    return SaleListType.getType({
      name: id,
      spaceId: spaceId
    })
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
      .catch(handleError(res));
  } else {
    return res.status(500).send('please provide type id or type name with spaceId');
  }
}

/**
 * @desc {GET http://hostname/api/sales/saleLists/types?spaceId=xxx}
 * 这个函数用来获取类型的数组。通常提供spaceId来获取机构的所有类型，
 * @param {integer} req.query.spaceId
 * @return {json} json object array for type
 * @example
 * GET
 * http://hostname/api/sales/saleLists/types?spaceId=2
 * @example
 * json result example
      [{
        "_id": 2,
        "parentId": -1,
        "name": "type1",
        "fullname": null,
        "alias": null,
        "description": null,
        "data": null,
        "spaceId": 1,
        "circleId": -1,
        "active": null,
        "attributes": [
          {
            "_id": 6,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr1",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "a1",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 40,
                "owner": "ProductAttribute",
                "ownerId": 6,
                "permitId": 64,
                "roleId": 5,
                "spaceId": 1,
                "active": null
              }
            ]
          },
          {
            "_id": 7,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr2",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "v2",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 41,
                "owner": "ProductAttribute",
                "ownerId": 7,
                "permitId": 67,
                "roleId": 13,
                "spaceId": 1,
                "active": null
              }
            ]
          }
        ]
      },
      ...]
 */
export function getSaleListTypes(req, res) {
  if (req.query && req.query.spaceId) {
    return SaleListType.getTypes(req.query)
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
      .catch(handleError(res));
  } else {
    res.status(500).send('please provide spaceId');
  }
}

/**
 * @desc {PUT http://hostname/api/sales/saleLists/types/:id}
 * 这个函数用来更新产品类型。
 * @param {object} req.body type data for updating
 * @param {integer} req.params.id 属性的id
 * @return {json} json object for new type
 * @example
 * PUT
 * http://hostname/api/sales/saleLists/types/5
 * req.body example:
      {
          "name": "type2",
          "alias": "type2 alias",
      }
 * @example
 * json result example
      {
        "_id": 2,
        "parentId": -1,
        "name": "type2",
        "fullname": null,
        "alias": "type2 alias",
        "description": null,
        "data": null,
        "spaceId": 1,
        "circleId": -1,
        "active": null,
        "attributes": [
          {
            "_id": 6,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr1",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "a1",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 40,
                "owner": "ProductAttribute",
                "ownerId": 6,
                "permitId": 64,
                "roleId": 5,
                "spaceId": 1,
                "active": null
              }
            ]
          },
          {
            "_id": 7,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr2",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "v2",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 41,
                "owner": "ProductAttribute",
                "ownerId": 7,
                "permitId": 67,
                "roleId": 13,
                "spaceId": 1,
                "active": null
              }
            ]
          }
        ]
      }
 */
export function updateType(req, res) {
  var id = req.params.id;
  var body = req.body;

  return ProductType.updateType(req.body, req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * @desc {DELETE http://hostname/api/products/types/:id}
 * 这个函数用来删除类型。
 * @param {object} req.params.id 
 * @return {result} return true after deleted, otherwise return false
 * @example
 * DELETE
 * http://hostname/api/products/types/5
 * 
 */
export function deleteSaleListType(req, res) {
  SaleListType.findById(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

/**
 * @desc {POST http://hostname/api/sales/saleLists}
 * 这个函数用来创建新的产品。函数首先会在数据库中查找，如果发现已经存在，不会操作。
 * 如果没有发现类型，就进行创建
 * @param {object} req.body product data for add new product
 * @return {json} json object for new product
 * @example
 * POST
 * http://hostname/api/products
 * req.body example:
      {
          "name": "product1",
          "alias": "product1 alias",
          "attributes": {
              "attr1": {
                  "value": "value1",
                  "grants": {
                      "manager": "allow.input"
                  }
              },
              "attr2": {
                  "value": "value2",
                  "grants": {
                      "client": "allow.input"
                  }
              }
          }
      }
 * @example
 * json result example
      {
        "_id": 2,
        "parentId": -1,
        "name": "product1",
        "fullname": null,
        "alias": null,
        "description": null,
        "data": null,
        "spaceId": 1,
        "circleId": -1,
        "active": null,
        "typeId": 2,
        "type": {
          "name":"type1"
        "attributes": [
          {
            "_id": 6,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr1",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "a1",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 40,
                "owner": "ProductAttribute",
                "ownerId": 6,
                "permitId": 64,
                "roleId": 5,
                "spaceId": 1,
                "active": null
              }
            ]
          },
          {
            "_id": 7,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr2",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "v2",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 41,
                "owner": "ProductAttribute",
                "ownerId": 7,
                "permitId": 67,
                "roleId": 13,
                "spaceId": 1,
                "active": null
              }
            ]
          }
        ]
        }
      }
 */
export function addSaleList(req, res) {
  var query = req.query;
  var body = req.body;

  if (!query.spaceId && !req.body.spaceId) {
    return res.status(500).send('please provide spaceId in query');
  }

  return SaleList.addSaleList(req.body, { spaceId: query.spaceId })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * @desc {POST http://hostname/api/products/batch}
 * 这个函数用来批量创建新的产品。默认情况下，函数首先会在数据库中查找，如果发现已经存在，不会操作。
 * 如果没有发现类型，就进行创建
 * @param {productData[]} req.body array for product data
 * @return {product[]} list of new created product
 * @example
 * POST
 * http://hostname/api/products/batch
 * req.body example:
      [{
          "name": "product1",
          "alias": "product1 alias",
          "typeId":2,
          "type":{
          "attributes": {
              "attr1": {
                  "value": "value1",
                  "grants": {
                      "manager": "allow.input"
                  }
              },
              "attr2": {
                  "value": "value2",
                  "grants": {
                      "client": "allow.input"
                  }
              }
          }}
      },
      ...
      ]
 * @example
 * json result example
      [{
        "_id": 2,
        "parentId": -1,
        "name": "product1",
        "fullname": null,
        "alias": null,
        "description": null,
        "data": null,
        "spaceId": 1,
        "circleId": -1,
        "active": null,
        "typeId":2,
        "type":{
        "attributes": [
          {
            "_id": 6,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr1",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "a1",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 40,
                "owner": "ProductAttribute",
                "ownerId": 6,
                "permitId": 64,
                "roleId": 5,
                "spaceId": 1,
                "active": null
              }
            ]
          }},...
        ]
      },
      ....
      ]
 */
export function addProducts(req, res) {
  var query = req.query;
  var body = req.body;

  if (!query.spaceId) {
    return res.status(500).send('please provide spaceId in query');
  }

  return Product.addProducts(req.body, { spaceId: req.query.spaceId })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * @desc {GET http://hostname/api/products/:id[?spaceId=xxx]}
 * 这个函数用来获取某一个产品。如果:id是integer，用id获取product.如果:id是name,同时提供spaceId，
 * 也可以用typename来获取product
 * @param {integer or string} req.params.id[req.query.spaceId]
 * @return {json} json object for product
 * @example
 * GET
 * http://hostname/api/products/5
 * or
 * http://hostname/api/products/product1?spaceId=2
 * type1 is name of type
 * @example
 * json result example
      {
        "_id": 2,
        "parentId": -1,
        "name": "product1",
        "fullname": "product1",
        "alias": null,
        "description": null,
        "data": null,
        "spaceId": 1,
        "circleId": -1,
        "active": null,
        "type":{
        "attributes": [
          {
            "_id": 6,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr1",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "a1",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 40,
                "owner": "ProductAttribute",
                "ownerId": 6,
                "permitId": 64,
                "roleId": 5,
                "spaceId": 1,
                "active": null
              }
            ]
          },
          {
            "_id": 7,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr2",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "v2",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 41,
                "owner": "ProductAttribute",
                "ownerId": 7,
                "permitId": 67,
                "roleId": 13,
                "spaceId": 1,
                "active": null
              }
            ]
          }
        ]}
      }
 */
export function getSaleListProduct(req, res) {
  var id, spaceId;
  if (req.params.id) {
    id = req.params.id;
  }
  if (req.query.spaceId) {
    spaceId = req.query.spaceId;
  }

  if (!isNaN(id) && id > 0) {
    return SaleList.getSaleList(id)
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
      .catch(handleError(res));
  } else if (id && spaceId) {
    return SaleList.getSaleList({
      name: id,
      spaceId: spaceId
    })
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
      .catch(handleError(res));
  } else {
    return res.status(500).send('please provide type id or type name with spaceId');
  }
}

/**
 * @desc {GET http://hostname/api/products?spaceId=xxx}
 * 这个函数用来获取产品的数组。通常提供spaceId来获取机构的所有产品，
 * @param {integer} req.query.spaceId
 * @return {json} json object array for type
 * @example
 * GET
 * http://hostname/api/products?spaceId=2
 * @example
 * json result example
      [{
        "_id": 2,
        "parentId": -1,
        "name": "product1",
        "fullname": null,
        "alias": null,
        "description": null,
        "data": null,
        "spaceId": 1,
        "circleId": -1,
        "active": null,
        "typeId":2,
        "type":{
        "attributes": [
          {
            "_id": 6,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr1",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "a1",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 40,
                "owner": "ProductAttribute",
                "ownerId": 6,
                "permitId": 64,
                "roleId": 5,
                "spaceId": 1,
                "active": null
              }
            ]
          },
          {
            "_id": 7,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr2",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "v2",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 41,
                "owner": "ProductAttribute",
                "ownerId": 7,
                "permitId": 67,
                "roleId": 13,
                "spaceId": 1,
                "active": null
              }
            ]
          }
        ]}
      },
      ...]
 */
export function getSaleLists(req, res) {
  if (req.query && req.query.spaceId) {
    return SaleList.getSaleLists(req.query)
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
      .catch(handleError(res));
  } else {
    res.status(500).send('please provide spaceId');
  }
}

/**
 * @desc {PUT http://hostname/api/products/:id}
 * 这个函数用来更新产品。
 * @param {object} req.body product data for updating
 * @param {integer} req.params.id 属性的id
 * @return {json} json object for new product
 * @example
 * PUT
 * http://hostname/api/products/5
 * req.body example:
      {
          "name": "product_update_1",
          "alias": "product_update_1 alias",
      }
 * @example
 * json result example
      {
        "_id": 2,
        "parentId": -1,
        "name": "product_update_1",
        "fullname": null,
        "alias": "product_update_1 alias",
        "description": null,
        "data": null,
        "spaceId": 1,
        "circleId": -1,
        "active": null,
        "typeId": 2,
        "type":{
        "attributes": [
          {
            "_id": 6,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr1",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "a1",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 40,
                "owner": "ProductAttribute",
                "ownerId": 6,
                "permitId": 64,
                "roleId": 5,
                "spaceId": 1,
                "active": null
              }
            ]
          },
          {
            "_id": 7,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr2",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "v2",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 41,
                "owner": "ProductAttribute",
                "ownerId": 7,
                "permitId": 67,
                "roleId": 13,
                "spaceId": 1,
                "active": null
              }
            ]
          }
        ]}
      }
 */
export function updateSaleList(req, res) {
  var id = req.params.id;
  var body = req.body;

  return SaleList.updateSaleList(req.body, req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * @desc {DELETE http://hostname/api/products/:id}
 * 这个函数用来删除产品。
 * @param {object} req.params.id 
 * @return {result} return true after deleted, otherwise return false
 * @example
 * DELETE
 * http://hostname/api/products/5
 * 
 */
export function deleteSaleList(req, res) {
  SaleList.findById(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

/**
 * @desc {POST http://hostname/api/products/attributes[?owner=xxx&ownerId=xxx]}
 * 这个函数用来创建产品或者type的attribute。函数首先会在数据库中查找，如果发现已经存在，不会操作。
 * 如果没有发现类型，就进行创建。输入中必须包含owner的信息。如果没有在req.body里面提供owner, 则需要在req.query
 * 里面提供
 * @param {object} req.body product data for add new attribute
 * @return {json} json object for new attribute
 * @example
 * POST
 * http://hostname/api/products/attributes[?owner=Product&ownerId=3]
 * or
 * http://hostname/api/products/attributes[?owner=ProductType&ownerId=2]
 * req.body example:
      {
          "name": "attribute1",
          "value": "value1
          "alias": "product1 alias",
          "owner": "Product",
          "ownerId": 3,
          "grants": {
              "manager": "allow.input",
              "client": "allow.access"
          }
      }
 * @example
 * json result example    
          {
            "_id": 6,
            "parentId": -1,
            "owner": "Product",
            "ownerId": 2,
            "name": "attribute1",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "value1",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 40,
                "owner": "ProductAttribute",
                "ownerId": 6,
                "permitId": 64,
                "roleId": 5,
                "spaceId": 1,
                "active": null
              }
            ]
          }      
 */
export function addSaleListAttribute(req, res) {
  var query = req.query;
  var body = req.body;

  if (!query.owner && !req.body.ownerId && req.body.spaceId) {
    return res.status(500).send('please provide owner,ownerId,spaceId in query');
  }

  return SaleListAttribute.addAttribute(
    req.body,
    {
      spaceId: query.spaceId,
      owner: query.owner,
      ownerId: query.ownerId
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * @desc {POST http://hostname/api/products/attributes/batch[?owner=xxx&ownerId=xxx]}
 * 这个函数用来批量创建产品或者type的attribute。函数首先会在数据库中查找，如果发现已经存在，不会操作。
 * 如果没有发现类型，就进行创建。输入中必须包含owner的信息。如果没有在req.body里面提供owner, 则需要在req.query
 * 里面提供
 * @param {object} req.body array of attribute data for adding
 * @return {json} array of json object for new attribute
 * @example
 * POST
 * http://hostname/api/products/attributes/batch[?owner=Product&ownerId=3]
 * or
 * http://hostname/api/products/attributes/batch[?owner=ProductType&ownerId=2]
 * req.body example:
      [{
          "name": "attribute1",
          "value": "value1
          "alias": "product1 alias",
          "owner": "Product",
          "ownerId": 3,
          "grants": {
              "manager": "allow.input",
              "client": "allow.access"
          }
      },...]
 * @example
 * json result example    
          [{
            "_id": 6,
            "parentId": -1,
            "owner": "Product",
            "ownerId": 2,
            "name": "attribute1",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "value1",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 40,
                "owner": "ProductAttribute",
                "ownerId": 6,
                "permitId": 64,
                "roleId": 5,
                "spaceId": 1,
                "active": null
              }
            ]
          },...]      
 */
export function addAttributes(req, res) {
  var query = req.query;
  var body = req.body;

  if (!query.owner && !req.body.ownerId && req.body.spaceId) {
    return res.status(500).send('please provide owner,ownerId,spaceId in query');
  }

  return SaleListAttributes.addAttributes(req.body, { spaceId: req.query.spaceId })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * @desc {GET http://hostname/api/products/attributes/:id[?owner=xxx&ownerId=xxx]}
 * 这个函数用来获取某一个属性。如果:id是integer，用id获取属性.如果:id是name,同时提供owner,ownerId，
 * 也可以用name来获取属性
 * @param {integer or string} req.params.id[req.query.owner,req.query.ownerId]
 * @return {json} json object for attribute
 * @example
 * GET
 * http://hostname/api/products/attributes/5
 * or
 * http://hostname/api/products/attributes/attr1?owner=Product&ownerId=2
 * type1 is name of type
 * @example
 * json result example
          {
            "_id": 6,
            "parentId": -1,
            "owner": "Product",
            "ownerId": 2,
            "name": "attr1",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "a1",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 40,
                "owner": "ProductAttribute",
                "ownerId": 6,
                "permitId": 64,
                "roleId": 5,
                "spaceId": 1,
                "active": null
              }
            ]
          }
 */
export function getSaleListAttribute(req, res) {
  var id, owner,ownerId;
  if (req.params.id) {
    id = req.params.id;
  }
  if (req.query.owner) {
    owner = req.query.owner;
  }
  if (req.query.ownerId) {
    ownerId = req.query.ownerId;
  }

  if (!isNaN(id) && id > 0) {
    return SaleListAttribute.getAttribute(id)
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
      .catch(handleError(res));
  } else if (id && owner && ownerId) {
    return SaleListAttribute.getAttribute({
      name: id,
      owner: owner,
      ownerId: ownerId
    })
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
      .catch(handleError(res));
  } else {
    return res.status(500).send('please provide id or name with owner and ownerId');
  }
}

/**
 * @desc {GET http://hostname/api/products/attributes/[?owner=xxx&ownerId=xxx]}
 * 这个函数用来获取某一个属性。如果:id是integer，用id获取属性.如果:id是name,同时提供owner,ownerId，
 * 也可以用name来获取属性
 * @param {integer or string} req.params.id[req.query.owner,req.query.ownerId]
 * @return {json} json object for attribute
 * @example
 * GET
 * http://hostname/api/products/attributes?owner=Product&ownerId=2
 * @example
 * json result example
          [{
            "_id": 6,
            "parentId": -1,
            "owner": "Product",
            "ownerId": 2,
            "name": "attr1",
            "fullname": null,
            "alias": null,
            "description": null,
            "data": null,
            "value": "a1",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 40,
                "owner": "ProductAttribute",
                "ownerId": 6,
                "permitId": 64,
                "roleId": 5,
                "spaceId": 1,
                "active": null
              }
            ]
          },...]
 */
export function getSaleListAttributes(req, res) {
  if (req.query && req.query.owner && req.query.ownerId) {
    return SaleListAttribute.getAttributes(req.query)
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
      .catch(handleError(res));
  } else {
    res.status(500).send('please provide owner, ownerId');
  }
}

/**
 * @desc {PUT http://hostname/api/products/attributes/:id}
 * 这个函数用来更新属性。
 * @param {object} req.body attribute data for updating
 * @param {integer} req.params.id 属性的id
 * @return {json} json object for new attribute
 * @example
 * PUT
 * http://hostname/api/products/attributes/:id
 * req.body example:
      {
          "value": "attribute_update_1"
      }
 * @example
 * json result example
          {
            "_id": 6,
            "parentId": -1,
            "owner": "ProductType",
            "ownerId": 2,
            "name": "attr1",
            "fullname": null,
            "alias": null,
            "description": null,
            "value": "attribute_update_1,
            "value": "a1",
            "spaceId": 1,
            "circleId": -1,
            "type": "string",
            "active": null,
            "permits": [
              {
                "_id": 40,
                "owner": "ProductAttribute",
                "ownerId": 6,
                "permitId": 64,
                "roleId": 5,
                "spaceId": 1,
                "active": null
              }
            ]
          }
 */
export function updateSaleListAttribute(req, res) {
  var id = req.params.id;
  var body = req.body;

  return SaleListAttribute.updateAttribute(req.body, req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * @desc {DELETE http://hostname/api/products/attributes/:id}
 * 这个函数用来删除属性。
 * @param {object} req.params.id 
 * @return {result} return true after deleted, otherwise return false
 * @example
 * DELETE
 * http://hostname/api/products/attributes/5
 * 
 */
export function deleteSaleListAttribute(req, res) {
  SaleListAttribute.findById(req.params.id)
    .then(function(entity){
      return Promise.resolve(entity);
    })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

/**
 * @ignore
 */
export function index(req, res) {
  Nut.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * @ignore
 */
export function show(req, res) {
  Nut.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * @ignore
 */
export function create(req, res) {

}

/**
 * @ignore
 */
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Nut.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * @ignore
 */
export function destroy(req, res) {
  Nut.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
