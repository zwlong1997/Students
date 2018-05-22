const path = require('path');
const express = require('express');
const multipart=require('connect-multiparty');

let multipartMiddeware=multipart();

var WeeklyRouter = express.Router();

var WeeklyController = require(path.join(__dirname,"../controllers/WeeklyController.js"));

//列表
WeeklyRouter.get('/weeklyList',WeeklyController.weeklyList);


// 添加周记
WeeklyRouter.get('/weeklyAdd',WeeklyController.weeklyAdd);

WeeklyRouter.post('/weeklyAdd',WeeklyController.weeklyAddForm);

//编辑周记
WeeklyRouter.get('/weeklyEdit',WeeklyController.weeklyEdit);

WeeklyRouter.post('/weeklyEdit',WeeklyController.weeklyEditForm);

//删除周记
WeeklyRouter.get('/weeklyDelete',WeeklyController.weeklyDelete);


module.exports=WeeklyRouter;