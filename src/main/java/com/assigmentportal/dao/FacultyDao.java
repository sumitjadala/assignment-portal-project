package com.assigmentportal.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.assigmentportal.entity.EFaculty;

@Repository
public interface FacultyDao extends JpaRepository<EFaculty, Integer> {

  @Query("select departmentId from EFaculty where userId = :facultyId")
  Integer getDepartmentId(Integer facultyId);

}
