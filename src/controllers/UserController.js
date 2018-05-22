'use strict';

const xtpl = require('xtpl');
const path = require('path');
const md5 = require('md5');
const captchapng = require('captchapng');
const db = require(path.join(__dirname,'../config/config'));
const CommonHelper = require(path.join(__dirname,"../helpers/commonHelpers"));
const fs = require('fs');


module.exports.userList = function(req,res)
{
    CommonHelper.isLogin(req,res);
    //当前页码值
    const page = parseInt(req.query.page) || 1;

    //每页显示多少条
    const limit = 12;

    //偏移量
    const start = (page-1)*limit;

    let where = 10;

    db.table('user').where(where).count('*').then(function(count){

        //总页数
        const totalPage = count % limit == 0 ? count/limit : parseInt(count/limit)+1;

        const totalPageArray = [];

        //分页
        for(var i=1;i<=totalPage;i++)
        {
            totalPageArray.push(i);
        }

        //查询数据
        db.table('user').alias('user').join({
            table: 'usertype',
            join: 'left',
            as: 'type',
            on: ['type_id', 'type_id']
        }).where(where).order('user.user_id DESC').limit(start,limit).select().then(function(user_list){

            let data = {
                array:user_list,
                count:count,
                totalPageArray:totalPageArray,
                page:page,
                totalPage:totalPage
            };

            CommonHelper.renderFile(req,res,"userList.html",data);
        });


    });
};

module.exports.userAdd=function(req,res){
    db.table('usertype').select().then(function(result)
    {
        db.table('school').select().then(function(school)
        {
            db.table('class').select().then(function(class_list)
            {
                let Data={
                    "type_list":result,
                    "school_list":school,
                    "class_list":class_list
                };
                CommonHelper.renderFile(req,res,"userAdd.html",Data);
            });
        });
        
    });
}

module.exports.userAddForm=function(req,res)
{
    //先检测一下 该用户是否存在
    let user_name=req.body.user_name;
    db.table('user').where(`user_name = '${user_name}'`).find().then(function(data){
        if(JSON.stringify(data) != "{}")
        {
            res.setHeader("Content-Type","text/html;charset=utf-8");
            res.end("<script>alert('该用户已被添加');location.href='/user/userAdd';</script>");
        }else{
            data={
                "user_name":req.body.user_name,
                "user_pwd":md5(req.body.user_pwd),
                "user_email":req.body.user_email,
                "user_time":Date.now(),
                "user_sex":req.body.user_sex,
                "user_address":req.body.user_address,
                "user_phone":req.body.user_phone,
                "type_id":req.body.type_id
            }

            if(req.files.user_img.size>0)
            {
                data.user_img=req.files.user_img.path.replace("assets","");
            }else{
                data.user_img="";
            }

            db.table('user').add(data).then(function(insertId)
            {
                if(insertId)
                {
                    if(data.type_id == 2)//教师
                    {
                        let teacher_data={
                            "teach_name":req.body.teach_name,
                            "school_id":req.body.school_id,
                            "user_id":insertId
                        }
                        
                        db.table('teacher').add(teacher_data).then(function(teacherIntert)
                        {
                            if(teacherIntert)
                            {
                                res.redirect(`/user/userList`);
                                return false;
                            }else{
                                res.redirect(`/user/userAdd`);
                                return false;
                            }
                        })
                    }else if(data.type_id == 3)//学生
                    {
                        let student_data={
                            "stu_name":req.body.stu_name,
                            "stu_number":"00"+req.body.school_id+"11"+req.body.class_id+"22"+insertId,
                            "school_id":req.body.school_id,
                            "class_id":req.body.class_id,
                            "user_id":insertId
                        }

                        db.table('student').add(student_data).then(function(studentInsert)
                        {
                            if(studentInsert)
                            {
                                res.redirect(`/user/userList`);
                                return false;
                            }else{
                                res.redirect(`/user/userAdd`);
                                return false;
                            }
                        });
                    }else{//管理员
                        res.redirect(`/user/userList`);
                        return false;
                    }
                }else{
                    res.redirect(`/user/userAdd`);
                    return false;
                }
            });
        }
    })
}

module.exports.userEdit=function(req,res)
{
    let user_id=req.query.user_id;
    if(!user_id)
    {
        res.redirect('/user/userList');
        return false;
    }

    db.table('user').where(`user_id = ${user_id}`).find().then(function(user)
    {
        db.table('usertype').select().then(function(type_list)
        {
            db.table('school').select().then(function(school)
            {
                db.table('class').select().then(function(class_list)
                {
                    db.table('user').alias('user').join({
                        table: 'student',
                        join: 'left',//left, right, inner三种方式
                        as: 'student', //表别名
                        on: ['user_id', 'user_id'] //ON 条件
                    }).where(`user.user_id = ${user_id}`).find().then(function(student)
                    {
                        db.table('user').alias('user').join({
                            table:'teacher',
                            join:'left',
                            as:'teacher',
                            on:['user_id','user_id']
                        }).where(`user.user_id = ${user_id}`).find().then(function(teacher)
                        {
                            if(user.type_id == 2)
                            {
                                let Data={
                                    "user":user,
                                    "type_list":type_list,
                                    "school_list":school,
                                    "class_list":class_list,
                                    "student_list":student,
                                    "teacher_list":teacher,
                                    "user_school":teacher
                                };
                                console.log(Data.school_list);
                                
                                CommonHelper.renderFile(req,res,'userEdit.html',Data);

                            }
                            if(user.type_id == 3)
                            {
                                let Data={
                                    "user":user,
                                    "type_list":type_list,
                                    "school_list":school,
                                    "class_list":class_list,
                                    "student_list":student,
                                    "teacher_list":teacher,
                                    "user_school":student
                                };
                                console.log(Data.school_list);
                                
                                CommonHelper.renderFile(req,res,'userEdit.html',Data);

                            }

                            
                        })
                         
                    })
                       
                })
            })
            
        });
    });
};

