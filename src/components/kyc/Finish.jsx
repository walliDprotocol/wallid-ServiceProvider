import React from "react";

import store from "../../js/store/index";

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

  render() {
    if (window.web3) {
      return (
        <div>
          <form>
            <div class="form-group">
              <div className="row">
                <div className="col-sm-12 col-md-8 headerTextImportId">
                  <h2>Thank you</h2>
                </div>
              </div>
              <p>Thank you for applying to a personal credit with CrediBank.</p>
              <p>We sent you our official proposal to your email.</p>
              <p>
                You can now submit your application to personal credit with
                Credibank.
              </p>
            </div>
          </form>
        </div>
      );
    } else {
      return (
        <div>
          <p>No MetaMask detected.</p>
          <p>To prove your identity connect with metamask.</p>
          <p>
            <a href="https://metamask.io/">What is Metamask?</a>
          </p>
          <p>
            <a href="https://metamask.io/">Download Metamask?</a>
          </p>
        </div>
      );
    }
  }
}

export default Finish;
