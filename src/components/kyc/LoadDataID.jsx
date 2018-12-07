import React from "react";
import Web3 from "web3";
import WallidContract from "../../wallid/wallid.js";
import * as WallidConst from "../../wallid/const.js";

import store from "../../js/store/index";
import { setCreditState } from "../../js/actions/index";
import { setIdentityIdEncrypted } from "../../js/actions/index";
import { setVerifyIdEncrypted } from "../../js/actions/index";
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

class LoadDataID extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLogged: 0,
      errorMsg: "",
      dataVerifyId: "",
      dataVerifyIdEncrypted: "",
      dataIdentityIdEncrypted: "",
      dataIdentityId: "",
      ContractAddress: WallidConst.CONTRACT_ADDRESS,
      ContractInstance: null,
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
          self.loadDataID();
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
        opid: store.getState().opid
      });
    });
  }

  hex2a(hexx) {
    var hex = hexx.toString(); //force conversion
    var str = "";
    for (var i = 2; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  loadDataID() {
    console.log(
      "******************** loadDataID *******************************"
    );
    console.log("idt = " + this.state.idt);
    console.log("opid = " + this.state.opid);
    var opid = this.state.opid;
    var opidString = opid.toString();
    console.log("opidString = " + opidString);
    this.state.ContractInstance.getIdtDataVerified(
      this.state.idt,
      opidString,
      (err, data) => {
        if (data) {
          console.log("get Info Result ", data);
        } else {
          console.log("Operation fail");
          // TODO: Show popup about Operation fail
        }
      }
    );

    this.state.ContractInstance.EventDataId((err, data) => {
      console.log("get event data ", data);
      console.log(data["address"]);
      console.log(data["args"]);
      var wallid = data["args"];
      console.log(
        "************************************************************"
      );
      console.log("EVENT EventDataId");
      console.log("opid = " + this.state.opid);
      console.log("opid event= " + wallid["opid"]);
      console.log(
        "************************************************************"
      );
      if (Number(wallid["opid"]) === Number(this.state.opid)) {
        console.log("IdentityId = " + wallid["identityId"]);
        console.log("Idt = " + this.hex2a(wallid["idt"]));
        console.log("VeridyId = " + wallid["veridyId"]);

        console.log("IdentityId hexa = " + this.hex2a(wallid["identityId"]));
        console.log("Idt hexa = " + this.hex2a(wallid["idt"]));
        console.log("VeridyId hexa = " + this.hex2a(wallid["veridyId"]));

        this.state.dataIdentityIdEncrypted = this.hex2a(wallid["identityId"]);
        this.state.idt = this.hex2a(wallid["idt"]);
        this.state.dataVerifyIdEncrypted = this.hex2a(wallid["veridyId"]);

        if (this.state.dataIdentityIdEncrypted === "") {
          this.state.errorMsg =
            "Wallet Not Registered in WalliD. Please create at myetherid.io!";
          console.log(
            "Wallet Not Registered in WalliD. Please create at myetherid.io!"
          );
          alert(
            "Wallet Not Registered in WalliD. Please create at myetherid.io!"
          );
          store.dispatch(
            setCreditState(CREDIT_STATE["CREDIT_STATE_PURPOSE_SELECT"])
          );
        } else if (this.state.dataVerifyIdEncrypted === "STOREID_FAIL") {
          this.state.errorMsg =
            "StoreId Fail. Wallet Not Registered. Please register again at myetherid.io!";
          console.log(
            "StoreId Fail. Wallet Not Registered. Please register again at myetherid.io!"
          );
          alert(
            "StoreId Fail. Wallet Not Registered. Please register again at myetherid.io!"
          );
          store.dispatch(
            setCreditState(CREDIT_STATE["CREDIT_STATE_PURPOSE_SELECT"])
          );
        } else {
          console.log("CREDIT_STATE_DECRYPT_DATA");
          store.dispatch(
            setIdentityIdEncrypted(this.hex2a(wallid["identityId"]))
          );
          store.dispatch(setVerifyIdEncrypted(this.hex2a(wallid["veridyId"])));
          store.dispatch(
            setCreditState(CREDIT_STATE["CREDIT_STATE_DECRYPT_DATA"])
          );
        }
      } else {
        console.log("EVENT EventDataId another OPID");
      }
    });
  }

  render() {
    if (window.web3) {
      return (
        <div className="form-content auto-step">
          <h2 className="title">Step 2 - Provide Your Identity Information</h2>
          <div align="center">
            <p className="wait-msg">Please wait....</p>
            <Spinner name="ball-clip-rotate" color="#1a9fff" className="loading"/>
            <p className="opid-msg">Operation ID: {this.state.opid}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="form-content auto-step">
          <h2 className="title">Step 2 - Provide Your Identity Information</h2>
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

export default LoadDataID;
