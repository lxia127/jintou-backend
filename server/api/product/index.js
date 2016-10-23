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
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);




module.exports = router;
