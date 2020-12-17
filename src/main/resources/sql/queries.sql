--15th dec

create database assignmentportaldb;
drop database assignmentportaldb;

insert into student values(1,1,'sumit@gmail.com','8898981799','Sumit Jadala',4);
insert into student values(2,1,'sumit1@gmail.com','8898981799','Sumit1 Jadala1',5);
insert into student values(3,2,'itachi@gmail.com','7865786534','Itachi Uchiha',6);
insert into student values(4,2,'naruto@gmail.com','8987654323','Naruto Uzumaki',7);
insert into student values(5,3,'sumit2@gmail.com','8898981799','Sumit2 Jadala2',8);
insert into student values(6,3,'student@gmail.com','8898981799','Student',1);

insert into department values (1,'Computer');
insert into department values (2,'IT');
insert into department values (3,'Mechanical');

insert into faculty values (1,1,'kakashi@leaf.com','Kakashi hatake',9);
insert into faculty values (2,2,'jiraya@leaf.com','Jiraya',10);
insert into faculty values (3,3,'konohamaru@leaf.com','Konohamaru Sarutobi',11);
insert into faculty values (4,3,'faculty@leaf.com','Faculty',3);

insert into common_data(name, detail) values ('submit_status','SUBMITTED');
insert into common_data(name, detail) values ('submit_status','NOT_SUBMITTED');
insert into common_data(name, detail) values ('submit_status','DUE_DATE_PASSED');

insert into users values(1,'student@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','student');
insert into users values(2,'admin@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','admin');
insert into users values(3,'faculty@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','faculty');
insert into users values(4,'sumit@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','sumit');
insert into users values(5,'sumit1@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','sumit1');
insert into users values(6,'itachi@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','itachi');
insert into users values(7,'naruto@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','naruto');
insert into users values(8,'sumit2@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','sumit2');
insert into users values(9,'kakashi@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','kakashi');
insert into users values(10,'jiraya@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','jiraya');
insert into users values(11,'konohamaru@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','konohamaru');

insert into roles values(1, 'ROLE_STUDENT');
insert into roles values(2, 'ROLE_ADMIN');
insert into roles values(3, 'ROLE_FACULTY');

insert into user_roles values(1,1);
insert into user_roles values(2,2);
insert into user_roles values(3,3);
insert into user_roles values(4,2);
insert into user_roles values(5,1);
insert into user_roles values(6,1);
insert into user_roles values(7,1);
insert into user_roles values(8,1);
insert into user_roles values(9,3);
insert into user_roles values(10,3);
insert into user_roles values(11,3);

select * from student;
select * from department;
select * from faculty;
select * from assignment;
select * from student_assignment_details;
select * from common_data;
select * from roles;
select * from user_roles;
select * from users;
select * from uploaded_files;
drop table uploaded_files;
select * from student_assignment_details where student_id = 1 and assignment_id = 1;

select * from assignment where DATE(submission_date) < DATE(CURRENT_TIMESTAMP);
select CURRENT_TIMESTAMP;

select s.id, s.student_name, a.title, a.description, a.subject, a.submission_date, a.assignment_details_file_name, sad.file, f.faculty_name,
CASE WHEN DATE(a.submission_date) < DATE(CURRENT_TIMESTAMP) then 3
	 WHEN sad.file is null then 2
     ELSE 1 END as is_submitted
from assignmentportaldb.student_assignment_details sad
join assignmentportaldb.assignment a on a.id = sad.assignment_id
join assignmentportaldb.faculty f on f.id = sad.faculty_id
join assignmentportaldb.student s on s.id = sad.student_id
where a.is_deleted = false and sad.faculty_id = 3;

select a.title, a.description, a.subject, a.submission_date, sad.file, sad.is_submitted, f.faculty_name, s.student_name, s.user_id 
from assignmentportaldb.student_assignment_details sad 
join assignmentportaldb.assignment a on a.id = sad.assignment_id 
join assignmentportaldb.faculty f on f.user_id = sad.faculty_id 
join assignmentportaldb.student s on s.user_id = sad.student_id 
where a.is_deleted = false and sad.faculty_id = 3;

