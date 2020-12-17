import React, {Component} from "react";
import userImg from '../img/userImg.png';
import {Col, Form, Button} from 'react-bootstrap';
import AdminService from './../services/AdminService';
import MyToast from './MyToast.js';

export default class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      username: '',
      email: '',
      mobileNo: '',
      role: 'Student',
      password: '',
      usernameExist: '',
      userNameErrorMessage : '',
      emailExist: '',
      emailErrorMessage: '',
      validated: false,
      departmentNames: [],
      selectedDepartmentName: '',
      showSuccessToast: false,
    };
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeMobileNo = this.onChangeMobileNo.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeRole = this.onChangeRole.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeDepartment = this.onChangeDepartment.bind(this);
  }

  onChangeName(e) {
    this.setState({name: e.target.value});
  }

  onChangeUsername(e) {
    console.log('onchangeusernmae called ' + e.target.value);
    this.setState({username: e.target.value});
    AdminService.validateUsername(e.target.value).then(res => {
      if(res.data) {
        this.setState({
          usernameExist: false,
          validated: false,
        });
      }
    }).catch(error => {
     console.log('catch block :' + error.response.data.message);
     this.setState({ usernameExist: true, userNameErrorMessage: error.response.data.message });
   });
  }

  onChangeEmail(e) {
    console.log('onChangeEmail called ' + e.target.value);
    this.setState({email: e.target.value});
    AdminService.validateEmail(e.target.value).then(res => {
      if(res.data) {
        this.setState({
          emailExist: false,
          validated: false,
        });
      }
    }).catch(error => {
     console.log('catch block :' + error.response.data.message);
     this.setState({ emailExist: true, emailErrorMessage: error.response.data.message });
   });
  }

  onChangeMobileNo(e) {
    this.setState({mobileNo: e.target.value});
  }

  onChangeRole(e) {
    console.log(e.target.value);
    this.setState({role: e.target.value});
    console.log('after ' + this.state.role);
  }

  onChangePassword(e) {
    this.setState({password: e.target.value});
  }

  onChangeDepartment(e) {
    console.log('Selected : ' + e.target.value);
    this.setState({selectedDepartmentName: e.target.value});
  }

  handleRegister = (e) => {
    console.log('Register User clicked');
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      console.log('Form validation failed');
      e.preventDefault();
      e.stopPropagation();
      this.setState({validated: true});
    } else {
      console.log('Registering user called')
      e.preventDefault();
      const formData = new FormData();
      formData.append('name', this.state.name);
      formData.append('username', this.state.username);
      formData.append('email', this.state.email);
      formData.append('mobileNo', this.state.mobileNo);
      formData.append('role', this.state.role);
      formData.append('password', this.state.password);
      formData.append('selectedDepartmentName', this.state.selectedDepartmentName);
      console.log('formData => ' + JSON.stringify(formData));

      AdminService.signup(formData).then(res => {
        console.log('Registered successfully');
        this.setState({ showSuccessToast: true });
        setTimeout(() => this.setState({ showSuccessToast: false }),5000);
        this.setState({ name: '', username: '', email: '', mobileNo: '', role: '', password: '', validated: false, usernameExist: '', userNameErrorMessage : '', emailExist: '', emailErrorMessage: ''});
      }).catch(error => {
       console.log(error.response.data.message);
     });
    }
  }

  getDepartmentNames = (e) => {
    AdminService.getDepartmentNames().then((res) => {
      console.log(res.data);
      this.setState({ departmentNames: res.data });
    })
  }

  render() {
    return (
      <div>
        <div style={{"display":this.state.showSuccessToast ? "block" : "none"}}>
          <MyToast children = {{showSuccessToast:this.state.showSuccessToast, message:"Added user successfully"}}/>
        </div>
        <div className="col-md-12">
        <div className="card card-container add-user">
          <img src={userImg} alt="profile-img" className="profile-img-card"/>

          <Form id="registerFormId" noValidate="noValidate" validated={this.state.validated} onSubmit={this.handleRegister}>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridName">
                <Form.Label>Name:</Form.Label>
                <Form.Control required="required" size="sm" type="text" name="title" placeholder="Enter Name" autoComplete="off" value={this.state.name} onChange={this.onChangeName}/>
                <Form.Control.Feedback type="invalid">Please enter name.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control required="required" size="sm" type="text" name="username" placeholder="Enter Username" autoComplete="off" value={this.state.username} onChange={this.onChangeUsername}/>
                { this.state.usernameExist ? <p className="text-danger small pt-1"> {this.state.userNameErrorMessage} </p> : null }
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control required="required" size="sm" type="email" name="email" placeholder="Enter Email" autoComplete="off" value={this.state.email} onChange={this.onChangeEmail}/>
                { this.state.emailExist ? <p className="text-danger small pt-1"> {this.state.emailErrorMessage} </p> : null }
              </Form.Group>
              <Form.Group as={Col} controlId="formGridMobileNo">
                <Form.Label>Mobile no:</Form.Label>
                <Form.Control required="required" size="sm" type="tel" name="mobileNo" placeholder="Enter Mobile no." autoComplete="off" value={this.state.mobileNo} onChange={this.onChangeMobileNo}/>
                <Form.Control.Feedback type="invalid">Please enter mobile no.</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridRole">
                <Form.Label>Role:</Form.Label>
                <Form.Control size="sm" as="select" onChange={this.onChangeRole}>
                  <option>Student</option>
                  <option>Faculty</option>
                  <option>Admin</option>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridDepartment">
                <Form.Label>Department:</Form.Label>
                <Form.Control size="sm" as="select" onChange={this.onChangeDepartment} onClick={this.getDepartmentNames}>
                  {
                    this.state.departmentNames.map((d, index) => (
                      <option key={index}> {d} </option>
                    ))
                  }

                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control required="required" size="sm" type="password" name="password" placeholder="Enter Password" autoComplete="off" value={this.state.password} onChange={this.onChangePassword}/>
                <Form.Control.Feedback type="invalid">Please enter password.</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Button disabled={this.state.usernameExist || this.state.emailExist} variant="primary" type="submit">Register user</Button>
          </Form>
        </div>
      </div>
      </div>
      );
  }
}
