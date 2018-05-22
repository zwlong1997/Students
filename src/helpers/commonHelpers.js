const path = require('path');
const xtpl = require('xtpl');
const db = require(path.join(__dirname,'../config/config'));
const moment = require('moment');

module.exports.isLogin=function(req,res)
{
    if(!req.session.user)
    {
        res.redirect(`/home/login`);
        return false;
    }
}


module.exports.renderFile = function(req,res,Template,Data={})
{
    db.table('user_action').where({action_name_en:['LIKE','%List']}).select().then(function(menu)
    {

        if(JSON.stringify(menu) != "{}")
        {
            for(item in menu)
            {
                menu[item].action_url=menu[item].action_name_en.replace("List","");
            }
        }
    Data.moment = moment;
    Data.menu = menu;
    //验证当前用户是否有权限显示
    Data.checkAction = function(ActionName)
    {
        let userActions = req.session.user.user_action.split(',');
        if(exports.inArray(userActions,ActionName))
        {
            return true;
        }else{
            return false;
        }
    };

    xtpl.renderFile(
        path.join(__dirname,`../views/${Template}`),
        Data,
        function(err,content)
        {
            if(err)
            {
                console.log(err);
                return false;
            }

            res.setHeader("Content-Type","text/html;charset=utf-8");
            res.end(content);
        }
    );
});
};

//判断是否包含在数组内
module.exports.inArray = function(arr,obj)
{
    let i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
};

