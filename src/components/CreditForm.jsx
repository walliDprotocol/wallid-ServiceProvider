import React from 'react';
import {
  Link
} from 'react-router-dom';

class CreditForm extends React.Component {

render() {
    return (
    <form onSubmit={this.handleSubmit}>
      <div class="form-group">
        <label>Choise your project</label>
        <select class="form-control" required>
          <option value="NewCar">New Car</option>
          <option value="NewHouse">New House</option>
          <option value="Construction">Construction</option>
          <option value="Private">Private</option>
        </select>
      </div>
      <div class="form-group">
        <label>Choose the amount of money [ Euros ]</label>
        <input type="text" name="walletAddress" onChange={this.handleChange} class="form-control" required/>
      </div>
      <div class="form-group">
        <label>Choose the term [ Months ]</label>
        <input type="text" name="password" onChange={this.handleChange} class="form-control" required/>
      </div>
      <Link to ='/KycVerify' ><button>Apply for credit</button></Link>
    </form>
  );
}
}

export default CreditForm;
