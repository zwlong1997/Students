const path=require('path');
const express=require('express');
const multipart=require('connect-multiparty');

let multipartMiddeware=multipart();

var TeacherRouter=express.Router();

var TeacherController=require(path.join(__dirname,"../controllers/TeacherController"));

//教师列表
TeacherRouter.get('/teacherList',TeacherController.teacherList);

module.exports=TeacherRouter;