'use strict';

const path=require('path');
const xtpl=require('xtpl');
const md5=require('md5');
const captchapng=require('captchapng');
const db=require(path.join(__dirname,'../config/config'));
const CommonHelper=require(path.join(__dirname,'../helpers/commonHelpers'));

module.exports.schoolList=function(req,res)
{
	const page=parseInt(req.query.page) || 1;

	const limit=12;

	const start=(page-1)*limit;

	let where = 1;

	db.table('school').where(where).count('*').then(function(count){

		const totalPage=count % limit == 0 ? count / limit : parseInt(count / limit)+1;

		const totalPageArray = [];

		for(var i=1;i<=totalPage;i++)
		{
			totalPageArray.push(i);
		} 
		console.log(totalPageArray);

		//查询数据
		db.table('school').where(where).order('school_id DESC').limit(start,limit).select().then(function(school_list){
			let data={
				array:school_list,
				count:count,
				totalPageArray:totalPageArray,
				page:page,
				totalPage:totalPage
			}
			CommonHelper.renderFile(req,res,"schoolList.html",data);
		})
	})
}

module.exports.schoolAdd=function(req,res)
{
	CommonHelper.renderFile(req,res,"schoolAdd.html");
}

module.exports.schoolAddForm=function(req,res)
{
	let data={
		"school_name":req.body.school_name,
		"school_time":req.body.school_time
	}

	db.table('school').add(data).then(function(insertId)
	{
		if(insertId)
		{
			res.redirect('/school/schoolList');
			return false;
		}else{
			res.redirect('/school/schoolAdd');
			return false;
		}
	})
}

//学校编辑
module.exports.schoolEdit=function(req,res)
{
	let school_id=req.query.school_id;
	if(!school_id)
	{
		res.redirect('school/schoolList');
		return false;
	}

	db.table('school').where(`school_id = ${school_id}`).find().then(function(school)
	{
		if(school)
		{
			let data={
				"school":school
			}
			CommonHelper.renderFile(req,res,"schoolEdit.html",data);
		}
	})
}

module.exports.schoolEditForm=function(req,res)
{
	let school_id=req.query.school_id;
	if(!school_id)
	{
		res.redirect('/school/schoolList');
		return false;
	}

	let data={
		"school_name":req.body.school_name,
		"school_time":req.body.school_time
	}

	db.table('school').where(`school_id = ${school_id}`).update(data).then(function(affectRow)
	{
		if(affectRow)
		{
			res.redirect(`/school/schoolList`);
			return false;
		}else{
			res.redirect(`/school/schoolEdit?school_id=${school_id}`);
			return false;
		}
	})
	
}

//删除学校
module.exports.schoolDelete=function(req,res)
{
	let delete_id=req.query.school_id;
	if(!delete_id)
	{
		res.redirect(`/school/schoolList`);
		return false;
	}
	db.table('school').where(`school_id = ${delete_id}`).delete().then(function(affectRow)
	{
		if(affectRow)
		{
			res.redirect(`/school/schoolList`);
			return false;
		}else{
			res.redirect(`/school/schoolList`);
			return false;
		}
	})
}