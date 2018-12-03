import React from 'react';

import PurposeForm from './kyc/PurposeForm';
import ImportForm from './kyc/ImportForm';

import store from "../js/store/index";
import { setYourPurpose } from "../js/actions/index";

import { CREDIT_STATE } from "../js/constants/action-types";

class CreditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yourPurpose: store.getState().yourPurpose,
      creditState: store.getState().creditState
  }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeIdt = this.handleChangeIdt.bind(this);
  }

  componentWillMount() {
      store.subscribe(() => {
          // When state will be updated(in our case, when items will be fetched),
          // we will update local component state and force component to rerender
          // with new data.

          this.setState({
              yourPurpose: store.getState().yourPurpose,
              creditState: store.getState().creditState,
          });
      });
  };

  handleSubmit(event) {
    console.log("handleSubmit" + event);
    event.preventDefault();
  }

  handleChangeIdt(event) {
    console.log("handleChangeIdt");
    console.log(event.target.name);
    console.log(event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
    store.dispatch(setYourPurpose(event.target.value))
  }

  render() {
    switch (this.state.creditState) {
      case CREDIT_STATE['CREDIT_STATE_PURPOSE']:
      return (
        <PurposeForm />
      );

      case CREDIT_STATE['CREDIT_STATE_SELECT']:
      return (
        <ImportForm />
      );

      default:
      return (
        <PurposeForm />
      );
    }
  }
}

export default CreditForm;
