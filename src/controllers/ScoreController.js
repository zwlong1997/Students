'use strict';

const path=require('path');
const xtpl=require('xtpl');
const md5=require('md5');
const captchapng=require('captchapng');
const db=require(path.join(__dirname,'../config/config'));
const CommonHelper=require(path.join(__dirname,'../helpers/commonHelpers'));

module.exports.scoreList=function(req,res)
{
	const page=parseInt(req.query.page) || 1;

	const limit=12;

	const start=(page-1)*limit;


	db.table('score').count('*').then(function(count){

		const totalPage=count % limit == 0 ? count / limit : parseInt(count / limit)+1;

		const totalPageArray = [];

		for(var i=1;i<=totalPage;i++)
		{
			totalPageArray.push(i);
		} 

		//查询数据
		db.table('score').alias('score').join({
			table:'project',
			join:'left',
			as:'project',
			on:['pro_id','pro_id']
		}).join({
			table:'student',
			join:'left',
			as:'student',
			on:['stu_id','stu_id']
		}).order('score.score_id DESC').limit(start,limit).select().then(function(score_list)
		{
				let data={
					array:score_list,
					count:count,
					totalPageArray:totalPageArray,
					page:page,
					totalPage:totalPage
				}
				CommonHelper.renderFile(req,res,"scoreList.html",data);
		})
	})
}

module.exports.scoreAdd=function(req,res)
{
  	db.table('project').select().then(function(project_list)
  	{
  		let data={
  			project_list:project_list
  		}
  		CommonHelper.renderFile(req,res,"scoreAdd.html",data);
  	})
	
}

module.exports.scoreAddForm=function(req,res)
{
	let stu_name=req.body.stu_name;
	db.table('student').where(`stu_name = '${stu_name}'`).find().then(function(student)
	{
		if(JSON.stringify(student) != "{}")
		{

			let data={
				"score_number":req.body.score_number,
				"pro_id":req.body.pro_id,
				"stu_id":student.stu_id
			};


			db.table('score').add(data).then(function(insertId)
			{
				if(insertId)
				{
					res.redirect('/score/scoreList');
					return false;
				}else{
					res.redirect('/score/scoreAdd');
					return false;
				}
			})
		}else{
			res.redirect('/score/scoreAdd');
			return false;
		}
	})
}

// 分数编辑
module.exports.scoreEdit=function(req,res)
{
	let score_id=req.query.score_id;
	if(!score_id)
	{
		res.redirect('score/scoreList');
		return false;
	}

	db.table('score').alias('score').join({
		table:'student',
		join:'left',
		as:'student',
		on:['stu_id','stu_id']
	}).join({
		table:'project',
		join:'left',
		as:'project',
		on:['pro_id','pro_id']
	}).where(`score.score_id = ${score_id}`).find().then(function(score_list)
	{
		db.table('project').select().then(function(project_list)
		{
			let data={
				"score_list":score_list,
				project_list:project_list
			}
			CommonHelper.renderFile(req,res,"scoreEdit.html",data);
		})
			
	})
}

module.exports.scoreEditForm=function(req,res)
{
	let score_id=req.query.score_id;
	let stu_name=req.body.stu_name;
	if(!score_id)
	{
		res.redirect('/score/scoreList');
		return false;
	}

	db.table('student').where(`stu_name = '${stu_name}'`).find().then(function(student)
	{
		if(JSON.stringify(student) != "{}")
		{
			let data={
				"score_number":req.body.score_number,
				"pro_id":req.body.pro_id,
				"stu_id":student.stu_id
			}
			db.table('score').where(`score_id = ${score_id}`).update(data).then(function(affectRow)
			{
				if(affectRow)
				{
					res.redirect(`/score/scoreList`);
					return false;
				}else{
					res.redirect(`/score/scoreEdit?score_id=${score_id}`);
					return false;
				}
			})
		}else{
			res.redirect(`/score/scoreList`);
			return false;
		}
		
	})
	
	
}

// 删除分数
module.exports.scoreDelete=function(req,res)
{
	let delete_id=req.query.score_id;
	if(!delete_id)
	{
		res.redirect(`/score/scoreList`);
		return false;
	}
	db.table('score').where(`score_id = ${delete_id}`).delete().then(function(affectRow)
	{
		if(affectRow)
		{
			res.redirect(`/score/scoreList`);
			return false;
		}else{
			res.redirect(`/score/scoreList`);
			return false;
		}
	})
}