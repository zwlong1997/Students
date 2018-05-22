const path = require('path');
const HomeRouter = require(path.join(__dirname,"HomeRouter"));
const UserRouter = require(path.join(__dirname,"UserRouter"));
const SchoolRouter=require(path.join(__dirname,"SchoolRouter"));
const StudentRouter=require(path.join(__dirname,"StudentRouter"));
const TeacherRouter=require(path.join(__dirname,"TeacherRouter"));
const ClassRouter=require(path.join(__dirname,"ClassRouter"));
const ActionRouter=require(path.join(__dirname,"ActionRouter"));
const WeeklyRouter=require(path.join(__dirname,"WeeklyRouter"));
const ProjectRouter=require(path.join(__dirname,"ProjectRouter"));
const ScoreRouter=require(path.join(__dirname,"ScoreRouter"));
const StuProRouter=require(path.join(__dirname,"StuProRouter"));

function Router(app)
{
  //主路由
  app.get('/',function(req,res){

      if(req.url == '/home/login' || req.url == '/home/logout')
      {
          next();  //跳过
      }else{
          if(!req.session.user)  //没有登录就跳转到登录界面
          {
              //重定向
              res.redirect(`/home/login`);
          }
      }

      // res.redirect(`/home/index`);
  });

  //后台首页路由
  app.use('/home',HomeRouter);

  //账号路由
  app.use('/user',UserRouter);

  //学校路由
  app.use('/school',SchoolRouter);

  //学生路由
  app.use('/student',StudentRouter);

  //教师路由
  app.use('/teacher',TeacherRouter);

  //班级路由
  app.use('/class',ClassRouter);

  //权限路由
  app.use('/action',ActionRouter);

  //周记路由
  app.use('/weekly',WeeklyRouter);

  //课程路由
  app.use('/project',ProjectRouter);

  //分数路由
  app.use('/score',ScoreRouter);

  //学生关系路由
  app.use('/stupro',StuProRouter);
}


module.exports = Router;