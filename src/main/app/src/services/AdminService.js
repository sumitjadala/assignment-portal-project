import axios from 'axios';
import authHeader from './AuthHeader';

const API_URL = 'http://localhost:8080/api/admin/';

class AdminService {
  getAssignments(currentPage, assignmentsPerPage) {
    return axios.get(API_URL + 'getAssignment', {
      params: {
        page: currentPage,
        size: assignmentsPerPage
      },
      headers: authHeader()
    });
  }

  downloadFile(uploadedFileName) {
    return axios.get(API_URL + 'downloadFile/' + uploadedFileName, {
      headers: authHeader(),
      responseType: 'blob'
    });
  }

  getAssignmentById(assignmentId) {
    return axios.get(API_URL + 'getAssignmentById/assignmentId/' + assignmentId, {
      headers: authHeader()
    });
  }

  updateAssignment(assignment, assignmentId) {
    console.log('update called in service');
    return axios.put(API_URL + 'updateAssignment/assignmentId/' + assignmentId, assignment, {
      headers: authHeader()
    });
  }

  deleteAssignment(assignmentId, userId) {
    return axios.delete(API_URL + 'deleteAssignment/assignmentId/' + assignmentId, {
      headers: authHeader()
    });
  }

  getStudentSubmittedAssignmentStatus(currentPage, assignmentsPerPage) {
    return axios.get(API_URL + 'studentAssignmentsStatus', {
      params: {
        page: currentPage,
        size: assignmentsPerPage
      },
      headers: authHeader()
    });
  }

  validateUsername(username) {
    return axios.get(API_URL + 'validateUsername', {
      params: {
        username: username,
      },
      headers: authHeader()
    });
  }

  validateEmail(email) {
    return axios.get(API_URL + 'validateEmail', {
      params: {
        email: email,
      },
      headers: authHeader()
    });
  }

  signup(userData) {
    return axios.post(API_URL + 'signup', userData, {
      headers: authHeader()
    });
  }

  getDepartmentNames() {
    return axios.get(API_URL + 'departmentNames', {
      headers: authHeader()
    });
  }

}


export default new AdminService();
