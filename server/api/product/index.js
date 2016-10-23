'use strict';

var express = require('express');
var controller = require('./product.controller');

var router = express.Router();

//for types
router.get('/types', controller.getTypes);
router.get('/types/:id', controller.getType);
router.post('/types', controller.addType);
router.post('/types/batch', controller.addTypes);

//default function for voucher table
router.get('/', controller.getProducts);
router.get('/:id', controller.getProduct);
router.post('/', controller.addProduct);
router.post('/batch', controller.addProducts);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);




module.exports = router;
