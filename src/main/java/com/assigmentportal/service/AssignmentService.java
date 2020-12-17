package com.assigmentportal.service;

import java.sql.Timestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.assigmentportal.dao.AssignmentDao;
import com.assigmentportal.entity.EAssignment;

@Service
public class AssignmentService {

	@Autowired
	AssignmentDao assignmentDao;
	
	public Integer deleteAssignment(Integer facultyId, Integer assignmentId) {
		return assignmentDao.updateIsDeleted(Boolean.TRUE, facultyId, assignmentId);
	}

	//ADMIN
  public Integer deleteAssignment(Integer assignmentId) {
    return assignmentDao.updateIsDeleted(Boolean.TRUE, assignmentId);
  }

	public Page<EAssignment> getAssignmentDetails(Integer facultyId, Pageable pageable) {
	  Page<EAssignment> assignment = assignmentDao.getAssignmentDetails(facultyId, pageable);
		return assignment;
	}

  public EAssignment getAssignmentById(Integer facultyId, Integer assignmentId) {
    return assignmentDao.getAssignmentById(facultyId, assignmentId, Boolean.FALSE);
  }

  public Page<EAssignment> getAssignmentWithPagination(Integer facultyId, Pageable pageable) {
    return assignmentDao.findAll(pageable);
  }

  public EAssignment updateAssignment(String title, String subject, String description, Long submissionDate,
      MultipartFile file, String fileName, Integer facultyId, Integer assignmentId) {
    EAssignment assignment = assignmentDao.findByFacultyIdAndAssignmentId(facultyId, assignmentId);
    if(title != null && !title.isEmpty()) {
      assignment.setTitle(title);
    }
    if(subject != null && !subject.isEmpty()) {
      assignment.setSubject(subject);
    }
    if(description != null && !description.isEmpty()) {
      assignment.setDescription(description);
    }
    if(submissionDate != null) {
      assignment.setSubmissionDate(new Timestamp(submissionDate));
    }
    if(fileName != null && !fileName.isEmpty()) {
      assignment.setAssignmentDetailsFileName(fileName);
    }
    return assignmentDao.save(assignment);
  }

  //Admin
  public Page<EAssignment> getAssignments(Pageable pageable) {
    return assignmentDao.getAssignments(pageable);
  }

  public EAssignment getAssignmentById(Integer assignmentId) {
    return assignmentDao.getAssignmentById(assignmentId, Boolean.FALSE);
  }

  public EAssignment updateAssignmentAdmin(String title, String subject, String description, Long submissionDate, Integer assignmentId) {
    EAssignment assignment = assignmentDao.findByAssigmentId(assignmentId);
    if(title != null && !title.isEmpty()) {
      assignment.setTitle(title);
    }
    if(subject != null && !subject.isEmpty()) {
      assignment.setSubject(subject);
    }
    if(description != null && !description.isEmpty()) {
      assignment.setDescription(description);
    }
    if(submissionDate != null) {
      assignment.setSubmissionDate(new Timestamp(submissionDate));
    }
    return assignmentDao.save(assignment);
  }

}
