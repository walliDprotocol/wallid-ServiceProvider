import React from "react";

import store from "../../js/store/index";
import { setCreditState } from "./../../js/actions/index";
import { CREDIT_STATE } from "./../../js/constants/action-types";

class Finish extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLogged: 0,
      userWa: "",
      idt: "",
      opid: "",
      yourPurpose: store.getState().yourPurpose
    };
  }
  componentWillMount() {
    store.subscribe(() => {
      this.setState({
        yourPurpose: store.getState().yourPurpose
      });
    });
  }

  handleSubmit(event) {
    console.log("handleSubmit");
    store.dispatch(setCreditState(CREDIT_STATE["CREDIT_STATE_PURPOSE_SELECT"]));
  }

  render() {
    if (window.web3) {
      return (
        <div>
            <div className="form-group form-content">
              <h2 className="title">Thank you</h2>
              <p className="finish-msg">Thank you for applying to a personal credit with CrediBank.<br/>
              We sent you our official proposal to your email.<br/>
              You can now submit your application to personal credit with Credibank.</p>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div class="btn-container text-right">
                <button className="btn btn-next">Next</button>
                <p className="text-center">
                  <a className="text-white" href="https://metamask.io/">
                    what it means?
                  </a>
                </p>
              </div>
            </form>
        </div>
      );
    } else {
      return (
        <div className="form-content auto-step">
          <h2 className="title">Thank you</h2>
          <br />
          <div align="center">
            <p className="err-msg">No MetaMask detected.</p>
              <p>To prove your identity connect with metamask.</p>
              <p><a href="https://metamask.io/">What is Metamask?</a></p>
              <p><a href="https://metamask.io/">Download Metamask?</a></p>
          </div>
        </div>
      );
    }
  }
}

export default Finish;
