package com.assigmentportal.service;

import java.sql.Timestamp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.assigmentportal.dao.AssignmentDao;
import com.assigmentportal.dao.FacultyDao;
import com.assigmentportal.dao.FileStorageDao;
import com.assigmentportal.dao.StudentAssignmentDetailsDao;
import com.assigmentportal.entity.EAssignment;
import com.assigmentportal.entity.EFileStorageProperties;

@Service
public class FacultyService {

  Logger logger = LoggerFactory.getLogger(FacultyService.class);

  @Autowired
  FacultyDao facultyDao;

  @Autowired
  AssignmentDao assignmentDao;

  @Autowired
  StudentAssignmentDetailsDao studentAssignmentDetailsDao;

  @Autowired
  FileStorageDao fileStorageDao;

  public EAssignment createAssignment(String title, String subject, String description, Long submissionDate,
      MultipartFile file, String fileName, Integer facultyId) {
    try {
      EAssignment eobj = new EAssignment();
      Integer departmentId = facultyDao.getDepartmentId(facultyId);
      eobj.setTitle(title);
      eobj.setSubject(subject);
      eobj.setDescription(description);
      eobj.setCreatedBy(facultyId);
      eobj.setCreatedTime(new Timestamp(System.currentTimeMillis()));
      eobj.setSubmissionDate(new Timestamp(submissionDate));
      eobj.setDepartmentId(departmentId);
      eobj.setAssignmentDetailsFileName(fileName);
      EAssignment savedAssignment = assignmentDao.saveAndFlush(eobj);
      saveFileInUploadTable(savedAssignment.getId(), fileName, facultyId);
      return savedAssignment;
    } catch (Exception e) {
      logger.error("Exception occured at FacultyService.createAssignment() {}", e.getMessage());
      return null;
    }
  }

  private void saveFileInUploadTable(Integer assignmentId, String fileName, Integer facultyId) {
    EFileStorageProperties doc = fileStorageDao.checkDocumentByUserId(facultyId, assignmentId);
    if (doc != null) {
      doc.setFileName(fileName);
      fileStorageDao.save(doc);
    } else {
      EFileStorageProperties newDoc = new EFileStorageProperties();
      newDoc.setUserId(facultyId);
      newDoc.setFileName(fileName);
      newDoc.setAssignmentId(assignmentId);
      fileStorageDao.save(newDoc);
    }
  }

  public String checkIsTitleUnique(Integer facultyId, String title) {
    return assignmentDao.checkIsTitleUnique(facultyId, title);
  }

}
