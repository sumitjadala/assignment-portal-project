import React, {Component} from 'react';
import '../css/FacultyComponent.css';
import Tabs from './Tabs';
import AllCreatedAssignment from './admin/AllCreatedAssignment';
import AllAssignmentStatus from './admin/AllAssignmentStatus';
import AuthService from '../services/AuthService';
import { Redirect } from "react-router-dom";

const user = AuthService.getCurrentUser();

export default class AdminComponent extends Component {
  render() {
    return (<div>
      { user ? <Tabs>
          <div label="All Created Assignment">
            <AllCreatedAssignment/>
          </div>
          <div label="Submission Status">
            <AllAssignmentStatus/>
          </div>
        </Tabs> : <Redirect to="/login" />
      }
    </div>);
  }
}
