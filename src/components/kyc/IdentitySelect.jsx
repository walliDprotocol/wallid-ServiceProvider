import React from "react";
import Web3 from "web3";
import WallidContract from "../../wallid/wallid.js";

import store from "../../js/store/index";
import { setCreditState } from "../../js/actions/index";
import { setIdt } from "../../js/actions/index";

import { CREDIT_STATE } from "../../js/constants/action-types";
import { Collapse, CardBody, Card, Row, Col, Input, FormGroup } from 'reactstrap';

window.addEventListener("load", async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.enable();
    } catch (error) {
      console.error(error);
    }
  }
});

window.addEventListener("reload", function() {
  if (typeof web3 !== "undefined") {
    console.log("Using web3 detected from external source like Metamask");
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    console.log(
      "No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask"
    );
    window.web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:8545")
    );
    alert("No web3? You should consider trying MetaMask!");
  }
});

function Chevron(props) {
    const isCollapse = props.isCollapse;
    if (isCollapse) {
      return <i className="fas fa-chevron-down"></i>
    } else {
      return <i className="fas fa-chevron-up"></i>
    }
  }

class IdentitySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLogged: 0,
      idt: "",
      yourPurpose: store.getState().yourPurpose
    };

    this.toggleOpt1 = this.toggleOpt1.bind(this);
    this.toggleOpt2 = this.toggleOpt2.bind(this);
    this.state = { collapseOpt1: false };
    this.state = { collapseOpt2: false };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    if (window.web3) {
      console.log("*********************** window.web3 ********************");
      const MyContract = window.web3.eth.contract(WallidContract.abi);
      this.state.ContractInstance = MyContract.at(this.state.ContractAddress);

      // this.state.ContractInstance.countItemList( (err, data) => {
      //   console.log('Count items :  ', data);
      //   console.log('total items #', data.c[0] );
      // });
      var self = this;
      window.web3.eth.getAccounts(function(err, accounts) {
        if (err != null) {
          console.error("An error occurred: " + err);
          self.state.isUserLogged = 0;
        } else if (accounts.length === 0) {
          console.log("User is not logged in to MetaMask");
          self.state.isUserLogged = 0;
          alert(
            "User logged out? Please login your account at metamask and refresh to try again!"
          );
        } else {
          console.log("User is logged in to MetaMask");
          console.log(accounts[0]);
          self.state.userWa = accounts[0];
          self.state.isUserLogged = 1;
        }
      });
    } else {
      alert("No web3? You should consider trying MetaMask!");
    }
  }
  componentWillMount() {
    store.subscribe(() => {
      this.setState({
        yourPurpose: store.getState().yourPurpose
      });
    });
  }

  handleChange(event) {
    console.log("handleChange");
    console.log(event.target.name);
    console.log(event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    console.log("handleSubmit" + event);
    if (this.state.isUserLogged === 0) {
      alert(
        "User logged out? Please login your account at metamask and refresh to try again!"
      );
    } else {
      if (this.state.idt !== "") {
        console.log("CREDIT_STATE_LOAD_OPID");
        console.log(this.state.idt);
        store.dispatch(setIdt(this.state.idt));
        store.dispatch(setCreditState(CREDIT_STATE["CREDIT_STATE_LOAD_OPID"]));
      } else {
        alert("Please select your Identity Type\n\n");
      }
    }
    event.preventDefault();
  }

  toggleOpt1() {
    console.log('clicked option 1');
    this.setState({ collapseOpt1: !this.state.collapseOpt1 });
    this.setState({ collapseOpt2: this.state.collapseOpt2 });

    if (this.state.collapseOpt2) {
      this.setState({ collapseOpt2: !this.state.collapseOpt2 });

    }
  }

  toggleOpt2() {
    console.log('clicked option 2');
    this.setState({ collapseOpt2: !this.state.collapseOpt2 });
    this.setState({ collapseOpt1: this.state.collapseOpt1 });

    if (this.state.collapseOpt1) {
      this.setState({ collapseOpt1: !this.state.collapseOpt1 });

    }
  }

  render() {
    if (window.web3) {
      return (
        <div className="form-content auto-step">
          <h2 className="title">Step 2 - Provide Your Identity Information</h2>
          <br />
          <label className="label">Please choose one of the following methods:</label>
          <div className="collapse-container">
            <Chevron isCollapse={!this.state.collapseOpt1} />
            <button className="btn btn-collapse" onClick={this.toggleOpt1}>Instant Validation Using WalliD's protocol: (takes up to 5 minutes)</button>
            <Collapse isOpen={this.state.collapseOpt1}>
              <Card>
                <CardBody>
                  <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <label className="label">Select the Provider with your ID certificate:</label>
                      <div className="select-container">
                        <i className="fas fa-chevron-down"></i>
                        <select
                          className="form-control"
                          required
                          name="provider"
                          onChange={this.handleChange}
                        >
                          <option disabled="disabled" selected="selected">
                            Select a compatible Provider
                          </option>
                          <option>
                            WalliD@StoreID
                          </option>
                        </select>
                      </div>
                      <label className="label">Select Identity Type:</label>
                      <div className="select-container">
                        <i className="fas fa-chevron-down"></i>
                        <select
                          className="form-control"
                          required
                          name="idt"
                          onChange={this.handleChange}
                        >
                          <option disabled="disabled" selected="selected">
                            Select a valid identity
                          </option>
                          <option value="CC_PT">
                            Cartão de Cidadão - República Portuguesa
                          </option>
                          <option value="CC_PT_TST">
                            Cartão de Cidadão TST - República Portuguesa
                          </option>
                          <option value="CMD_PT">
                            Chave Móvel Digital - República Portuguesa
                          </option>
                        </select>
                      </div>
                      <p className="msg">To prove your identity connect with metamask</p>
                      <input
                        type="submit"
                        value="Connect with metamask"
                        className="btn btn-white"
                      />
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Collapse>
          </div>
          <div className="collapse-container">
            <Chevron isCollapse={!this.state.collapseOpt2} />
            <button className="btn btn-collapse" onClick={this.toggleOpt2}>Fill the forms below and send copies of your ID documents (takes up to 72 hours)</button>
            <Collapse isOpen={this.state.collapseOpt2}>
              <Card>
                <CardBody>
                  <FormGroup className="fake-form">
                    <Row>
                      <Col md="6">
                        <label className="label">Surname</label>
                        <Input type="text"></Input>
                      </Col>
                      <Col md="6">
                        <label className="label">Givename</label>
                        <Input type="text"></Input>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <label className="label">Gender</label>
                        <Input type="text"></Input>
                      </Col>
                      <Col md="6">
                        <label className="label">Height</label>
                        <Input type="text"></Input>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <label className="label">Country</label>
                        <Input type="text"></Input>
                      </Col>
                      <Col md="6">
                        <label className="label">Birthdate</label>
                        <Input type="text"></Input>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <label className="label">Givename Father</label>
                        <Input type="text"></Input>
                      </Col>
                      <Col md="6">
                        <label className="label">Surname Father</label>
                        <Input type="text"></Input>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <label className="label">Givename Mother</label>
                        <Input type="text"></Input>
                      </Col>
                      <Col md="6">
                        <label className="label">Surname Mother</label>
                        <Input type="text"></Input>
                      </Col>
                    </Row>
                    <p className="msg">Please send a copy of your ID document, with a handwritten paper of the date of today in the same picture of you holding them.</p>
                    <div class="text-right">
                      <button className="btn btn-next">Next Step</button>
                    </div>
                  </FormGroup>
                </CardBody>
              </Card>
            </Collapse>
          </div>
        </div>
      );
    } else {
      return (
        <div className="form-content auto-step">
          <h2 className="title">Step 2 - Provide Your Identity Information</h2>
          <br />
          <label className="label">Please choose one of the following methods:</label>
          <div className="collapse-container">
            <Chevron isCollapse={!this.state.collapseOpt1} />
            <button className="btn btn-collapse" onClick={this.toggleOpt1}>Instant Validation Using WalliD's protocol: (takes up to 5 minutes)</button>
            <Collapse isOpen={this.state.collapseOpt1}>
              <Card>
                <CardBody>
                    <div className="form-group">
                      <p className="msg">To prove your identity connect with metamask</p>
                        <p className="err-msg">No MetaMask detected.</p>
                        <p>To prove your identity connect with metamask.</p>
                        <p><a href="https://metamask.io/">What is Metamask?</a></p>
                        <p><a href="https://metamask.io/">Download Metamask?</a></p>
                      <p className="text-center">
                        <a className="text-white" href="https://metamask.io/">
                          what it means?
                        </a>
                      </p>
                    </div>
                </CardBody>
              </Card>
            </Collapse>
          </div>
          <div className="collapse-container">
            <Chevron isCollapse={!this.state.collapseOpt2} />
            <button className="btn btn-collapse" onClick={this.toggleOpt2}>Fill the forms below and send copies of your ID documents (takes up to 72 hours)</button>
            <Collapse isOpen={this.state.collapseOpt2}>
              <Card>
                <CardBody>
                  <FormGroup className="fake-form">
                    <Row>
                      <Col md="6">
                        <label className="label">Surname</label>
                        <Input type="text"></Input>
                      </Col>
                      <Col md="6">
                        <label className="label">Givename</label>
                        <Input type="text"></Input>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <label className="label">Gender</label>
                        <Input type="text"></Input>
                      </Col>
                      <Col md="6">
                        <label className="label">Height</label>
                        <Input type="text"></Input>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <label className="label">Country</label>
                        <Input type="text"></Input>
                      </Col>
                      <Col md="6">
                        <label className="label">Birthdate</label>
                        <Input type="text"></Input>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <label className="label">Givename Father</label>
                        <Input type="text"></Input>
                      </Col>
                      <Col md="6">
                        <label className="label">Surname Father</label>
                        <Input type="text"></Input>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <label className="label">Givename Mother</label>
                        <Input type="text"></Input>
                      </Col>
                      <Col md="6">
                        <label className="label">Surname Mother</label>
                        <Input type="text"></Input>
                      </Col>
                    </Row>
                    <p className="msg">Please send a copy of your ID document, with a handwritten paper of the date of today in the same picture of you holding them.</p>
                    <div class="text-right">
                      <button className="btn btn-next">Next Step</button>
                    </div>
                  </FormGroup>
                </CardBody>
              </Card>
            </Collapse>
          </div>
        </div>
      );
    }
  }
}

export default IdentitySelect;
