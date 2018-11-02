import React from "react";
import { Link } from 'react-router-dom';

class CardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLogged: 0
    };
    if(window.web3){
    this.checkMetamaskUser()
  }
  }

   checkMetamaskUser() {
    var self = this

    window.web3.eth.getAccounts(function(err, accounts){

      if (err != null) {
        console.error("An error occurred: "+err);
        self.state.isUserLogged = 0;
      }
      else if (accounts.length === 0) {
        console.log("User is not logged in to MetaMask");
        self.state.isUserLogged = 0;
        alert('User logged out? Please login your account at metamask and try again!')
      }
      else {
        console.log("User is logged in to MetaMask");
        self.state.isUserLogged = 1;
      }
      self.forceUpdate()
    });
  }

  render() {
    if(window.web3){
      if(this.state.isUserLogged){
      return (
        <div>
          <div className="row">
            <div className="col-sm-12 col-md-8 headerTextImportId">
              <h2>
                Step 2 - Load your identity
              </h2>
            </div>
          </div>
          <div class="row justify-content-start">
            <div class="col-sm-12 col-md-12">
              <form onSubmit={this.handleSubmit} >
                <div class="form-group">
                  <br />
                  <label className="text-white">
                    Select StoreID Provider:
                  </label>
                  <select class="form-control" required>
                    <option disabled="disabled" selected="selected">Select an valid StoreID Provider</option>
                    <option>CaixaMagica@StoreID</option>
                  </select>
                  <label className="text-white">
                    Select identity type:
                  </label>
                  <select class="form-control" required>
                    <option disabled="disabled" selected="selected">Select an valid identity</option>
                    <option>Cartão de Cidadão - República Portuguesa</option>
                  </select>
                </div>
                <p>
                  To prove your identity connect with metamask
                </p>
                <Link to ='/Import' className="btn btn-block btn-lg btnStyle btnMetaMask">
                  Connect with metamask
                </Link>
              </form>
            </div>
          </div>
        </div>
      );
    }else{
      return (
        <div>
          <div className="row">
            <div className="col-sm-12 col-md-8 headerTextImportId">
              <h2>
                Step 2 - Load your identity
              </h2>
            </div>
          </div>
          <div class="row justify-content-start">
            <div class="col-sm-12 col-md-12">
              <form onSubmit={this.handleSubmit} >
                <div class="form-group">
                  <label className="text-white">
                    Select StoreID Provider:
                  </label>
                  <select class="form-control" required>
                    <option disabled="disabled" selected="selected">Select an valid StoreID Provider</option>
                    <option>CaixaMagica@StoreID</option>
                  </select>
                  <label className="text-white">
                    Select identity type:
                  </label>
                  <select class="form-control" required>
                    <option disabled="disabled" selected="selected">Select an valid identity</option>
                    <option>Cartão de Cidadão - República Portuguesa</option>
                  </select>
                </div>
                <p>
                  To prove your identity connect with metamask.
                </p>
                <p>
                  User logged out? Please login your account at metamask and try again!!
                </p>
                <p>
                  <a href="https://metamask.io/">
                    What is Metamask?
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      );
    }
    }else {
      return (
        <div>
          <div className="row">
            <div className="col-sm-12 col-md-8 headerTextImportId">
              <h2>
                Step 2 - Load your identity
              </h2>
            </div>
          </div>
          <div class="row justify-content-start">
            <div class="col-sm-12 col-md-12">
              <form onSubmit={this.handleSubmit} >
                <div class="form-group">
                  <label className="text-white">
                    Select StoreID Provider:
                  </label>
                  <select class="form-control" required>
                    <option disabled="disabled" selected="selected">Select an valid StoreID Provider</option>
                    <option>CaixaMagica@StoreID</option>
                  </select>
                  <label className="text-white">
                    Select identity type:
                  </label>
                  <select class="form-control" required>
                    <option disabled="disabled" selected="selected">Select an valid identity</option>
                    <option>Cartão de Cidadão - República Portuguesa</option>
                  </select>
                </div>
                <p>
                  No MetaMask detected.
                </p>
                <p>
                  To prove your identity connect with metamask.
                </p>
                <p>
                  <a href="https://www.myetherid.io">
                    What is Wallid?
                  </a>
                </p>
                <p>
                  <a href="https://metamask.io/">
                    What is Metamask?
                  </a>
                </p>
                <p>
                  <a href="https://metamask.io/">
                    Download Metamask?
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      );
    }
}
}

export default CardForm;