module.exports.userEditForm=function(req,res)
{
    let user_id=req.query.user_id;
    if(!user_id)
    {
        res.redirect('/user/userList');
        return false;
    }

    db.table('user').where(`user_id = ${user_id}`).find().then(function(user)
    {
        let data={
            "user_email":req.body.user_email,
            "user_sex":req.body.user_sex,
            "user_address":req.body.user_address,
            "user_phone":req.body.user_phone,
            "type_id":req.body.type_id
        }

        if(req.body.user_pwd!= "")
        {
            data.user_pwd=md5(req.body.user_pwd);
        }

        if(req.files.user_img.size>0)
        {
            let user_old=fs.statSync(path.join("assets",user.user_img.replace('assets','')));
            user_old.isFile() && fs.unlinkSync(path.join("assets",user.user_img.replace('assets','')));
            data.user_img=req.files.user_img.path.replace('assets','');
        }

        db.table('user').where(`user_id = ${user_id}`).update(data).then(function(affectId)
        {
            if(affectId)
            {
                res.redirect(`/user/userList`);
                return false;
            }else{
                res.redirect(`/user/userEdit?user_id=${user_id}`);
                return false;
            }
        })
    })
}

module.exports.userAction = function(req,res)
{
    let user_id = req.query.user_id;

    if(!user_id)
    {
        //重定向
        res.redirect(`/user/userList`);
        return false;
    }

    db.table('user').where(`user_id = ${user_id}`).find().then(function(user){
        db.table('user_action').select().then(function(result){

            //将用户权限转化为数组
            let user_action = user.user_action.split(",");

            let action_list = [];
            for(var item in result)
            {
                if(CommonHelper.inArray(user_action,result[item].action_name_en))
                {
                    result[item].checked = true;
                }else{
                    result[item].checked = false;
                }

                if(result[item].parent_id == 0)
                {
                    //顶级权限
                    action_list.push(result[item]);
                }

                //顶级权限
                for(var key in action_list)
                {

                    if(action_list[key].action_id == result[item].parent_id)
                    {
                        if(!action_list[key]['son'])
                        {
                            action_list[key]['son']=[];
                        }

                        action_list[key]['son'].push(result[item]);

                    }
                }
            }


            let Data = {
                "user":user,
                "action_list":action_list,
                "user_action":user_action,
            };

            CommonHelper.renderFile(req,res,"userAction.html",Data);
        });
    });
};

module.exports.userActionForm=function(req,res)
{
    let user_id=req.query.user_id;
    let user_action=req.body.user_action || false;

    if(!user_id)
    {
        res.redirect(`/user/userList`);
        return false;
    }

    if(user_action)
    {
        let data={
            "user_action":user_action.join(',')
        };

        db.table('user').where(`user_id = ${user_id}`).find().then(function(user)
        {
            db.table('user').where(`user_id = ${user_id}`).update(data).then(function(affectId)
            {
             if(affectId)
             {
                if(user_id == req.session.user.user_id)
                {
                    req.session.user.user_action=user_action.join(',');
                }
                res.redirect('/user/userList');
                return false;
             }else{
                res.redirect(`/user/userAction?user_id=${user_id}`);
                return false;
             }
            })
        });
        
    }
}

module.exports.userDelete=function(req,res)
{
    let delete_id=req.query.delete_id;
        db.table('user').where(`user_id = ${delete_id}`).find().then(function(user)
        {
           if(user.type_id == 2)
           {
                db.table('user').where(`user_id = ${delete_id}`).delete().then(function(userRows)
                {
                    db.table('teacher').where(`user_id = ${delete_id}`).delete().then(function(teacherRows)
                    {
                        if(teacherRows)
                        {
                            res.redirect(`/user/userList`);
                            return false;
                        }else{
                            res.redirect(`/user/userList`);
                            return false;
                        }
                    })
                })
           }

           else if(user.type_id == 3)
           {
                db.table('user').where(`user_id = ${delete_id}`).delete().then(function(userRows)
                {
                    db.table('student').where(`user_id = ${delete_id}`).delete().then(function(studentRows)
                    {
                        if(studentRows)
                        {
                            res.redirect(`/user/userList`);
                            return false;
                        }else{
                            res.redirect(`/user/userList`);
                            return false;
                        }
                    })
                })
           }

        })
}