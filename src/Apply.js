import React, { Component } from "react";
import CreditForm from './components/CreditForm';
import Stepper from './components/Stepper';

class Apply extends Component {

  render() {
    return (
      <div className="container">
        <h2 className="title">Personal Credit application</h2>
        <br />
        <p className="desc">
            Welcome to CrediBank automatic Personal Credit application. Please follow through the application process.<br/>
            It will take you less then five minutes and it will provide an official credit proposal, ready to be accepted.<br/>
            Your personal funding might be just 5 minutes away.</p>
        <br />
        <Stepper/>
        <div className="">
            <CreditForm />
        </div>
      </div>
    );
  }
}

export default Apply;
