/**
 * Main application file
 */

'use strict';

import express from 'express';
import sqldb from './sqldb';
import config from './config/environment';
import http from 'http';
//import httpProxy from 'http-proxy';

// Populate databases with sample data
if (config.seedDB) { require('./config/seed'); }

// //wechat oauth

// var appid = "wx45a1e16368ad52ba";
// var appsecret = "049b70db6cba1b801fc66fa8a73413fc";

// var OAuth = require('wechat-oauth');
// var client = new OAuth(appid,appsecret);

// var oauthApi = new OAuth(appid, appsecret, function (openid, callback) {
//   // 传入一个根据openid获取对应的全局token的方法
//   // 在getUser时会通过该方法来获取token
//   fs.readFile(openid +':access_token.txt', 'utf8', function (err, txt) {
//     if (err) {return callback(err);}
//     callback(null, JSON.parse(txt));
//   });
// }, function (openid, token, callback) {
//   // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
//   // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
//   // 持久化时请注意，每个openid都对应一个唯一的token!
//   fs.writeFile(openid + ':access_token.txt', JSON.stringify(token), callback);
// });

// var url = client.getAuthorizeURL('http://f9413b46.ngrok.io', '1', 'snsapi_userinfo');

// client.getAccessToken('code', function (err, result) {
//   var accessToken = result.data.access_token;
//   var openid = result.data.openid;
// });

// client.getUser(openid, function (err, result) {
//   var userInfo = result;
// });
// Setup server
var app = express();
var server = http.createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('wah Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

sqldb.sequelize.sync()
  .then(startServer)
  .catch(function(err) {
    console.log('Server failed to start due to error: %s', err);
  });

// Expose app
exports = module.exports = app;
