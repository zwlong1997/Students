'use strict';

const path=require('path');
const xtpl=require('xtpl');
const md5=require('md5');
const captchapng=require('captchapng');
const db=require(path.join(__dirname,'../config/config'));
const CommonHelper=require(path.join(__dirname,'../helpers/commonHelpers'));

module.exports.stuproList=function(req,res)
{
	const page=parseInt(req.query.page) || 1;

	const limit=12;

	const start=(page-1)*limit;


	db.table('stu_project').count('*').then(function(count){

		const totalPage=count % limit == 0 ? count / limit : parseInt(count / limit)+1;

		const totalPageArray = [];

		for(var i=1;i<=totalPage;i++)
		{
			totalPageArray.push(i);
		} 

		//查询数据
		db.table('stu_project').alias('stu_project').join({
			table:'student',
			join:'left',
			as:'student',
			on:['stu_id','stu_id']
		}).join({
			table:'project',
			join:'left',
			as:'project',
			on:['pro_id','pro_id']
		}).join({
			table:'term',
			join:'left',
			as:'term',
			on:['term_id','term_id']
		}).join({
			table:'grade',
			join:'left',
			as:'grade',
			on:['grade_id','grade_id']
		}).order('stu_project.stupro_id DESC').limit(start,limit).select().then(function(stupro_list)
		{
				let data={
					array:stupro_list,
					count:count,
					totalPageArray:totalPageArray,
					page:page,
					totalPage:totalPage
				}
				CommonHelper.renderFile(req,res,"stuproList.html",data);
		})
	})
}

module.exports.stuproAdd=function(req,res)
{
	db.table('project').select().then(function(project_list)
	{
		db.table('term').select().then(function(term_list)
		{
			db.table('grade').select().then(function(grade_list)
			{
				let data={
					project_list:project_list,
					term_list:term_list,
					grade_list:grade_list
				}
				CommonHelper.renderFile(req,res,"stuproAdd.html",data);
			})
		})
	})
	
}

module.exports.stuproAddForm=function(req,res)
{

	let stu_name=req.body.stu_name;
	
	db.table('student').where(`stu_name = '${stu_name}'`).find().then(function(student)
	{
		if(JSON.stringify(student) != "{}")
		{
			let pro_id=req.body.pro_id;
			db.table('project').where(`pro_id = ${pro_id}`).find().then(function(project)
			{
				let data={
					"stu_id":student.stu_id,
					"pro_id":project.pro_id,
					"term_id":req.body.term_id,
					"grade_id":req.body.grade_id,
					"pro_type":project.pro_type
				};


				db.table('stu_project').add(data).then(function(insertId)
				{
					if(insertId)
					{
						res.redirect('/stupro/stuproList');
						return false;
					}else{
						res.redirect('/stupro/stuproAdd');
						return false;
					}
				})
			})
				
		}else{
			res.redirect(`/stupro/stuproAdd`);
			return false;
		}
	})
	

}

// 学生关系编辑
module.exports.stuproEdit=function(req,res)
{
	let stupro_id=req.query.stupro_id;
	if(!stupro_id)
	{
		res.redirect('stupro/stuproList');
		return false;
	}

	db.table('stu_project').alias('stu_project').join({
			table:'student',
			join:'left',
			as:'student',
			on:['stu_id','stu_id']
		}).join({
			table:'project',
			join:'left',
			as:'project',
			on:['pro_id','pro_id']
		}).join({
			table:'term',
			join:'left',
			as:'term',
			on:['term_id','term_id']
		}).join({
			table:'grade',
			join:'left',
			as:'grade',
			on:['grade_id','grade_id']
		}).where(`stu_project.stupro_id = ${stupro_id}`).find().then(function(stupro_list)
		{
			db.table('project').select().then(function(project_list)
			{
				db.table('term').select().then(function(term_list)
				{
					db.table('grade').select().then(function(grade_list)
					{
						let data={
							stupro_list:stupro_list,
							project_list:project_list,
							term_list:term_list,
							grade_list:grade_list

						}
						CommonHelper.renderFile(req,res,"stuproEdit.html",data);
					})
				})
			})
				
		})
}

module.exports.stuproEditForm=function(req,res)
{
	let stupro_id=req.query.stupro_id;
	if(!stupro_id)
	{
		res.redirect('/stupro/stuproList');
		return false;
	}


	let stu_name=req.body.stu_name;
	db.table('student').where(`stu_name ='${stu_name}'`).find().then(function(student)
	{
		if(JSON.stringify(student) != "{}")
		{
			let pro_id=req.body.pro_id;
			db.table('project').where(`pro_id =${pro_id}`).find().then(function(project)
			{
				let data={
					"stu_id":student.stu_id,
					"pro_id":project.pro_id,
					"term_id":req.body.term_id,
					"grade_id":req.body.grade_id,
					"pro_type":project.pro_type
				}

				db.table('stu_project').where(`stupro_id = ${stupro_id}`).update(data).then(function(affectRow)
				{
					if(affectRow)
					{
						res.redirect(`/stupro/stuproList`);
						return false;
					}else{
						res.redirect(`/stupro/stuproEdit?stupro_id=${stupro_id}`);
						return false;
					}
				})
			})
			
		}else{
			res.redirect(`/stupro/stuproEdit`);
			return false;
		}
	})

	
	
}

// 删除学生关系
module.exports.stuproDelete=function(req,res)
{
	let delete_id=req.query.stupro_id;
	if(!delete_id)
	{
		res.redirect(`/stupro/stuproList`);
		return false;
	}
	db.table('stu_project').where(`stupro_id = ${delete_id}`).delete().then(function(affectRow)
	{
		if(affectRow)
		{
			res.redirect(`/stupro/stuproList`);
			return false;
		}else{
			res.redirect(`/stupro/stuproList`);
			return false;
		}
	})
}