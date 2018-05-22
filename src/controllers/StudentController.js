'use strict';

const path=require('path');
const xtpl=require('xtpl');
const captchapng=require('captchapng');
const db=require(path.join(__dirname,"../config/config"));
const CommonHelper=require(path.join(__dirname,'../helpers/commonHelpers'));

module.exports.studentList=function(req,res)
{
	const page=parseInt(req.query.page) || 1;

	const limit=12;

	const start=(page-1)*limit;

	db.table('student').count('*').then(function(count)
	{
		const totalPage=count % limit == 0 ? count / limit : parseInt(count / limit)+1;

		const totalPageArray=[];

		for(var i=1;i<=totalPage;i++)
		{
			totalPageArray.push(i);
		}


		db.table('student').alias('student').join({
		    table: 'class',
		    join: 'left',
		    as: 'class',
		    on: ['class_id', 'class_id']
		}).join({
		    table: 'school',
		    join: 'left',
		    as: 'school',
		    on: ['school_id', 'school_id']
		}).order('student.stu_id DESC').limit(start,limit).select().then(function(student_list)
		{
				let data={
					array:student_list,
					count:count,
					page:page,
					totalPage:totalPage,
					totalPageArray:totalPageArray
				};
				CommonHelper.renderFile(req,res,"studentList.html",data);
		}); 
			
	})
}