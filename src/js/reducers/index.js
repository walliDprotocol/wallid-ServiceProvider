import { SET_YOUR_PURPOSE } from "../constants/action-types";
import { SET_CREDIT_STATE } from "../constants/action-types";
import { GET_CREDIT_STATE } from "../constants/action-types";
import { GET_IDT } from "../constants/action-types";
import { SET_IDT } from "../constants/action-types";
import { GET_OPID } from "../constants/action-types";
import { SET_OPID } from "../constants/action-types";
import { GET_IDENTITY_ID_ENCRYPTED } from "../constants/action-types";
import { SET_IDENTITY_ID_ENCRYPTED } from "../constants/action-types";
import { GET_VERIFY_ID_ENCRYPTED } from "../constants/action-types";
import { SET_VERIFY_ID_ENCRYPTED } from "../constants/action-types";
import { GET_DATA_IDENTITY_ID } from "../constants/action-types";
import { SET_DATA_IDENTITY_ID } from "../constants/action-types";
import { GET_DATA_VERIFY_ID } from "../constants/action-types";
import { SET_DATA_VERIFY_ID } from "../constants/action-types";
import { GET_DATA } from "../constants/action-types";
import { SET_DATA } from "../constants/action-types";

import { CREDIT_STATE } from "../constants/action-types";

const initialState = {
  yourPurpose: "",
  creditState: CREDIT_STATE["CREDIT_STATE_PURPOSE_SELECT_SELECT"],
  idt: "",
  opid: "",
  dataIdentityIdEncrypted: "",
  dataVerifyIdEncrypted: "",
  dataIdentityId: "",
  dataVerifyId: "",
  data: ""
};

const rootReducer = (state = initialState, action) => {
  console.log(" rootReducer action.type = " + action.type);
  console.log(" rootReducer action.payload = " + action.payload);
  switch (action.type) {
    case SET_YOUR_PURPOSE:
      state.yourPurpose = action.payload;
      return state;

    case SET_CREDIT_STATE:
      state.creditState = action.payload;
      return state;

    case GET_CREDIT_STATE:
      return state;

    case SET_IDT:
      state.idt = action.payload;
      return state;

    case GET_IDT:
      return state;

    case SET_OPID:
      state.opid = action.payload;
      return state;

    case GET_OPID:
      return state;

    case SET_IDENTITY_ID_ENCRYPTED:
      state.dataIdentityIdEncrypted = action.payload;
      return state;

    case GET_IDENTITY_ID_ENCRYPTED:
      return state;

    case SET_VERIFY_ID_ENCRYPTED:
      state.dataVerifyIdEncrypted = action.payload;
      return state;

    case GET_VERIFY_ID_ENCRYPTED:
      return state;

    case SET_DATA_IDENTITY_ID:
      state.dataIdentityId = action.payload;
      return state;

    case GET_DATA_IDENTITY_ID:
      return state;

    case SET_DATA_VERIFY_ID:
      state.dataVerifyId = action.payload;
      return state;

    case GET_DATA_VERIFY_ID:
      return state;

    case SET_DATA:
      state.data = action.payload;
      return state;

    case GET_DATA:
      return state;

    default:
      return state;
  }
};
export default rootReducer;
