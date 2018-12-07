import React from "react";
import Web3 from "web3";
import WallidContract from "../../wallid/wallid.js";
import * as WallidConst from "../../wallid/const.js";

import store from "../../js/store/index";
import { setCreditState } from "../../js/actions/index";
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

class SubmitData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLogged: 0,
      dataVerifyId: "",
      dataVerifyIdEncrypted: "",
      dataIdentityIdEncrypted: "",
      dataIdentityId: "",
      ContractAddress: WallidConst.CONTRACT_ADDRESS,
      ContractInstance: null,
      userWa: "",
      yourPurpose: store.getState().yourPurpose
    };

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

  handleSubmit(event) {
    console.log("handleSubmit");
    console.log("CREDIT_STATE_FINISH");
    store.dispatch(setCreditState(CREDIT_STATE["CREDIT_STATE_FINISH"]));
  }

  render() {
    if (window.web3) {
      return (
        <div>
          <div className="form-group form-content">
            <h2 className="title">Step 5 - Submit your application</h2>
            <p className="submit-msg">Your identity attributes were successfully verified by Wallid.<br/>
            You can now submit your application to personal credit with Credibank.</p>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div class="btn-container text-right">
              <button className="btn btn-next">Submit</button>
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
        <div className="form-content auto-step">
          <h2 className="title">Step 5 - Submit your application</h2>
          <br />
          <div align="center">
            <p className="err-msg">No MetaMask detected.</p>
              <p>To prove your identity connect with metamask.</p>
              <p><a href="https://metamask.io/">What is Metamask?</a></p>
              <p><a href="https://metamask.io/">Download Metamask?</a></p>
          </div>
        </div>
      );
    }
  }
}

export default SubmitData;
