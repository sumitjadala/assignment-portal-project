import React, { Component } from "react";
import { Switch, Route, Link, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import 'react-tabs/style/react-tabs.css';
import AuthService from "./services/AuthService";
import Login from "./components/Login";
import AddUser from "./components/AddUser";
import Home from "./components/Home";
import Faculty from './components/FacultyComponent';
import CreatedAssignment from './components/faculty/CreatedAssignment';
import Student from './components/StudentComponent';
import AdminComponent from './components/AdminComponent';
import Error from "./Error";

class App extends Component {

  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showStudentBoard: false,
      showFacultyBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showStudentBoard: user.roles.includes("ROLE_STUDENT"),
        showFacultyBoard: user.roles.includes("ROLE_FACULTY"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser, showStudentBoard, showFacultyBoard, showAdminBoard } = this.state;

    return (
      <div>
        <nav className="navbar fixed-top navbar-expand navbar-dark bg-dark">

          <NavLink to={"/"} className="navbar-brand">
            Assignment-Portal
          </NavLink>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {showStudentBoard && (
              <li className="nav-item">
                <Link to={"/student"} className="nav-link">
                  Student Board
                </Link>
              </li>
            )}

            {showFacultyBoard && (
              <li className="nav-item">
                <Link to={"/faculty"} className="nav-link">
                  Faculty Board
                </Link>
              </li>
            )}

            {showAdminBoard && (
                <li className="nav-item">
                  <Link to={"/admin"} className="nav-link">
                    Admin Board
                  </Link>
                </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <NavLink to={"/addUser"} className="nav-link">
                  Add User
                </NavLink>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Logout</button>
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <NavLink to={"/login"} className="nav-link">
                  <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Login</button>
                </NavLink>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-5 ">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/addUser" component={AddUser} />
            <Route exact path="/admin" component={AdminComponent} />
            <Route exact path="/faculty" component={Faculty}/>
            <Route exact path="/faculty/createdAssignment" component={CreatedAssignment}/>
            <Route exact path="/student" component={Student}/>
            <Route component={Error} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
