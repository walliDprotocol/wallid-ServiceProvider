import React, { Component } from "react";
import ImportForm from './components/ImportForm';

class KycVerify extends Component {
  render() {
    return (
      <div>
      <h2>Credit Simulator</h2>
      <h2>Step 2 - Identify using BlockID</h2>
        <br />
        <ImportForm />
      </div>
    );
  }
}

export default KycVerify;
