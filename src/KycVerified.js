import React, { Component } from "react";
import KycVerifiedSuccess from './components/KycVerifiedSuccess';

class KycVerified extends Component {
  render() {
    return (
      <div>
      <h2>Personal Credit application</h2>
        <p>Welcome to CrediBank automatic Credit Simulator.</p>
        <p>Please follow through the application process. It will take you less then five minutes and it will provide an official credit proposal, ready to be accepted. Your personal funding might be just 5 minutes away</p>
      <h2>Step 3 - Confirm your identity</h2>
        <br />
        <KycVerifiedSuccess />
      </div>
    );
  }
}

export default KycVerified;
