'use strict';

var express = require('express');
var slController = require('./saleList.controller');

var router = express.Router();

//for saleList attributes
router.get('/saleLists/attributes', slController.getAttributes);
router.get('/saleLists/attributes/:id', slController.getAttribute);
router.post('/saleLists/attributes', slController.addAttribute);
router.post('/saleLists/attributes/batch', slController.addAttributes);
router.put('/saleLists/attributes/:id', slController.updateAttribute);
router.delete('/saleLists/attributes/:id', slController.deleteAttribute);

//for saleList types
router.get('/saleLists/types', slController.getTypes);
router.get('/saleLists/types/:id', slController.getType);
router.post('/saleLists/types', slController.addType);
router.post('/saleLists/types/batch', slController.addTypes);
router.put('/saleLists/types/:id', slController.updateType);
router.delete('saleLists/types/:id', slController.deleteType);

//default function for saleList table
router.get('/saleLists', slController.getSaleLists);
router.get('/saleLists/:id', slController.getSaleLists);
router.post('/saleLists', slController.addSaleList);
router.post('/saleLists/batch', slController.addSaleLists);
router.put('/saleLists/:id', slController.updateSaleList);
router.delete('/saleLists/:id', slController.deleteSaleList);


module.exports = router;
