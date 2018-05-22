const path = require('path');
const express = require('express');
const multipart=require('connect-multiparty');

let multipartMiddeware=multipart();

var StuProRouter = express.Router();

var StuProController = require(path.join(__dirname,"../controllers/StuProController.js"));

//列表
StuProRouter.get('/stuproList',StuProController.stuproList);


// 添加学生关系
StuProRouter.get('/stuproAdd',StuProController.stuproAdd);

StuProRouter.post('/stuproAdd',StuProController.stuproAddForm);

//编辑学生关系
StuProRouter.get('/stuproEdit',StuProController.stuproEdit);

StuProRouter.post('/stuproEdit',StuProController.stuproEditForm);

//删除学生关系
StuProRouter.get('/stuproDelete',StuProController.stuproDelete);


module.exports=StuProRouter;