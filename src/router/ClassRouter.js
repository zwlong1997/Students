const path = require('path');
const express = require('express');
const multipart=require('connect-multiparty');

let multipartMiddeware=multipart();

var ClassRouter = express.Router();

var ClassController = require(path.join(__dirname,"../controllers/ClassController.js"));

//列表
ClassRouter.get('/ClassList',ClassController.classList);


//添加班级
ClassRouter.get('/ClassAdd',ClassController.classAdd);

ClassRouter.post('/ClassAdd',ClassController.classAddForm);

//编辑班级
ClassRouter.get('/ClassEdit',ClassController.classEdit);

ClassRouter.post('/ClassEdit',ClassController.classEditForm);

//删除班级
ClassRouter.get('/ClassDelete',ClassController.classDelete);


module.exports=ClassRouter;