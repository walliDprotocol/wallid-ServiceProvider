import React, { Component } from "react";
import CreditForm from './components/CreditForm';


class Home extends Component {
  render() {
    return (
      <div>
        <h2>Credit Simulator</h2>
        <h2>Step 1 - Select credit values</h2>
        <br />
        <CreditForm />
      </div>
    );
  }
}

export default Home;
