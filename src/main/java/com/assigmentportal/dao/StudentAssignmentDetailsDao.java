package com.assigmentportal.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.assigmentportal.entity.EStudentAssignmentDetails;

@Repository
public interface StudentAssignmentDetailsDao extends JpaRepository<EStudentAssignmentDetails, Integer> {
  
  @Query("select a from EStudentAssignmentDetails a where studentId = :studentId and assignmentId = :assignmentId")
  EStudentAssignmentDetails findByAssignmentIdAndUserId(Integer studentId, Integer assignmentId);
  
}
