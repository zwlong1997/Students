const path = require('path');
const express = require('express');
const multipart=require('connect-multiparty');

let multipartMiddeware=multipart();

var ScoreRouter = express.Router();

var ScoreController = require(path.join(__dirname,"../controllers/ScoreController.js"));

//列表
ScoreRouter.get('/scoreList',ScoreController.scoreList);


//添加分数
ScoreRouter.get('/scoreAdd',ScoreController.scoreAdd);

ScoreRouter.post('/scoreAdd',ScoreController.scoreAddForm);

//编辑分数
ScoreRouter.get('/scoreEdit',ScoreController.scoreEdit);

ScoreRouter.post('/scoreEdit',ScoreController.scoreEditForm);

//删除分数
ScoreRouter.get('/scoreDelete',ScoreController.scoreDelete);


module.exports=ScoreRouter;