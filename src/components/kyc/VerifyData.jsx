import React from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Web3 from 'web3';
import WallidContract from '../../wallid/wallid.js';
import * as WallidConst from '../../wallid/const.js';

import store from "../../js/store/index";
import { setCreditState } from "../../js/actions/index";
import { CREDIT_STATE } from "../../js/constants/action-types";

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

class VerifyData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLogged: 0,
      data: store.getState().data,
      dataVerifyId: store.getState().dataVerifyId,
      dataVerifyIdEncrypted: store.getState().dataVerifyIdEncrypted,
      dataIdentityIdEncrypted: store.getState().dataIdentityIdEncrypted,
      dataIdentityId: store.getState().dataIdentityId,
      ContractAddress : WallidConst.CONTRACT_ADDRESS,
      ContractInstance : null,
      userWa: '',
      idt: store.getState().idt,
      opid: store.getState().opid,
      yourPurpose  : store.getState().yourPurpose
    };

    this.handleSubmit = this.handleSubmit.bind(this);


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
  };

  handleSubmit(event) {
    console.log("handleSubmit" + event);
    this.verifyData();
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
    console.log("handleSucess step");
    store.dispatch(setCreditState(CREDIT_STATE['CREDIT_STATE_SUBMIT_DATA']));
    return;
  }

  verifyData()
  {
    console.log("******************** verifyData *******************************");

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
    if(window.web3){
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

  export default VerifyData;
