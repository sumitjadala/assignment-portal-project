package com.assigmentportal.entity;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Immutable;

@Entity
@Immutable
@Table(name = "student_assignment_details_view")
public class EStudentAssignmentDetailsView implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @Column(name = "id")
  private Integer id;

  @Column(name = "title")
  private String title;

  @Column(name = "subject")
  private String subject;

  @Column(name = "description")
  private String description;

  @Column(name = "submission_date")
  private Timestamp submissionDate;

  @Column(name = "is_deleted")
  private Boolean isDeleted;

  @Column(name = "assignment_details_file_name")
  private String assignmentDetailsFileName;

  @Column(name = "student_submitted_file")
  private String studentSubmittedFile;

  @Column(name = "is_submitted")
  private Integer isSubmitted;

  @Column(name = "faculty_id")
  private Integer facultyId;

  @Column(name = "faculty_name")
  private String facultyName;

  @Column(name = "student_id")
  private Integer studentId;

  @Column(name = "student_name")
  private String studentName;

  @Column(name = "assignment_id")
  private Integer assignmentId;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getSubject() {
    return subject;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Timestamp getSubmissionDate() {
    return submissionDate;
  }

  public void setSubmissionDate(Timestamp submissionDate) {
    this.submissionDate = submissionDate;
  }

  public Boolean getIsDeleted() {
    return isDeleted;
  }

  public void setIsDeleted(Boolean isDeleted) {
    this.isDeleted = isDeleted;
  }

  public String getAssignmentDetailsFileName() {
    return assignmentDetailsFileName;
  }

  public void setAssignmentDetailsFileName(String assignmentDetailsFileName) {
    this.assignmentDetailsFileName = assignmentDetailsFileName;
  }

  public Integer getIsSubmitted() {
    return isSubmitted;
  }

  public void setIsSubmitted(Integer isSubmitted) {
    this.isSubmitted = isSubmitted;
  }

  public Integer getFacultyId() {
    return facultyId;
  }

  public void setFacultyId(Integer facultyId) {
    this.facultyId = facultyId;
  }

  public String getFacultyName() {
    return facultyName;
  }

  public void setFacultyName(String facultyName) {
    this.facultyName = facultyName;
  }

  public Integer getStudentId() {
    return studentId;
  }

  public void setStudentId(Integer studentId) {
    this.studentId = studentId;
  }

  public String getStudentName() {
    return studentName;
  }

  public void setStudentName(String studentName) {
    this.studentName = studentName;
  }

  public Integer getAssignmentId() {
    return assignmentId;
  }

  public void setAssignmentId(Integer assignmentId) {
    this.assignmentId = assignmentId;
  }

  public String getStudentSubmittedFile() {
    return studentSubmittedFile;
  }

  public void setStudentSubmittedFile(String studentSubmittedFile) {
    this.studentSubmittedFile = studentSubmittedFile;
  }

}
