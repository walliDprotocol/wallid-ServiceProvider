import React from "react";

import PurposeSelect from "./kyc/PurposeSelect";
import IdentitySelect from "./kyc/IdentitySelect";
import LoadOPID from "./kyc/LoadOPID";
import LoadDataID from "./kyc/LoadDataID";
import DecryptData from "./kyc/DecryptData";
import VerifyData from "./kyc/VerifyData";
import VerifyDataID from "./kyc/VerifyDataID";
import SubmitData from "./kyc/SubmitData";
import Finish from "./kyc/Finish";

import store from "../js/store/index";

import { setCreditState } from "./../js/actions/index";
import { CREDIT_STATE } from "../js/constants/action-types";

class CreditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creditState: store.getState().creditState
    };
  }

  componentWillMount() {
    store.dispatch(
      setCreditState(CREDIT_STATE["CREDIT_STATE_PURPOSE_SELECT_SELECT"])
    );

    store.subscribe(() => {
      this.setState({
        creditState: store.getState().creditState
      });
    });
  }

  render() {
    switch (this.state.creditState) {
      case CREDIT_STATE["CREDIT_STATE_PURPOSE_SELECT"]:
        return <PurposeSelect />;

      case CREDIT_STATE["CREDIT_STATE_IDENTITY_SELECT"]:
        return <IdentitySelect />;

      case CREDIT_STATE["CREDIT_STATE_LOAD_OPID"]:
        return <LoadOPID />;

      case CREDIT_STATE["CREDIT_STATE_LOAD_DATAID"]:
        return <LoadDataID />;

      case CREDIT_STATE["CREDIT_STATE_DECRYPT_DATA"]:
        return <DecryptData />;

      case CREDIT_STATE["CREDIT_STATE_VERIFY_DATA"]:
        return <VerifyData />;

      case CREDIT_STATE["CREDIT_STATE_VERIFY_DATAID"]:
        return <VerifyDataID />;

      case CREDIT_STATE["CREDIT_STATE_SUBMIT_DATA"]:
        return <SubmitData />;

      case CREDIT_STATE["CREDIT_STATE_FINISH"]:
        return <Finish />;

      default:
        return <PurposeSelect />;
    }
  }
}

export default CreditForm;
