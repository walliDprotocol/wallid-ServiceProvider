import React from 'react';
import {
  Link
} from 'react-router-dom';

class CreditForm extends React.Component {

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12 col-md-8 headerTextImportId">
            <h2>
              Step 1 - Funding purpose and values:
            </h2>
          </div>
        </div>
        <div class="row justify-content-start">
          <div class="col-sm-12 col-md-12">
            <form onSubmit={this.handleSubmit}>
              <div class="form-group">
                <br />
                <label className="text-white">
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
                <label className="text-white">
                  How much funding do you need : (total in euros)
                </label>
                <input
                  type="text"
                  name="walletAddress"
                  onChange={this.handleChange}
                  class="form-control"
                  required/>
                <label className="text-white">
                  How often would you like to receive payment tranches? monthly, every 3 month, every 6 month, once a year
                </label>
                <select class="form-control" required>
                  <option disabled="disabled" selected="selected">Select how often you like to receive</option>
                  <option>monthly</option>
                  <option>every 3 month</option>
                  <option>every 6 month</option>
                  <option>once a year</option>
                </select>
              </div>
              <div>
                <Link to ='/Import' className="btn btn-block btn-lg btnStyle btnNext">
                  Next Step
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default CreditForm;
