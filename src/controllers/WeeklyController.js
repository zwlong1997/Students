'use strict';

const path=require('path');
const xtpl=require('xtpl');
const md5=require('md5');
const captchapng=require('captchapng');
const db=require(path.join(__dirname,'../config/config'));
const CommonHelper=require(path.join(__dirname,'../helpers/commonHelpers'));

module.exports.weeklyList=function(req,res)
{
	const page=parseInt(req.query.page) || 1;

	const limit=12;

	const start=(page-1)*limit;


	db.table('weekly').count('*').then(function(count){

		const totalPage=count % limit == 0 ? count / limit : parseInt(count / limit)+1;

		const totalPageArray = [];

		for(var i=1;i<=totalPage;i++)
		{
			totalPageArray.push(i);
		} 

		//查询数据
		db.table('weekly').alias('weekly').join({
			table:'student',
			join:'left',
			as:'student',
			on:['stu_id','stu_id']
		}).order('weekly_id DESC').limit(start,limit).select().then(function(weekly_list)
		{
				let data={
					array:weekly_list,
					count:count,
					totalPageArray:totalPageArray,
					page:page,
					totalPage:totalPage
				}
				CommonHelper.renderFile(req,res,"weeklyList.html",data);
		})
	})
}

module.exports.weeklyAdd=function(req,res)
{

	CommonHelper.renderFile(req,res,"weeklyAdd.html");
}

module.exports.weeklyAddForm=function(req,res)
{
	let stu_name=req.body.stu_name;
	db.table('student').where(`stu_name = '${stu_name}'`).find().then(function(student)
	{
		if(JSON.stringify(student) != "{}")
		{

			let data={
				"weekly_name":req.body.weekly_name,
				"weekly_content":req.body.weekly_content,
				"stu_id":student.stu_id,
				"weekly_time":Date.now()
			};


			db.table('weekly').add(data).then(function(insertId)
			{
				if(insertId)
				{
					res.redirect('/weekly/weeklyList');
					return false;
				}else{
					res.redirect('/weekly/weeklyAdd');
					return false;
				}
			})
		}else{
			res.redirect('/weekly/weeklyAdd');
			return false;
		}
	})
}

// 周记编辑
module.exports.weeklyEdit=function(req,res)
{
	let weekly_id=req.query.weekly_id;
	if(!weekly_id)
	{
		res.redirect('weekly/weeklyList');
		return false;
	}

	db.table('weekly').alias('weekly').join({
		table:'student',
		join:'left',
		as:'student',
		on:['stu_id','stu_id']
	}).where(`weekly.weekly_id = ${weekly_id}`).find().then(function(weekly_list)
	{
			let data={
				"weekly_list":weekly_list,
			}
			CommonHelper.renderFile(req,res,"weeklyEdit.html",data);
	})
}

module.exports.weeklyEditForm=function(req,res)
{
	let weekly_id=req.query.weekly_id;
	if(!weekly_id)
	{
		res.redirect('/weekly/weeklyList');
		return false;
	}

	let data={
		"weekly_name":req.body.weekly_name,
		"weekly_content":req.body.weekly_content
	}

	db.table('weekly').where(`weekly_id = ${weekly_id}`).update(data).then(function(affectRow)
	{
		if(affectRow)
		{
			res.redirect(`/weekly/weeklyList`);
			return false;
		}else{
			res.redirect(`/weekly/weeklyEdit?weekly_id=${weekly_id}`);
			return false;
		}
	})
	
}

// 删除周记
module.exports.weeklyDelete=function(req,res)
{
	let delete_id=req.query.weekly_id;
	if(!delete_id)
	{
		res.redirect(`/weekly/weeklyList`);
		return false;
	}
	db.table('weekly').where(`weekly_id = ${delete_id}`).delete().then(function(affectRow)
	{
		if(affectRow)
		{
			res.redirect(`/weekly/weeklyList`);
			return false;
		}else{
			res.redirect(`/weekly/weeklyList`);
			return false;
		}
	})
}