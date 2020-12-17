import React from 'react'
import Moment from 'moment';
import { Card, Table, InputGroup, Button, Modal, Col, Form } from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faEye, faStepBackward, faFastBackward, faStepForward, faFastForward, faDownload } from '@fortawesome/free-solid-svg-icons';
import fileDownload from 'js-file-download';
import AdminService from '../../services/AdminService';
import DatePicker from 'react-datepicker';

export default class AllCreatedAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allAssignments: [],
      currentPage : 1,
      assignmentsPerPage : 10,
      showAssignmentDetailsModalFlag: false,
      title: '', subject: '', description: '', submissionDate: '', assignmentFile: '',
      updateAssignmentId: '',
      showUpdateModal: false,
      validated: false,
    };
    this.downloadFile = this.downloadFile.bind(this);
    this.showAssignmentDetailsModal = this.showAssignmentDetailsModal.bind(this);
    this.hideAssignmentDetailsModal = this.hideAssignmentDetailsModal.bind(this);
    this.showUpdateModal = this.showUpdateModal.bind(this);
    this.hideUpdateModal = this.hideUpdateModal.bind(this);
    this.deleteAssignment = this.deleteAssignment.bind(this);
    this.changeTitleHandler = this.changeTitleHandler.bind(this);
    this.changeSubjectHandler = this.changeSubjectHandler.bind(this);
    this.changeDescriptionHandler = this.changeDescriptionHandler.bind(this);
    this.changeSubmissionDateHandler = this.changeSubmissionDateHandler.bind(this);
  }

  componentDidMount() {
    console.log('FacultyStudentAssignmentDetails called');
    this.getAssignments(this.state.currentPage);
  }

  getAssignments(currentPage) {
    currentPage -= 1;
    AdminService.getAssignments(currentPage, this.state.assignmentsPerPage).then((res) => {
      this.setState({
        allAssignments: res.data.content,
        totalPages: res.data.totalPages,
        totalElements: res.data.totalElements,
        currentPage: res.data.number + 1
      });
    }).catch((error) => {

    });
  }

  deleteAssignment(assignmentId) {
    AdminService.deleteAssignment(assignmentId).then((res) => {
        this.getAssignments(this.state.currentPage);
    });
  };

  downloadFile(uploadedFileName) {
    console.log(uploadedFileName);
    AdminService.downloadFile(uploadedFileName).then((res) => {
      fileDownload(res.data, uploadedFileName);
    }, (error) => {
      console.log('Error');
    });
  }

  firstPage = () => {
    let firstPage = 1;
    if(this.state.currentPage > firstPage) {
      this.getAssignments(firstPage);
    }
  };

  prevPage = () => {
    let prevPage = 1;
    if(this.state.currentPage > prevPage) {
      this.getAssignments(this.state.currentPage - prevPage);
    }
  };

  lastPage = () => {
      let condition = Math.ceil(this.state.totalElements / this.state.assignmentsPerPage);
      if(this.state.currentPage < condition) {
        this.getAssignments(condition);
      }
  };

  nextPage = () => {
      if(this.state.currentPage < Math.ceil(this.state.totalElements / this.state.assignmentsPerPage)) {
        this.getAssignments(this.state.currentPage + 1);
      }
  };

  showAssignmentDetailsModal(ass) {
    console.log('showAssignmentDetailsModal called' + ass.title + ' ' + ass.subject + ' ' + ass.description);
    this.setState({
      showAssignmentDetailsModalFlag: true,
      title: ass.title,
      subject: ass.subject,
      description: ass.description,
      createdTime: Moment(ass.createdTime).format('DD-MM-YYYY'),
      submissionDate: Moment(ass.submissionDate).format('DD-MM-YYYY')
    });
  };

  hideAssignmentDetailsModal() {
    this.setState({showAssignmentDetailsModalFlag: false, title: '', subject: '', description: '', submissionDate: ''});
  };

  updateAssignment = (e) => {
    console.log('update called');
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      console.log('form validation failed');
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
      formData.append('assignmentId', this.state.updateAssignmentId);
      console.log('formData => ' + JSON.stringify(formData));
      AdminService.updateAssignment(formData, this.state.updateAssignmentId).then(res => {
        console.log('Updated successfully');
        this.setState({
          show: false,
          title: '',
          subject: '',
          description: '',
          submissionDate: '',
          validated: false
        });
        this.getAssignments(this.state.currentPage);
        this.hideUpdateModal();
      });
    }
  };

  showUpdateModal(id) {
    console.log(id);
    AdminService.getAssignmentById(id).then((res) => {
      this.setState({title: res.data.title, subject: res.data.subject, submissionDate: '',
        description: res.data.description, showUpdateModal: true, updateAssignmentId: id})
    });
  }

  hideUpdateModal() {
    this.setState({showUpdateModal: false, updateAssignmentId: ''});
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

  render () {
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
          <h5> Created Date </h5>
          <p> {this.state.createdTime} </p>
          <h5> Submission Date </h5>
          <p> {this.state.submissionDate} </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.hideAssignmentDetailsModal}> Close </Button>
        </Modal.Footer>
      </Modal>
      {/* *************** END Assignment Details Code *************** */}
        <Card.Body>
          <Table bordered hover striped className="borderless">
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
              this.state.allAssignments.length > 0 ? <tbody>
              {
                this.state.allAssignments.map(as => <tr key={as.id}>
                  <td style={{width: '350px'}}>{as.title}</td>
                  <td style={{width: '200px'}}>{as.subject}</td>
                  <td style={{width: '130px'}}>{Moment(as.createdTime).format('DD-MM-YYYY')}</td>
                  <td style={{width: '150px'}}>{Moment(as.submissionDate).format('DD-MM-YYYY')}</td>
                  <td style={{width: '250px'}}>
                    <button disabled={(as.isSubmitted === 2 || as.isSubmitted === 3)} style={{marginLeft: "10px"}}
                      className="btn btn-outline-success my-2 my-sm-0"
                      data-toggle="tooltip" data-placement="top" title="Download"
                      onClick={ () => this.downloadFile(as.assignmentDetailsFileName)}>
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                    <button style={{ marginLeft: "10px" }} onClick={() => this.showUpdateModal(as.id)} className="btn btn-outline-success my-2 my-sm-0" data-toggle="tooltip" data-placement="top" title="Edit Assignment">
                      <FontAwesomeIcon icon={faEdit}/>
                    </button>
                    <button style={{ marginLeft: "10px" }} className="btn btn-outline-success my-2 my-sm-0" data-toggle="tooltip" data-placement="top" title="Delete Assignment" onClick={() => this.deleteAssignment(as.id)}>
                      <FontAwesomeIcon icon={faTrash}/>
                    </button>
                    <button style={{ marginLeft: "10px" }} className="btn btn-outline-success my-2 my-sm-0" data-toggle="tooltip" data-placement="top" title="View Assignment" onClick={() => this.showAssignmentDetailsModal(as)}>
                      <FontAwesomeIcon icon={faEye}/>
                    </button>
                   </td>
                </tr>)
              }
            </tbody> : <p className="p-2 font-italic">No records found !</p>
        }
          </Table>
        </Card.Body>
        {this.state.allAssignments.length > 0 ?
          <Card.Footer>
              <div style={{"float":"left"}}>
                  Showing Page {this.state.currentPage} of {this.state.totalPages}
              </div>
              <div style={{"float":"right"}}>
                  <InputGroup size="sm">
                      <InputGroup.Prepend>
                          <Button type="button" variant="outline-success" disabled={this.state.currentPage === 1 ? true : false}
                              onClick={this.firstPage}>
                              <FontAwesomeIcon icon={faFastBackward} /> First
                          </Button>
                          <Button type="button" variant="outline-success" disabled={this.state.currentPage === 1 ? true : false}
                              onClick={this.prevPage}>
                              <FontAwesomeIcon icon={faStepBackward} /> Prev
                          </Button>
                      </InputGroup.Prepend>
                      <Button type="button" variant="outline-success" disabled className={"page-num"} name="currentPage">
                        {this.state.currentPage}
                      </Button>
                      <InputGroup.Append>
                          <Button type="button" variant="outline-success" disabled={this.state.currentPage === this.state.totalPages ? true : false}
                              onClick={this.nextPage}>
                              <FontAwesomeIcon icon={faStepForward} /> Next
                          </Button>
                          <Button type="button" variant="outline-success" disabled={this.state.currentPage === this.state.totalPages ? true : false}
                              onClick={this.lastPage}>
                              <FontAwesomeIcon icon={faFastForward} /> Last
                          </Button>
                      </InputGroup.Append>
                  </InputGroup>
              </div>
          </Card.Footer> : null
       }
      </Card>
      </div>

    );
  }
}
