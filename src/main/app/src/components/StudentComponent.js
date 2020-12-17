import React, {Component} from 'react'
import Tabs from './Tabs';
import StudentPendingAssignment from './student/StudentPendingAssignment';
import StudentAllAssignment from './student/StudentAllAssignment';
import { Redirect } from "react-router-dom";
import AuthService from '../services/AuthService';

const user = AuthService.getCurrentUser();

export default class StudentComponent extends Component {
  render() {
    return (
    <div>
      { user ? <Tabs>
        <div label="All Assignments">
          <StudentAllAssignment/>
        </div>
        <div label="Pending Assignment">
          <StudentPendingAssignment/>
        </div>
      </Tabs> : <Redirect to="/login" />
    }
    </div>);
  }
}
