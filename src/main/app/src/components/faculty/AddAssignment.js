import React from 'react'
import {Modal, Button, Col, Form} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AuthService from "../../services/AuthService";
import FacultyService from '../../services/FacultyService';
import MyToast from '../MyToast.js';

const user = AuthService.getCurrentUser();

class AddAssignment extends React.Component {

  constructor(props) {
    console.log('AddAssignment called');
    super(props);
    this.state = {
      show: false,
      title: '',
      subject: '',
      description: '',
      submissionDate: new Date(),
      assignmentFile: '',
      validated: false,
      showErrorToast: false,
      titleExist: false,
    };
    this.changeTitleHandler = this.changeTitleHandler.bind(this);
    this.changeSubjectHandler = this.changeSubjectHandler.bind(this);
    this.changeDescriptionHandler = this.changeDescriptionHandler.bind(this);
    this.changeSubmissionDateHandler = this.changeSubmissionDateHandler.bind(this);
    this.saveAssignment = this.saveAssignment.bind(this);
    this.changeAssignmentFileHandler = this.changeAssignmentFileHandler.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  saveAssignment = (e) => {
    console.log('Save Assignment clicked');
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      console.log('Form validation failed');
      e.preventDefault();
      e.stopPropagation();
      this.setState({validated: true});
    } else {
      console.log('saveAssignment called')
      e.preventDefault();
      const formData = new FormData();
      formData.append('title', this.state.title);
      formData.append('subject', this.state.subject);
      formData.append('description', this.state.description);
      formData.append('submissionDate', this.state.submissionDate.getTime());
      formData.append('assignmentFile', this.state.assignmentFile);
      formData.append('userId', user.id);
      console.log('formData => ' + JSON.stringify(formData));

      FacultyService.createAssignment(formData).then(res => {
        console.log('Added successfully');
        this.setState({ show: false, title: '', subject: '', description: '', submissionDate: new Date(), assignmentFile: false, validated: false });
        window.location.reload(false);
      }).catch(error => {
       console.log(error.response.data.message);
       this.setState({ showErrorToast: true });
       setTimeout(() => this.setState({ showErrorToast: false }),5000);
       this.setState({errorMessage:error.response.data.message})
     });
    }
  };

  changeTitleHandler = (event) => {
    this.setState({title: event.target.value});
    FacultyService.checkIfTitleUnique(user.id, event.target.value).then(res => {
      if(res.data) {
        console.log('Title already exist');
        this.setState({
          titleExist: true,
          validated: false,
        });
      } else {
        console.log('Ok');
        this.setState({
          titleExist: false,
        })
      }
    });
  };

  changeSubjectHandler = (event) => {
    this.setState({subject: event.target.value});
  };

  changeDescriptionHandler = (event) => {
    this.setState({description: event.target.value});
  };

  changeSubmissionDateHandler(date) {
    console.log(date.getTime());
    this.setState({submissionDate: date});
  };

  changeAssignmentFileHandler = (event) => {
    this.setState({assignmentFile: event.target.files[0]});
  }

  handleShow() {
    this.setState({show: true});
  }

  handleClose() {
    this.setState({show: false, validated: false, title: '', subject: '', description: '', submissionDate: new Date(), assignmentFile:'', titleExist: false });
  }

  render() {
    return (<div>
      <Button variant="primary" onClick={this.handleShow}>
        <FontAwesomeIcon icon={faPlusCircle} className="mr-2"/>
        Add Assignment
      </Button>

      <div style={{"display":this.state.showErrorToast ? "block" : "none"}}>
        <MyToast children = {{showErrorToast:this.state.showErrorToast, message:this.state.errorMessage}}/>
      </div>

      <Modal show={this.state.show} onHide={this.handleClose.bind(this)} backdrop="static">
        <Modal.Header closeButton="closeButton">
          <Modal.Title>Add Assignment</Modal.Title>
        </Modal.Header>
        <Form id="assignmentFormId" noValidate validated={this.state.validated} onSubmit={this.saveAssignment}>
          <Modal.Body>
            <Form.Group as={Col} controlId="formGridTitle">
              <Form.Label>Title:</Form.Label>
              <Form.Control required type="text" name="title" placeholder="Enter Title" autoComplete="off" value={this.state.title} onChange={this.changeTitleHandler}/>
              <Form.Control.Feedback type="invalid">Please enter title.</Form.Control.Feedback>
              {this.state.titleExist ? <p className="text-danger small pt-1"> Title already exist</p> : null }
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
              <DatePicker required className="form-control" selected={this.state.submissionDate} onChange={this.changeSubmissionDateHandler} name="startDate" dateFormat="MM/dd/yyyy"/>
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
            <Button variant="secondary" onClick={this.handleClose.bind(this)}>Close</Button>
            <Button disabled={this.state.titleExist} variant="primary" type="submit">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>);
  }
}

export default AddAssignment;
