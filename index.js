var express = require('express'),
    opn = require('opn'),
    moment = require('moment'),
    md5 = require('md5'),
    multipart = require('connect-multiparty'),
    xtpl = require('xtpl'),
    session = require('express-session'),
    path = require('path'),
    bodyParser = require('body-parser'),
    Router = require(path.join(__dirname,"./src/router/index"));


//入口配置
const PORT = 3000;


//创建应用
let app = express();

//调用上传文件模块
let mutipartMiddeware = multipart();  //调用模块

//设置文件的上传目录
app.use(multipart({uploadDir:"assets/uploads/"}));

//静态文件目录设置
app.use(express.static('assets'));


//设置body-parser
app.use(bodyParser.urlencoded({extended:false}));


//将session 设置 app的应用当中
app.use(session({secret:'h1705',cookie:{maxAge:6000000},rolling:true,resave:false,saveUninitialized:true}));


//设置路由
Router(app);

app.listen(PORT,function(err){
  if(err)
  {
    console.log(err);
    return false;
  }

  console.log('程序已启动');
  // opn();
});
