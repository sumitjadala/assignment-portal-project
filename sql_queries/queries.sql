use assignmentportaldb;

select * from student;
delete from student where id =1;
insert into student values(1,1,'sumit@gmail.com','8898981799','Sumit Jadala');
insert into student values(2,2,'itachi@gmail.com','7865786534','Itachi Uchiha'); 
insert into student values(3,3,'naruto@gmail.com','8987654323','Naruto Uzumaki'); 

select * from department;
insert into department values (1,'Computer');
insert into department values (2,'IT');
insert into department values (3,'Mechanical');

select * from faculty;
insert into faculty values (1,1,'kakashi@leaf.com','Kakashi hatake');
insert into faculty values (2,2,'jiraya@leaf.com','Jiraya');
insert into faculty values (3,3,'konohamaru@leaf.com','Konohamaru Sarutobi');

select * from assignment;
desc assignment;
drop table assignment;
delete from assignment where id = 2;

drop table authorities;

drop table student_assignment_details;
select * from student_assignment_details;
update student_assignment_details set is_submitted = 2 where student_id = 1;

select * from user;
insert into user(username,password,enabled)
	values('admin','$2y$10$x3aVPqMlsii2/5l1V9e4/OQB1WP8KfWn9baxByFZ.y9sXp6jQj4ae',true);
insert into authorities(username,authority) values('admin','ROLE_ADMIN');

update assignment set is_assigned = true , is_deleted = false where id =1;

select * from common_data;
insert into common_data(name, detail) values ('submit_status','SUBMITTED');
insert into common_data(name, detail) values ('submit_status','NOT_SUBMITTED');
insert into common_data(name, detail) values ('submit_status','DUE_DATE_PASSED');



