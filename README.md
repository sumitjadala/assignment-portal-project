# assignment-portal-project
1.Create database in mysql using following query
create database assignmentportaldb;

2.Start java application run following queries in mysql

insert into department values (1,'Computer');
insert into department values (2,'IT');
insert into department values (3,'Mechanical');

insert into roles values(1, 'ROLE_STUDENT');
insert into roles values(2, 'ROLE_ADMIN');
insert into roles values(3, 'ROLE_FACULTY');

insert into users values(2,'admin@gmail.com','$2y$12$g7hqU4lVKPKCA8EbPk.fAOAbjQY7yyPB6kiPKpffYeDteFN/GHqlC','admin');
insert into user_roles values(2,2);

DROP TABLE IF EXISTS assignmentportaldb.student_assignment_details_view;
CREATE OR REPLACE VIEW assignmentportaldb.student_assignment_details_view AS 
SELECT sad.id, a.title, a.description, a.subject, a.submission_date, sad.file as student_submitted_file, f.faculty_name, 
	f.user_id as faculty_id, s.student_name, s.user_id as student_id, a.assignment_details_file_name, a.is_deleted, a.id as assignment_id,
    CASE 
		WHEN sad.file is not null then 1
		WHEN DATE(a.submission_date) < DATE(CURRENT_TIMESTAMP) then 3
		WHEN sad.file is null then 2
		END as is_submitted
    FROM assignmentportaldb.student_assignment_details sad
	join assignmentportaldb.assignment a on a.id = sad.assignment_id
	join assignmentportaldb.faculty f on f.user_id = sad.faculty_id
	join assignmentportaldb.student s on s.user_id = sad.student_id
    where a.is_deleted = false;

3.Go into src/main/app run following command
npm install
npm start

4.Sign in with following credentials
username= admin
password= password
