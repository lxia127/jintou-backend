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
import {ProductType} from '../../sqldb';
import {Product} from '../../sqldb';
import {ProductAttribute} from '../../sqldb';

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
 * method: POST
 * url: /api/products/types
 * 描述：这个函数用来创建新的产品类型。函数首先会在数据库中查找，如果发现已经存在，不会操作
 * 如果没有发现类型，就进行创建
 * 输入：
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
 * 输出：
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
export function addType(req, res) {
  var query = req.query;
  var body = req.body;

  if (!query.spaceId) {
    return res.status(500).send('please provide spaceId in query');
  }

  return ProductType.addType(req.body,{spaceId:query.spaceId})
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * method: POST
 * url:/api/products/types/batch
 * 输入：addType输入的数组，参考addType的输入
 * 输出：addType 函数输出的数组，参考 addType 输出
 * 说明：批量添加types
 */
export function addTypes(req, res) {
  var query = req.query;
  var body = req.body;

  if (!query.spaceId) {
    return res.status(500).send('please provide spaceId in query');
  }

  return ProductType.addTypes(req.body, {spaceId: req.query.spaceId})
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getType(req, res){
  var id, spaceId;
  if(req.params.id){
    id = req.params.id;
  }
  if(req.query.spaceId){
    spaceId = req.query.spaceId;
  }

  if(!isNaN(id) && id > 0){
    return ProductType.getType(id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
  } else if(id && spaceId){
    return ProductType.getType({
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

export function getTypes(req, res){
  if(req.query && req.query.spaceId){
    return ProductType.getTypes(req.query)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
  } else {
    res.status(500).send('please provide spaceId');
  }
}

export function updateType(req, res){
  var id = req.params.id;
  var body = req.body;

  return ProductType.updateType(req.body,req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function deleteType(req, res){
  ProductType.findById(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

/**
 * method: POST
 * url: /api/products/types
 * 描述：这个函数用来创建新的产品类型。函数首先会在数据库中查找，如果发现已经存在，不会操作
 * 如果没有发现类型，就进行创建
 * 输入：
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
 * 输出：
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
export function addProduct(req, res) {
  var query = req.query;
  var body = req.body;

  if (!query.spaceId && !req.body.spaceId) {
    return res.status(500).send('please provide spaceId in query');
  }

  return Product.addProduct(req.body,{spaceId:query.spaceId})
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * method: POST
 * url:/api/products/types/batch
 * 输入：addType输入的数组，参考addType的输入
 * 输出：addType 函数输出的数组，参考 addType 输出
 * 说明：批量添加types
 */
export function addProducts(req, res) {
  var query = req.query;
  var body = req.body;

  if (!query.spaceId) {
    return res.status(500).send('please provide spaceId in query');
  }

  return Product.addProducts(req.body, {spaceId: req.query.spaceId})
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getProduct(req, res){
  var id, spaceId;
  if(req.params.id){
    id = req.params.id;
  }
  if(req.query.spaceId){
    spaceId = req.query.spaceId;
  }

  if(!isNaN(id) && id > 0){
    return Product.getProduct(id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
  } else if(id && spaceId){
    return Product.getProduct({
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

export function getProducts(req, res){
  if(req.query && req.query.spaceId){
    return Product.getProducts(req.query)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
  } else {
    res.status(500).send('please provide spaceId');
  }
}

export function updateProduct(req, res){
  var id = req.params.id;
  var body = req.body;

  return Product.updateProduct(req.body,req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function deleteProduct(req, res){
  Product.findById(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Gets a list of Nuts
export function index(req, res) {
  Nut.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Nut from the DB
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

export function create(req, res) {
  
}

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

// Deletes a Nut from the DB
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

export function findOrCreate(req, res) {

}
