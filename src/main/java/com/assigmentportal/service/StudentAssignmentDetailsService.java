package com.assigmentportal.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.assigmentportal.common.CommonData;
import com.assigmentportal.dao.AssignmentDao;
import com.assigmentportal.dao.FacultyDao;
import com.assigmentportal.dao.StudentAssignmentDetailsDao;
import com.assigmentportal.dao.StudentsDao;
import com.assigmentportal.entity.EStudentAssignmentDetails;

@Service
public class StudentAssignmentDetailsService {

	@Autowired
	StudentAssignmentDetailsDao studentAssignmentDetailsDao;

	@Autowired
	StudentsDao studentsDao;

	@Autowired
	FacultyDao facultyDao;

	@Autowired
	AssignmentDao assignmentDao;

	public Integer updateIsAssigned(Integer assignmentId, Integer facultyId) {
		Integer departmentId = facultyDao.getDepartmentId(facultyId);
		List<Integer> studentIds = studentsDao.getAllStudentsId(departmentId);

		for (Integer studentId : studentIds) {
			EStudentAssignmentDetails studentAssignmentDetails = new EStudentAssignmentDetails();
			studentAssignmentDetails.setStudentId(studentId);
			studentAssignmentDetails.setAssignmentId(assignmentId);
			studentAssignmentDetails.setFacultyId(facultyId);
			studentAssignmentDetails.setIsSubmitted(CommonData.SUBMIT_STATUS_NOT_SUBMITTED);
			studentAssignmentDetailsDao.saveAndFlush(studentAssignmentDetails);
		}
		return assignmentDao.updateIsAssigned(assignmentId);
	}

//	public List<VStudentAssignmentDetails> getPendingAssignments(Integer studentId) {
//		List<Object[]> objList = studentAssignmentDetailsDao.getPendingAssignments(studentId);
//		return populateEntity(objList);
//	}

//	public List<EStudentAssignmentDetails> getSubmittedAssignments(Integer studentId) {
//		return studentAssignmentDetailsDao.getSubmittedAssignments(studentId);
//	}

//	public List<VStudentAssignmentDetails> getAllAssignmentsBasedOnStudentId(Integer id) {
//		List<Object[]> objList = studentAssignmentDetailsDao.getAllAssignmentsBasedOnStudentId(id);
//		return populateEntity(objList);
//	}

//	private List<VStudentAssignmentDetails> populateEntity(List<Object[]> objList) {
//		List<VStudentAssignmentDetails> studentAssignmentDetails = new ArrayList<>();
//		VStudentAssignmentDetails studentAssignmentDetail = null;
//		for (Object[] o : objList) {
//			studentAssignmentDetail= new VStudentAssignmentDetails();
//			studentAssignmentDetail.setTitle((String) o[0]);
//			studentAssignmentDetail.setDescription((String) o[1]);
//			studentAssignmentDetail.setSubject((String) o[2]);
//			studentAssignmentDetail.setSubmissionDate((Timestamp) o[3]);
//			studentAssignmentDetail.setUploadedFileName((String) o[4]);
//			studentAssignmentDetail.setFile((String) o[5]);
//			studentAssignmentDetail.setIsSubmitted((Integer) o[6]);
//			studentAssignmentDetail.setFacultyName((String) o[7]);
//			studentAssignmentDetail.setStudentName((String) o[8]);
//			studentAssignmentDetail.setStudentId((Integer) o[9]);
//			studentAssignmentDetails.add(studentAssignmentDetail);
//		}
//		return studentAssignmentDetails;
//	}

  public EStudentAssignmentDetails submitAssignment(String fileName, Integer studentId, Integer assignmentId) {
    EStudentAssignmentDetails studentAssignmentDetails = studentAssignmentDetailsDao.findByAssignmentIdAndUserId(studentId, assignmentId);
    studentAssignmentDetails.setFile(fileName);
    studentAssignmentDetails.setIsSubmitted(CommonData.SUBMIT_STATUS_SUBMITTED);
    studentAssignmentDetailsDao.save(studentAssignmentDetails);
    return studentAssignmentDetails;
  }

}
