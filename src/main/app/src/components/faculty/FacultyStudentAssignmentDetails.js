import { React, Component } from 'react'
import Moment from 'moment';
import { Card, Table, InputGroup, Button } from 'react-bootstrap';
import AuthService from "../../services/AuthService";
import FacultyService from '../../services/FacultyService';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faStepBackward, faFastBackward, faStepForward, faFastForward, faDownload } from '@fortawesome/free-solid-svg-icons';
import fileDownload from 'js-file-download';

const user = AuthService.getCurrentUser();

export default class FacultyStudentAssignmentDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignmentStatus: [],
      currentPage : 1,
      assignmentsPerPage : 5,
    };
    this.downloadFile = this.downloadFile.bind(this);
  }

  componentDidMount() {
    console.log('FacultyStudentAssignmentDetails called');
    this.getAssignmentStatus(this.state.currentPage);
  }

  getAssignmentStatus(currentPage) {
    currentPage -= 1;
    FacultyService.getStudentAssignmentStatus(user.id, currentPage, this.state.assignmentsPerPage).then((res) => {
      this.setState({
        assignmentStatus: res.data.content,
        totalPages: res.data.totalPages,
        totalElements: res.data.totalElements,
        currentPage: res.data.number + 1
      });
    });
  }

  firstPage = () => {
    let firstPage = 1;
    if(this.state.currentPage > firstPage) {
      this.getAssignmentStatus(firstPage);
    }
  };

  prevPage = () => {
    let prevPage = 1;
    if(this.state.currentPage > prevPage) {
      this.getAssignmentStatus(this.state.currentPage - prevPage);
    }
  };

  lastPage = () => {
      let condition = Math.ceil(this.state.totalElements / this.state.assignmentsPerPage);
      if(this.state.currentPage < condition) {
        this.getAssignmentStatus(condition);
      }
  };

  nextPage = () => {
      if(this.state.currentPage < Math.ceil(this.state.totalElements / this.state.assignmentsPerPage)) {
        this.getAssignmentStatus(this.state.currentPage + 1);
      }
  };

  downloadFile(uploadedFileName) {
    console.log('Download file called');
    FacultyService.downloadFile(uploadedFileName).then((res) => {
      fileDownload(res.data, uploadedFileName);
    }, (error) => {
      console.log('error while downloading');
    });
  }

  render () {
    return (
      <Card className={"border"}>
        <Card.Body>
          <Table bordered hover striped className="borderless">
            <thead>
              <tr>
                <th>Student Id</th>
                <th>Student Name</th>
                <th>Title</th>
                <th>Submission date</th>
                <th>Submitted file</th>
                <th>Submit Status</th>
              </tr>
            </thead>
            {
              this.state.assignmentStatus.length > 0 ? <tbody>
              {
                this.state.assignmentStatus.map(as => <tr key={as.id}>
                  <td style={{width: '90px'}}>{as.studentId}</td>
                  <td style={{width: '120px'}}>{as.studentName}</td>
                  <td style={{width: '350px'}}>{as.title}</td>
                  <td style={{width: '130px'}}>{Moment(as.submissionDate).format('DD-MM-YYYY')}</td>
                  <td style={{width: '110px'}}>
                    <button disabled={(as.isSubmitted === 2 || as.isSubmitted === 3)} style={{marginLeft: "10px"}}
                      className="btn btn-outline-success my-2 my-sm-0"
                      data-toggle="tooltip" data-placement="top" title="Download"
                      onClick={ () => this.downloadFile(as.studentSubmittedFile)}>
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                   </td>
                  <td style={{width: '120px'}}>
                    {as.isSubmitted === 1 && <p> Submitted.</p>}
                    {as.isSubmitted === 2 && <p> Submission Pending.</p>}
                    {as.isSubmitted === 3 && <p> Due date passed.</p>}
                  </td>
                </tr>)
              }
            </tbody> : <tbody className="p-2 font-italic">No records found !</tbody>
        }
          </Table>
        </Card.Body>
        {this.state.assignmentStatus.length > 0 ?
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
    );
  }
}
