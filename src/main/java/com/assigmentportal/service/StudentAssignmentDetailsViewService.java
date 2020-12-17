package com.assigmentportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.assigmentportal.common.CommonData;
import com.assigmentportal.dao.StudentAssignmentDetailsViewDao;
import com.assigmentportal.entity.EStudentAssignmentDetailsView;

@Service
public class StudentAssignmentDetailsViewService {

  @Autowired
  StudentAssignmentDetailsViewDao studentAssignmentDetailsViewDao;

  public Page<EStudentAssignmentDetailsView> getStudentAssignmentStatus(Integer facultyId, Pageable pageable) {
    return studentAssignmentDetailsViewDao.findByFacultyId(facultyId, pageable);
  }

  public Page<EStudentAssignmentDetailsView> getAllAssignmentsBasedOnStudentId(Integer studentId, Pageable pageable) {
    return studentAssignmentDetailsViewDao
        .getAllAssignmentsBasedOnStudentId(studentId, Boolean.FALSE, pageable);
  }

  public Page<EStudentAssignmentDetailsView> getPendingAssignments(Integer studentId, Pageable pageable) {
    return studentAssignmentDetailsViewDao
        .getPendingAssignmentsBasedOnStudentId(studentId, Boolean.FALSE, CommonData.SUBMIT_STATUS_NOT_SUBMITTED,
            CommonData.SUBMIT_STATUS_DUE_DATE_PASSED, pageable);
  }

  public Page<EStudentAssignmentDetailsView> getStudentAssignmentsStatus(Pageable pageable) {
    return studentAssignmentDetailsViewDao
        .getStudentAssignmentsStatus(Boolean.FALSE, pageable);
  }

}
