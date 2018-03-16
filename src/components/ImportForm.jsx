import React from "react";
import {
  Link
} from 'react-router-dom';

class ImportForm extends React.Component {

render() {
  return (
    <form>
      <div class="form-group">
        <label>Select identity type:</label>
        <select class="form-control" required>
          <option value="grapefruit">Cartão do Cidadão - República Portuguesa</option>
        </select>
      </div>
    <div class="form-group">
        <label>Ether Wallet Address:</label>
        <input type="text" name="walletAddress" onChange={this.handleChange} class="form-control" placeholder="Enter your wallet address" required/>
      </div>
        {/*<div class="form-group">
        <label>Encryption password:</label>
        <input type="password" name="password" onChange={this.handleChange} class="form-control" placeholder="Paste your BlockID encryption password" required />
      </div>*/}
      <input type="submit" value="Connect to metamask" /> Recommended action
      <p><a href="https://metamask.io/">what is Metamask?</a></p>
        <div class="form-group">
          <label>Paste Private Key: Not recommended</label>
          <input type="password" name="password" onChange={this.handleChange} class="form-control" placeholder="Paste Private Key: Not recommended" />
        </div>
      <Link to ='/KycVerified' ><button>Next Step</button></Link>
    </form>
  );
}
}

export default ImportForm;
