import React from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Web3 from 'web3'
import WallidContract from '../wallid/wallid.js';
import { withSwalInstance } from 'sweetalert2-react';
import swal from 'sweetalert2';
import KycVerifiedSuccess from './KycVerifiedSuccess';
var CryptoJS = require("crypto-js");

const SweetAlert = withSwalInstance(swal);

const state = {
  STATE_ENCRYPTED_DATA: 0,
  STATE_DECRYPTED_DATA: 1,
  STATE_VERIFIED_DATA:  2
};

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
      step: state['STATE_ENCRYPTED_DATA'],
      data: '',
      dataCrypted: '',
      ContractAddress : '0x0bdafb4db2b71f70530d5b2070a3468052c1adb1',
      ContractInstance : null,
      password: '20THIS_WILL_USE_METAMASK_SECURITY18',
      wa: '',
      pWa: '',
      pUrl: '',
      pName: '',
      idt: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    if(window.web3){
      const MyContract = window.web3.eth.contract(WallidContract.abi)
      this.state.ContractInstance = MyContract.at(this.state.ContractAddress)

      // this.state.ContractInstance.countItemList( (err, data) => {
      //   console.log('Count items :  ', data);
      //   console.log('total items #', data.c[0] );
      // });
      this.getInfoCrypted();

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

  handleSubmit(event) {
    console.log("handleSubmit" + event);
    switch (this.state.step) {
      case state['STATE_ENCRYPTED_DATA']:
      this.getInfo();
      break;
      case state['STATE_DECRYPTED_DATA']:
      this.getVerify();
      break;
      default:
      break;
    }

    event.preventDefault();
  }

  handleSucess(response) {
    console.log("handleSucess");
    this.state.step = state['STATE_VERIFIED_DATA']
    this.forceUpdate()
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
    console.log('getVerify');
    this.handleSucess();
  }

  getInfo()
  {
    this.state.ContractInstance.getIdtData( "CC_PT", (err, data) => {
      console.log('get Info Result:', data);
      var loadData = [];
      var identifyId = {}

      try {
        var bytes =  CryptoJS.AES.decrypt(this.hex2a(data[0]) ,this.state.password);
        var ret_1 = bytes.toString(CryptoJS.enc.Utf8);
        identifyId = JSON.parse(ret_1);

        //console.log('Identify ', identifyId);
        //console.log(Object.keys(identifyId));

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

        console.log(this.hex2a(data[1]));
        this.state.pWa = JSON.parse(this.hex2a(data[1]))

        console.log(this.hex2a(data[2]));
        this.state.idt = this.hex2a(data[2])

        console.log(this.hex2a(data[3]));
        this.state.wa = JSON.parse(this.hex2a(data[3]))

        console.log(this.hex2a(data[4]));
        this.state.pUrl = this.hex2a(data[4])

        this.forceUpdate()

      }
      catch(err) {
        console.log("error",err);
        alert("Decrypt fail! Try Again!")
      }

    });
  }

  getInfoCrypted()
  {
    this.state.ContractInstance.getIdtData( "CC_PT", (err, data) => {
      console.log('get Info Result ', data);
      console.log((data[0]));

      this.state.dataCrypted = this.hex2a(data[0])
      this.forceUpdate()

    });
  }

  render() {
    if(window.web3){
      switch (this.state.step) {
        case state['STATE_ENCRYPTED_DATA']:
        return (
          <div>
            <h2>
              Step 3 - Decrypt your data Locally
            </h2>
            <form onSubmit={this.handleSubmit} >
              <div class="form-group">
                <label>
                  Your encrypted data:
                </label>
                <textarea
                  rows="5"
                  value={this.state.dataCrypted}
                  type="text"
                  name="EncryptedData"
                  class="form-control"
                  />
              </div>
              {/*<div class="form-group">
                <label>
                Encryption password:
                </label>
                <input
                type="password"
                name="password"
                onChange={this.handleChange}
                class="form-control"
                placeholder="Write your Wallid encryption password"
                required />
                <p>
                <a href="https://www.myetherid.io">
                What is Wallid Encrytion Password?
                </a>
                </p>
                </div>*/}
                <div class="form-group">
                  <input
                    type="submit"
                    value="Decrypt ID" />
                  <p>
                    <a href="https://metamask.io/">
                      what it means?
                    </a>
                  </p>
                </div>
              </form>
            </div>
          );
          case state['STATE_DECRYPTED_DATA']:
          return (
            <div>
              <h2>
                Step 4 - Verify your data
              </h2>
              <div class="row">
                <div class="col-sm">

                  <div class="form-group">
                    <label>
                      Your encrypted data:
                    </label>
                    <textarea
                      rows="20"
                      value={this.state.dataCrypted}
                      type="text"
                      name="EncryptedData"
                      class="form-control"
                      />
                  </div>
                </div>
                <div class="col-sm">
                  <label>
                    Your decrypted data:
                  </label>
                  <BootstrapTable
                    data={this.state.data}
                    hover
                    condensed
                    pagination
                    >
                    <TableHeaderColumn
                      dataField="item"
                      width='50%'
                      isKey={true}>Item</TableHeaderColumn>
                    <TableHeaderColumn dataField="value" width='50%'>Value</TableHeaderColumn>
                  </BootstrapTable>
                </div>
              </div>
              <form onSubmit={this.handleSubmit} >
                <div class="form-group">
                  <input
                    type="submit"
                    value="Verify ID" />
                  <p>
                    <a href="https://metamask.io/">
                      what it means?
                    </a>
                  </p>
                </div>
              </form>
            </div>
          );
          case state['STATE_VERIFIED_DATA']:
          return (
            <KycVerifiedSuccess />
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
