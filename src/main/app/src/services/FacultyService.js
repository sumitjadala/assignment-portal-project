import axios from 'axios';
import authHeader from './AuthHeader';

const API_URL = 'http://localhost:8080/api/faculty/';

class FacultyService {

  getAssignments(id, currentPage, assignmentsPerPage) {
    return axios.get(API_URL + 'getAssignment/' + id, {
      params: {
        page: currentPage,
        size: assignmentsPerPage
      },
      headers: authHeader()
    });
  }

  createAssignment(assignment) {
    return axios.post(API_URL + 'createAssignment', assignment, {
      headers: authHeader()
    });
  }

  updateAssignment(assignment, id, assignmentid) {
    console.log('update called in service');
    return axios.put(API_URL + 'updateAssignment/facultyId/' + id + '/assignmentId/' + assignmentid, assignment, {
      headers: authHeader()
    });
  }

  assignToStudents(id, facultyId) {
    return axios.put(API_URL + 'assignStudents/assignmentId/' + id + '/userId/' + facultyId, {}, {
      headers: authHeader()
    });
  }

  downloadFile(uploadedFileName) {
    return axios.get(API_URL + 'downloadFile/' + uploadedFileName, {
      headers: authHeader(),
      responseType: 'blob'
    });
  }

  deleteAssignment(assignmentId, userId) {
    return axios.delete(API_URL + 'deleteAssignment/userId/' + userId + '/assignmentId/' + assignmentId, {
      headers: authHeader()
    });
  }

  getStudentAssignmentStatus(id, currentPage, assignmentsPerPage) {
    return axios.get(API_URL + 'studentAssignmentStatus/' + id, {
      params: {
        page: currentPage,
        size: assignmentsPerPage
      },
      headers: authHeader()
    });
  }

  getAssignmentById(id, assignmentId) {
    return axios.get(API_URL + 'getAssignmentById/userId/' + id + '/assignmentId/' + assignmentId, {
      headers: authHeader()
    });
  }

  updateAssignmentById(assignment) {
    return axios.put(API_URL + 'updateAssignmentWithObj', assignment, {
      headers: authHeader()
    });
  }

  checkIfTitleUnique(facultyId, title) {
    return axios.get(API_URL + 'title/' + facultyId, {
      params: {
        title: title,
      },
      headers: authHeader()
    });
  }

}

export default new FacultyService();
