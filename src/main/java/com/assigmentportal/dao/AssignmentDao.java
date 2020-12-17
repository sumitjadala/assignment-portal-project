package com.assigmentportal.dao;

import javax.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.assigmentportal.entity.EAssignment;

@Repository
public interface AssignmentDao extends JpaRepository<EAssignment, Integer> {

  @Query("select a from EAssignment a where createdBy = ?1 and isDeleted = false")
  Page<EAssignment> getAssignmentDetails(Integer facultyId, Pageable pageable);
  
  @Query("select a from EAssignment a where createdBy = ?1 and id = ?2")
  EAssignment findByFacultyIdAndAssignmentId(Integer facultyId, Integer assignmentId);

  @Query("select title from EAssignment a where createdBy = ?1 and lower(title) = lower(?2)")
  String checkIsTitleUnique(Integer facultyId, String title);
  
  @Query("select a from EAssignment a where a.id = :assignmentId and a.isDeleted = :isDeleted")
  EAssignment getAssignmentById(Integer assignmentId, Boolean isDeleted);

  @Query("select a from EAssignment a where a.createdBy = ?1 and a.id = ?2 and a.isDeleted = ?3")
  EAssignment getAssignmentById(Integer facultyId, Integer assignmentId, Boolean isDeleted);

  @Transactional
  @Modifying
  @Query("update EAssignment set isDeleted = :isDeleted where id = :assignmentId")
  Integer updateIsDeleted(Boolean isDeleted, Integer assignmentId);

  @Transactional
  @Modifying
  @Query("update EAssignment set isDeleted = :isDeleted where id = :assignmentId and createdBy = :facultyId")
  Integer updateIsDeleted(Boolean isDeleted, Integer facultyId, Integer assignmentId);

  @Query("select a from EAssignment a where isDeleted = false")
  Page<EAssignment> getAssignments(Pageable pageable);

  @Query("select a from EAssignment a where id = ?1")
  EAssignment findByAssigmentId(Integer assignmentId);
  
  @Transactional
  @Modifying
  @Query("update EAssignment set isAssigned = true where id = :assignmentId")
  Integer updateIsAssigned(Integer assignmentId);


}
