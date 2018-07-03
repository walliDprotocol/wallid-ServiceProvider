import React, { Component } from "react";
import ImportForm from './components/ImportForm';

class Import extends Component {
  render() {
    return (
      <div>
      <h2>Personal Credit application</h2>
        <br />
        <p>Welcome to CrediBank automatic Personal Credit application.</p>
        <p>Please follow through the application process. It will take you less then five minutes and it will provide an official credit proposal, ready to be accepted.</p>
        <p>Your personal funding might be just 5 minutes away.</p>
        <br />
        <ImportForm />
      </div>
    );
  }
}

export default Import;
