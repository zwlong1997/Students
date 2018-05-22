'use strict';

const xtpl = require('xtpl');
const path = require('path');
const md5 = require('md5');
const captchapng = require('captchapng');
const db = require(path.join(__dirname,'../config/config'));
const commonHelper=require(path.join(__dirname,'../helpers/commonHelpers.js'));
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const wellknown = require("nodemailer-wellknown");
const config = wellknown("163");   //所选择的第三方服务

config.auth = {
    user:'13113738378@163.com',  //邮件账号
    pass:'zwl6661294'   //这里密码不是qq,163密码，是你设置的smtp授权密码
}

//创建一个邮件发送的服务 是基于smtp
var transporter = nodemailer.createTransport(smtpTransport(config));


module.exports.index = function(req,res)
{
   db.table('project').count('pro_id').then(function(project_count){
       db.table('teacher').count('teach_id').then(function(teacher_count){
            db.table('student').count('stu_id').then(function(student_count){
                db.table('weekly').count('weekly_id').then(function(weekly_count){

                    let data={
                        "project_count":project_count,
                        "teacher_count":teacher_count,
                        "student_count":student_count,
                        "weekly_count":weekly_count
                    }
                    commonHelper.renderFile(req,res,"index.html",data);

                });
            });
       })
   });

};

//登录方法
module.exports.login = function(req,res)
{
    if(req.query)
    {
        let action=req.query.action;
        if(action)
        {
            res.end("<script>alert('验证成功');location.href='/home/login';</script>");
        }
    }
    
    xtpl.renderFile(
        path.join(__dirname,"../views/login.html"),
        {},
        function(err,content)
        {
            if(err)
            {
                console.log(err);
                return false;
            }

            // res.setHeader("Content-Type","text/html;charset=utf-8");
            res.end(content);
        }
    );
};

//登录提交数据
module.exports.saveLogin = function(req,res)
{
    let result = {status:1,message:"登录成功"};
    let user_name = req.body.user_name;
    let vcode = req.body.vcode;
    let user_pwd = md5(req.body.user_pwd);


    //判断验证码是否正确
    if(req.session.vcode != vcode)
    {
        result.status=0;
        result.message="验证码错误";
        res.json(result);
        return false;
    }

    db.table("user").where(`user_name = '${user_name}' AND user_pwd = '${user_pwd}'`).find().then(function(data){
        console.log(data);
        if(data)
        {
            data.user_pwd = null;
            req.session.user = data;
            res.json(result);
            console.log(result);
            return false;
        }else{
            result.status=0;
            result.message="登录失败";
            res.json(result);
            console.log(result);
            return false;
        }
    });
};

//验证码方法
module.exports.getVcodeImage = function(req,res)
{
    var vcode = parseInt(Math.random()*9000+1000);
    var p = new captchapng(80,30,vcode);
    p.color(0,0,0,0);
    p.color(80,80,80,255);
    req.session.vcode = vcode;

    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');
    res.writeHead(200,{
        'Content-Type':'image/png'
    });
    res.end(imgbase64);
};

//退出登录
module.exports.logout=function(req,res)
{
    req.session.user=null;
    res.redirect(`/home/login`);
    return false;
}

//找回密码方法
module.exports.forgot=function(req,res)
{
    let email=req.query.email;
    if(!email)
    {
        res.redirect(`/home/login`);
        return false;
    }

    var mailOptions = {
        from:"13113738378@163.com",   //发送方的邮件地址
        to:email,    //收件人的邮件地址
        subject:"学生验证",  //邮件主题
        text:"text plain",    //邮件文档类型
        html:"<div><a href='http://127.0.0.1:3000/home/login?action=yanzheng'>点击该链接进行验证</a></div>"   //邮件正文内容
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

    });
}