DROP TABLE IF EXISTS assignmentportaldb.student_assignment_details_view;
CREATE OR REPLACE VIEW assignmentportaldb.student_assignment_details_view AS 
SELECT sad.id, a.title, a.description, a.subject, a.submission_date, sad.file as student_submitted_file, f.faculty_name, 
	f.user_id as faculty_id, s.student_name, s.user_id as student_id, a.assignment_details_file_name, a.is_deleted, a.id as assignment_id,
    CASE WHEN DATE(a.submission_date) < DATE(CURRENT_TIMESTAMP) then 3
	 WHEN sad.file is null then 2
     ELSE 1 END as is_submitted
    FROM assignmentportaldb.student_assignment_details sad
	join assignmentportaldb.assignment a on a.id = sad.assignment_id
	join assignmentportaldb.faculty f on f.user_id = sad.faculty_id
	join assignmentportaldb.student s on s.user_id = sad.student_id
    where a.is_deleted = false;

select * from assignmentportaldb.student_assignment_details_view;
select s.* from assignmentportaldb.student_assignment_details_view s where s.faculty_id = 3 and s.is_deleted= false;
select * from assignmentportaldb.student_assignment_details_view where faculty_id = 3 and is_deleted= false;
select * from assignment a where a.id = 16 and a.created_by = 3 and is_deleted = true;

select a.title, a.description, a.subject, a.submission_date, a.uploaded_file_name, sad.file, sad.is_submitted, f.faculty_name, s.student_name
from assignmentportaldb.student_assignment_details sad
join assignmentportaldb.assignment a on a.id = sad.assignment_id
join assignmentportaldb.faculty f on f.id = sad.faculty_id
join assignmentportaldb.student s on s.id = sad.student_id
where sad.student_id = 3 and a.is_deleted = false;

select title from assignment a where created_by = 3 and lower(title) = lower('sdfasf');
select title from assignment a where created_by = 3 and title = 'sdfasf';

