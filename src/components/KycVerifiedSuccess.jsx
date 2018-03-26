import React from "react";
import { withSwalInstance } from 'sweetalert2-react';
import swal from 'sweetalert2';

const SweetAlert = withSwalInstance(swal);

class KycVerifiedSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popup: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <form>
        <div class="form-group">
          <label>
            Your Identity was verified by BlockID. Now you are ready to apply for credit with CrediBank.
          </label>
        </div>
        <SweetAlert
          show={this.state.popup}
          title="Thank you"
          text="Thank you for applying to a personal credit with CrediBank.
          We sent you our official proposal to your email."
          confirmButtonColor = "#FFCC00"
          onConfirm={() => this.setState({ popup: false })}
          />
        <button onClick={() => this.setState({ popup: true })}>Apply</button>
      </form>
    );
  }
}

export default KycVerifiedSuccess;
