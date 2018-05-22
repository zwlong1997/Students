const path=require('path');
const express=require('express');
const multipart=require('connect-multiparty');

let multipartMiddeware=multipart();

var StudentRouter=express.Router();

var StudentController=require(path.join(__dirname,"../controllers/StudentController"));

//学生列表
StudentRouter.get('/studentList',StudentController.studentList);

module.exports=StudentRouter;