import React from 'react'

export default class HeaderComponent extends React.Component {
  render () {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light">
          <span className="navbar-brand">Assignment-portal</span>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Logout</button>
              </div>
            </div>
        </nav>
      </div>
    );
  }
}
