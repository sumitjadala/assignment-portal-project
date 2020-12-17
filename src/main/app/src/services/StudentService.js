import axios from 'axios';
import authHeader from './AuthHeader';

const API_URL = 'http://localhost:8080/api/student/';

class StudentService {

  getPendingAssignments(id, currentPage, assignmentsPerPage) {
    return axios.get(API_URL + 'pendingAssignments/' + id ,{
      params: {
        page: currentPage,
        size: assignmentsPerPage
      },
      headers: authHeader()
    });
  }

  getAllAssignments(id, currentPage, assignmentsPerPage) {
    return axios.get(API_URL + 'getAllAssignments/' + id ,{
      params: {
        page: currentPage,
        size: assignmentsPerPage
      },
      headers: authHeader()
    });
  }

  downloadFile(uploadedFileName) {
    console.log(uploadedFileName);
    return axios.get(API_URL + 'downloadFile/' + uploadedFileName, {
      headers: authHeader(),
      responseType: 'blob'
    });
  }

  submitAssignment(assignment) {
    return axios.post(API_URL + 'submitAssignment', assignment, {
      headers: authHeader()
    });
  }

}

export default new StudentService();
