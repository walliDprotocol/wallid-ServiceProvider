import React, { Component } from "react";
import ImportForm from './components/ImportForm';

class Import extends Component {
  render() {
    return (
      <div className="container">
      <h2>WalliD’s test validation service</h2>
        <br />
        <p>Welcome to WalliD’s test validation web app.</p>
        <p>This website is intended to display  WalliD’s  validation use case through an app that  is fully working on top of the protocol and performs all identity validations of a certified Identity stored in a user’s wallet but is not requesting any real user data.</p>
        <p>Follow the next steps to prove your (test) identity by decrypting it directly in the service</p>
        <br />
        <ImportForm />
      </div>
    );
  }
}

export default Import;
