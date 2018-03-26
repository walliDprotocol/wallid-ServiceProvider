import React from 'react';
import {
  Link
} from 'react-router-dom';

class CreditForm extends React.Component {

  render() {
    return (
      <div>
        <h2>
          Step 1 - Funding purpose and values:
        </h2>
        <form onSubmit={this.handleSubmit}>
          <div class="form-group">
            <label>
              Select the purpose:
            </label>
            <select class="form-control" required>
              <option value="NewCar">
                New Car
              </option>
              <option value="NewHouse">
                New House
              </option>
              <option value="Construction">
                University degree
              </option>
              <option value="Private">Holidays</option>
            </select>
          </div>
          <div class="form-group">
            <label>
              How much funding do you need : (total in euros)
            </label>
            <input
              type="text"
              name="walletAddress"
              onChange={this.handleChange}
              class="form-control"
              required/>
          </div>
          <div class="form-group">
            <label>
              How often would you like to receive payment tranches? monthly, every 3 month, every 6 month, once a year
            </label>
            <input
              type="text"
              name="password"
              onChange={this.handleChange}
              class="form-control"
              required/>
          </div>
          <Link to ='/KycVerify' >
            <button>
              Next Step
            </button>
          </Link>
        </form>
      </div>
    );
  }
}

export default CreditForm;
