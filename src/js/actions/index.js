// src/js/actions/index.js
import { SET_YOUR_PURPOSE } from "../constants/action-types";
import { SET_CREDIT_STATE } from "../constants/action-types";
import { GET_CREDIT_STATE } from "../constants/action-types";

export const setYourPurpose = yourPurpose => ({ type: SET_YOUR_PURPOSE, payload: yourPurpose });
export const setCreditState = creditState => ({ type: SET_CREDIT_STATE, payload: creditState });
export const getCreditState = creditState => ({ type: GET_CREDIT_STATE, payload: creditState });
