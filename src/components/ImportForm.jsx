import React from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Web3 from 'web3'
import WallidContract from '../wallid/wallid.js';
var CryptoJS = require("crypto-js");

var Spinner = require('react-spinkit');

const state = {
  STATE_LOADING_DATA: 0,
  STATE_ENCRYPTED_DATA: 1,
  STATE_DECRYPTED_DATA: 2,
  STATE_VERIFIED_DATA:  3,
  STATE_SUBMITED_DATA: 4
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
      step: state['STATE_LOADING_DATA'],
      data: '',
      dataCrypted: '',
      ContractAddress : '0x787e5fc4773cad0c45f287bf00daca402845b1b7',
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
      console.log('*********************** window.web3 ********************');
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
      case state['STATE_VERIFIED_DATA']:
        this.state.step = state['STATE_SUBMITED_DATA']
        this.forceUpdate()
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
    console.log("******************** GetVerify *******************************");
    console.log('getVerify');
    this.handleSucess();
  }

  getInfo()
  {
    console.log("******************** GetInfo *******************************");
    var loadData = [];
    var identifyId = {}

    try {
      var bytes =  CryptoJS.AES.decrypt(this.state.dataCrypted ,this.state.password);
      var ret_1 = bytes.toString(CryptoJS.enc.Utf8);
      identifyId = JSON.parse(ret_1);

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

      // console.log(this.hex2a(data[1]));
      // this.state.pWa = JSON.parse(this.hex2a(data[1]))
      //
      // console.log(this.hex2a(data[2]));
      // this.state.idt = this.hex2a(data[2])
      //
      // console.log(this.hex2a(data[3]));
      // this.state.wa = JSON.parse(this.hex2a(data[3]))
      //
      // console.log(this.hex2a(data[4]));
      // this.state.pUrl = this.hex2a(data[4])

      this.forceUpdate()

    }
    catch(err) {
      console.log("error",err);
      alert("Decrypt fail! Try Again!")
    }
  }

  getInfoCrypted()
  {
    console.log("******************** GetInfoCrypted *******************************");
    this.state.ContractInstance.getIdtDataVerified( "CC_PT", "123456789", (err, data) => {
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
      console.log("IdentityId=" + wallid["identityId"]);
      console.log("VeridyId" + wallid["veridyId"]);

      console.log("IdentityId=" + this.hex2a(wallid["identityId"]));
      console.log("VeridyId" + this.hex2a(wallid["veridyId"]));

      this.state.dataCrypted = this.hex2a(wallid["identityId"]);
      this.state.step = state['STATE_ENCRYPTED_DATA']
      this.forceUpdate()
    });
    // Dummy data
    // this.state.dataCrypted="U2FsdGVkX18+wNWJ0tydZM26vW1mZSLHzeouCNlljYMDnbMI/eKOZu93FwJGoH+g8X3ZyRLPWsY/S0L+BVDDxBIOuxWuoSo+aS/bmtW/zE9Lrz9dhVdD+gxZejQpRMUHe3blUKyrtqrgmyZKRgeKqenK4Xl3TEtOWbMetdcAbCjhG2tN2UR2sAiy6bEMP4YttIcjoCILdRz9BM5gumQQqw9YcD5OwPLzzxW1tqELPBpjIV7Bw8koC4XdEl7pB+srjbkEH5Y5F3khZFAF+Pmi6TEbd4VrVAQrKvvUHo16GHK9QEmFRePF11tO410IIVGnSjn3QW6q6uvYwBxNbq6wFu+4dEc5W2IKSl2BDWakrKPwM9wKNwNsK7zULko30JeEXkq6oxt4fjxHnjHQtXi+5WhuPC3s2tWyhjWB1q7kadSyYnUouK0+ybS/7nEnBkR/0TA3q+CvWj/vhMcjRRXOvcBRWeCPbvf4Mo4OAYpcsh54zbd0XRWsL1hYdo9H0qDaKCxe1H13LXTybeXO01QDS80Uab5fWVfOd7A2L5ckxcN3Xc0OMRaGuT3x0yGUCtvXteZExXeYdG39xtaafT1YSvra4PCYf/Y7Vntl9JJtFVh7W9V/YPfj9BKVpzOJTi49p5SFchUNR6KgbYCCk3dXiF/4KcqcRtV2MZR8zSxgqKDRi700X7WXVIeFN/C7d40CXhQ/1SWRFxz5BHCkSQIkcYjqIDQfz1lbQOkUmOnTjDLBrf0XEANXBo1EU2xhtEyJ4IyuBH8OZro+MZSgcrwQdN3rxCRGpVRQYx23BWbo/T0zdo6U4WosfrILuNcnOtnkiulKnMqvjvyWeABxPlxWsdtNzTh2mY5HLF+jdL1QPdOYvq8+/M+x+g1FuUqUNtkFTtbmCp0DQJFDh8mqo60RH/Z/7wNi/D9DBL4ieEocNrOxjJRf/vFdZrbPTaKXsS2jtAxmUZ3qnHNtzNjOJrzYLSKT2R2LlBziH8hFHfV6gBHp7ORre/HS+vrVq2d8EhKsOx58iuukMEjfZxYOGzxelq6e3H/14GPXmadVJtxScTyoHM5GdcEsrUPOLdAcWfgz7OWOByTPwiPQi2Fqa+g2FV7eYiQvKhPmcqIJJTLQDTY9MYlkDZI7nDQW5Knm1bqNcq0a6+ixEJkc9QExrQtoxN8N9qVKgv9TU85TQDamU45f2Joj9VpnWJUaIP9saaI0EiBTzsymJSWDO7N6VkL0zlhlp3QON4TqG8YoapXDmqCo3iAxe9RxSO0kvZ3AWlRStjaYmCOew6Tjau6Jb6aOrw4ThiGXtkHVaEtkzIQWBHNliLrry74O9MPTDU0i3KcxhIhkYpR0clp3qLbdy4DHjaEhOPnjx3e8r72icRIX+36LnjMeJfjob/mKx5bnXQDtEp+GPgikrFihGeI4PCwX58hQ3Wh6Vjzhd1GRf2fTZhn0O0SuqJhQz20xbgFo7WGVa9uFTHJcvnjDsybxRbp/ILYk8vwmWovLVEV4CF918dFFMhBryUYbmsW2cXt868MsCEJnQ8/vqSLlmVBKrahW7U7P4xMJ0v3q9ijvR//yxibNY4hGuTHdh+/M4AlUCtS0r06GVpBShMyuiKg6R5FjTDQvKL9tpI9sZgqGw/W5tUqwnLFLFW+51UC5RX+Y53G6/uubDI4esZixBS0UZvTbw0ukWgrMD9tyaTvbkJ4SwBKfZ0mzDzhyr8nnLr9UfuCz9ziAk4sbuwiKLM3pBkOZ5bSiLKQOHzw3CBUutaWVjA4sHegkC4Hy7TP2effGHYfN4TMZU1feQvaToYD46KpAJ/6mU8t7LCIx+alkHJEf4bk="
    //
    // this.state.step = state['STATE_ENCRYPTED_DATA']
    // this.forceUpdate()
  }

  render() {
    if(window.web3){
      switch (this.state.step) {
        case state['STATE_LOADING_DATA']:
        return (
          <div>
            <h2>
              Step 3 - Loading data from the blockchain
            </h2>
            <div align="center">
              <p>
                Please wait....
              </p>
              <Spinner name="wandering-cubes" color="blue"/>
            </div>
          </div>
        );
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
                  readOnly
                  rows="5"
                  value={this.state.dataCrypted}
                  type="text"
                  name="EncryptedData"
                  class="form-control"
                  />
              </div>
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
                    readOnly
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
          <div>
              <div class="form-group">
                <h2>
                  Step 5 - Submit your application
                </h2>
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
                    value="Submit" />
                  <p>
                    <a href="https://metamask.io/">
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
                  <h2>
                    Thank you
                  </h2>
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
