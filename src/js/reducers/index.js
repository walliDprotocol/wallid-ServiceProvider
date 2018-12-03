import { SET_YOUR_PURPOSE } from "../constants/action-types";
import { SET_CREDIT_STATE } from "../constants/action-types";
import { GET_CREDIT_STATE } from "../constants/action-types";

import { CREDIT_STATE } from "../constants/action-types";

const initialState = {
    yourPurpose: "",
    creditState: CREDIT_STATE['CREDIT_STATE_PURPOSE']
};

const rootReducer = (state = initialState, action) => {
  console.log(" rootReducer action.type = " + action.type);
  console.log(" rootReducer action.payload = " + action.payload);
  switch (action.type) {
    case SET_YOUR_PURPOSE:
      state.yourPurpose = action.payload
    return state;

    case SET_CREDIT_STATE:
      state.creditState = action.payload
    return state;

    case GET_CREDIT_STATE:
      state.creditState = action.payload
    return state;

    default:
    return state;
  }
};
export default rootReducer;
