'use strict';

const path=require('path');
const xtpl=require('xtpl');
const md5=require('md5');
const captchapng=require('captchapng');
const db=require(path.join(__dirname,'../config/config'));
const CommonHelper=require(path.join(__dirname,'../helpers/commonHelpers'));

module.exports.classList=function(req,res)
{
	const page=parseInt(req.query.page) || 1;

	const limit=12;

	const start=(page-1)*limit;


	db.table('class').count('*').then(function(count){

		const totalPage=count % limit == 0 ? count / limit : parseInt(count / limit)+1;

		const totalPageArray = [];

		for(var i=1;i<=totalPage;i++)
		{
			totalPageArray.push(i);
		} 
		console.log(totalPageArray);

		//查询数据
		db.table('class').alias('class').join({
			table:'school',
			join:'left',
			as:'school',
			on:['school_id','school_id']
		}).order('class_id DESC').limit(start,limit).select().then(function(class_list)
		{
				let data={
					array:class_list,
					count:count,
					totalPageArray:totalPageArray,
					page:page,
					totalPage:totalPage
				}
				CommonHelper.renderFile(req,res,"classList.html",data);
		})
	})
}

module.exports.classAdd=function(req,res)
{
	db.table('school').select().then(function(school)
	{
		let data={
			school:school
		};
		console.log(school);
		CommonHelper.renderFile(req,res,"classAdd.html",data);
	})
}

module.exports.classAddForm=function(req,res)
{
	let data={
		"class_name":req.body.class_name,
		"school_id":req.body.school
	}


	db.table('class').add(data).then(function(insertId)
	{
		if(insertId)
		{
			console.log(data);
			res.redirect('/class/classList');
			return false;
		}else{
			res.redirect('/class/classAdd');
			return false;
		}
	})

}

// 学校编辑
module.exports.classEdit=function(req,res)
{
	let class_id=req.query.class_id;
	if(!class_id)
	{
		res.redirect('class/classList');
		return false;
	}

	db.table('class').alias('class').join({
		table:'school',
		join:'left',
		as:'school',
		on:['school_id','school_id']
	}).where(`class_id = ${class_id}`).find().then(function(class_list)
	{
		db.table('school').select().then(function(school)
		{
			let data={
				"class_list":class_list,
				"school":school
			}
			CommonHelper.renderFile(req,res,"classEdit.html",data);
		})

	})
}

module.exports.classEditForm=function(req,res)
{
	let class_id=req.query.class_id;
	if(!class_id)
	{
		res.redirect('/class/classList');
		return false;
	}

	let data={
		"class_name":req.body.class_name,
		"school_id":req.body.school
	}

	db.table('class').where(`class_id = ${class_id}`).update(data).then(function(affectRow)
	{
		if(affectRow)
		{
			res.redirect(`/class/classList`);
			return false;
		}else{
			res.redirect(`/class/classEdit?class_id=${class_id}`);
			return false;
		}
	})
	
}

// 删除学校
module.exports.classDelete=function(req,res)
{
	let delete_id=req.query.class_id;
	if(!delete_id)
	{
		res.redirect(`/class/classList`);
		return false;
	}
	db.table('class').where(`class_id = ${delete_id}`).delete().then(function(affectRow)
	{
		if(affectRow)
		{
			res.redirect(`/class/classList`);
			return false;
		}else{
			res.redirect(`/class/classList`);
			return false;
		}
	})
}