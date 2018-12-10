import React from "react";

import store from "../../js/store/index";
import { setYourPurpose } from "../../js/actions/index";
import { setCreditState } from "../../js/actions/index";
import { CREDIT_STATE } from "../../js/constants/action-types";

import Slider from "./../Slider";

class PurposeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yourPurpose: store.getState().yourPurpose
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {

    store.subscribe(() => {
      this.setState({
        yourPurpose: store.getState().yourPurpose,
        creditState: store.getState().creditState
      });
    });
  }

  handleSubmit(event) {
    console.log("CREDIT_STATE_IDENTITY_SELECT");
    store.dispatch(
      setCreditState(CREDIT_STATE["CREDIT_STATE_IDENTITY_SELECT"])
    );
  }

  handleChange(event) {
    console.log("handleChange");
    console.log(event.target.name);
    console.log(event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
    store.dispatch(setYourPurpose(event.target.value));
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group form-content">
            <h2 className="title">Step 1 - Funding purpose and values</h2>
            <br />
            <label className="label">Select the purpose:</label>
            <select
              class="form-control"
              name="yourPurpose"
              required
              onChange={this.handleChange}
            >
              <option value="" selected disabled>
                Select the purpose
              </option>
              <option value="NewCar">New Car</option>
              <option value="NewHouse">New House</option>
              <option value="Construction">University degree</option>
              <option value="Private">Holidays</option>
            </select>
            <i class="fas fa-chevron-down"></i>

            <label className="label how-much">
              How much funding do you need? (total in euros)
            </label>
            <Slider />
          </div>
          <div class="btn-container text-right">
            <input
              type="submit"
              value="Next Step"
              className="btn btn-next"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default PurposeSelect;
