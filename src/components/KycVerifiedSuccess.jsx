import React from "react";

class KycVerifiedSuccess extends React.Component {
render() {
  return (
    <form onSubmit={this.handleSubmit} >
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
      <button>Aplly</button>
    </form>
  );
}
}

export default KycVerifiedSuccess;
