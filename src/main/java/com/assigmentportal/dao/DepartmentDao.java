package com.assigmentportal.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.assigmentportal.entity.EDepartment;

@Repository
public interface DepartmentDao extends JpaRepository<EDepartment, Integer> {
  
  @Query("select name from EDepartment")
  List<String> getAllDepartmentNames();

  @Query("select id from EDepartment where name = ?1")
  Integer getIdByDepartmentName(String departmentName);
}
