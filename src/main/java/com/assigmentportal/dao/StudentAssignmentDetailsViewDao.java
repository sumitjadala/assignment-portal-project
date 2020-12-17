package com.assigmentportal.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.assigmentportal.entity.EStudentAssignmentDetailsView;

@Repository
public interface StudentAssignmentDetailsViewDao extends JpaRepository<EStudentAssignmentDetailsView, Integer> {

  Page<EStudentAssignmentDetailsView> findByFacultyId(Integer facultyId, Pageable pageable);

  @Query("select a from EStudentAssignmentDetailsView a where studentId = ?1 and isDeleted = ?2 and isSubmitted in (?3, ?4)")
  Page<EStudentAssignmentDetailsView> getPendingAssignmentsBasedOnStudentId(Integer studentId, Boolean isDeleted,
      Integer isSubmitted, Integer submitStatusDueDatePassed, Pageable pageable);

  @Query("select a from EStudentAssignmentDetailsView a where studentId = ?1 and isDeleted = ?2")
  Page<EStudentAssignmentDetailsView> getAllAssignmentsBasedOnStudentId(Integer studentId, Boolean isDeleted, Pageable pageable);

  @Query("select a from EStudentAssignmentDetailsView a where isDeleted = ?1")
  Page<EStudentAssignmentDetailsView> getStudentAssignmentsStatus(Boolean isDeleted, Pageable pageable);

}
