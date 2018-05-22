const path = require('path');
const express = require('express');
const multipart = require('connect-multiparty');

let app = express();

//调用上传文件模块
let mutipartMiddeware = multipart();  //调用模块

//设置文件的上传目录
app.use(multipart({uploadDir:"assets/uploads/"}));


//构建
const UserRouter = express.Router();

//引入控制器
const UserController = require(path.join(__dirname,"../controllers/UserController"));


//账号列表页面
UserRouter.get('/userList',UserController.userList);

//账号添加页面
UserRouter.get('/userAdd',UserController.userAdd);

UserRouter.post('/userAdd',mutipartMiddeware,UserController.userAddForm);

//账号编辑页面
UserRouter.get('/userEdit',UserController.userEdit);

UserRouter.post('/userEdit',mutipartMiddeware,UserController.userEditForm);

//权限修改
UserRouter.get('/UserAction',UserController.userAction);

UserRouter.post('/UserAction',UserController.userActionForm);


//账号删除页面
UserRouter.get('/userDelete',UserController.userDelete);

module.exports = UserRouter;