'use strict';

var express = require('express');
var controller = require('./wechat.controller');

var router = express.Router();


router.get('/wechatOauthRedirect', controller.wechatOauthRedirect);
router.get('/wechatLogin', controller.wechatLogin);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
