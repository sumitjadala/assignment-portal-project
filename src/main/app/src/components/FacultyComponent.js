import React, {Component} from 'react';
import '../css/FacultyComponent.css';
import Tabs from './Tabs';
import CreatedAssignment from './faculty/CreatedAssignment';
import FacultyStudentAssignmentDetails from './faculty/FacultyStudentAssignmentDetails';
import { Redirect } from "react-router-dom";
import AuthService from '../services/AuthService';

const user = AuthService.getCurrentUser();

class FacultyComponent extends Component {

  render() {
    return (
      <div>
      { user ? <Tabs>
          <div label="Created Assignment">
            <CreatedAssignment/>
          </div>
          <div label="Assignment Status">
            <FacultyStudentAssignmentDetails/>
          </div>
        </Tabs> : <Redirect to="/login" />
      }
      </div>
    );
  }
}

export default FacultyComponent;
