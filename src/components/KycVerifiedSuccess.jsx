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
        <label>Your Identity Verified with Cartão do Cidadão - República Portuguesa</label>
      </div>
      <div class="form-group">
        <label>Name</label>
        <input type="text" value="João José Maria" class="form-control" placeholder="Enter wallet address" required/>
      </div>
      <div class="form-group">
        <label>Morada</label>
        <input type="text" value="Rua do Fim do Caminho, 1990 -123, Lisboa" class="form-control" placeholder="Enter wallet address" required/>
      </div>
      <div class="form-group">
        <label>Date of birth</label>
        <input type="text" value="30-09-1983" class="form-control" placeholder="Enter wallet address" required/>
      </div>
      <div class="form-group">
        <label>NIC</label>
        <input type="text" value="1234567890" class="form-control" placeholder="Enter wallet address" required/>
      </div>
      <div class="form-group">
        <label>NIF</label>
        <input type="text" value="0987654321" class="form-control" placeholder="Enter wallet address" required/>
      </div>
      <SweetAlert
        show={this.state.popup}
        title="Thank you"
        text="Thank you for applying to a personal credit with DemoBank.
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
