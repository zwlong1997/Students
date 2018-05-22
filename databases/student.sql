-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2018-04-30 15:32:35
-- 服务器版本： 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `student`
--

-- --------------------------------------------------------

--
-- 表的结构 `pre_class`
--

CREATE TABLE IF NOT EXISTS `pre_class` (
  `class_id` int(11) NOT NULL AUTO_INCREMENT,
  `class_name` varchar(100) DEFAULT NULL,
  `school_id` int(11) NOT NULL,
  PRIMARY KEY (`class_id`),
  KEY `fk_pre_class_pre_school1_idx` (`school_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='班级表' AUTO_INCREMENT=4 ;

--
-- 转存表中的数据 `pre_class`
--

INSERT INTO `pre_class` (`class_id`, `class_name`, `school_id`) VALUES
(1, '班级1', 1),
(2, '班级2', 2);

-- --------------------------------------------------------

--
-- 表的结构 `pre_grade`
--

CREATE TABLE IF NOT EXISTS `pre_grade` (
  `grade_id` int(11) NOT NULL AUTO_INCREMENT,
  `grade_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`grade_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='年级表' AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `pre_grade`
--

INSERT INTO `pre_grade` (`grade_id`, `grade_name`) VALUES
(1, '大一'),
(2, '大二'),
(3, '大三'),
(4, '大四');

-- --------------------------------------------------------

--
-- 表的结构 `pre_project`
--

CREATE TABLE IF NOT EXISTS `pre_project` (
  `pro_id` int(11) NOT NULL AUTO_INCREMENT,
  `pro_name` varchar(45) DEFAULT NULL COMMENT '课程名称',
  `school_id` int(11) NOT NULL,
  `pro_type` int(11) DEFAULT '1' COMMENT '1代表必修\n0代表选修',
  PRIMARY KEY (`pro_id`),
  KEY `fk_pre_project_pre_school1_idx` (`school_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='课程表' AUTO_INCREMENT=6 ;

--
-- 转存表中的数据 `pre_project`
--

INSERT INTO `pre_project` (`pro_id`, `pro_name`, `school_id`, `pro_type`) VALUES
(1, 'java语言', 1, 1),
(2, 'PHP', 2, 1),
(3, 'javaScript', 1, 1),
(4, 'python', 1, 0);

-- --------------------------------------------------------

--
-- 表的结构 `pre_school`
--

CREATE TABLE IF NOT EXISTS `pre_school` (
  `school_id` int(11) NOT NULL AUTO_INCREMENT,
  `school_name` varchar(160) DEFAULT NULL,
  `school_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`school_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='学校表' AUTO_INCREMENT=6 ;

--
-- 转存表中的数据 `pre_school`
--

INSERT INTO `pre_school` (`school_id`, `school_name`, `school_time`) VALUES
(1, '中山大学', 23),
(2, '哈佛大学', 243);

-- --------------------------------------------------------

--
-- 表的结构 `pre_score`
--

CREATE TABLE IF NOT EXISTS `pre_score` (
  `score_id` int(11) NOT NULL AUTO_INCREMENT,
  `score_number` varchar(45) DEFAULT NULL,
  `score_time` int(11) DEFAULT NULL,
  `score_name` varchar(150) DEFAULT NULL,
  `pro_id` int(11) NOT NULL,
  `stu_id` int(11) NOT NULL,
  PRIMARY KEY (`score_id`),
  KEY `fk_pre_score_pre_project1_idx` (`pro_id`),
  KEY `fk_pre_score_pre_student1_idx` (`stu_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='成绩表' AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `pre_score`
--

INSERT INTO `pre_score` (`score_id`, `score_number`, `score_time`, `score_name`, `pro_id`, `stu_id`) VALUES
(1, '99', NULL, NULL, 1, 1),
(3, '101', NULL, NULL, 2, 5),
(4, '120', NULL, NULL, 3, 1);

-- --------------------------------------------------------

--
-- 表的结构 `pre_stu_project`
--

CREATE TABLE IF NOT EXISTS `pre_stu_project` (
  `stupro_id` int(11) NOT NULL AUTO_INCREMENT,
  `stu_id` int(11) NOT NULL,
  `pro_id` int(11) NOT NULL COMMENT '课程id列表',
  `term_id` int(11) DEFAULT NULL COMMENT '学期外键',
  `grade_id` int(11) DEFAULT NULL COMMENT '年级外键',
  `pro_type` int(11) DEFAULT '1' COMMENT '如果是1  选择的就是必修课程 0就是选修课程',
  PRIMARY KEY (`stupro_id`,`stu_id`,`pro_id`),
  KEY `fk_pre_student_has_pre_project_pre_project1_idx` (`pro_id`),
  KEY `fk_pre_student_has_pre_project_pre_student1_idx` (`stu_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='关系表' AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `pre_stu_project`
--

INSERT INTO `pre_stu_project` (`stupro_id`, `stu_id`, `pro_id`, `term_id`, `grade_id`, `pro_type`) VALUES
(1, 1, 1, 1, 1, 1),
(2, 1, 2, 1, 4, 1),
(4, 5, 3, 2, 2, 1);

-- --------------------------------------------------------

--
-- 表的结构 `pre_student`
--

CREATE TABLE IF NOT EXISTS `pre_student` (
  `stu_id` int(11) NOT NULL AUTO_INCREMENT,
  `stu_name` varchar(100) DEFAULT NULL,
  `stu_number` varchar(100) DEFAULT NULL COMMENT '学号',
  `class_id` int(11) NOT NULL COMMENT '班级外键',
  `school_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL COMMENT '账号外键',
  PRIMARY KEY (`stu_id`),
  KEY `fk_pre_student_pre_class_idx` (`class_id`),
  KEY `fk_pre_student_pre_school1_idx` (`school_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='学生表' AUTO_INCREMENT=6 ;

--
-- 转存表中的数据 `pre_student`
--

INSERT INTO `pre_student` (`stu_id`, `stu_name`, `stu_number`, `class_id`, `school_id`, `user_id`) VALUES
(1, 'haha', NULL, 1, 1, 69),
(4, '小花', NULL, 1, 2, 74),
(5, '小小', '0021122276', 2, 2, 76);

-- --------------------------------------------------------

--
-- 表的结构 `pre_teacher`
--

CREATE TABLE IF NOT EXISTS `pre_teacher` (
  `teach_id` int(11) NOT NULL AUTO_INCREMENT,
  `teach_name` varchar(45) DEFAULT NULL COMMENT '老师姓名',
  `school_id` int(11) NOT NULL COMMENT '学校外键',
  `user_id` varchar(45) DEFAULT NULL COMMENT '账号的外键',
  PRIMARY KEY (`teach_id`),
  KEY `fk_pre_teacher_pre_school1_idx` (`school_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='教师表' AUTO_INCREMENT=4 ;

--
-- 转存表中的数据 `pre_teacher`
--

INSERT INTO `pre_teacher` (`teach_id`, `teach_name`, `school_id`, `user_id`) VALUES
(2, '朱老师', 1, '73'),
(3, '徐老师', 2, '75');

-- --------------------------------------------------------

--
-- 表的结构 `pre_term`
--

CREATE TABLE IF NOT EXISTS `pre_term` (
  `term_id` int(11) NOT NULL AUTO_INCREMENT,
  `grade_id` int(11) NOT NULL COMMENT '年级外键',
  `term_start` date DEFAULT NULL COMMENT '学期的开始时间',
  `term_end` date DEFAULT NULL COMMENT '学期的结束时间',
  `term_year` varchar(255) DEFAULT NULL COMMENT '自定义：大一上半学期',
  PRIMARY KEY (`term_id`),
  KEY `fk_pre_term_pre_grade1_idx` (`grade_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='学期表' AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `pre_term`
--

INSERT INTO `pre_term` (`term_id`, `grade_id`, `term_start`, `term_end`, `term_year`) VALUES
(1, 1, '2015-09-05', '2016-01-10', '第一学期'),
(2, 1, '2016-09-07', '2016-06-10', '第二学期');

-- --------------------------------------------------------

--
-- 表的结构 `pre_user`
--

CREATE TABLE IF NOT EXISTS `pre_user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(80) DEFAULT NULL,
  `user_pwd` varchar(32) DEFAULT NULL,
  `user_email` varchar(80) DEFAULT NULL,
  `user_time` int(11) DEFAULT NULL,
  `user_img` varchar(255) DEFAULT NULL,
  `user_last_login` int(11) DEFAULT NULL COMMENT '最后登录时间',
  `user_login_count` int(11) DEFAULT NULL COMMENT '登录次数',
  `user_last_ip` varchar(100) DEFAULT NULL COMMENT '最后登录的Ip',
  `user_sex` int(11) DEFAULT NULL,
  `user_address` varchar(150) DEFAULT NULL,
  `user_phone` varchar(45) DEFAULT NULL,
  `type_id` int(11) NOT NULL COMMENT '类型外键',
  `user_action` text NOT NULL COMMENT '用户权限',
  PRIMARY KEY (`user_id`),
  KEY `fk_pre_user_pre_usertype1_idx` (`type_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='用户表' AUTO_INCREMENT=77 ;

--
-- 转存表中的数据 `pre_user`
--

INSERT INTO `pre_user` (`user_id`, `user_name`, `user_pwd`, `user_email`, `user_time`, `user_img`, `user_last_login`, `user_login_count`, `user_last_ip`, `user_sex`, `user_address`, `user_phone`, `type_id`, `user_action`) VALUES
(1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', NULL, 12312333, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'classList,userList,userAdd,userEdit,userDelete,userAction'),
(67, 'zwl', '90a2b68cd536b42b5d34b12382fad15d', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'classList,classAdd,userList,userEdit,schoolList,studentList,teacherList,actionList,weeklyList,projectList,scoreList,stuproList'),
(69, 'haha', '4e4d6c332b6fe62a63afe56171fd3725', 'haha@qq.com', 2147483647, NULL, NULL, NULL, NULL, 0, 'hah', 'haha', 3, ''),
(73, '朱老师', '202cb962ac59075b964b07152d234b70', '123@qq.com', 2147483647, NULL, NULL, NULL, NULL, 1, '11', '11', 2, ''),
(74, '小花', 'bcbe3365e6ac95ea2c0343a2395834dd', '222@qq.com', 2147483647, NULL, NULL, NULL, NULL, 1, '222', '222', 3, ''),
(75, '徐老师', 'f3abb86bd34cf4d52698f14c0da1dc60', 'zzz@qq.com', 2147483647, NULL, NULL, NULL, NULL, 0, 'qqq', '23456', 2, ''),
(76, '小小', 'bcbe3365e6ac95ea2c0343a2395834dd', '222@qq.com', 2147483647, NULL, NULL, NULL, NULL, 0, '222', '222', 3, '');

-- --------------------------------------------------------

--
-- 表的结构 `pre_user_action`
--

CREATE TABLE IF NOT EXISTS `pre_user_action` (
  `action_id` int(11) NOT NULL AUTO_INCREMENT,
  `action_name_en` varchar(100) DEFAULT NULL COMMENT '权限名称英文',
  `action_name_zh` varchar(150) DEFAULT NULL COMMENT '权限名称中文',
  `parent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`action_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='用户权限表' AUTO_INCREMENT=44 ;

--
-- 转存表中的数据 `pre_user_action`
--

INSERT INTO `pre_user_action` (`action_id`, `action_name_en`, `action_name_zh`, `parent_id`) VALUES
(1, 'class', '班级管理', 0),
(2, 'classList', '班级列表', 1),
(3, 'classAdd', '班级添加', 1),
(4, 'classEdit', '班级编辑', 1),
(5, 'classDelete', '班级删除', 1),
(6, 'user', '账号管理', 0),
(7, 'userList', '账号列表', 6),
(8, 'userAdd', '账号添加', 6),
(9, 'userEdit', '账号编辑', 6),
(10, 'userDelete', '账号删除', 6),
(11, 'userAction', '账号权限', 6),
(12, 'school', '学校管理', 0),
(13, 'schoolList', '学校列表', 12),
(14, 'schoolAdd', '学校添加', 12),
(15, 'schoolEdit', '学校编辑', 12),
(16, 'schoolDelete', '学校删除', 12),
(17, 'student', '学生管理', 0),
(18, 'studentList', '学生列表', 17),
(19, 'teacher', '教师管理', 0),
(20, 'teacherList', '教师列表', 19),
(21, 'action', '权限管理', 0),
(22, 'actionList', '权限列表', 21),
(24, 'actionAdd', '权限添加', 21),
(25, 'actionEdit', '权限编辑', 21),
(26, 'actionDelete', '权限删除', 21),
(27, 'weekly', '周记管理', 0),
(28, 'weeklyList', '周记列表', 27),
(29, 'weekAdd', '周记添加', 27),
(30, 'weekEdit', '周记编辑', 27),
(31, 'weekDelete', '周记删除', 27),
(32, 'project', '课程管理', 0),
(33, 'projectList', '课程列表', 32),
(34, 'projectAdd', '课程添加', 32),
(35, 'projectEdit', '课程编辑', 32),
(36, 'projectDelete', '课程删除', 32),
(37, 'score', '分数管理', 0),
(38, 'scoreList', '分数列表', 37),
(39, 'scoreAdd', '分数添加', 37),
(40, 'scoreEdit', '分数编辑', 37),
(41, 'scoreDelete', '分数删除', 37),
(42, 'stupro', '学生关系', 0),
(43, 'stuproList', '学生关系列表', 42);

-- --------------------------------------------------------

--
-- 表的结构 `pre_usertype`
--

CREATE TABLE IF NOT EXISTS `pre_usertype` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(85) DEFAULT NULL COMMENT '类型名称',
  PRIMARY KEY (`type_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='用户类型表' AUTO_INCREMENT=4 ;

--
-- 转存表中的数据 `pre_usertype`
--

INSERT INTO `pre_usertype` (`type_id`, `type_name`) VALUES
(1, '超级管理员'),
(2, '教师'),
(3, '学生');

-- --------------------------------------------------------

--
-- 表的结构 `pre_weekly`
--

CREATE TABLE IF NOT EXISTS `pre_weekly` (
  `weekly_id` int(11) NOT NULL AUTO_INCREMENT,
  `weekly_name` varchar(180) DEFAULT NULL,
  `weekly_content` text,
  `weekly_time` int(11) DEFAULT NULL,
  `weekly_attr` varchar(255) DEFAULT NULL,
  `stu_id` int(11) NOT NULL COMMENT '学生外键',
  PRIMARY KEY (`weekly_id`),
  KEY `fk_pre_weekly_pre_student1_idx` (`stu_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='周记表' AUTO_INCREMENT=9 ;

--
-- 转存表中的数据 `pre_weekly`
--

INSERT INTO `pre_weekly` (`weekly_id`, `weekly_name`, `weekly_content`, `weekly_time`, `weekly_attr`, `stu_id`) VALUES
(1, '周记一', '我来啦', 133, NULL, 1),
(3, '周记2', '哈哈哈啦啦啦', NULL, NULL, 1),
(4, '光明', '也许迷途的惆怅会扯碎我的脚步', 2147483647, NULL, 1),
(8, '我是小小', '小小小小鸟', 2147483647, NULL, 5);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
