import React from "react";
import Web3 from "web3";
import Switch from "react-switch";
import WallidContract from "../../wallid/wallid.js";
import * as WallidConst from "../../wallid/const.js";

import store from "../../js/store/index";
import { setCreditState } from "../../js/actions/index";
import { setData } from "../../js/actions/index";
import { setDataIdentityId } from "../../js/actions/index";
import { setDataVerifyId } from "../../js/actions/index";
import { CREDIT_STATE } from "../../js/constants/action-types";

var CryptoJS = require("crypto-js");

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

class DecryptData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLogged: 0,
      dataVerifyId: store.getState().dataVerifyId,
      dataVerifyIdEncrypted: store.getState().dataVerifyIdEncrypted,
      dataIdentityIdEncrypted: store.getState().dataIdentityIdEncrypted,
      dataIdentityId: store.getState().dataIdentityId,
      ContractAddress: WallidConst.CONTRACT_ADDRESS,
      ContractInstance: null,
      password: WallidConst.DEFAULT_PASSWORD,
      passwordCheck: WallidConst.DEFAULT_PASSWORD,
      userWa: "",
      idt: store.getState().idt,
      opid: store.getState().opid,
      isManualPassword: true,
      chiperPassword: WallidConst.DEFAULT_PASSWORD,
      yourPurpose: store.getState().yourPurpose
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsePassword = this.handleUsePassword.bind(this);

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
        yourPurpose: store.getState().yourPurpose,
        idt: store.getState().idt,
        opid: store.getState().opid,
        dataVerifyIdEncrypted: store.getState().dataVerifyIdEncrypted,
        dataIdentityIdEncrypted: store.getState().dataIdentityIdEncrypted,
        dataVerifyId: store.getState().dataVerifyId,
        dataIdentityId: store.getState().dataIdentityId
      });
    });
  }

  handleChange(event) {
    console.log("handleChange");
    console.log(event.target.name + event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    console.log("handleSubmit" + event);
    this.decryptData();
  }

  handleUsePassword(event) {
    console.log("LOG ", this.state.isManualPassword);
    this.setState({ isManualPassword: event });
  }

  decryptData() {
    console.log(
      "******************** decryptData *******************************"
    );
    var loadData = [];
    var identifyId = {};
    var verifyId = {};

    try {
      var password = this.state.isManualPassword
        ? this.state.chiperPassword
        : this.state.password;
      console.log("Password to decrypt ", password);
      var bytes = CryptoJS.AES.decrypt(
        this.state.dataIdentityIdEncrypted,
        password
      );
      var ret_1 = bytes.toString(CryptoJS.enc.Utf8);
      identifyId = JSON.parse(ret_1);

      bytes = CryptoJS.AES.decrypt(this.state.dataVerifyIdEncrypted, password);
      ret_1 = bytes.toString(CryptoJS.enc.Utf8);
      verifyId = JSON.parse(ret_1);

      this.state.dataIdentityId = identifyId;
      this.state.dataVerifyId = verifyId;

      console.log("Identify ", identifyId);
      console.log(Object.keys(identifyId));

      for (var i in identifyId.identityAttributes) {
        //console.log(i);
        //console.log(identifyId[i]);
        loadData.push({ item: i, value: identifyId.identityAttributes[i] });
      }

      for (i in identifyId.addressAttributes) {
        //console.log(i);
        //console.log(identifyId[i]);
        loadData.push({ item: i, value: identifyId.addressAttributes[i] });
      }
      store.dispatch(setDataIdentityId(identifyId));
      store.dispatch(setDataVerifyId(verifyId));
      store.dispatch(setData(loadData));
      console.log("CREDIT_STATE_VERIFY_DATA");
      store.dispatch(setCreditState(CREDIT_STATE["CREDIT_STATE_VERIFY_DATA"]));
    } catch (err) {
      console.log("error", err);
      alert("Decrypt fail! Try Again!");
    }
  }

  render() {
    if (window.web3) {
      return (
        <div className="form-content auto-step">
          <h2 className="title">Step 3 - Decrypt your data locally</h2>
          <form onSubmit={this.handleSubmit}>
            <div class="form-group">
              <br />
              <label className="label">Your encrypted data:</label>
              <textarea
                readOnly
                rows="5"
                value={this.state.dataIdentityIdEncrypted}
                type="text"
                name="EncryptedData"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <br />
              <label className="label">Your verifyId data encrypted:</label>
              <textarea
                readOnly
                rows="5"
                value={this.state.dataVerifyIdEncrypted}
                type="text"
                name="EncryptedData"
                class="form-control"
              />
            </div>
            <div className="disclaimer">
              <br />
              <div className="form-inline">
                <div>
                  <p className="disclaimer">
                    <strong> Disclaimer: </strong> Current Metamask build doesn't support the features do encrypt data with users'private keys. It will be available as soon. you can encrypt your ID data with a password of your choice{" "} <strong>(recommended action)</strong> Otherwise you can choose to allow MyEtheriD to encrypt your ID data with a default password <strong>(We do not recommend this action)</strong>.
                  </p>
                </div>
                <Switch
                  onChange={this.handleUsePassword}
                  checked={this.state.isManualPassword}
                  id="normal-switch"
                  onHandleColor="#1a9fff"
                  onColor="#b8b8b8"
                  offColor="#b8b8b8"
                />
              </div>
              <div
                className="form-inline password"
                hidden={!this.state.isManualPassword ? true : false}
              >
                <label>Password:</label>

                <input
                  style={{ width: "300px" }}
                  hidden={!this.state.isManualPassword ? true : false}
                  id="chiperPassword"
                  name="chiperPassword"
                  onChange={this.handleChange}
                  className="form-control"
                  type="password"
                  placeholder="Insert password to decrypt your data"
                  required={this.state.isManualPassword ? true : false}
                />
              </div>
            </div>
            <br />
            <div class="form-group">
              <button className="btn btn-white">Decrypt ID</button>
            <p className="metamask-link">
                <a href="https://metamask.io/">
                  What it means?
                </a>
              </p>
            </div>
          </form>
        </div>
      );
    } else {
      return (
        <div className="form-content auto-step">
          <h2 className="title">Step 3 - Decrypt your data locally</h2>
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

export default DecryptData;
