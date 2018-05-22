'use strict';

const path=require('path');
const xtpl=require('xtpl');
const md5=require('md5');
const captchapng=require('captchapng');
const db=require(path.join(__dirname,'../config/config'));
const CommonHelper=require(path.join(__dirname,'../helpers/commonHelpers'));

module.exports.actionList=function(req,res)
{
	const page=parseInt(req.query.page) || 1;

	const limit=12;

	const start=(page-1)*limit;


	db.table('user_action').count('*').then(function(count){

		const totalPage=count % limit == 0 ? count / limit : parseInt(count / limit)+1;

		const totalPageArray = [];

		for(var i=1;i<=totalPage;i++)
		{
			totalPageArray.push(i);
		} 
		console.log(totalPageArray);

		//查询数据
		db.table('user_action').order('action_id DESC').limit(start,limit).select().then(function(action_list)
		{
				let data={
					array:action_list,
					count:count,
					totalPageArray:totalPageArray,
					page:page,
					totalPage:totalPage
				}
				CommonHelper.renderFile(req,res,"actionList.html",data);
		})
	})
}

module.exports.actionAdd=function(req,res)
{

	CommonHelper.renderFile(req,res,"actionAdd.html");
}

module.exports.actionAddForm=function(req,res)
{
	let data={
		"action_name_zh":req.body.action_name_zh,
		"action_name_en":req.body.action_name_en,
		"parent_id":req.body.parent_id
	};


	db.table('user_action').add(data).then(function(insertId)
	{
		if(insertId)
		{
			res.redirect('/action/actionList');
			return false;
		}else{
			res.redirect('/action/actionAdd');
			return false;
		}
	})

}

// 学校编辑
module.exports.actionEdit=function(req,res)
{
	let action_id=req.query.action_id;
	if(!action_id)
	{
		res.redirect('action/actionList');
		return false;
	}

	db.table('user_action').where(`action_id = ${action_id}`).find().then(function(action_list)
	{
			let data={
				"action_list":action_list,
			}
			CommonHelper.renderFile(req,res,"actionEdit.html",data);
	})
}

module.exports.actionEditForm=function(req,res)
{
	let action_id=req.query.action_id;
	if(!action_id)
	{
		res.redirect('/action/actionList');
		return false;
	}

	let data={
		"action_name_zh":req.body.action_name_zh,
		"action_name_en":req.body.action_name_en,
		"parent_id":req.body.parent_id
	}

	db.table('user_action').where(`action_id = ${action_id}`).update(data).then(function(affectRow)
	{
		if(affectRow)
		{
			res.redirect(`/action/actionList`);
			return false;
		}else{
			res.redirect(`/action/actionEdit?action_id=${action_id}`);
			return false;
		}
	})
	
}

// 删除学校
module.exports.actionDelete=function(req,res)
{
	let delete_id=req.query.action_id;
	if(!delete_id)
	{
		res.redirect(`/action/actionList`);
		return false;
	}
	db.table('user_action').where(`action_id = ${delete_id}`).delete().then(function(affectRow)
	{
		if(affectRow)
		{
			res.redirect(`/action/actionList`);
			return false;
		}else{
			res.redirect(`/action/actionList`);
			return false;
		}
	})
}