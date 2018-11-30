import React from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Web3 from 'web3';
import Switch from "react-switch";
import WallidContract from '../wallid/wallid.js';
import { Link } from 'react-router-dom';
import * as WallidConst from '../wallid/const.js';

var CryptoJS = require("crypto-js");

var Spinner = require('react-spinkit');

const state = {
  STATE_CARD_SELECT: 0,
  STATE_LOADING_OPID: 1,
  STATE_LOADING_DATA: 2,
  STATE_LOADING_DATA_FAIL: 3,
  STATE_ENCRYPTED_DATA: 4,
  STATE_DECRYPTED_DATA: 5,
  STATE_VERIFIED_DATA:  6,
  STATE_SUBMITED_DATA: 7
};

window.addEventListener('load', async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.enable();
    } catch (error) {
      console.error(error)
    }
  }
})

window.addEventListener('reload', function () {
  if(typeof web3 !== 'undefined'){
    console.log("Using web3 detected from external source like Metamask")
    window.web3 = new Web3(window.web3.currentProvider)
  }else{
    console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    alert('No web3? You should consider trying MetaMask!')
  }
});

class ImportForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: state['STATE_CARD_SELECT'],
      isUserLogged: 0,
      errorMsg: '',
      data: '',
      dataId: '',
      dataVerifyId: '',
      dataVerifyIdEncrypted: '',
      dataIdentityIdEncrypted: '',
      dataIdentityId: '',
      ContractAddress : WallidConst.CONTRACT_ADDRESS,
      ContractInstance : null,
      password: WallidConst.DEFAULT_PASSWORD,
      passwordCheck: WallidConst.DEFAULT_PASSWORD,
      userWa: '',
      idt: '',
      opid: '',
      isManualPassword : true,
      chiperPassword  : WallidConst.DEFAULT_PASSWORD
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeIdt = this.handleChangeIdt.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsePassword = this.handleUsePassword.bind(this);

    if(window.web3){
      console.log('*********************** window.web3 ********************');
      const MyContract = window.web3.eth.contract(WallidContract.abi)
      this.state.ContractInstance = MyContract.at(this.state.ContractAddress)

      // this.state.ContractInstance.countItemList( (err, data) => {
      //   console.log('Count items :  ', data);
      //   console.log('total items #', data.c[0] );
      // });
      var self = this
      window.web3.eth.getAccounts(function(err, accounts){

        if (err != null) {
          console.error("An error occurred: "+err);
          self.state.isUserLogged = 0;
        }
        else if (accounts.length === 0) {
          console.log("User is not logged in to MetaMask");
          self.state.isUserLogged = 0;
          alert('User logged out? Please login your account at metamask and refresh to try again!')
        }
        else {
          console.log("User is logged in to MetaMask");
          console.log(accounts[0]);
          self.state.userWa = accounts[0];
          self.state.isUserLogged = 1;
        }
      });

    }else {
      alert('No web3? You should consider trying MetaMask!')
    }
  }

  handleChange(event) {
    console.log("handleChange");
    console.log(event.target.name + event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleChangeIdt(event) {
    console.log("handleChangeIdt");
    console.log(event.target.name);
    console.log(event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleUsePassword(event){
    console.log('LOG ', this.state.isManualPassword);
    this.setState({ isManualPassword : event });
  }

  handleSubmit(event) {
    console.log("handleSubmit" + event);
    switch (this.state.step) {
      case state['STATE_ENCRYPTED_DATA']:
        this.getInfo();
      break;
      case state['STATE_DECRYPTED_DATA']:
        this.getVerify();
      break;
      case state['STATE_VERIFIED_DATA']:
        this.state.step = state['STATE_SUBMITED_DATA']
        this.forceUpdate()
      break;
      case state['STATE_CARD_SELECT']:
        if(this.state.isUserLogged == 0){
          alert('User logged out? Please login your account at metamask and refresh to try again!')
        }else{
          if(this.state.idt!=""){
            this.state.step = state['STATE_LOADING_OPID']
            this.forceUpdate()
            this.getOpID();
          }else{
            alert("Please select your Identity Type\n\n")
          }
        }
      break;

      default:
      break;
    }

    event.preventDefault();
  }

  handleErrors(response) {
    console.log("handleErrors");
    if (!response.ok) {
      console.log("response = ",response);
      console.log("response.status = ", response.status)
      alert("Error Verifying data\n\n",response.status)

      throw Error(response.status);
    }
    return response;
  }

  handleSucess(response) {
    console.log("handleSucess step = ",this.state.step);

    switch (this.state.step) {

      case state['STATE_DECRYPTED_DATA']:
        console.log("STATE_DECRYPTED_DATA");
        this.state.step = state['STATE_VERIFIED_DATA']
        this.forceUpdate()
      break;

      case state['STATE_LOADING_DATA']:
        console.log("STATE_LOADING_DATA");
        this.getInfoCrypted();
      break

      default:
      break;
    }
    return;
  }

  hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 2; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  getVerify()
  {
    console.log("******************** GetVerify *******************************");

    var dataID = JSON.parse('{ "data":{"wa":"","idt":"","idtName":"","identityID":"","verifyID":""}}');

    dataID.data.wa = this.state.userWa;
    dataID.data.idt = this.state.idt;
    dataID.data.identityID = this.state.dataIdentityId;
    dataID.data.verifyID = this.state.dataVerifyId;

    console.log("dataID = ", JSON.stringify(dataID));

    if(this.state.password === this.state.passwordCheck){
      console.log("call storeIdProvider: " + WallidConst.VERIFYID_PROVIDER_URL);
        fetch(WallidConst.VERIFYID_PROVIDER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataID)
        })
        .then(response => this.handleErrors(response))
        .then(response => this.handleSucess(response) )
        .catch(error => {
          console.log(error)
          alert("VerifyID Service Fail")
        }
      );
    }else{
      alert("Password and comfirm password is not the same")
    }
  }

  getInfo()
  {
    console.log("******************** GetInfo *******************************");
    var loadData = [];
    var identifyId = {}
    var verifyId = {}

    try {
      var password = this.state.isManualPassword ? this.state.chiperPassword : this.state.password;
      console.log('Password to decrypt ', password)
      var bytes =  CryptoJS.AES.decrypt(this.state.dataIdentityIdEncrypted, password);
      var ret_1 = bytes.toString(CryptoJS.enc.Utf8);
      identifyId = JSON.parse(ret_1);

      bytes =  CryptoJS.AES.decrypt(this.state.dataVerifyIdEncrypted, password);
      ret_1 = bytes.toString(CryptoJS.enc.Utf8);
      verifyId = JSON.parse(ret_1);

      this.state.dataIdentityId = identifyId;
      this.state.dataVerifyId = verifyId;

      console.log('Identify ', identifyId);
      console.log(Object.keys(identifyId));

      for(var i in identifyId.identityAttributes){
        //console.log(i);
        //console.log(identifyId[i]);
        loadData.push({ 'item' : i, 'value' : identifyId.identityAttributes[i]})
      }

      for( i in identifyId.addressAttributes){
        //console.log(i);
        //console.log(identifyId[i]);
        loadData.push({ 'item' : i, 'value' : identifyId.addressAttributes[i]})
      }
      this.state.data = loadData
      this.state.step = state['STATE_DECRYPTED_DATA']

      this.forceUpdate()

    }
    catch(err) {
      console.log("error",err);
      alert("Decrypt fail! Try Again!")
    }
  }
  getOpID()
  {
    console.log("******************** getOpID *******************************");
    console.log(this.state.idt);
    var datakyc = JSON.parse('{"wa":"","idt":"","idtName":""}');

    datakyc.wa = this.state.userWa;
    datakyc.idt = this.state.idt;

    console.log(JSON.stringify(datakyc));

    console.log("call kycProvider: " + WallidConst.KYC_PROVIDER_URL);
      fetch(WallidConst.KYC_PROVIDER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datakyc)
      })
      .then(response => this.handleErrors(response))
      .then(response => response.json())
      .then(data => this.setState({ opid: data.data , step: state['STATE_LOADING_DATA']}))
      .then(response => this.handleSucess(response) )
      .catch(error => {
        console.log(error)
        alert("getOpID Service Fail")
      }
    );
  }

  getInfoCrypted()
  {
    console.log("******************** GetInfoCrypted *******************************");
    console.log("idt = " + this.state.idt);
    console.log("opid = " + this.state.opid);
    var opid = this.state.opid;
    var opidString = opid.toString();
    console.log("opidString = " + opidString);
    this.state.ContractInstance.getIdtDataVerified( this.state.idt, opidString, (err, data) => {
      if(data){
        console.log('get Info Result ', data);
      }else{
        console.log('Operation fail');
        // TODO: Show popup about Operation fail
      }
    });

    this.state.ContractInstance.EventDataId((err, data) => {
      console.log('get event data ', data);
      console.log(data["address"]);
      console.log(data["args"]);
      var wallid = data["args"];
      console.log("************************************************************");
      console.log("EVENT EventDataId");
      console.log("opid = " + this.state.opid);
      console.log("opid event= " + wallid["opid"]);
      console.log("************************************************************");
      if(Number(wallid["opid"]) === Number(this.state.opid)){
          console.log("IdentityId = " + wallid["identityId"]);
          console.log("Idt = " + this.hex2a(wallid["idt"]));
          console.log("VeridyId = " + wallid["veridyId"]);

          console.log("IdentityId hexa = " + this.hex2a(wallid["identityId"]));
          console.log("Idt hexa = " + this.hex2a(wallid["idt"]));
          console.log("VeridyId hexa = " + this.hex2a(wallid["veridyId"]));

          this.state.dataIdentityIdEncrypted = this.hex2a(wallid["identityId"]);
          this.state.idt = this.hex2a(wallid["idt"]);
          this.state.dataVerifyIdEncrypted = this.hex2a(wallid["veridyId"]);

          if(this.state.dataIdentityIdEncrypted === ""){
            this.state.errorMsg = "Wallet Not Registered in WalliD. Please create at myetherid.io!";
            console.log("Wallet Not Registered in WalliD. Please create at myetherid.io!");
            this.state.step = state['STATE_LOADING_DATA_FAIL'];
          }else if(this.state.dataVerifyIdEncrypted === "STOREID_FAIL"){
            this.state.errorMsg = "StoreId Fail. Wallet Not Registered. Please register again at myetherid.io!";
            console.log("StoreId Fail. Wallet Not Registered. Please register again at myetherid.io!");
            this.state.step = state['STATE_LOADING_DATA_FAIL'];
          }else{
            this.state.step = state['STATE_ENCRYPTED_DATA']
          }
          this.forceUpdate()
      } else {
        console.log("EVENT EventDataId another OPID");
      }

    });
  }

  render() {
    if(window.web3){
      switch (this.state.step) {
        case state['STATE_CARD_SELECT']:
        return (
          <div>
            <div className="row">
              <div className="col-sm-12 col-md-8 headerTextImportId">
                <h2>
                  Step 2 - Select a Certified Identity
                </h2>
              </div>
            </div>
            <form onSubmit={this.handleSubmit} >
              <div class="form-group">
                <br />
                <label className="text-white">
                  Select identity type:
                </label>
                <select class="form-control"
                  required
                  name="idt"
                  onChange={this.handleChangeIdt}>
                  <option disabled="disabled" selected="selected">Select an valid identity</option>
                  <option value="CC_PT">Cartão de Cidadão - República Portuguesa</option>
                  <option value="CC_PT_TST">Cartão de Cidadão TST - República Portuguesa</option>
                </select>
                <p>
                  To prove your identity connect with metamask
                </p>
                <input
                  type="submit"
                  value="Prove your Identity"
                  className="btn btn-block btn-lg btnStyle btnMetaMask" />
                <p className="text-center">
                  <a className="text-white" href="https://metamask.io/">
                    what it means?
                  </a>
                </p>
              </div>
            </form>
          </div>
        );
        case state['STATE_LOADING_OPID']:
        case state['STATE_LOADING_DATA']:
        return (
          <div>
            <div className="row">
              <div className="col-sm-12 col-md-8 headerTextImportId">
                <h2>
                  Step 3 - Loading data from the blockchain
                </h2>
              </div>
            </div>
            <br />
            <div align="center">
              <h2>
                Please wait....
              </h2>
              <p>Operation ID: {this.state.opid}</p>
              <Spinner name="wandering-cubes" color="orange"/>
            </div>
            <br />
          </div>
        );
        case state['STATE_LOADING_DATA_FAIL']:
        return (
          <div>
            <form>
              <div class="form-group">
                <div className="row">
                  <div className="col-sm-12 col-md-8 headerTextImportId">
                    <h2>
                      We are sorry.
                    </h2>
                  </div>
                </div>
                <p>Loading data from the blockchain fail!</p>
                <p>{this.state.errorMsg}</p>
              </div>
            </form>
          </div>
        );
        case state['STATE_ENCRYPTED_DATA']:
        return (
          <div>
            <div className="row">
              <div className="col-sm-12 col-md-8 headerTextImportId">
                <h2>
                  Step 4 - Decrypt your data Locally
                </h2>
              </div>
            </div>
            <div class="row justify-content-start">
              <div class="col-sm-12 col-md-12">
                <form onSubmit={this.handleSubmit} >
                  <div class="form-group">
                    <br />
                    <label className="text-white">
                      Your encrypted data:
                    </label>
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
                      <label className="text-white">
                        Your verifyId data encrypted:
                      </label>
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
                    <br/>
                    <div className="form-inline">
                      <div>
                      <p><strong> Disclaimer: </strong> Current Metamask build doesn't support the features do encrypt data with users'private keys. It will be available as soon. you can encrypt your ID data with a password of your choice <strong>(recommended action)</strong>  Otherwise you can choose to allow MyEtheriD to encrypt your ID data with a default password (We do not recommend this action)</p>
                      </div>
                      <Switch
                        onChange={this.handleUsePassword}
                        checked={this.state.isManualPassword}
                        id="normal-switch"
                      />
                    </div>
                    <div className="form-inline"  hidden={ !this.state.isManualPassword ?  true : false }>
                      <label className="text-white">
                        Password : 	&nbsp;	&nbsp;
                      </label>

                      <input
                        style={{width: "300px"}}
                        hidden={ !this.state.isManualPassword ?  true : false }
                        id="chiperPassword"
                        name="chiperPassword"
                        onChange={this.handleChange}
                        className="form-control"
                        type="password"
                        placeholder="Insert password to decrypt your data"
                        required={this.state.isManualPassword ?  true : false }
                        >
                      </input>
                    </div>

                  </div>
                  <br/>
                  <div class="form-group">
                    <input
                      type="submit"
                      value="Decrypt ID"
                      className="btn btn-block btn-lg btnStyle btnNext" />
                    <p className="text-center">
                      <a className="text-white" href="https://metamask.io/">
                        what it means?
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
        case state['STATE_DECRYPTED_DATA']:
        return (
          <div>
            <div className="row">
              <div className="col-sm-12 col-md-8 headerTextImportId">
                <h2>
                  Step 5 - Verify your data
                </h2>
              </div>
            </div>
            <div class="row">
              <div class="col-sm">

                <div class="form-group">
                  <br />
                  <label className="text-white">
                    Your encrypted data:
                  </label>
                  <textarea
                    readOnly
                    rows="10"
                    value={this.state.dataIdentityIdEncrypted}
                    type="text"
                    name="EncryptedData"
                    class="form-control"
                    />
                  <div class="form-group">
                  </div>
                  <br />
                    <label className="text-white">
                      Your verifyId data:
                    </label>
                    <textarea
                      readOnly
                      rows="10"
                      value={JSON.stringify(this.state.dataVerifyId)}
                      type="text"
                      name="EncryptedData"
                      class="form-control"
                      />
                </div>
              </div>
              <div class="col-sm">
                <br />
                <label className="text-white">
                  Your decrypted data:
                </label>
                <BootstrapTable
                  data={this.state.data}
                  hover
                  condensed
                  pagination
                  className="text-white"
                  >
                  <TableHeaderColumn
                    dataField="item"
                    width='50%'
                    className="text-white"
                    isKey={true}>Item</TableHeaderColumn>
                  <TableHeaderColumn dataField="value" className="text-white" width='50%'>Value</TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
            <form onSubmit={this.handleSubmit} >
              <div class="form-group">
                <input
                  type="submit"
                  value="Verify ID"
                  className="btn btn-block btn-lg btnStyle btnNext" />
                <p class="text-center">
                  <a className="text-white" href="https://metamask.io/">
                    what it means?
                  </a>
                </p>
              </div>
            </form>
          </div>
        );
        case state['STATE_VERIFIED_DATA']:
        return (
          <div>
              <div class="form-group">
                <div className="row">
                  <div className="col-sm-12 col-md-8 headerTextImportId">
                    <h2>
                      Step 6 - Submit your application
                    </h2>
                  </div>
                </div>
                <p>
                  Your identity attributes were successfully verified by Wallid.
                </p>
                <p>
                  You can now submit your application to personal credit with Credibank.
                </p>
              </div>
              <form onSubmit={this.handleSubmit} >
                <div class="form-group">
                  <input
                    type="submit"
                    value="Submit"
                    className="btn btn-block btn-lg btnStyle btnNext" />
                  <p className="text-center">
                    <a className="text-white" href="https://metamask.io/">
                      what it means?
                    </a>
                  </p>
                </div>
              </form>
            </div>
          );
          case state['STATE_SUBMITED_DATA']:
          return (
            <div>
              <form>
                <div class="form-group">
                  <div className="row">
                    <div className="col-sm-12 col-md-8 headerTextImportId">
                      <h2>
                        Thank you
                      </h2>
                    </div>
                  </div>
                  <p>Thank you for applying to a personal credit with CrediBank.</p>
                  <p>We sent you our official proposal to your email.</p>
                  <p>
                    You can now submit your application to personal credit with Credibank.
                  </p>
                </div>
              </form>
            </div>
          );
          default:
          break;
        }
      }else{
        return (
          <div>
            <p>
              No MetaMask detected.
            </p>
            <p>
              To prove your identity connect with metamask.
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
          </div>
        );
      }
    }
  }

  export default ImportForm;
