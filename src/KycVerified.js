import React, { Component } from "react";
import KycVerifiedSuccess from './components/KycVerifiedSuccess';

class KycVerified extends Component {
  render() {
    return (
      <div>
      <h2>Credit Simulator</h2>
      <h2>Step 3 - Your Identify Verified</h2>
        <br />
        <KycVerifiedSuccess />
      </div>
    );
  }
}

export default KycVerified;
