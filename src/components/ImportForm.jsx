import React from "react";
import {
  Link
} from 'react-router-dom';

class ImportForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      walletAddress: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    alert('Data submited')
    console.log('WalletAddress' + this.state.walletAddress);
    console.log('Password' + this.state.password);
  event.preventDefault();
}

render() {
  return (
    <form onSubmit={this.handleSubmit} >
      <div class="form-group">
        <label>Pick your Identity:</label>
        <select class="form-control" required>
          <option value="grapefruit">Cartão do Cidadão - República Portuguesa</option>
        </select>
      </div>
      <div class="form-group">
        <label>Wallet Address:</label>
        <input type="text" name="walletAddress" onChange={this.handleChange} class="form-control" placeholder="Enter wallet address" required/>
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" name="password" onChange={this.handleChange} class="form-control" required />
      </div>
      <Link to ='/KycVerified' ><button>Identify</button></Link>
    </form>
  );
}
}

export default ImportForm;
