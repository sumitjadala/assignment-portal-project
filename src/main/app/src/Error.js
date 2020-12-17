import React from 'react';
import { NavLink } from "react-router-dom";

const Error = () => {
  return(
    <>
      <div>
        <h1> 404 Error page </h1>
        <p> This page does not exist </p>
        <NavLink to="/home"> Go to home page </NavLink>
      </div>
    </>
  )
}

export default Error;
