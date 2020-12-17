import React, {Component} from 'react'
import moment from 'moment';
import AuthService from "../../services/AuthService";
import FacultyService from '../../services/FacultyService';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTasks, faDownload, faStepBackward, faFastBackward, faStepForward, faFastForward, faEye} from '@fortawesome/free-solid-svg-icons';
import fileDownload from 'js-file-download';
import { Card, Table, ListGroup, InputGroup, Button, Modal, Form, Col } from 'react-bootstrap';
import AddAssignment from './AddAssignment'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const user = AuthService.getCurrentUser();

export default class CreatedAssignment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      createdAssignments: [],
      currentPage: 1,
      assignmentsPerPage: 5,
      updateAssignmentId: '',
      showUpdateModal: false,
      showAssignmentDetailsModalFlag: false,
      title: '',
      subject: '',
      description: '',
      submissionDate: new Date(),
      assignmentFile: '',
      validated: false,
    };
    this.assignToStudents = this.assignToStudents.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.deleteAssignment = this.deleteAssignment.bind(this);
    this.showUpdateModal = this.showUpdateModal.bind(this);
    this.hideUpdateModal = this.hideUpdateModal.bind(this);
    this.showAssignmentDetailsModal = this.showAssignmentDetailsModal.bind(this);
    this.hideAssignmentDetailsModal = this.hideAssignmentDetailsModal.bind(this);
    this.changeTitleHandler = this.changeTitleHandler.bind(this);
    this.changeSubjectHandler = this.changeSubjectHandler.bind(this);
    this.changeDescriptionHandler = this.changeDescriptionHandler.bind(this);
    this.changeSubmissionDateHandler = this.changeSubmissionDateHandler.bind(this);
  }

  componentDidMount() {
    console.log('CreatedAssignment');
    this.getAllAssignments(this.state.currentPage);
  }

  getAllAssignments(currentPage) {
    currentPage -= 1;
    FacultyService.getAssignments(user.id, currentPage, this.state.assignmentsPerPage).then((res) => {
      this.setState({
        createdAssignments: res.data.content,
        totalPages: res.data.totalPages,
        totalElements: res.data.totalElements,
        currentPage: res.data.number + 1
      })
    });
  }

  updateAssignment = (e) => {
    console.log('Update Assignment called');
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      console.log('Form validation failed');
      e.preventDefault();
      e.stopPropagation();
      this.setState({validated: true});
    } else {
      e.preventDefault();
      const formData = new FormData();
      formData.append('title', this.state.title);
      formData.append('subject', this.state.subject);
      formData.append('description', this.state.description);
      formData.append('submissionDate', this.state.submissionDate.getTime());
      formData.append('assignmentFile', this.state.assignmentFile);
      formData.append('userId', user.id);
      formData.append('assignmentId', this.state.updateAssignmentId);

      FacultyService.updateAssignment(formData, user.id, this.state.updateAssignmentId).then(res => {
        console.log('Updated successfully');
        this.setState({
          show: false,
          title: '',
          subject: '',
          description: '',
          submissionDate: '',
          assignmentFile: '',
          validated: false
        });
        this.getAllAssignments(this.state.currentPage);
        this.hideUpdateModal();
      });
    }
  };

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

  assignToStudents(id) {
    FacultyService.assignToStudents(id, user.id).then((res) => {
      console.log('Assigned successfully !');
      this.getAllAssignments(this.state.currentPage);
    });
  }

  downloadFile(uploadedFileName) {
    FacultyService.downloadFile(uploadedFileName).then((res) => {
      fileDownload(res.data, uploadedFileName);
    }, (error) => {
      console.log('Error');
    });
  }

  deleteAssignment(assignmentId) {
    console.log('Deleted assignment');
    FacultyService.deleteAssignment(assignmentId, user.id).then((res) => {
        this.getAllAssignments(this.state.currentPage);
    });
  };

  showUpdateModal(id) {
    FacultyService.getAssignmentById(user.id, id).then((res) => {
      this.setState({title: res.data.title, subject: res.data.subject, submissionDate: '', description: res.data.description, assignmentFile: res.data.assignmentDetailsFileName})
    });
    this.setState({showUpdateModal: true, updateAssignmentId: id});
  }

  hideUpdateModal() {
    this.setState({showUpdateModal: false, updateAssignmentId: ''});
  };

  showAssignmentDetailsModal(ass) {
    this.setState({
      showAssignmentDetailsModalFlag: true,
      title: ass.title,
      subject: ass.subject,
      description: ass.description,
      submissionDate: moment(ass.submissionDate).format('MM-DD-YYYY')
    });
  };

  hideAssignmentDetailsModal() {
    this.setState({showAssignmentDetailsModalFlag: false, title: '', subject: '', description: '', submissionDate: ''});
  };

  changeTitleHandler = (event) => {
    this.setState({title: event.target.value});
  };

  changeSubjectHandler = (event) => {
    this.setState({subject: event.target.value});
  };

  changeDescriptionHandler = (event) => {
    this.setState({description: event.target.value});
  };

  changeSubmissionDateHandler(date) {
    this.setState({submissionDate: date});
  };

  changeAssignmentFileHandler = (event) => {
    this.setState({assignmentFile: event.target.files[0]});
  }

  render() {
    return (
      <div>
        <Card className={"border"}>
          {/* *************** Start Update Modal Code *************** */}
          <Modal show={this.state.showUpdateModal} onHide={this.hideUpdateModal} animation={false}>
            <Modal.Header closeButton="closeButton">
              <Modal.Title>Update Assignment</Modal.Title>
            </Modal.Header>
            <Form id="updateFormId" noValidate validated={this.state.validated} onSubmit={this.updateAssignment}>
              <Modal.Body>
                <Form.Group as={Col} controlId="formGridTitle">
                  <Form.Label>Title:</Form.Label>
                  <Form.Control required type="text" name="title" placeholder="Enter Title" autoComplete="off" value={this.state.title} onChange={this.changeTitleHandler}/>
                  <Form.Control.Feedback type="invalid">Please enter title.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridSubject">
                  <Form.Label>Subject:</Form.Label>
                  <Form.Control required type="text" name="subject" placeholder="Enter Subject" autoComplete="off" value={this.state.subject} onChange={this.changeSubjectHandler}/>
                  <Form.Control.Feedback type="invalid">Please enter subject.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridDescription">
                  <Form.Label>Description:</Form.Label>
                  <Form.Control required type="text" name="description" placeholder="Enter Description" autoComplete="off" value={this.state.description} onChange={this.changeDescriptionHandler}/>
                  <Form.Control.Feedback type="invalid">Please enter description.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridSubmissionDate">
                  <Form.Label>Submission Date:</Form.Label>
                  <DatePicker required className="form-control" selected={this.state.submissionDate} onChange={this.changeSubmissionDateHandler} name="startDate"/>
                  <Form.Control.Feedback type="invalid">Please select date.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridUploadAssignmentFile">
                  <Form.Label>Upload Assignment File :</Form.Label>
                  <Form.Text muted="muted">Please upload doc/ pdf files only.</Form.Text>
                  <Form.File required name="assignmentFile" accept="application/msword, application/pdf" label="Select assignment file" custom onChange={this.changeAssignmentFileHandler}/>
                  {this.state.assignmentFile ? <p><br /> {this.state.assignmentFile.name} </p> : ''}
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.hideUpdateModal}> Close </Button>
                <Button variant="primary" type="submit"> Save Changes </Button>
              </Modal.Footer>
            </Form>
          </Modal>
          {/* *************** END Update Modal Code *************** */}

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
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.hideAssignmentDetailsModal}> Close </Button>
            </Modal.Footer>
          </Modal>
          {/* *************** END Assignment Details Code *************** */}

          {/* *************** START Created Assignment Code *************** */}
          <Card.Body>
            <ListGroup horizontal="horizontal">
              <ListGroup.Item className="border-0"><AddAssignment/></ListGroup.Item>
            </ListGroup>
            <Table bordered="bordered" hover="hover" striped="striped" responsive="responsive" className="borderless">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Created date</th>
                  <th>Submission date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {
                this.state.createdAssignments.length > 0 ? <tbody>
                {
                  this.state.createdAssignments.map((ass) => (<tr key={ass.id}>
                    <td style={{width: '250px'}}>{ass.title}</td>
                    <td style={{width: '200px'}}>{ass.subject}</td>
                    <td style={{width: '100px'}}>{moment(ass.createdTime).format('MM-DD-YYYY')}</td>
                    <td style={{width: '120px'}}>{moment(ass.submissionDate).format('MM-DD-YYYY')}</td>
                    <td style={{width: '230px'}}>
                      <button disabled={ass.isAssigned === true} onClick={() => this.assignToStudents(ass.id)} className="btn btn-outline-success my-2 my-sm-0" data-toggle="tooltip" data-placement="top" title="Assign to students">
                        <FontAwesomeIcon icon={faTasks}/>
                      </button>
                      <button style={{ marginLeft: "10px" }} onClick={() => this.showUpdateModal(ass.id)} className="btn btn-outline-success my-2 my-sm-0" data-toggle="tooltip" data-placement="top" title="Edit Assignment">
                        <FontAwesomeIcon icon={faEdit}/>
                      </button>
                      <button style={{ marginLeft: "10px" }} className="btn btn-outline-success my-2 my-sm-0" data-toggle="tooltip" data-placement="top" title="Delete Assignment" onClick={() => this.deleteAssignment(ass.id)}>
                        <FontAwesomeIcon icon={faTrash}/>
                      </button>
                      <button style={{ marginLeft: "10px" }} className="btn btn-outline-success my-2 my-sm-0" data-toggle="tooltip" data-placement="top" title="Download Assignment" onClick={() => this.downloadFile(ass.assignmentDetailsFileName)}>
                        <FontAwesomeIcon icon={faDownload}/>
                      </button>
                      <button style={{ marginLeft: "10px" }} className="btn btn-outline-success my-2 my-sm-0" data-toggle="tooltip" data-placement="top" title="View Assignment" onClick={() => this.showAssignmentDetailsModal(ass)}>
                        <FontAwesomeIcon icon={faEye}/>
                      </button>
                    </td>
                  </tr>))
                  }
              </tbody> : <tbody className="p-2 font-italic">No records found !</tbody>
          }
            </Table>
          </Card.Body>
          {/* *************** END Created Assignment Code *************** */}

          {/* *************** START Pagination Code *************** */}
          {
            this.state.createdAssignments.length > 0 ? <Card.Footer>
                  <div style={{ "float" : "left" }}>
                    Showing Page {this.state.currentPage} of  {this.state.totalPages}
                  </div>
                  <div style={{ "float" : "right" }}>
                    <InputGroup size="sm">
                      <InputGroup.Prepend>
                        <Button type="button" variant="outline-success" disabled={this.state.currentPage === 1 ? true : false} onClick={this.firstPage}>
                          <FontAwesomeIcon icon={faFastBackward}/> First
                        </Button>
                        <Button type="button" variant="outline-success" disabled={this.state.currentPage === 1 ? true : false} onClick={this.prevPage}>
                          <FontAwesomeIcon icon={faStepBackward}/> Prev
                        </Button>
                      </InputGroup.Prepend>
                      <Button type="button" variant="outline-success" disabled="disabled" className={"page-num"} name="currentPage">
                        {this.state.currentPage}
                      </Button>
                      <InputGroup.Append>
                        <Button type="button" variant="outline-success" disabled={this.state.currentPage === this.state.totalPages ? true : false} onClick={this.nextPage}>
                          <FontAwesomeIcon icon={faStepForward}/> Next
                        </Button>
                        <Button type="button" variant="outline-success" disabled={this.state.currentPage === this.state.totalPages ? true : false} onClick={this.lastPage}>
                          <FontAwesomeIcon icon={faFastForward} /> Last
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </div>
                </Card.Footer> : null
          }
          {/* *************** END Pagination Code *************** */}
        </Card>
      </div>
    );
  }
}
