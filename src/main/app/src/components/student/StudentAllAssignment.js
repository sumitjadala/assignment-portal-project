import React from 'react'
import Moment from 'moment';
import { Card, Table, InputGroup, Button, Modal } from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faDownload, faEye, faStepBackward, faFastBackward, faStepForward, faFastForward } from '@fortawesome/free-solid-svg-icons';
import AuthService from "../../services/AuthService";
import StudentService from '../../services/StudentService';
import fileDownload from 'js-file-download';

const user = AuthService.getCurrentUser();

export default class StudentAllAssignment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      assignments: [],
      currentPage: 1,
      assignmentsPerPage: 5,
      showAssignmentDetailsModalFlag: false,
      title: '',
      subject: '',
      description: '',
      submissionDate:'',
      submissionStatus: '',
      assignmentId: '',
    };
    this.hideAssignmentDetailsModal = this.hideAssignmentDetailsModal.bind(this);
  }

  componentDidMount() {
    this.getAllAssignments(this.state.currentPage);
  }

  getAllAssignments(currentPage) {
    currentPage -= 1;
    StudentService.getAllAssignments(user.id, currentPage, this.state.assignmentsPerPage).then((res) => {
      console.log('StudentAllAssignment called');
      this.setState({
        assignments: res.data.content,
        totalPages: res.data.totalPages,
        totalElements: res.data.totalElements,
        currentPage: res.data.number + 1
      });
    });
  }

  firstPage = () => {
    let firstPage = 1;
    if (this.state.currentPage > firstPage) {
      this.getAllAssignments(firstPage);
    }
  };

  prevPage = () => {
    let prevPage = 1;
    if (this.state.currentPage > prevPage) {
      this.getAllAssignments(this.state.currentPage - prevPage);
    }
  };

  lastPage = () => {
    let condition = Math.ceil(this.state.totalElements / this.state.assignmentsPerPage);
    if (this.state.currentPage < condition) {
      this.getAllAssignments(condition);
    }
  };

  nextPage = () => {
    if (this.state.currentPage < Math.ceil(this.state.totalElements / this.state.assignmentsPerPage)) {
      this.getAllAssignments(this.state.currentPage + 1);
    }
  };

  downloadFile(uploadedFileName) {
    console.log(uploadedFileName);
    StudentService.downloadFile(uploadedFileName).then((res) => {
      fileDownload(res.data, uploadedFileName);
    }, (error) => {
      console.log('Error');
    });
  }

  showAssignmentDetailsModal(ass) {
    console.log('showAssignmentDetailsModal called' + ass.title + ' ' + ass.subject + ' ' + ass.description);
    this.setState({
      showAssignmentDetailsModalFlag: true,
      title: ass.title,
      subject: ass.subject,
      description: ass.description,
      submissionDate: Moment(ass.submissionDate).format('MM-DD-YYYY'),
      submissionStatus: ass.isSubmitted,
    });
  };

  hideAssignmentDetailsModal() {
    this.setState({
      showAssignmentDetailsModalFlag: false,
      title: '',
      assignmentId: '',
    });
  };

  render () {
    return(
      <div>
        {/* *************** START Assignment Details Code *************** */}
          <Modal show={this.state.showAssignmentDetailsModalFlag} onHide={this.hideAssignmentDetailsModal} animation={false}>
            <Modal.Header closeButton="closeButton">
              <Modal.Title>Assignment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5> Title  </h5>
              <p> {this.state.title} </p>
              <h5> Subject </h5>
              <p> {this.state.subject} </p>
              <h5> Description </h5>
              <p> {this.state.description} </p>
              <h5> Submission Date </h5>
              <p> {this.state.submissionDate} </p>
              <h5> Submission Status </h5>
              <p> {
                  this.state.submissionStatus === 1 ? <p> Submitted.</p> :
                  this.state.submissionStatus === 2 ? <p> Submission Pending.</p> :
                  <p> Due date passed.</p>
                } </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.hideAssignmentDetailsModal}> Close </Button>
            </Modal.Footer>
          </Modal>
        {/* *************** END Assignment Details Code *************** */}
        <Card className={"border"}>
          <Card.Body>
            <Table bordered hover striped className="borderless">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Submission date</th>
                  <th>Submission Status</th>
                  <th>Faculty Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {
                this.state.assignments.length > 0 ? <tbody>
                  {
                    this.state.assignments.map((as) => (<tr key={as.id}>
                      <td style={{width: '350px'}}>{as.title}</td>
                      <td style={{width: '200px'}}>{as.subject}</td>
                      <td style={{width: '160px'}}>{Moment(as.submissionDate).format('DD-MM-YYYY')}</td>
                      <td style={{width: '170px'}}>
                        {as.isSubmitted === 1 && <p> Submitted.</p>}
                        {as.isSubmitted === 2 && <p> Submission Pending.</p>}
                        {as.isSubmitted === 3 && <p> Due date passed.</p>}
                      </td>
                      <td style={{width: '135px'}}>{as.facultyName}</td>
                      <td style={{width: '140px'}}>
                        <button style={{ marginLeft: "10px" }} className="btn btn-outline-success my-2 my-sm-0" data-toggle="tooltip" data-placement="top" title="Download Assignment" onClick={() => this.downloadFile(as.assignmentDetailsFileName)}>
                          <FontAwesomeIcon icon={faDownload}/>
                        </button>
                        <button style={{ marginLeft: "10px" }} className="btn btn-outline-success my-2 my-sm-0" data-toggle="tooltip" data-placement="top" title="View Assignment" onClick={() => this.showAssignmentDetailsModal(as)}>
                          <FontAwesomeIcon icon={faEye}/>
                        </button>
                      </td>
                    </tr>))
                  }
                </tbody> : <tbody className="p-2 font-italic">No records found !</tbody>
              }
            </Table>
          </Card.Body>
          {/* *************** START Pagination Code *************** */}
          {
            this.state.assignments.length > 0
              ? <Card.Footer>
                  <div style={{
                      "float" : "left"
                    }}>
                    Showing Page {this.state.currentPage} of  {this.state.totalPages}
                  </div>
                  <div style={{
                      "float" : "right"
                    }}>
                    <InputGroup size="sm">
                      <InputGroup.Prepend>
                        <Button type="button" variant="outline-success" disabled={this.state.currentPage === 1
                            ? true
                            : false} onClick={this.firstPage}>
                          <FontAwesomeIcon icon={faFastBackward}/>
                          First
                        </Button>
                        <Button type="button" variant="outline-success" disabled={this.state.currentPage === 1
                            ? true
                            : false} onClick={this.prevPage}>
                          <FontAwesomeIcon icon={faStepBackward}/>
                          Prev
                        </Button>
                      </InputGroup.Prepend>
                      <Button type="button" variant="outline-success" disabled="disabled" className={"page-num"} name="currentPage">
                        {this.state.currentPage}
                      </Button>
                      <InputGroup.Append>
                        <Button type="button" variant="outline-success" disabled={this.state.currentPage === this.state.totalPages
                            ? true
                            : false} onClick={this.nextPage}>
                          <FontAwesomeIcon icon={faStepForward}/>
                          Next
                        </Button>
                        <Button type="button" variant="outline-success" disabled={this.state.currentPage === this.state.totalPages
                            ? true
                            : false} onClick={this.lastPage}>
                          <FontAwesomeIcon icon={faFastForward}/>
                          Last
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </div>
                </Card.Footer>
              : null
          }
          {/* *************** END Pagination Code *************** */}
        </Card>
      </div>
    );
  }
}
