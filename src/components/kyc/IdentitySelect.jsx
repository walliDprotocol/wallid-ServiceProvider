import React from "react";
import Web3 from "web3";
import WallidContract from "../../wallid/wallid.js";

import store from "../../js/store/index";
import { setCreditState } from "../../js/actions/index";
import { setIdt } from "../../js/actions/index";

import { CREDIT_STATE } from "../../js/constants/action-types";

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

class IdentitySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLogged: 0,
      idt: "",
      yourPurpose: store.getState().yourPurpose
    };

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

  render() {
    if (window.web3) {
      return (
        <div>
          <div className="row">
            <div className="col-sm-12 col-md-8 headerTextImportId">
              <h2>Step 2 - Select a Certified Identity</h2>
            </div>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div class="form-group">
              <br />
              <label className="text-white">Select identity type:</label>
              <select
                class="form-control"
                required
                name="idt"
                onChange={this.handleChange}
              >
                <option disabled="disabled" selected="selected">
                  Select an valid identity
                </option>
                <option value="CC_PT">
                  Cartão de Cidadão - República Portuguesa
                </option>
                <option value="CC_PT_TST">
                  Cartão de Cidadão TST - República Portuguesa
                </option>
              </select>
              <p>To prove your identity connect with metamask</p>
              <input
                type="submit"
                value="Prove your Identity"
                className="btn btn-block btn-lg btnStyle btnMetaMask"
              />
              <p className="text-center">
                <a className="text-white" href="https://metamask.io/">
                  what it means?
                </a>
              </p>
            </div>
          </form>
        </div>
      );
    } else {
      return (
        <div>
          <p>No MetaMask detected.</p>
          <p>To prove your identity connect with metamask.</p>
          <p>
            <a href="https://metamask.io/">What is Metamask?</a>
          </p>
          <p>
            <a href="https://metamask.io/">Download Metamask?</a>
          </p>
        </div>
      );
    }
  }
}

export default IdentitySelect;
