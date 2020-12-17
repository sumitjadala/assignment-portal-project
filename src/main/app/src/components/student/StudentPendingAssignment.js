import React from 'react'
import Moment from 'moment';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { Card, Table, Button, Modal, InputGroup, Form, Col } from 'react-bootstrap';
import AuthService from "../../services/AuthService";
import StudentService from '../../services/StudentService';
import { faUpload, faDownload, faStepBackward, faFastBackward, faStepForward, faFastForward, faEye } from '@fortawesome/free-solid-svg-icons';
import fileDownload from 'js-file-download';
import MyToast from '../MyToast.js'

const user = AuthService.getCurrentUser();

export default class StudentPendingAssignment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      assignmentStatus: [],
      title: '',
      subject: '',
      description: '',
      submissionDate:'',
      submissionStatus: '',
      facultyName: '',
      showAssignmentDetailsModalFlag: false,
      submitAssignmentForm: false,
      currentPage: 1,
      assignmentsPerPage: 5,
      submittedAssignmentFile: '',
      assignmentId: '',
      showSuccessToast: false,
      showErrorToast: false,
      errorMessage: '',
    };
    this.hideAssignmentDetailsModal = this.hideAssignmentDetailsModal.bind(this);
    this.hideSubmitAssignmentForm = this.hideSubmitAssignmentForm.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
  }

  componentDidMount() {
    this.getPendingAssignments(this.state.currentPage);
  }

  getPendingAssignments(currentPage) {
    currentPage -= 1;
    StudentService.getPendingAssignments(user.id, currentPage, this.state.assignmentsPerPage).then((res) => {
      console.log('StudentPendingAssignment called');
      this.setState({
        assignmentStatus: res.data.content,
        totalPages: res.data.totalPages,
        totalElements: res.data.totalElements,
        currentPage: res.data.number + 1
      });
    });
  }

  showSubmitAssignmentForm(ass) {
    this.setState({
      title: ass.title,
      assignmentId: ass.assignmentId,
      submitAssignmentForm: true,
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
    this.setState({showAssignmentDetailsModalFlag: false, title: '', assignmentId:''});
  };

  hideSubmitAssignmentForm() {
    this.setState({submitAssignmentForm: false, title: '', subject: '', description: '', submissionDate: '',validated: false, submittedAssignmentFile:''});
  };

  downloadFile(uploadedFileName) {
    console.log(uploadedFileName);
    StudentService.downloadFile(uploadedFileName).then((res) => {
      fileDownload(res.data, uploadedFileName);
    }, (error) => {
      console.log('Error');
    });
  }

  firstPage = () => {
    let firstPage = 1;
    if (this.state.currentPage > firstPage) {
      this.getPendingAssignments(firstPage);
    }
  };

  prevPage = () => {
    let prevPage = 1;
    if (this.state.currentPage > prevPage) {
      this.getPendingAssignments(this.state.currentPage - prevPage);
    }
  };

  lastPage = () => {
    let condition = Math.ceil(this.state.totalElements / this.state.assignmentsPerPage);
    if (this.state.currentPage < condition) {
      this.getPendingAssignments(condition);
    }
  };

  nextPage = () => {
    if (this.state.currentPage < Math.ceil(this.state.totalElements / this.state.assignmentsPerPage)) {
      this.getPendingAssignments(this.state.currentPage + 1);
    }
  };

  changeAssignmentFileHandler = (event) => {
    this.setState({submittedAssignmentFile: event.target.files[0]});
  }

  submitAssignment = (e) => {
    const form = e.currentTarget;
    console.log('Submit Assignment Clicked');
    if (form.checkValidity() === false) {
      console.log('Form validation failed');
      e.preventDefault();
      e.stopPropagation();
      this.setState({validated: true});
    } else {
      e.preventDefault();
      console.log('Successfully submitted');
      const formData = new FormData();
      formData.append('submittedAssignmentFile', this.state.submittedAssignmentFile);
      formData.append('userId', user.id);
      formData.append('assignmentId', this.state.assignmentId);
      formData.append('title', this.state.title);

      console.log('formData => ' + JSON.stringify(formData));
      StudentService.submitAssignment(formData).then(res => {
        if(res.status === 200) {
          console.log('Submited successfully');
          this.setState({ showSuccessToast: true });
          setTimeout(() => this.setState({ showSuccessToast: false }),5000);
          this.setState({submitAssignmentForm: false, validated: false, submittedAssignmentFile: '', title:'', assignmentId:''});
          this.getPendingAssignments(this.state.currentPage);
        } else {
          this.setState({ showErrorToast: true });
        }
      }).catch(error => {
       console.log(error.response.data.message);
       this.setState({ showErrorToast: true });
       setTimeout(() => this.setState({ showErrorToast: false }),5000);
       this.setState({errorMessage:error.response.data.message})
     });
   }
  }

  render () {
    return (
      <div>
        <div style={{"display":this.state.showSuccessToast ? "block" : "none"}}>
          <MyToast children = {{showSuccessToast:this.state.showSuccessToast, message:"Assignment submitted"}}/>
        </div>
        <div style={{"display":this.state.showErrorToast ? "block" : "none"}}>
          <MyToast children = {{showErrorToast:this.state.showErrorToast, message:this.state.errorMessage}}/>
        </div>
        <Card className={"border"}>
          {/* *************** START Submit Assignment Code *************** */}
          <Modal show={this.state.submitAssignmentForm} onHide={this.hideSubmitAssignmentForm} animation={false}>
            <Modal.Header closeButton="closeButton">
              <Modal.Title>Submit Assignment</Modal.Title>
            </Modal.Header>
            <Form id="submitAssignmentForm" noValidate validated={this.state.validated} onSubmit={this.submitAssignment}>
              <Modal.Body>
                <h5 className="ml-3"> Title </h5>
                <p className="ml-3"> {this.state.title} </p>

                <Form.Group as={Col} controlId="formGridSubmittingAssignmentFile">
                  <Form.Label className="h6">Upload Submission Assignment File :</Form.Label>
                  <Form.Text muted="muted">Please upload doc/pdf files only.</Form.Text>
                  <Form.File required name="assignmentFile" accept="application/msword, application/pdf" label="Select file" custom onChange={this.changeAssignmentFileHandler} />
                  {this.state.submittedAssignmentFile ? <p><br /> {this.state.submittedAssignmentFile.name} </p> : null }
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.hideSubmitAssignmentForm}> Close </Button>
                <Button variant="primary" type="submit"> Submit </Button>
              </Modal.Footer>
            </Form>
          </Modal>
          {/* *************** END Submit Assignment Code *************** */}

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
                  }
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.hideAssignmentDetailsModal}> Close </Button>
              </Modal.Footer>
            </Modal>
          {/* *************** END Assignment Details Code *************** */}

          {/* *************** START Pending Assignment Code *************** */}
          <Card.Body>
            <Table bordered hover striped className="borderless">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Submission date</th>
                  <th>Submission Status</th>
                  <th>Actions</th>
                  <th>Upload Assignment</th>
                </tr>
              </thead>
              {
                this.state.assignmentStatus.length > 0 ? <tbody>
                {
                  this.state.assignmentStatus.map((as) => (<tr key={as.id}>
                    <td style={{width: '350px'}}>{as.title}</td>
                    <td style={{width: '200px'}}>{as.subject}</td>
                    <td style={{width: '160px'}}>{Moment(as.submissionDate).format('DD-MM-YYYY')}</td>
                    <td style={{width: '180px'}}>
                      {as.isSubmitted === 1 && <p> Submitted.</p>}
                      {as.isSubmitted === 2 && <p> Submission Pending.</p>}
                      {as.isSubmitted === 3 && <p> Due date passed.</p>}
                    </td>
                    <td style={{width: '145px'}}>
                      <button style={{ marginLeft: "10px"}} className="btn btn-outline-success my-2 my-sm-0" data-toggle="tooltip" data-placement="top" title="Download Assignment" onClick={() => this.downloadFile(as.assignmentDetailsFileName)}>
                        <FontAwesomeIcon icon={faDownload}/>
                      </button>
                      <button style={{ marginLeft: "10px" }} className="btn btn-outline-success my-2 my-sm-0" data-toggle="tooltip" data-placement="top" title="View Assignment" onClick={() => this.showAssignmentDetailsModal(as)}>
                        <FontAwesomeIcon icon={faEye}/>
                      </button>
                    </td>
                    <td style={{width: '190px'}}> <Button disabled={as.isSubmitted === 3} data-toggle="tooltip" data-placement="top" title="Submit Assignment" onClick={() => this.showSubmitAssignmentForm(as)}><FontAwesomeIcon icon={faUpload}/> Upload File </Button> </td>
                  </tr>))
                }
              </tbody> : <tbody className="p-2 font-italic">No records found !</tbody>
          }
            </Table>
          </Card.Body>
          {/* *************** END Pending Assignment Code *************** */}

          {/* *************** START Pagination Code *************** */}
          {
            this.state.assignmentStatus.length > 0
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
