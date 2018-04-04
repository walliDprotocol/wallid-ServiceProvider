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
      ContractAddress : '0x82209352470b2f22f5a6874790114d5651a75285',
      ContractInstance : null,
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    if(window.web3){
      const MyContract = window.web3.eth.contract(BlockIdContract.abi)
      this.state.ContractInstance = MyContract.at(this.state.ContractAddress)

      this.state.ContractInstance.countItemList( (err, data) => {
        console.log('Count items :  ', data);
        console.log('total items #', data.c[0] );
      });
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
    this.state.ContractInstance.getInfo( (err, data) => {
      console.log('get Info Result ', data);
      var loadData = [];
      var dataAttribute = [];

      try {
        var bytes =  CryptoJS.AES.decrypt(this.hex2a(data[1]) ,this.state.password);
        var ret_1 = bytes.toString(CryptoJS.enc.Utf8);
        dataAttribute = JSON.parse(ret_1);
        //console.log(dataAttribute);
        //console.log(Object.keys(dataAttribute));
        for(var i in dataAttribute){
          //console.log(i);
          //console.log(dataAttribute[i]);
          loadData.push({ 'item' : i, 'value' : dataAttribute[i]})
        }

        bytes =  CryptoJS.AES.decrypt(this.hex2a(data[2]),this.state.password);
        var ret_2 = bytes.toString(CryptoJS.enc.Utf8);
        dataAttribute = JSON.parse(ret_2)
        //console.log(dataAttribute);
        //console.log(Object.keys(dataAttribute));
        for(i in dataAttribute){
          //console.log(i);
          //console.log(dataAttribute[i]);
          loadData.push({ 'item' : i, 'value' : dataAttribute[i]})
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
    this.state.ContractInstance.getInfo( (err, data) => {
      console.log('get Info Result ', data);
      console.log((data[0]));
      console.log(this.hex2a(data[1]));
      console.log(this.hex2a(data[2]));

      this.state.dataCrypted = this.hex2a(data[1])+this.hex2a(data[2])
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
              Step 3 - Local decrypt your data
            </h2>
            <form onSubmit={this.handleSubmit} >
              <div class="form-group">
                <label>
                  Your Encrypted data:
                </label>
                <textarea
                  rows="5"
                  value={this.state.dataCrypted}
                  type="text"
                  name="EncryptedData"
                  class="form-control"
                  />
              </div>
              <div class="form-group">
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
              </div>
              <div class="form-group">
                <input
                  type="submit"
                  value="Local decrypt your data" />
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
              Step 3 - Local decrypt your data
            </h2>
            <div class="form-group">
              <label>
                Your Encrypted data:
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
              Your Decrypted data:
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
              Your identity have to be verified by VerifyID to apply for credit with CrediBank.
            </p>
            <Link to ='/KycVerified' >
              <button>
                VerifyID
              </button>
            </Link>
            <p>
              <a href="https://blockid.herokuapp.com">
                What is VerifyID?
              </a>
            </p>
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