--13th dec
--create database assignmentportaldb;
--drop database assignmentportaldb;
--
--insert into student values(1,1,'sumit@gmail.com','8898981799','Sumit Jadala',4);
--insert into student values(2,1,'sumit1@gmail.com','8898981799','Sumit1 Jadala1',5);
--insert into student values(3,2,'itachi@gmail.com','7865786534','Itachi Uchiha',6);
--insert into student values(4,2,'naruto@gmail.com','8987654323','Naruto Uzumaki',7);
--insert into student values(5,3,'sumit2@gmail.com','8898981799','Sumit2 Jadala2',8);
--insert into student values(6,3,'student@gmail.com','8898981799','Student',1);
--
--insert into department values (1,'Computer');
--insert into department values (2,'IT');
--insert into department values (3,'Mechanical');
--
--insert into faculty values (1,1,'kakashi@leaf.com','Kakashi hatake',9);
--insert into faculty values (2,2,'jiraya@leaf.com','Jiraya',10);
--insert into faculty values (3,3,'konohamaru@leaf.com','Konohamaru Sarutobi',11);
--insert into faculty values (4,3,'faculty@leaf.com','Faculty',3);
--
--insert into common_data(name, detail) values ('submit_status','SUBMITTED');
--insert into common_data(name, detail) values ('submit_status','NOT_SUBMITTED');
--insert into common_data(name, detail) values ('submit_status','DUE_DATE_PASSED');
--
--insert into users values(1,'student@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','student');
--insert into users values(2,'admin@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','admin');
--insert into users values(3,'faculty@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','faculty');
--insert into users values(4,'sumit@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','sumit');
--insert into users values(5,'sumit1@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','sumit1');
--insert into users values(6,'itachi@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','itachi');
--insert into users values(7,'naruto@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','naruto');
--insert into users values(8,'sumit2@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','sumit2');
--insert into users values(9,'kakashi@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','kakashi');
--insert into users values(10,'jiraya@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','jiraya');
--insert into users values(11,'konohamaru@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','konohamaru');
--
--insert into roles values(1, 'ROLE_STUDENT');
--insert into roles values(2, 'ROLE_ADMIN');
--insert into roles values(3, 'ROLE_FACULTY');
--
--insert into user_roles values(1,1);
--insert into user_roles values(2,2);
--insert into user_roles values(3,3);
--insert into user_roles values(4,2);
--insert into user_roles values(5,1);
--insert into user_roles values(6,1);
--insert into user_roles values(7,1);
--insert into user_roles values(8,1);
--insert into user_roles values(9,3);
--insert into user_roles values(10,3);
--insert into user_roles values(11,3);
--
--select * from student;
--select * from department;
--select * from faculty;
--select * from assignment;
--select * from student_assignment_details;
--select * from common_data;
--select * from roles;
--select * from user_roles;
--select * from users;
--select * from uploaded_files;
--drop table uploaded_files;
--select * from student_assignment_details where student_id = 1 and assignment_id = 1;
--
--select * from assignment where DATE(submission_date) < DATE(CURRENT_TIMESTAMP);
--select CURRENT_TIMESTAMP;
--
--select s.id, s.student_name, a.title, a.description, a.subject, a.submission_date, a.assignment_details_file_name, sad.file, f.faculty_name,
--CASE WHEN DATE(a.submission_date) < DATE(CURRENT_TIMESTAMP) then 3
--	 WHEN sad.file is null then 2
--     ELSE 1 END as is_submitted
--from assignmentportaldb.student_assignment_details sad
--join assignmentportaldb.assignment a on a.id = sad.assignment_id
--join assignmentportaldb.faculty f on f.id = sad.faculty_id
--join assignmentportaldb.student s on s.id = sad.student_id
--where a.is_deleted = false and sad.faculty_id = 3;
--
--select a.title, a.description, a.subject, a.submission_date, sad.file, sad.is_submitted, f.faculty_name, s.student_name, s.user_id 
--from assignmentportaldb.student_assignment_details sad 
--join assignmentportaldb.assignment a on a.id = sad.assignment_id 
--join assignmentportaldb.faculty f on f.user_id = sad.faculty_id 
--join assignmentportaldb.student s on s.user_id = sad.student_id 
--where a.is_deleted = false and sad.faculty_id = 3;
--
--DROP TABLE IF EXISTS assignmentportaldb.student_assignment_details_view;
--CREATE OR REPLACE VIEW assignmentportaldb.student_assignment_details_view AS 
--SELECT sad.id, a.title, a.description, a.subject, a.submission_date, sad.file as student_submitted_file, f.faculty_name, 
--	f.user_id as faculty_id, s.student_name, s.user_id as student_id, a.assignment_details_file_name, a.is_deleted, a.id as assignment_id,
--    CASE WHEN DATE(a.submission_date) < DATE(CURRENT_TIMESTAMP) then 3
--	 WHEN sad.file is null then 2
--     ELSE 1 END as is_submitted
--    FROM assignmentportaldb.student_assignment_details sad
--	join assignmentportaldb.assignment a on a.id = sad.assignment_id
--	join assignmentportaldb.faculty f on f.user_id = sad.faculty_id
--	join assignmentportaldb.student s on s.user_id = sad.student_id
--    where a.is_deleted = false;
--
--select * from assignmentportaldb.student_assignment_details_view;
--select s.* from assignmentportaldb.student_assignment_details_view s where s.faculty_id = 3 and s.is_deleted= false;
--select * from assignmentportaldb.student_assignment_details_view where faculty_id = 3 and is_deleted= false;
--select * from assignment a where a.id = 16 and a.created_by = 3 and is_deleted = true;
--
--select a.title, a.description, a.subject, a.submission_date, a.uploaded_file_name, sad.file, sad.is_submitted, f.faculty_name, s.student_name
--from assignmentportaldb.student_assignment_details sad
--join assignmentportaldb.assignment a on a.id = sad.assignment_id
--join assignmentportaldb.faculty f on f.id = sad.faculty_id
--join assignmentportaldb.student s on s.id = sad.student_id
--where sad.student_id = 3 and a.is_deleted = false;
--
