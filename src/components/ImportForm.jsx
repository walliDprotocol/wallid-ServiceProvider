import React from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Web3 from 'web3'
import BlockIdContract from '../blockid/BlockId.js';
import { Link } from 'react-router-dom';
var CryptoJS = require("crypto-js");

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
      step: 0,
      data: '',
      dataCrypted: '',
      ContractAddress : '0x7f852d0be239e1a547b07c88aa54cfcc98a80f49',
      ContractInstance : null,
      password: '20THIS_WILL_USE_METAMASK_SECURITY18'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    if(window.web3){
      const MyContract = window.web3.eth.contract(BlockIdContract.abi)
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
    console.log("handleSubmit");
    this.getInfo();
    event.preventDefault();
  }

  hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 2; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
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
        this.state.step = 1
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
        case 0:
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
                  placeholder="Write your BlockID encryption password"
                  required />
                <p>
                  <a href="https://blockid.herokuapp.com">
                    What is BlockID Encrytion Password?
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
        case 1:
        return (
          <div>
            <h2>
              Step 3 - Decrypt your data Locally
            </h2>
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
            <label>
              Your decrypted data:
            </label>
            <BootstrapTable
              data={this.state.data}
              hover
              condensed
              >
              <TableHeaderColumn
                dataField="item"
                width='50%'
                isKey={true}>Item</TableHeaderColumn>
              <TableHeaderColumn dataField="value" width='50%'>Value</TableHeaderColumn>
            </BootstrapTable>
            <p>
              Please submit your data to verification.
            </p>
            <Link to ='/KycVerified' >
              <button>
                Submit
              </button>
            </Link>
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
