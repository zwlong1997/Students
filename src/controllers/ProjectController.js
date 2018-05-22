'use strict';

const path=require('path');
const xtpl=require('xtpl');
const md5=require('md5');
const captchapng=require('captchapng');
const db=require(path.join(__dirname,'../config/config'));
const CommonHelper=require(path.join(__dirname,'../helpers/commonHelpers'));

module.exports.projectList=function(req,res)
{
	const page=parseInt(req.query.page) || 1;

	const limit=12;

	const start=(page-1)*limit;


	db.table('project').count('*').then(function(count){

		const totalPage=count % limit == 0 ? count / limit : parseInt(count / limit)+1;

		const totalPageArray = [];

		for(var i=1;i<=totalPage;i++)
		{
			totalPageArray.push(i);
		} 

		//查询数据
		db.table('project').alias('project').join({
			table:'school',
			join:'left',
			as:'school',
			on:['school_id','school_id']
		}).order('project.pro_id DESC').limit(start,limit).select().then(function(project_list)
		{
				let data={
					array:project_list,
					count:count,
					totalPageArray:totalPageArray,
					page:page,
					totalPage:totalPage
				}
				CommonHelper.renderFile(req,res,"projectList.html",data);
		})
	})
}

module.exports.projectAdd=function(req,res)
{
	db.table('school').select().then(function(school_list)
	{
		let data={
			school_list:school_list
		}
		CommonHelper.renderFile(req,res,"projectAdd.html",data);
	})
}
	

module.exports.projectAddForm=function(req,res)
{
			let data={
				"pro_name":req.body.pro_name,
				"school_id":req.body.school_id,
				"pro_type":req.body.pro_type
			};


			db.table('project').add(data).then(function(insertId)
			{
				if(insertId)
				{
					res.redirect('/project/projectList');
					return false;
				}else{
					res.redirect('/project/projectAdd');
					return false;
				}
			})
}

// 学校编辑
module.exports.projectEdit=function(req,res)
{
	let pro_id=req.query.pro_id;
	if(!pro_id)
	{
		res.redirect('project/projectList');
		return false;
	}

	db.table('project').alias('project').join({
		table:'school',
		join:'left',
		as:'school',
		on:['school_id','school_id']
	}).where(`project.pro_id = ${pro_id}`).find().then(function(project_list)
	{
		db.table('school').select().then(function(school_list)
		{
			let data={
				"project_list":project_list,
				"school_list":school_list
			}
			CommonHelper.renderFile(req,res,"projectEdit.html",data);
		})
			
	})
}

module.exports.projectEditForm=function(req,res)
{
	let pro_id=req.query.pro_id;
	if(!pro_id)
	{
		res.redirect('/project/projectList');
		return false;
	}

	let data={
		"pro_name":req.body.project_name,
		"school_id":req.body.school_id,
		"pro_type":req.body.pro_type
	}

	db.table('project').where(`pro_id = ${pro_id}`).update(data).then(function(affectRow)
	{
		if(affectRow)
		{
			res.redirect(`/project/projectList`);
			return false;
		}else{
			res.redirect(`/project/projectEdit?pro_id=${pro_id}`);
			return false;
		}
	})
	
}

// 删除学校
module.exports.projectDelete=function(req,res)
{
	let delete_id=req.query.pro_id;
	if(!delete_id)
	{
		res.redirect(`/project/projectList`);
		return false;
	}
	db.table('project').where(`pro_id = ${delete_id}`).delete().then(function(affectRow)
	{
		if(affectRow)
		{
			res.redirect(`/project/projectList`);
			return false;
		}else{
			res.redirect(`/project/projectList`);
			return false;
		}
	})
}