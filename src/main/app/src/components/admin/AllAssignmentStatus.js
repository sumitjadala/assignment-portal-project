import React from 'react'
import Moment from 'moment';
import { Card, Table, InputGroup, Button, Modal } from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faDownload, faEye, faStepBackward, faFastBackward, faStepForward, faFastForward } from '@fortawesome/free-solid-svg-icons';
import AdminService from '../../services/AdminService';
import fileDownload from 'js-file-download';

export default class AllAssignmentStatus extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      allAsignmentsStatus: [],
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
    this.getStudentSubmittedAssignmentStatus(this.state.currentPage);
  }

  getStudentSubmittedAssignmentStatus(currentPage) {
    currentPage -= 1;
    AdminService.getStudentSubmittedAssignmentStatus(currentPage, this.state.assignmentsPerPage).then((res) => {
      console.log('StudentAllAssignment called');
      this.setState({
        allAsignmentsStatus: res.data.content,
        totalPages: res.data.totalPages,
        totalElements: res.data.totalElements,
        currentPage: res.data.number + 1
      });
    });
  }

  firstPage = () => {
    let firstPage = 1;
    if (this.state.currentPage > firstPage) {
      this.getStudentSubmittedAssignmentStatus(firstPage);
    }
  };

  prevPage = () => {
    let prevPage = 1;
    if (this.state.currentPage > prevPage) {
      this.getStudentSubmittedAssignmentStatus(this.state.currentPage - prevPage);
    }
  };

  lastPage = () => {
    let condition = Math.ceil(this.state.totalElements / this.state.assignmentsPerPage);
    if (this.state.currentPage < condition) {
      this.getStudentSubmittedAssignmentStatus(condition);
    }
  };

  nextPage = () => {
    if (this.state.currentPage < Math.ceil(this.state.totalElements / this.state.assignmentsPerPage)) {
      this.getStudentSubmittedAssignmentStatus(this.state.currentPage + 1);
    }
  };

  downloadFile(uploadedFileName) {
    console.log(uploadedFileName);
    AdminService.downloadFile(uploadedFileName).then((res) => {
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
            <Table bordered hover striped >
              <thead>
                <tr>
                  <th>Student name</th>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Submission Status</th>
                  <th>View</th>
                  <th>Submitted file</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.allAsignmentsStatus.map((as) => (<tr key={as.id}>
                    <td style={{width: '135px'}}>{as.studentName}</td>
                    <td style={{width: '350px'}}>{as.title}</td>
                    <td style={{width: '200px'}}>{as.subject}</td>
                    <td style={{width: '175px'}}>
                    {as.isSubmitted === 1 ? <p>Submitted.</p> : as.isSubmitted === 2
                          ? <p>Submission Pending.</p> : <p>Due date passed.</p>}
                    </td>
                    <td style={{width: '50px'}}>
                      <button style={{ marginLeft: "10px" }} className="btn btn-outline-success my-2 my-sm-0" data-toggle="tooltip" data-placement="top" title="View Assignment" onClick={() => this.showAssignmentDetailsModal(as)}>
                        <FontAwesomeIcon icon={faEye}/>
                      </button>
                    </td>
                    <td style={{width: '140px'}}>
                      <button disabled={(as.isSubmitted === 2 || as.isSubmitted === 3)} style={{ marginLeft: "10px" }} className="btn btn-outline-success my-2 my-sm-0" data-toggle="tooltip" data-placement="top" title="Download Assignment" onClick={() => this.downloadFile(as.studentSubmittedFile)}>
                        <FontAwesomeIcon icon={faDownload}/>
                      </button>
                    </td>
                  </tr>))
                }
              </tbody>
            </Table>
          </Card.Body>
          {/* *************** START Pagination Code *************** */}
          {
            this.state.allAsignmentsStatus.length > 0
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
