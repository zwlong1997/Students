const path = require('path');
const express = require('express');
const multipart=require('connect-multiparty');

let multipartMiddeware=multipart();

var ActionRouter = express.Router();

var ActionController = require(path.join(__dirname,"../controllers/ActionController.js"));

//列表
ActionRouter.get('/actionList',ActionController.actionList);


//添加权限
ActionRouter.get('/actionAdd',ActionController.actionAdd);

ActionRouter.post('/actionAdd',ActionController.actionAddForm);

//编辑权限
ActionRouter.get('/actionEdit',ActionController.actionEdit);

ActionRouter.post('/actionEdit',ActionController.actionEditForm);

//删除权限
ActionRouter.get('/actionDelete',ActionController.actionDelete);


module.exports=ActionRouter;