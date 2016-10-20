'use strict';

var express = require('express');
var controller = require('./product.controller');

var router = express.Router();

//default function for voucher table
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.get('/types', controller.getTypes);
router.get('/types/:id', controller.getType);
router.post('/types', controller.addType);


module.exports = router;
