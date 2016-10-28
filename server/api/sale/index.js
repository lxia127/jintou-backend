'use strict';

var express = require('express');
var controller = require('./product.controller');

var router = express.Router();

//for attributes
router.get('/attributes', controller.getAttributes);
router.get('/attributes/:id', controller.getAttribute);
router.post('/attributes', controller.addAttribute);
router.post('/attributes/batch', controller.addAttributes);
router.put('/attributes/:id', controller.updateAttribute);
router.delete('/attributes/:id', controller.deleteAttribute);

//for types
router.get('/types', controller.getTypes);
router.get('/types/:id', controller.getType);
router.post('/types', controller.addType);
router.post('/types/batch', controller.addTypes);
router.put('/types/:id', controller.updateType);
router.delete('types/:id', controller.deleteType);

//default function for voucher table
router.get('/', controller.getProducts);
router.get('/:id', controller.getProduct);
router.post('/', controller.addProduct);
router.post('/batch', controller.addProducts);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);


module.exports = router;
