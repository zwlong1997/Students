const path = require('path');
const express = require('express');
const multipart=require('connect-multiparty');

let multipartMiddeware=multipart();

var ProjectRouter = express.Router();

var ProjectController = require(path.join(__dirname,"../controllers/ProjectController.js"));

//列表
ProjectRouter.get('/projectList',ProjectController.projectList);


// 添加课程
ProjectRouter.get('/projectAdd',ProjectController.projectAdd);

ProjectRouter.post('/projectAdd',ProjectController.projectAddForm);

//编辑课程
ProjectRouter.get('/projectEdit',ProjectController.projectEdit);

ProjectRouter.post('/projectEdit',ProjectController.projectEditForm);

//删除课程
ProjectRouter.get('/projectDelete',ProjectController.projectDelete);


module.exports=ProjectRouter;