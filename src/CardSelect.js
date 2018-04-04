import React, { Component } from "react";
import CardForm from './components/CardForm';

class CardSelect extends Component {
  render() {
    return (
      <div>
      <h2>Personal Credit application</h2>
        <p>Select your card to import ID</p>
        <br />
        <CardForm />
      </div>
    );
  }
}

export default CardSelect;
