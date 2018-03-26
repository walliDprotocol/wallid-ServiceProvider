import React, { Component } from "react";
import CreditForm from './components/CreditForm';


class Home extends Component {
  render() {
    return (
      <div>
        <h2>Credit Simulator</h2>
        <p>Welcome to CrediBank automatic Credit Simulator.</p>
        <p>Please follow through the application process. It will take you less then five minutes and it will provide an official credit proposal, ready to be accepted. Your personal funding might be just 5 minutes away</p>
        <br />
        <CreditForm />
      </div>
    );
  }
}

export default Home;
