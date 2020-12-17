import React from 'react'
import { Toast } from 'react-bootstrap';


export default class MyToast extends React.Component {
  render () {

    const toastCss = {
      position: 'fixed',
      top: '100px',
      right: '20px',
      zIndex:'3',
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
    };

    return(
      <div >
        {this.props.children.showSuccessToast ? <div style={toastCss}>
          <Toast className={"border border-success bg-success text-white"} show={this.props.children.showSuccessToast}>
            <Toast.Header className={"bg-success text-white"} closeButton={false}>
              <strong className="mr-auto">Alert !</strong>
            </Toast.Header>
            <Toast.Body>
              { this.props.children.message }
            </Toast.Body>
          </Toast>
        </div> : null}
        {
        this.props.children.showErrorToast  ? <div style={toastCss}>
            <Toast className={"border border-danger bg-danger text-white"} show={this.props.children.showErrorToast}>
              <Toast.Header className={"bg-danger text-white"} closeButton={false}>
                <strong className="mr-auto">Alert !</strong>
              </Toast.Header>
              <Toast.Body>
                { this.props.children.message }
              </Toast.Body>
            </Toast>
          </div> : null
        }

      </div>
    );
  }
}
