const path = require('path');
const express = require('express');
const multipart=require('connect-multiparty');

let multipartMiddeware=multipart();

var SchoolRouter = express.Router();

var SchoolController = require(path.join(__dirname,"../controllers/SchoolController.js"));

//列表
SchoolRouter.get('/schoolList',SchoolController.schoolList);

//学校添加
SchoolRouter.get('/schoolAdd',SchoolController.schoolAdd);

SchoolRouter.post('/schoolAdd',multipartMiddeware,SchoolController.schoolAddForm);

//学校编辑
SchoolRouter.get('/schoolEdit',SchoolController.schoolEdit);

SchoolRouter.post('/schoolEdit',multipartMiddeware,SchoolController.schoolEditForm);

//学校删除
SchoolRouter.get('/schoolDelete',SchoolController.schoolDelete);

module.exports=SchoolRouter;