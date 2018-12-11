import React from "react";
import Web3 from "web3";
import WallidContract from "../../wallid/wallid.js";
import * as WallidConst from "../../wallid/const.js";

import store from "../../js/store/index";
import { setCreditState } from "../../js/actions/index";
import { CREDIT_STATE } from "../../js/constants/action-types";

var Spinner = require("react-spinkit");

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

class VerifyDataID extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLogged: 0,
      data: store.getState().data,
      dataVerifyId: store.getState().dataVerifyId,
      dataVerifyIdEncrypted: store.getState().dataVerifyIdEncrypted,
      dataIdentityIdEncrypted: store.getState().dataIdentityIdEncrypted,
      dataIdentityId: store.getState().dataIdentityId,
      userWa: "",
      idt: store.getState().idt,
      opid: store.getState().opid,
      yourPurpose: store.getState().yourPurpose
    };

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
          self.verifyDataID();
        }
      });
    } else {
      alert("No web3? You should consider trying MetaMask!");
    }
  }
  componentWillMount() {
    store.subscribe(() => {
      this.setState({
        yourPurpose: store.getState().yourPurpose,
        idt: store.getState().idt,
        opid: store.getState().opid,
        dataVerifyId: store.getState().dataVerifyId,
        dataVerifyIdEncrypted: store.getState().dataVerifyIdEncrypted,
        dataIdentityIdEncrypted: store.getState().dataIdentityIdEncrypted,
        dataIdentityId: store.getState().dataIdentityId,
        data: store.getState().data
      });
    });
  }

  handleErrors(response) {
    console.log("handleErrors response = " + response);
    if (!response.ok) {
      console.log("response = ",response);
      console.log("response.status = ", response.status)
      alert("Error Verifying data\n\n",response.status)
      throw Error(response.status);
    }
    return response;
  }

  handleSucess(response) {
    console.log("handleSucess");
    store.dispatch(setCreditState(CREDIT_STATE['CREDIT_STATE_SUBMIT_DATA']));
    return;
  }

  verifyDataID()
  {
    console.log("******************** verifyDataID *******************************");

    var dataID = JSON.parse('{ "data":{"wa":"","idt":"","idtName":"","identityID":"","verifyID":""}}');

    dataID.data.wa = this.state.userWa;
    dataID.data.idt = this.state.idt;
    dataID.data.identityID = this.state.dataIdentityId;
    dataID.data.verifyID = this.state.dataVerifyId;


    console.log("dataID.data.wa = " + dataID.data.wa);
    console.log("dataID.data.idt = " + dataID.data.idt);
    console.log("dataID.data.identityID = " + dataID.data.identityID);
    console.log("dataID.data.verifyID = " + dataID.data.verifyID);

    console.log("dataID = ", JSON.stringify(dataID));

      console.log("call verifyIdProvider: " + WallidConst.VERIFYID_PROVIDER_URL);
        fetch(WallidConst.VERIFYID_PROVIDER_URL, {
          method: 'POST',
          body: JSON.stringify(dataID),
          headers: {'Content-Type': 'application/json'}
        })
        .then(response => this.handleErrors(response))
        .then(response => this.handleSucess(response) )
        .catch(error => {
          console.log(error)
          alert("VerifyID Service Fail")
        }
      );
  }

  render() {
    if (window.web3) {
      return (
        <div className="form-content auto-step">
          <h2 className="title">Verifying your data</h2>
          <div align="center">
            <p className="wait-msg">Please wait....</p>
            <Spinner name="ball-clip-rotate" color="#1a9fff" className="loading"/>
          </div>
        </div>
      );
    } else {
      return (
        <div className="form-content auto-step">
          <h2 className="title">Verifying your data</h2>
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

export default VerifyDataID;
