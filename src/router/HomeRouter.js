const path = require('path');
const express = require('express');


//构建
const HomeRouter = express.Router();

//引入控制器
const HomeController = require(path.join(__dirname,"../controllers/HomeController"));


//主页面
HomeRouter.get('/index',HomeController.index);

//登录界面
HomeRouter.get('/login',HomeController.login);

//登录界面的提交
HomeRouter.post('/login',HomeController.saveLogin);

//验证码
HomeRouter.get('/vcode',HomeController.getVcodeImage);

//退出登录
HomeRouter.get('/logout',HomeController.logout);

//邮箱验证
HomeRouter.get('/forgot',HomeController.forgot);

module.exports = HomeRouter;