package com.assigmentportal.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.assigmentportal.entity.EStudent;

@Repository
public interface StudentsDao extends JpaRepository<EStudent, Integer> {
  
  @Query("select userId from EStudent where departmentId = :departmentId")
  List<Integer> getAllStudentsId(Integer departmentId);

}
